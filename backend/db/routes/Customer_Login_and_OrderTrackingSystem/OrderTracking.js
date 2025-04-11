const pool = require('../../databaseConnection/mysqlConnection');

const trackCustomerOrder = async (req, res) => {
    try {
        const { customerId } = req.customer;

        // 1. Get basic order info
        const [orderInfo] = await pool.query(`
            SELECT 
                cb.model, cb.version, cb.color, cb.fuelType, cb.transmission,
                opd.delivery_date, inv.payment_status,
                cs.vin, cs.chassisNumber, cs.engineNumber, cs.allotmentCarStatus,
                am.status AS account_status
            FROM customers c
            LEFT JOIN carbooking cb ON c.customerId = cb.customerId
            LEFT JOIN orders_prebooking_date opd ON c.customerId = opd.customerId
            LEFT JOIN invoice_summary inv ON c.customerId = inv.customerId
            LEFT JOIN carstocks cs ON c.customerId = cs.customerId
            LEFT JOIN account_management am ON c.customerId = am.customerId
            WHERE c.customerId = ?
        `, [customerId]);

        if (!orderInfo.length) {
            return res.status(404).json({
                success: false,
                message: 'No order found for this customer'
            });
        }

        // 2. Get all service requests
        const [services] = await pool.query(`
            -- Additional Services
            SELECT 'accessories' AS serviceType, status, updatedAt 
            FROM orders_accessories_request WHERE customerId = ?
            UNION ALL
            SELECT 'coating' AS serviceType, status, updatedAt 
            FROM coating_requests WHERE customerId = ?
            UNION ALL
            SELECT 'rto' AS serviceType, status, updatedAt 
            FROM car_rto_requests WHERE customerId = ?
            UNION ALL
            SELECT 'fastag' AS serviceType, status, updatedAt 
            FROM car_fasttag_requests WHERE customerId = ?
            UNION ALL
            SELECT 'insurance' AS serviceType, status, updatedAt 
            FROM car_insurance_requests WHERE customerId = ?
            UNION ALL
            SELECT 'autocard' AS serviceType, status, updatedAt 
            FROM car_autocard_requests WHERE customerId = ?
            UNION ALL
            SELECT 'warranty' AS serviceType, status, updatedAt 
            FROM car_extended_warranty_requests WHERE customerId = ?
            
            -- Delivery Process
            UNION ALL
            SELECT 'pdi' AS serviceType, status, updatedAt 
            FROM predeliveryinspection WHERE customerId = ?
            UNION ALL
            SELECT 'gate_pass' AS serviceType, status, updatedAt 
            FROM gate_pass WHERE customerId = ?
            UNION ALL
            SELECT 'security_clearance' AS serviceType, status, updatedAt 
            FROM management_security_clearance WHERE customerId = ?
        `, Array(10).fill(customerId));

        // 3. Get finance info if applicable
        let financeInfo = {};
        const [additionalInfo] = await pool.query(
            'SELECT finance FROM additional_info WHERE customerId = ?',
            [customerId]
        );

        if (additionalInfo[0]?.finance === 'YES') {
            const [loanInfo] = await pool.query(`
                SELECT 
                    loan_amount, interest_rate, loan_duration, 
                    calculated_emi, status
                FROM loans
                WHERE customerId = ?
            `, [customerId]);
            financeInfo = loanInfo[0] || {};
        }

        // 4. Get exchange info if applicable
        let exchangeInfo = {};
        if (additionalInfo[0]?.exchange === 'YES') {
            const [exchangeData] = await pool.query(`
                SELECT 
                    carMake, carModel, carColor, carRegistration, carYear,
                    exchangeAmount, status
                FROM car_exchange_requests
                WHERE customerId = ?
            `, [customerId]);
            exchangeInfo = exchangeData[0] || {};
        }

        // 5. Calculate overall status
        const overallStatus = calculateOverallStatus(orderInfo[0], services);

        // 6. Prepare response
        const response = {
            success: true,
            data: {
                orderSummary: {
                    carModel: orderInfo[0].model,
                    carColor: orderInfo[0].color,
                    expectedDelivery: orderInfo[0].delivery_date,
                    paymentStatus: orderInfo[0].payment_status,
                    allocationStatus: orderInfo[0].allotmentCarStatus,
                    overallStatus
                },
                carDetails: {
                    vin: orderInfo[0].vin,
                    chassisNumber: orderInfo[0].chassisNumber,
                    engineNumber: orderInfo[0].engineNumber
                },
                services: groupServicesByType(services),
                finance: additionalInfo[0]?.finance === 'YES' ? financeInfo : null,
                exchange: additionalInfo[0]?.exchange === 'YES' ? exchangeInfo : null
            },
            timeline: generateTimeline(services)
        };

        res.status(200).json(response);

    } catch (error) {
        console.error('Order tracking error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to track order',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Helper function to calculate overall status
function calculateOverallStatus(orderInfo, services) {
    const statusPriority = [
        'Security Cleared',
        'Gate Pass Approved',
        'PDI Completed',
        'Car Allocated',
        'Payment Completed',
        'Processing'
    ];

    const statusMap = {
        pdi: services.find(s => s.serviceType === 'pdi')?.status === 'Approval' ? 'PDI Completed' : null,
        gate_pass: services.find(s => s.serviceType === 'gate_pass')?.status === 'Approval' ? 'Gate Pass Approved' : null,
        security_clearance: services.find(s => s.serviceType === 'security_clearance')?.status === 'Approval' ? 'Security Cleared' : null,
        allocation: orderInfo.allotmentCarStatus === 'Allocated' ? 'Car Allocated' : null,
        payment: orderInfo.payment_status === 'Paid' ? 'Payment Completed' : null
    };

    for (const status of statusPriority) {
        if (Object.values(statusMap).includes(status)) {
            return status;
        }
    }

    return 'Processing';
}

// Helper function to group services by type
function groupServicesByType(services) {
    const grouped = {
        additional: services.filter(s => 
            ['accessories', 'coating', 'rto', 'fastag', 'insurance', 'autocard', 'warranty'].includes(s.serviceType)
        ),
        deliveryProcess: services.filter(s => 
            ['pdi', 'gate_pass', 'security_clearance'].includes(s.serviceType)
        )
    };
    return grouped;
}

// Helper function to generate timeline
function generateTimeline(services) {
    const timeline = services
        .map(service => ({
            type: service.serviceType,
            status: service.status,
            date: service.updatedAt
        }))
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    return timeline;
}



module.exports = { trackCustomerOrder };