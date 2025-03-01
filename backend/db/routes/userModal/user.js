const pool = require('../../databaseConnection/mysqlConnection');
 

const getCustomerOrders = async (req, res) => {
    const { customerId } = req.params;

    try {
        const [orders] = await pool.query(
            'SELECT * FROM orders_accessories_request WHERE customerId = ?', 
            [customerId]
        );

        for (let order of orders) {
            const [products] = await pool.query(
                'SELECT * FROM order_products WHERE orderId = ?', 
                [order.id]
            );
            order.products = products;
        }

        res.status(200).json({ orders });
    } catch (error) {
        console.error('Error fetching orders:', error.message);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};

 

const getCustomerLoans = async (req, res) => {
    try {
        const customerId = req.params.customerId;

        const sqlQuery = `
            SELECT 
                l.*,
                cd.id AS document_id,
                cd.employed_type AS employment_type,
                cd.document_name,
                cd.uploaded_file
            FROM loans l
            LEFT JOIN customer_documents cd ON l.id = cd.loan_id
            WHERE l.customerId = ?
            ORDER BY l.created_at DESC, cd.uploaded_at DESC
        `;

        const [rows] = await pool.query(sqlQuery, [customerId]);

        const structuredData = rows.reduce((acc, row) => {
            const existingLoan = acc.find(loan => loan.id === row.id);
            
            if (!existingLoan) {
                const newLoan = {
                    id: row.id,
                    customerId: row.customerId,
                    loan_amount: row.loan_amount,
                    interest_rate: row.interest_rate,
                    loan_duration: row.loan_duration,
                    calculated_emi: row.calculated_emi,
                    created_at: row.created_at,
                    documents: []
                };
                
                if (row.document_id) {
                    newLoan.documents.push({
                        id: row.document_id,
                        employment_type: row.employment_type,
                        document_name: row.document_name,
                        uploaded_file: row.uploaded_file,
                        uploaded_at: row.uploaded_at
                    });
                }
                
                acc.push(newLoan);
            } else {
                if (row.document_id) {
                    existingLoan.documents.push({
                        id: row.document_id,
                        employment_type: row.employment_type,
                        document_name: row.document_name,
                        uploaded_file: row.uploaded_file,
                        uploaded_at: row.uploaded_at
                    });
                }
            }
            
            return acc;
        }, []);

        res.json({
            success: true,
            loans: structuredData
        });

    } catch (error) {
        console.error('Error fetching loans:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching loan data',
            error: error.message
        });
    }
};



const getCustomerCoatingRequests = async (req, res) => {
    const { customerId } = req.params;

    try {
        const [coatingRequests] = await pool.query(
            'SELECT * FROM coating_requests WHERE customerId = ?', 
            [customerId]
        );

        res.status(200).json({ coatingRequests });
    } catch (error) {
        console.error('Error fetching coating requests:', error.message);
        res.status(500).json({ error: 'Failed to fetch coating requests' });
    }
};


module.exports = { getCustomerOrders, getCustomerLoans ,getCustomerCoatingRequests  };