const express = require('express');
const router = express.Router();
const pool = require('../../databaseConnection/mysqlConnection');

 

const showAutocard = async (req, res) => {
    try {
        // Pagination configuration
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        // Main query with all joins
        const query = `
          SELECT 
              c.*,
              cb.*,
              ai.*,
              ai.updatedAt,

              inv.invoice_id,
              inv.invoice_date,
              inv.due_date,
              inv.total_on_road_price,
              inv.total_charges,
              inv.grand_total AS invoice_grand_total,
              inv.payment_status,
              inv.customer_account_balance,

              opd.order_date,
              opd.tentative_date,
              opd.preferred_date,
              opd.request_date,
              opd.prebooking,
              opd.prebooking_date,
              opd.delivery_date,

              cs.vin,
              cs.chassisNumber,
              cs.engineNumber,
              cs.allotmentCarStatus as allotmentStatus,

              o.id AS accessory_request_id,
              o.totalAmount AS accessory_total_amount,
              o.createdAt AS accessory_createdAt,
              o.status AS accessory_status,
              o.accessorieReason,
              o.accessorieRecipes,
              o.updatedAt AS accessory_updatedAt,

              p.id AS product_id,
              p.category AS product_category,
              p.name AS product_name,
              p.price AS product_price,


              s.coatingType,
              s.preferredDate,
              s.preferredTime,
              s.additionalNotes,
              s.coating_amount,
              s.durability,
              s.createdAt AS coating_createdAt,
              s.updatedAt  AS coating_updatedAt,
              s.status AS coating_status,
              s.coatingReason,
              s.id AS coating_id,


              rt.id AS RTO_id,
              rt.form20,
              rt.form21,
              rt.form22,
              rt.form34,
              rt.invoice,
              rt.insurance,
              rt.puc,
              rt.idProof,
              rt.roadTax,
              rt.tempReg,
              rt.createdAt,
              rt.updatedAt,
              rt.rto_amount,
              rt.status AS RTO_status,
              rt.rtoReason,
              rt.rtoRecipes,

              adi.accessories,
              adi.coating,
              adi.rto,
              adi.fast_tag,
              adi.insurance,
              adi.auto_card,

              cir.id AS fasttag_id,
              cir.rcDocument,
              cir.panDocument,
              cir.passportPhoto,
              cir.fasttag_amount,
              cir.fasttagRecipes,
              cir.aadhaarDocument,
              cir.status AS fasttag_status,
              cir.fasttagReason,
              cir.createdAt AS fasttag_created,
              cir.updatedAt AS fasttag_updated,


               ins.id AS insurance_id,
               ins.rcDocument,
               ins.salesInvoice,
               ins.identityProof,
               ins.addressProof,
               ins.form21,
               ins.form22,
               ins.tempReg,
               ins.puc,
               ins.status AS insurance_status,
               ins.insuranceReason,
               ins.loanDocuments,
               ins.insurance_amount,
               ins.createdAt AS insurance_created,
               ins.updatedAt AS insurance_updated,

                aut.id AS autocard_id,
                aut.confirm_Benefits,
                aut.autocard_amount,
                aut.status AS autocard_status,
                aut.autoCardReason,
                aut.createdAt AS autocard_created,
                aut.updatedAt AS autocard_updated


            FROM customers c
            LEFT JOIN carbooking cb ON c.customerId = cb.customerId
            LEFT JOIN account_management ai ON c.customerId = ai.customerId
            LEFT JOIN invoice_summary inv ON c.customerId = inv.customerId
            LEFT JOIN orders_prebooking_date opd ON c.customerId = opd.customerId
            LEFT JOIN carstocks cs ON c.customerId = cs.customerId
            LEFT JOIN additional_info adi ON c.customerId = adi.customerId

            LEFT JOIN orders_accessories_request o 
            ON c.customerId = o.customerId 
            AND cs.allotmentCarStatus = 'allocated' 
            AND adi.accessories = 'Yes'  -- Only join accessories requests when accessories='Yes'
            LEFT JOIN order_products p ON o.id = p.orderId

            LEFT JOIN coating_requests s 
            ON c.customerId = s.customerId 
            AND adi.coating = 'Yes'  -- Always require coating='Yes'
            AND (
                -- Show coating requests when either:
                adi.accessories = 'No'  -- 1. Accessories are declined (no approval needed)
                OR 
                (adi.accessories = 'Yes' AND o.status = 'Approval')  -- 2. Accessories approved
            )

               -- Corrected car_rto_requests join:

            LEFT JOIN car_rto_requests rt 
            ON c.customerId = rt.customerId  -- Now correctly references customer table
            AND adi.rto = 'Yes'  
            AND (
                adi.coating = 'No'  
                OR 
                (adi.coating = 'Yes' AND  s.status = 'Approval')  
            )

                -- Corrected car_fasttag_requests join:

            LEFT JOIN car_fasttag_requests cir 
            ON c.customerId = cir.customerId -- Now correctly references customer table
            AND adi.fast_tag = 'Yes'  
            AND (
                adi.rto = 'No'  
                OR 
                (adi.rto = 'Yes' AND rt.status = 'Approval')  
            )

            LEFT JOIN car_insurance_requests ins
            ON c.customerId = ins.customerId
            AND adi.insurance = 'Yes'
            AND (
                adi.fast_tag = 'No'
                OR
                (adi.fast_tag = 'Yes' AND cir.status = 'Approval' ) 
            )


            LEFT JOIN car_autocard_requests aut
            ON c.customerId = aut.customerId
            AND adi.auto_card = 'Yes'
            AND (
                adi.insurance = 'No'
                OR
                (adi.insurance = 'Yes' AND ins.status = 'Approval' ) 
            )




            WHERE ai.status = 'Approval'
            ORDER BY c.createdAt DESC
            LIMIT ? OFFSET ?
      `;

        const [results] = await pool.query(query, [limit, offset]);

        if (!results || results.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No approved customer bookings found'
            });
        }

        // Group results by customer and accessory requests
        const customersMap = new Map();

        results.forEach(row => {
            if (!row.customerId) return;

            const customerId = row.customerId;

            // Initialize customer object if not exists
            if (!customersMap.has(customerId)) {
                customersMap.set(customerId, {
                    customerId,
                    firstName: row.firstName || '',
                    middleName: row.middleName || '',
                    lastName: row.lastName || '',
                    mobileNumber1: row.mobileNumber1 || '',
                    mobileNumber2: row.mobileNumber2 || '',
                    email: row.email || '',
                    status: row.status || '',
                    address: row.address || '',
                    city: row.city || '',
                    state: row.state || '',
                    country: row.country || '',
                    carBooking: {
                        model: row.model || '',
                        version: row.version || '',
                        color: row.color || '',
                        fuelType: row.fuelType || '',
                        transmission: row.transmission || '',
                        team_Leader: row.team_Leader || '',
                        team_Member: row.team_Member || '',
                        exShowroomPrice: row.exShowroomPrice || 0,
                        bookingAmount: row.bookingAmount || 0,
                        mileage: row.mileage || 0,
                        engineCapacity: row.engineCapacity || 0,
                        batteryCapacity: row.batteryCapacity || 0,
                        cardiscount: row.cardiscount || 0,
                        groundClearance: row.groundClearance || '',
                        bookingType: row.bookingType || ''
                    },
                    additional_info: {
                        accessories: row.accessories || '',
                        coating: row.coating || '',
                        rto: row.rto || '',
                        fast_tag: row.fast_tag || '',
                        insurance: row.insurance || '',
                        auto_card : row.auto_card || ''
                    },
                    account_management: {
                        updatedAt: row.updatedAt,
                    },
                    invoiceInfo: {
                        invoice_id: row.invoice_id || '',
                        invoice_date: row.invoice_date || null,
                        due_date: row.due_date || null,
                        total_on_road_price: row.total_on_road_price || 0,
                        total_charges: row.total_charges || 0,
                        grand_total: row.invoice_grand_total || 0,
                        payment_status: row.payment_status || ''
                    },
                    orderInfo: {
                        order_date: row.order_date || null,
                        tentative_date: row.tentative_date || null,
                        preferred_date: row.preferred_date || null,
                        request_date: row.request_date || null,
                        prebooking: row.prebooking || false,
                        prebooking_date: row.prebooking_date || null,
                        delivery_date: row.delivery_date || null
                    },
                    stockInfo: (row.vin || row.chassisNumber || row.engineNumber) ? {
                        vin: row.vin || '',
                        chassisNumber: row.chassisNumber || '',
                        engineNumber: row.engineNumber || '',
                        allotmentStatus: row.allotmentStatus || 'Not Allocated'
                    } : undefined,
                    grandTotal: row.grand_total || row.invoice_grand_total || 0,
                    accessoriesRequests: [],
                    coatingRequests: [],
                    RTORequests: [],
                    fasttagRequests: [],
                    insuranceRequests: [],
                    autocardRequests:[]
                });
            }

            // Process accessory requests
            const customer = customersMap.get(customerId);

            if (row.accessory_request_id) {
                let request = customer.accessoriesRequests.find(r => r.id === row.accessory_request_id);

                if (!request) {
                    request = {
                        id: row.accessory_request_id,
                        totalAmount: row.accessory_total_amount,
                        createdAt: row.accessory_createdAt,
                        status: row.accessory_status,
                        accessorieReason: row.accessorieReason,
                        accessorieRecipes: row.accessorieRecipes,
                        updatedAt: row.accessory_updatedAt,
                        products: []
                    };
                    customer.accessoriesRequests.push(request);
                }

                // Add product if exists
                if (row.product_id) {
                    request.products.push({
                        id: row.product_id,
                        category: row.product_category,
                        name: row.product_name,
                        price: row.product_price
                    });
                }
            }

            // New coating request handling
            if (row.coating_id) {
                const existingCoating = customer.coatingRequests.find(
                    c => c.id === row.coating_id
                );

                if (!existingCoating) {
                    customer.coatingRequests.push({
                        id: row.coating_id,
                        coatingType: row.coatingType,
                        preferredDate: row.preferredDate,
                        preferredTime: row.preferredTime,
                        additionalNotes: row.additionalNotes,
                        coating_amount: row.coating_amount,
                        durability: row.durability,
                        createdAt: row.coating_createdAt,
                        updatedAt: row.coating_updatedAt,
                        status: row.coating_status,
                        reason: row.coatingReason
                    });
                }
            }

            if (row.RTO_id && !customer.RTORequests.some(RTO => RTO.id === row.RTO_id)) {
                customer.RTORequests.push({
                    id: row.RTO_id,
                    form20: row.form20,
                    form21: row.form21,
                    form22: row.form22,
                    form34: row.form34,
                    invoice: row.invoice,
                    insurance: row.insurance,
                    puc: row.puc,
                    idProof: row.idProof,
                    roadTax: row.roadTax,
                    tempReg: row.tempReg,
                    createdAt: row.createdAt,
                    updatedAt: row.updatedAt,
                    rto_amount: row.rto_amount,
                    status: row.RTO_status,
                    rtoReason: row.rtoReason
                });
            }

            if (row.fasttag_id && !customer.fasttagRequests.some(fasttag => fasttag.id === row.fasttag_id)) {
                customer.fasttagRequests.push({
                    id: row.fasttag_id,
                    rcDocument: row.rcDocument,
                    panDocument: row.panDocument,
                    passportPhoto: row.passportPhoto,
                    fasttag_amount: row.fasttag_amount,
                    fasttagRecipes: row.fasttagRecipes,
                    aadhaarDocument: row.aadhaarDocument,
                    status: row.fasttag_status,
                    fasttagReason: row.fasttagReason,
                    createdAt: row.fasttag_created,
                    updatedAt: row.fasttag_updated
                });
            }

            if (row.insurance_id && !customer.insuranceRequests.some(insurance => insurance.id === row.insurance_id)) {
                customer.insuranceRequests.push({
                    id: row.insurance_id,
                    rcDocument: row.rcDocument,
                    salesInvoice: row.salesInvoice,
                    identityProof: row.identityProof,
                    addressProof: row.addressProof,
                    form21: row.form21,
                    form22: row.form22,
                    tempReg: row.tempReg,
                    status : row.insurance_status,
                    puc: row.puc,
                    insuranceReason:row.insuranceReason,
                    loanDocuments: row.loanDocuments,
                    insurance_amount: row.insurance_amount,
                    createdAt: row.insurance_created,
                    updatedAt: row.insurance_updated
                });
            }


            if (row.autocard_id && !customer.autocardRequests.some(autocard => autocard.id === row.autocard_id)) {
                customer.autocardRequests.push({
                    id: row.autocard_id,
                    confirmBenefits: row.confirm_Benefits,
                    autocardAmount: row.autocard_amount,
                    status: row.autocard_status,
                    autoCardReason: row.autoCardReason,
                    createdAt: row.autocard_created,
                    updatedAt: row.autocard_updated
                });
            }


        });

        const formattedResults = Array.from(customersMap.values());

        // Get total count for pagination
        const [countResult] = await pool.query(`
          SELECT COUNT(DISTINCT c.customerId) as total 
          FROM customers c
          JOIN account_management ai ON c.customerId = ai.customerId
          WHERE ai.status = 'Approval'
      `);
        const total = countResult[0].total;

        res.status(200).json({
            success: true,
            count: formattedResults.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            data: formattedResults
        });

    } catch (error) {
        console.error('Error fetching approved bookings:', {
            error: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });

        res.status(500).json({
            success: false,
            message: 'Failed to fetch approved bookings',
            error: process.env.NODE_ENV === 'development' ? {
                message: error.message,
                stack: error.stack
            } : undefined
        });
    }
}

module.exports = { showAutocard };