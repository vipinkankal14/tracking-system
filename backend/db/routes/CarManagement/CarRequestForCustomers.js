const express = require('express');
const router = express.Router();
const pool = require('../../databaseConnection/mysqlConnection');

const getCarRequestForCustomers = async (req, res) => {
  try {
      // Optional pagination parameters
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const offset = (page - 1) * limit;

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
              cs.allotmentCarStatus as allotmentStatus
          FROM customers c
          LEFT JOIN carbooking cb ON c.customerId = cb.customerId
          LEFT JOIN account_management ai ON c.customerId = ai.customerId
          LEFT JOIN invoice_summary inv ON c.customerId = inv.customerId
          LEFT JOIN orders_prebooking_date opd ON c.customerId = opd.customerId
          LEFT JOIN carstocks cs ON c.customerId = cs.customerId
          WHERE ai.status = 'approved'
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

      // Transform results
      const formattedResults = results.map(row => {
          if (!row.customerId) {
              throw new Error('Invalid data: customerId is required');
          }

          const result = {
              customerId: row.customerId,
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
              account_management: {
                updatedAt:row.updatedAt,
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
              grandTotal: row.grand_total || row.invoice_grand_total || 0
          };

          // Only add stockInfo if there's data in carstocks table
          if (row.vin || row.chassisNumber || row.engineNumber) {
              result.stockInfo = {
                  vin: row.vin || '',
                  chassisNumber: row.chassisNumber || '',
                  engineNumber: row.engineNumber || '',
                  allotmentStatus: row.allotmentStatus || 'Not Allocated'
              };
          }

          return result;
      });

      // Get total count for pagination
      const [countResult] = await pool.query(`
          SELECT COUNT(*) as total 
          FROM customers c
          JOIN account_management ai ON c.customerId = ai.customerId
          WHERE ai.status = 'approved'
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
};

module.exports = { getCarRequestForCustomers };