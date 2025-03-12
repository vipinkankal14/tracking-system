const pool = require("../../databaseConnection/mysqlConnection");

 


const getAllAccountManagementRefund = async (req, res) => {
    // Fixed SQL query (removed duplicate WHERE and semicolon)
    const query = `
        SELECT 
            c.customerId,
            c.firstName,
            c.middleName,
            c.lastName,
            c.email,
            c.created_at AS customer_created,
            cr.model,
            cr.version,
            cr.color,
            cir.id AS refund_id,
            cir.status,  
            cir.refundReason,
            cir.refundAmount,
            cir.createdAt AS refund_created,
            cir.updatedAt AS refund_updated
        FROM customers c
        LEFT JOIN carbooking cr ON c.customerId = cr.customerId
        LEFT JOIN account_management_refund cir ON c.customerId = cir.customerId
        WHERE cir.customerId IS NOT NULL 
          AND cir.customerId != ''
          AND cir.status = 'InProcess';
    `;

    try {
        const [results] = await pool.query(query);

        // Always return array even when empty
        if (!results || results.length === 0) {
            return res.status(200).json({
                success: true,
                data: [],
                message: 'No refund requests found.',
            });
        }

        const customersMap = new Map();

        results.forEach(row => {
            if (!customersMap.has(row.customerId)) {
                customersMap.set(row.customerId, {
                    customerId: row.customerId,
                    firstName: row.firstName,
                    middleName: row.middleName,
                    lastName: row.lastName,
                    email: row.email,
                    created_at: row.customer_created,
                    carBooking: {
                        model: row.model || null,  // Handle possible null values
                        version: row.version || null,
                        color: row.color || null
                    },
                    accountmanagementrefundRequests: []
                });
            }

            const customer = customersMap.get(row.customerId);

            // Add refund details if exists
            if (row.refund_id) {
                const exists = customer.accountmanagementrefundRequests
                    .some(r => r.id === row.refund_id);
                
                if (!exists) {
                    customer.accountmanagementrefundRequests.push({
                        id: row.refund_id,
                        status: row.status,
                        refundReason: row.refundReason,
                        refundAmount: row.refundAmount,
                        createdAt: row.refund_created,
                        updatedAt: row.refund_updated
                    });
                }
            }
        });

        // Convert map to array
        const customersArray = Array.from(customersMap.values());

        res.status(200).json({
            success: true,
            data: customersArray,
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            data: [],  // Ensure array response
            message: 'Error fetching refund requests',
            error: process.env.NODE_ENV === 'development' 
                ? error.message 
                : undefined
        });
    }
};

module.exports = { getAllAccountManagementRefund };



