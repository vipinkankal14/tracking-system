const pool = require('../../databaseConnection/mysqlConnection');

const getCustomerDetailsWithStatuses = async (req, res) => {
  try {
    const query = `
      SELECT 
          c.customerId,
          CONCAT(c.firstName, ' ', COALESCE(c.middleName, ''), ' ', c.lastName) AS customerName,
          c.mobileNumber1,
          c.email,
          adi.exchange AS interestExchange,
          adi.finance AS interestFinance,
          adi.accessories AS interestAccessories,
          adi.coating AS interestCoating,
          adi.rto AS interestRTO,
          adi.fast_tag AS interestFastTag,
          adi.insurance AS interestInsurance,
          adi.auto_card AS interestAutoCard,
          adi.extended_warranty AS interestExtendedWarranty,
          cer.status AS exchangeStatus,
          l.status AS financeStatus,
          oar.status AS accessoriesStatus,
          cr.status AS coatingStatus,
          rto.status AS rtoStatus,
          ft.status AS fastTagStatus,
          ins.status AS insuranceStatus,
          ac.status AS autoCardStatus,
          ew.status AS extendedWarrantyStatus,
          am.status AS accountStatus,
          pdi.status AS preDeliveryStatus,
          gp.status AS gatePassStatus,
          msc.status AS securityClearanceStatus
      FROM 
          customers c
      LEFT JOIN additional_info adi ON c.customerId = adi.customerId
      LEFT JOIN car_exchange_requests cer ON c.customerId = cer.customerId AND adi.exchange = 'YES'
      LEFT JOIN loans l ON c.customerId = l.customerId AND adi.finance = 'YES'
      LEFT JOIN orders_accessories_request oar ON c.customerId = oar.customerId AND adi.accessories = 'YES'
      LEFT JOIN coating_requests cr ON c.customerId = cr.customerId AND adi.coating = 'YES'
      LEFT JOIN car_rto_requests rto ON c.customerId = rto.customerId AND adi.rto = 'YES'
      LEFT JOIN car_fasttag_requests ft ON c.customerId = ft.customerId AND adi.fast_tag = 'YES'
      LEFT JOIN car_insurance_requests ins ON c.customerId = ins.customerId AND adi.insurance = 'YES'
      LEFT JOIN car_autocard_requests ac ON c.customerId = ac.customerId AND adi.auto_card = 'YES'
      LEFT JOIN car_extended_warranty_requests ew ON c.customerId = ew.customerId AND adi.extended_warranty = 'YES'
      LEFT JOIN account_management am ON c.customerId = am.customerId
      LEFT JOIN predeliveryinspection pdi ON c.customerId = pdi.customerId
      LEFT JOIN gate_pass gp ON c.customerId = gp.customerId
      LEFT JOIN management_security_clearance msc ON c.customerId = msc.customerId
      ORDER BY c.customerId;
    `;

    const [rows] = await pool.query(query);

    const results = rows.map(row => ({
      customerId: row.customerId,
      customerName: row.customerName,
      contact: {
        mobile: row.mobileNumber1,
        email: row.email
      },
      interests: {
        exchange: row.interestExchange,
        finance: row.interestFinance,
        accessories: row.interestAccessories,
        coating: row.interestCoating,
        rto: row.interestRTO,
        fastTag: row.interestFastTag,
        insurance: row.interestInsurance,
        autoCard: row.interestAutoCard,
        extendedWarranty: row.interestExtendedWarranty
      },
      statuses: {
        exchange: row.exchangeStatus,
        finance: row.financeStatus,
        accessories: row.accessoriesStatus,
        coating: row.coatingStatus,
        rto: row.rtoStatus,
        fastTag: row.fastTagStatus,
        insurance: row.insuranceStatus,
        autoCard: row.autoCardStatus,
        extendedWarranty: row.extendedWarrantyStatus,
        account: row.accountStatus,
        preDelivery: row.preDeliveryStatus,
        gatePass: row.gatePassStatus,
        securityClearance: row.securityClearanceStatus
      }
    }));

    // Initialize counts object
    const counts = {
      exchange: { Pending: 0, Approval: 0, Rejected: 0, totalInterested: 0 },
      finance: { Pending: 0, Approval: 0, Rejected: 0, totalInterested: 0 },
      accessories: { Pending: 0, Approval: 0, Rejected: 0, totalInterested: 0 },
      coating: { Pending: 0, Approval: 0, Rejected: 0, totalInterested: 0 },
      rto: { Pending: 0, Approval: 0, Rejected: 0, totalInterested: 0 },
      fastTag: { Pending: 0, Approval: 0, Rejected: 0, totalInterested: 0 },
      insurance: { Pending: 0, Approval: 0, Rejected: 0, totalInterested: 0 },
      autoCard: { Pending: 0, Approval: 0, Rejected: 0, totalInterested: 0 },
      extendedWarranty: { Pending: 0, Approval: 0, Rejected: 0, totalInterested: 0 },
      account: { Pending: 0, Approval: 0, Rejected: 0, total: 0 },
      preDelivery: { Pending: 0, Approval: 0, Rejected: 0, total: 0 },
      gatePass: { Pending: 0, Approval: 0, Rejected: 0, total: 0 },
      securityClearance: { Pending: 0, Approval: 0, Rejected: 0, total: 0 }
    };

    // Calculate counts
    results.forEach(customer => {
      // Process interest-based categories
      const interestCategories = ['exchange', 'finance', 'accessories', 'coating', 'rto', 
                                'fastTag', 'insurance', 'autoCard', 'extendedWarranty'];
      
      interestCategories.forEach(category => {
        if (customer.interests[category] === 'YES') {
          counts[category].totalInterested++;
          const status = customer.statuses[category];
          if (status === 'Pending') counts[category].Pending++;
          else if (status === 'Approval') counts[category].Approval++;
          else if (status === 'Rejected') counts[category].Rejected++;
        }
      });

      // Process non-interest categories
      const nonInterestCategories = ['account', 'preDelivery', 'gatePass', 'securityClearance'];
      nonInterestCategories.forEach(category => {
        counts[category].total++;
        const status = customer.statuses[category];
        if (status === 'Pending') counts[category].Pending++;
        else if (status === 'Approval') counts[category].Approval++;
        else if (status === 'Rejected') counts[category].Rejected++;
      });
    });

    res.status(200).json({
      success: true,
      data: {
        customers: results,
        counts: counts
      },
      message: 'Customer details with statuses retrieved successfully'
    });

  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve customer details',
      error: error.message
    });
  }
};

module.exports = {
  getCustomerDetailsWithStatuses,
};