const pool = require('../../databaseConnection/mysqlConnection');
 
const getChargesSummary = async (req, res) => {
    const { customerId } = req.query;

    if (!customerId) {
        return res.status(400).json({ error: "Customer ID is required" });
    }

    try {
        // Fetch Charges Summary
        const [chargesSummary] = await pool.query(
            `SELECT 
                COALESCE(cr.coating_amount, 0) AS coating_amount,
                COALESCE(cf.fasttag_amount, 0) AS fasttag_amount,
                COALESCE(ca.autocard_amount, 0) AS autocard_amount,
                COALESCE(ce.extendedwarranty_amount, 0) AS extendedwarranty_amount,
                COALESCE(ci.insurance_amount, 0) AS insurance_amount,
                COALESCE(crr.rto_amount, 0) AS rto_amount,
                (
                    COALESCE(cr.coating_amount, 0) +
                    COALESCE(cf.fasttag_amount, 0) +
                    COALESCE(ca.autocard_amount, 0) +
                    COALESCE(ce.extendedwarranty_amount, 0) +
                    COALESCE(ci.insurance_amount, 0) +
                    COALESCE(crr.rto_amount, 0)
                ) AS Total_Charges
            FROM carbooking cb
            LEFT JOIN coating_requests cr ON cr.customerId = cb.customerId
            LEFT JOIN car_fasttag_requests cf ON cf.customerId = cb.customerId
            LEFT JOIN car_autocard_requests ca ON ca.customerId = cb.customerId
            LEFT JOIN car_extended_warranty_requests ce ON ce.customerId = cb.customerId
            LEFT JOIN car_insurance_requests ci ON ci.customerId = cb.customerId
            LEFT JOIN car_rto_requests crr ON crr.customerId = cb.customerId
            WHERE cb.customerId = ?`,
            [customerId]
        );

        // Fetch On-Road Price Summary
        const [onRoadPriceSummary] = await pool.query(
            `WITH CarData AS (
                SELECT 
                    cb.customerId,
                    COALESCE(cb.exShowroomPrice, 0) AS exShowroomPrice,
                    COALESCE(oar.totalAmount, 0) AS totalAmount,
                    COALESCE(cb.cardiscount, 0) AS cardiscount,
                    cb.fuelType,
                    cb.engineCapacity,
                    cb.mileage,
                    cb.groundClearance,

                    -- Determine GST Rate
                    CASE 
                        WHEN cb.fuelType = 'Electric' THEN 5
                        WHEN cb.fuelType = 'Petrol' AND cb.engineCapacity <= 1200 AND cb.mileage <= 4 THEN 28
                        WHEN cb.fuelType = 'Diesel' AND cb.engineCapacity <= 1500 AND cb.mileage <= 4 THEN 28
                        WHEN cb.engineCapacity > 1200 AND cb.engineCapacity <= 1500 THEN 28
                        WHEN cb.engineCapacity > 1500 AND cb.mileage > 4 THEN 28
                        ELSE 28  -- Default GST rate for cars
                    END AS gstRate,

                    -- Determine Cess Rate
                    CASE 
                        WHEN cb.fuelType = 'Electric' THEN 0
                        WHEN cb.fuelType = 'Petrol' AND cb.engineCapacity <= 1200 AND cb.mileage <= 4 THEN 1
                        WHEN cb.fuelType = 'Diesel' AND cb.engineCapacity <= 1500 AND cb.mileage <= 4 THEN 3
                        WHEN cb.engineCapacity > 1200 AND cb.engineCapacity <= 1500 THEN 17
                        WHEN cb.engineCapacity > 1500 AND cb.mileage > 4 THEN 20
                        WHEN cb.engineCapacity > 1500 AND cb.mileage > 4 AND cb.groundClearance >= 170 THEN 22
                        ELSE 0  -- Default Cess
                    END AS cessRate
                FROM carbooking cb
                LEFT JOIN (
                    SELECT customerId, SUM(totalAmount) AS totalAmount
                    FROM orders_accessories_request
                    GROUP BY customerId
                ) oar ON cb.customerId = oar.customerId
                WHERE cb.customerId = ?
            )

            SELECT 
                customerId,
                exShowroomPrice,
                totalAmount,
                cardiscount,
                gstRate,  -- Include this field
                cessRate,  -- Include this field
                (exShowroomPrice + totalAmount - cardiscount) AS Subtotal,
                
                ((exShowroomPrice + totalAmount - cardiscount) * gstRate / 100) AS GST_Amount,
                ((exShowroomPrice + totalAmount - cardiscount) * cessRate / 100) AS Cess_Amount,
                ((exShowroomPrice + totalAmount - cardiscount) 
                + ((exShowroomPrice + totalAmount - cardiscount) * gstRate / 100) 
                + ((exShowroomPrice + totalAmount - cardiscount) * cessRate / 100))
                AS Total_On_Road_Price
            FROM CarData;`,
            [customerId]
        );

        if (onRoadPriceSummary.length === 0) {
            return res.status(404).json({ error: "Customer not found" });
        }

        // Calculate TotalAmountForRoadPriceCharges
        const totalCharges = parseFloat(chargesSummary[0].Total_Charges) || 0;
        const totalOnRoadPrice = parseFloat(onRoadPriceSummary[0].Total_On_Road_Price) || 0;
        const totalAmountForRoadPriceCharges = totalCharges + totalOnRoadPrice;

        // Return the response
        res.json({
            customerId: customerId,
            ChargesSummary: chargesSummary[0],
            OnRoadPriceSummary: onRoadPriceSummary[0],
            TotalAmountForRoadPriceCharges: totalAmountForRoadPriceCharges
        });
    } catch (error) {
        console.error("Error fetching total charges:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

module.exports = { getChargesSummary };