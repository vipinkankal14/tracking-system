 
const express = require('express');
const router = express.Router();
const pool = require('../../databaseConnection/mysqlConnection');

 
const getcanceledBookings = async (req, res) => {
    try {
      const query = `
        SELECT 
          c.*,
          cb.*,
          ai.*,
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
          opd.delivery_date
        FROM customers c
        LEFT JOIN carbooking cb ON c.customerId = cb.customerId
        LEFT JOIN additional_info ai ON c.customerId = ai.customerId
        LEFT JOIN invoice_summary inv ON c.customerId = inv.customerId
        LEFT JOIN orders_prebooking_date opd ON c.customerId = opd.customerId
        WHERE c.status = 'canceled'
        ORDER BY c.createdAt DESC
      `;
  
      const [results] = await pool.query(query);
  
      // Transform results to match frontend expectations
      const formattedResults = results.map(row => ({
        customerId: row.customerId,
        firstName: row.firstName,
        middleName: row.middleName,
        lastName: row.lastName,
        mobileNumber1: row.mobileNumber1,
        mobileNumber2: row.mobileNumber2,
        email: row.email,
        status: row.status,
        address: row.address,
        city: row.city,
        state: row.state,
        country: row.country,
        carBooking: {
          model: row.model,
          version: row.version,
          color: row.color,
          fuelType: row.fuelType,
          transmission: row.transmission
        },
        additionalInfo: {
          exchange: row.exchange,
          finance: row.finance,
          accessories: row.accessories,
          coating: row.coating,
          fast_tag: row.fast_tag,
          rto: row.rto,
          insurance: row.insurance,
          extended_warranty: row.extended_warranty,
          auto_card: row.auto_card
        },
        invoiceInfo: {
          invoice_id: row.invoice_id,
          invoice_date: row.invoice_date,
          due_date: row.due_date,
          total_on_road_price: row.total_on_road_price,
          total_charges: row.total_charges,
          grand_total: row.invoice_grand_total,
          payment_status: row.payment_status
        },
        orderInfo: {
          order_date: row.order_date,
          tentative_date: row.tentative_date,
          preferred_date: row.preferred_date,
          request_date: row.request_date,
          prebooking: row.prebooking,
          prebooking_date: row.prebooking_date,
          delivery_date: row.delivery_date
        },
        grandTotal: row.grand_total || row.invoice_grand_total
      }));
  
      res.status(200).json({
        success: true,
        count: formattedResults.length,
        data: formattedResults
      });
  
    } catch (error) {
      console.error('Error fetching canceled bookings:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch canceled bookings',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
};
  

module.exports = { getcanceledBookings };