const pool = require('../../databaseConnection/mysqlConnection');

const getCustomerProfile = async (req, res) => {
    try {
        const customerId = req.customer.customerId; // From JWT middleware

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

                adi.exchange,
                adi.finance,
                adi.accessories,
                adi.coating,
                adi.rto,
                adi.fast_tag,
                adi.insurance,
                adi.auto_card,
                adi.extended_warranty,

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
                aut.updatedAt AS autocard_updated,

                ex.id AS warranty_id,
                ex.request_extended_warranty,
                ex.extendedwarranty_amount,
                ex.status AS ex_status,
                ex.ex_Reason,
                ex.createdAt AS ex_created,
                ex.updatedAt AS ex_updated,

                pre.id AS pdi_id,
                pre.status AS pdi_status,
                pre.PreDeliveryInspectionReason,
                pre.createdAt AS pdi_created,
                pre.updatedAt AS pdi_updated,

                gsc.id AS sc_id,
                gsc.status AS sc_status,
                gsc.gatepassReason,
                gsc.createdAt AS sc_created,
                gsc.updatedAt AS sc_updated,

                mc.id AS mc_id,
                mc.status AS msc_status,
                mc.securityClearanceReason,
                mc.createdAt AS msc_created,
                mc.updatedAt AS msc_updated,

                l.id AS loan_id,
                l.loan_amount,
                l.interest_rate,
                l.loan_duration,
                l.status,
                l.financeReason,
                l.financeAmount,
                l.calculated_emi,
                l.createdAt AS loan_created,
                d.id AS document_id,
                d.employed_type,
                d.document_name,
                d.uploaded_file AS document_path,
                d.uploaded_at AS document_uploaded,

                cer.id AS exchange_id,
                cer.rcDocument AS exchange_rcDocument,
                cer.insurancePolicy AS exchange_insurancePolicy,
                cer.pucCertificate AS exchange_pucCertificate,
                cer.identityProof AS exchange_identityProof,
                cer.addressProof AS exchange_addressProof,
                cer.loanClearance AS exchange_loanClearance,
                cer.serviceHistory AS exchange_serviceHistory,
                cer.carOwnerFullName AS exchange_carOwnerFullName,
                cer.carMake AS exchange_carMake,
                cer.carModel AS exchange_carModel,
                cer.carColor AS exchange_carColor,
                cer.carRegistration AS exchange_carRegistration,
                cer.carYear AS exchange_carYear,
                cer.status AS exchange_status,
                cer.exchangeAmount AS exchange_exchangeAmount,
                cer.exchangeReason AS exchange_exchangeReason,
                cer.createdAt AS exchange_createdAt,
                cer.updatedAt AS exchange_updatedAt

            FROM customers c
            LEFT JOIN carbooking cb ON c.customerId = cb.customerId
            LEFT JOIN account_management ai ON c.customerId = ai.customerId
            LEFT JOIN invoice_summary inv ON c.customerId = inv.customerId
            LEFT JOIN orders_prebooking_date opd ON c.customerId = opd.customerId
            LEFT JOIN carstocks cs ON c.customerId = cs.customerId
            LEFT JOIN additional_info adi ON c.customerId = adi.customerId
            LEFT JOIN orders_accessories_request o ON c.customerId = o.customerId 
                AND cs.allotmentCarStatus = 'allocated' 
                AND adi.accessories = 'Yes'
            LEFT JOIN order_products p ON o.id = p.orderId
            LEFT JOIN coating_requests s ON c.customerId = s.customerId 
                AND adi.coating = 'Yes'
            LEFT JOIN car_rto_requests rt ON c.customerId = rt.customerId 
                AND adi.rto = 'Yes'
            LEFT JOIN car_fasttag_requests cir ON c.customerId = cir.customerId 
                AND adi.fast_tag = 'Yes'
            LEFT JOIN car_insurance_requests ins ON c.customerId = ins.customerId 
                AND adi.insurance = 'Yes'
            LEFT JOIN car_autocard_requests aut ON c.customerId = aut.customerId 
                AND adi.auto_card = 'Yes'
            LEFT JOIN car_extended_warranty_requests ex ON c.customerId = ex.customerId 
                AND adi.extended_warranty = 'Yes'
            LEFT JOIN predeliveryinspection pre ON c.customerId = pre.customerId
            LEFT JOIN gate_pass gsc ON c.customerId = gsc.customerId
            LEFT JOIN management_security_clearance mc ON c.customerId = mc.customerId
            LEFT JOIN car_exchange_requests cer ON c.customerId = cer.customerId 
                AND adi.exchange = 'Yes'
            LEFT JOIN loans l ON c.customerId = l.customerId 
                AND adi.finance = 'Yes'
            LEFT JOIN customer_documents d ON l.id = d.loan_id
            WHERE c.customerId = ?
            ORDER BY c.createdAt DESC
        `;

        const [results] = await pool.query(query, [customerId]);

        if (!results || results.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Customer not found'
            });
        }

        // Process results using existing pattern
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
                        auto_card: row.auto_card || '',
                        extended_warranty: row.extended_warranty || '',
                        exchange: row.exchange || '',
                        finance: row.finance || ''
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
                    loans: [],
                    carexchangerequests: [],
                    accessoriesRequests: [],
                    coatingRequests: [],
                    RTORequests: [],
                    fasttagRequests: [],
                    insuranceRequests: [],
                    autocardRequests: [],
                    extendedWarrantyRequests: [],
                    predeliveryinspection: [],
                    gate_pass: [],
                    management_security_clearance: []
                });
            }

            const customer = customersMap.get(customerId);

             if (row.loan_id) {
                let loan = customer.loans.find(loan => loan.id === row.loan_id);
                if (!loan) {
                    loan = {
                        id: row.loan_id,
                        loan_amount: row.loan_amount,
                        interest_rate: row.interest_rate,
                        loan_duration: row.loan_duration,
                        status: row.status,
                        financeReason: row.financeReason,
                        financeAmount: row.financeAmount,
                        calculated_emi: row.calculated_emi,
                        created_at: row.loan_created,
                        documents: []
                    };
                    customer.loans.push(loan);
                }

                // Process document data
                if (row.document_id) {
                    const existingDoc = loan.documents.find(doc => doc.id === row.document_id);
                    if (!existingDoc) {
                        loan.documents.push({
                            id: row.document_id,
                            employed_type: row.employed_type,
                            document_name: row.document_name,
                            document_path: row.document_path,
                            uploaded_at: row.document_uploaded
                        });
                    }
                }
            }

            if (row.exchange_id && !customer.carexchangerequests.some(ex => ex.id === row.exchange_id)) {
                customer.carexchangerequests.push({
                    id: row.exchange_id,
                    rcDocument: row.exchange_rcDocument,
                    insurancePolicy: row.exchange_insurancePolicy,
                    pucCertificate: row.exchange_pucCertificate,
                    identityProof: row.exchange_identityProof,
                    addressProof: row.exchange_addressProof,
                    loanClearance: row.exchange_loanClearance,
                    serviceHistory: row.exchange_serviceHistory,
                    carOwnerFullName: row.exchange_carOwnerFullName,
                    carMake: row.exchange_carMake,
                    carModel: row.exchange_carModel,
                    carColor: row.exchange_carColor,
                    carRegistration: row.exchange_carRegistration,
                    carYear: row.exchange_carYear,
                    status: row.exchange_status,
                    exchangeAmount: row.exchange_exchangeAmount,
                    exchangeReason: row.exchange_exchangeReason,
                    createdAt: row.exchange_createdAt,
                    updatedAt: row.exchange_updatedAt
                });
            }

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
                    status: row.insurance_status,
                    puc: row.puc,
                    insuranceReason: row.insuranceReason,
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

            if (row.warranty_id && !customer.extendedWarrantyRequests.some(warranty => warranty.id === row.warranty_id)) {
                customer.extendedWarrantyRequests.push({
                    id: row.warranty_id,
                    request_extended_warranty: row.request_extended_warranty,
                    extendedwarranty_amount: row.extendedwarranty_amount,
                    status: row.ex_status,
                    ex_Reason: row.ex_Reason,
                    createdAt: row.ex_created,
                    updatedAt: row.ex_updated
                });
            }

            if (row.pdi_id && !customer.predeliveryinspection.some(predeliveryinspection => predeliveryinspection.id === row.pdi_id)) {
                customer.predeliveryinspection.push({
                    id: row.pdi_id,
                    status: row.pdi_status,
                    PreDeliveryInspectionReason: row.PreDeliveryInspectionReason,
                    createdAt: row.pdi_created,
                    updatedAt: row.pdi_updated
                });
            }

            if (row.sc_id && !customer.gate_pass.some(gate_pass => gate_pass.id === row.sc_id)) {
                customer.gate_pass.push({
                    id: row.sc_id,
                    status: row.sc_status,
                    gatepassReason: row.gatepassReason,
                    createdAt: row.sc_created,
                    updatedAt: row.sc_updated
                });
            }

            if (row.mc_id && !customer.management_security_clearance.some(management_security_clearance => management_security_clearance.id === row.mc_id)) {
                customer.management_security_clearance.push({
                    id: row.mc_id,
                    status: row.msc_status,
                    securityClearanceReason: row.securityClearanceReason,
                    createdAt: row.msc_created,
                    updatedAt: row.msc_updated
                });
            }
        });

        const formattedResults = Array.from(customersMap.values());

        if (formattedResults.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Customer data not found'
            });
        }

        res.status(200).json({
            success: true,
            data: formattedResults[0]
        });

    } catch (error) {
        console.error('Profile error:', {
            error: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });

        res.status(500).json({
            success: false,
            message: 'Failed to fetch profile',
            error: process.env.NODE_ENV === 'development' ? {
                message: error.message,
                stack: error.stack
            } : undefined
        });
    }
};

module.exports = { getCustomerProfile };









































CREATE TABLE `customers` (
    `id` int(11) NOT NULL,
    `customerId` varchar(20) NOT NULL,
    `firstName` varchar(50) NOT NULL,
    `middleName` varchar(50) DEFAULT NULL,
    `lastName` varchar(50) NOT NULL,
    `mobileNumber1` varchar(15) NOT NULL,
    `mobileNumber2` varchar(15) DEFAULT NULL,
    `customerType` varchar(20) DEFAULT 'individual',
    `birthDate` date DEFAULT NULL,
    `email` varchar(100) DEFAULT NULL,
    `aadhaarNumber` varchar(20) DEFAULT NULL,
    `panNumber` varchar(20) DEFAULT NULL,
    `city` varchar(50) DEFAULT NULL,
    `state` varchar(50) DEFAULT NULL,
    `country` varchar(50) DEFAULT NULL,
    `address` text DEFAULT NULL,
    `status` enum('canceled','confirmed') DEFAULT NULL,
    `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
    `cancellationReason` text DEFAULT NULL,
    `isConfirmed` tinyint(1) DEFAULT 0,
    `cancellationDate` timestamp NULL DEFAULT NULL,
    `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    `password` varchar(255) NOT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
  
CREATE TABLE `additional_info` (
  `id` int(11) NOT NULL,backend/serrs.sql
  `customerId` varchar(20) NOT NULL,
  `exchange` enum('YES','NO') DEFAULT 'NO',
  `finance` enum('YES','NO') DEFAULT 'NO',
  `accessories` enum('YES','NO') DEFAULT 'NO',
  `coating` enum('YES','NO') DEFAULT 'NO',
  `fast_tag` enum('YES','NO') DEFAULT 'NO',
  `rto` enum('YES','NO') DEFAULT 'NO',
  `insurance` enum('YES','NO') DEFAULT 'NO',
  `extended_warranty` enum('YES','NO') DEFAULT 'NO',
  `auto_card` enum('YES','NO') DEFAULT 'NO',
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `orders_prebooking_date` (
  `id` int(11) NOT NULL,
  `customerId` varchar(20) NOT NULL,
  `order_date` enum('YES','NO') DEFAULT 'NO',
  `tentative_date` date DEFAULT NULL,
  `preferred_date` date DEFAULT NULL,
  `request_date` date DEFAULT NULL,
  `prebooking` enum('YES','NO') DEFAULT 'NO',
  `prebooking_date` date DEFAULT NULL,
  `delivery_date` date DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


// finance === YES show
 loans and documents
CREATE TABLE `loans` (
  `id` int(11) NOT NULL,
  `customerId` varchar(50) NOT NULL,
  `loan_amount` decimal(15,2) NOT NULL,
  `interest_rate` decimal(5,2) NOT NULL,
  `loan_duration` varchar(35) NOT NULL,
  `calculated_emi` decimal(15,2) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('Pending','Approval','Rejected') DEFAULT 'Pending',
  `financeAmount` decimal(15,2) NOT NULL DEFAULT 0.00,
  `financeReason` text DEFAULT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `customer_documents` (
  `id` int(11) NOT NULL,
  `loan_id` int(11) NOT NULL,
  `employed_type` varchar(50) NOT NULL,
  `document_name` varchar(255) NOT NULL,
  `uploaded_file` varchar(255) NOT NULL,
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

// exchange === YES show 
CREATE TABLE `car_exchange_requests` (
  `id` int(11) NOT NULL,
  `customerId` varchar(11) NOT NULL,
  `rcDocument` varchar(255) NOT NULL,
  `insurancePolicy` varchar(255) NOT NULL,
  `pucCertificate` varchar(255) NOT NULL,
  `identityProof` varchar(255) NOT NULL,
  `addressProof` varchar(255) NOT NULL,
  `loanClearance` varchar(255) DEFAULT NULL,
  `serviceHistory` varchar(255) DEFAULT NULL,
  `carOwnerFullName` varchar(100) NOT NULL,
  `carMake` varchar(100) NOT NULL,
  `carModel` varchar(100) NOT NULL,
  `carColor` varchar(50) NOT NULL,
  `carRegistration` varchar(20) NOT NULL,
  `carYear` int(11) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `exchangeAmount` decimal(10,2) DEFAULT NULL,
  `exchangeReason` text DEFAULT NULL,
  `status` enum('Pending','Approved','Rejected') NOT NULL DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `invoice_summary` (
  `invoice_id` int(11) NOT NULL,
  `customerId` varchar(20) NOT NULL,
  `invoice_date` date NOT NULL,
  `due_date` date NOT NULL,
  `total_on_road_price` decimal(12,2) NOT NULL,
  `total_charges` decimal(12,2) NOT NULL,
  `grand_total` decimal(12,2) NOT NULL,
  `payment_status` enum('Paid','Unpaid') DEFAULT 'Unpaid',
  `customer_account_balance` decimal(10,2) DEFAULT 0.00,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `additional_charges` (
  `charge_id` int(11) NOT NULL,
  `invoice_id` int(11) NOT NULL,
  `coating` decimal(12,2) DEFAULT 0.00,
  `fast_tag` decimal(12,2) DEFAULT 0.00,
  `rto` decimal(12,2) DEFAULT 0.00,
  `insurance` decimal(12,2) DEFAULT 0.00,
  `extended_warranty` decimal(12,2) DEFAULT 0.00,
  `auto_card` decimal(12,2) DEFAULT 0.00,
  `total_charges` decimal(12,2) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `on_road_price_details` (
  `price_detail_id` int(11) NOT NULL,
  `invoice_id` int(11) NOT NULL,
  `ex_showroom_price` decimal(12,2) NOT NULL,
  `accessories` decimal(12,2) DEFAULT 0.00,
  `discount` decimal(12,2) DEFAULT 0.00,
  `subtotal` decimal(12,2) NOT NULL,
  `gst_rate` decimal(5,2) NOT NULL,
  `gst_amount` decimal(12,2) NOT NULL,
  `cess_rate` decimal(5,2) DEFAULT 0.00,
  `cess_amount` decimal(12,2) DEFAULT 0.00,
  `total_on_road_price` decimal(12,2) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `carbooking` (
  `id` int(11) NOT NULL,
  `customerId` varchar(255) NOT NULL,
  `team_Leader` varchar(255) DEFAULT NULL,
  `team_Member` varchar(255) DEFAULT NULL,
  `carType` varchar(255) NOT NULL,
  `model` varchar(255) NOT NULL,
  `version` varchar(255) NOT NULL,
  `color` varchar(255) NOT NULL,
  `exShowroomPrice` decimal(10,2) NOT NULL,
  `bookingAmount` decimal(10,2) NOT NULL,
  `fuelType` varchar(255) NOT NULL,
  `transmission` varchar(255) NOT NULL,
  `mileage` decimal(10,2) NOT NULL,
  `engineCapacity` decimal(10,2) DEFAULT NULL,
  `batteryCapacity` decimal(10,2) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `cardiscount` decimal(10,2) DEFAULT 0.00,
  `groundClearance` varchar(8) DEFAULT NULL,
  `bookingType` varchar(50) DEFAULT NULL CHECK (`bookingType` in ('Online','Dealership Advisor'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


// account_management === approved  
CREATE TABLE `account_management` (
  `id` int(11) NOT NULL,
  `customerId` varchar(12) NOT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `cancellationReason` text DEFAULT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `account_management_refund` (
  `id` int(11) NOT NULL,
  `customerId` varchar(16) NOT NULL,
  `status` enum('Failed','InProcess','Completed') NOT NULL,
  `refundReason` text NOT NULL,
  `refundAmount` decimal(10,2) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `transactionType` varchar(155) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


// account_management === approved  after carbooking and  carstocks customerId is same after show vin,manufacturerDate,chassisNumber,engineNumber,allotmentCarStatus
CREATE TABLE `carstocks` (
  `id` int(11) NOT NULL,
  `vin` varchar(17) NOT NULL,
  `manufacturerDate` date NOT NULL,
  `dateIn` date NOT NULL,
  `model` varchar(255) NOT NULL,
  `color` varchar(50) DEFAULT NULL,
  `fuelType` varchar(50) DEFAULT NULL,
  `chassisNumber` varchar(50) DEFAULT NULL,
  `engineNumber` varchar(50) DEFAULT NULL,
  `version` varchar(50) DEFAULT NULL,
  `customerId` varchar(10) DEFAULT NULL,
  `allotmentCarStatus` enum('Allocated','Not Allocated') DEFAULT NULL,
  `carType` varchar(50) NOT NULL,
  `engineCapacity` varchar(10) NOT NULL,
  `transmission` varchar(50) NOT NULL,
  `exShowroomPrice` decimal(15,2) NOT NULL,
  `bookingAmount` decimal(15,2) NOT NULL,
  `mileage` varchar(10) NOT NULL,
  `batteryCapacity` varchar(50) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `cardiscount` decimal(15,2) DEFAULT NULL,
  `groundClearance` varchar(255) DEFAULT NULL,
  `cancellationReason` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


// accessories === YES show 
CREATE TABLE `orders_accessories_request` (
  `id` int(11) NOT NULL,
  `customerId` varchar(255) NOT NULL,
  `totalAmount` decimal(10,2) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('Pending','Approval','Rejected') DEFAULT 'Pending',
  `accessorieReason` text DEFAULT NULL,
  `accessorieRecipes` varchar(255) DEFAULT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `order_products` (
  `id` int(11) NOT NULL,
  `orderId` int(11) DEFAULT NULL,
  `category` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


// coating === YES show 
CREATE TABLE `coating_requests` (
  `id` int(11) NOT NULL,
  `customerId` varchar(11) NOT NULL,
  `coatingType` varchar(100) NOT NULL,
  `preferredDate` date NOT NULL,
  `preferredTime` varchar(20) NOT NULL,
  `additionalNotes` text DEFAULT NULL,
  `coating_amount` decimal(10,2) DEFAULT NULL,
  `durability` varchar(50) NOT NULL,
  `status` enum('Pending','Approval','Rejected') DEFAULT 'Pending',
  `coatingReason` text DEFAULT NULL,
  `coatingRecipes` varchar(255) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


// rto  === YES show 
CREATE TABLE `car_rto_requests` (
  `id` int(11) NOT NULL,
  `customerId` varchar(255) NOT NULL,
  `form20` varchar(255) DEFAULT NULL,
  `form21` varchar(255) DEFAULT NULL,
  `form22` varchar(255) DEFAULT NULL,
  `invoice` varchar(255) DEFAULT NULL,
  `insurance` varchar(255) DEFAULT NULL,
  `puc` varchar(255) DEFAULT NULL,
  `idProof` varchar(255) DEFAULT NULL,
  `roadTax` varchar(255) DEFAULT NULL,
  `tempReg` varchar(255) DEFAULT NULL,
  `form34` varchar(255) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `rto_amount` decimal(10,2) NOT NULL,
  `status` enum('Pending','Approval','Rejected') DEFAULT 'Pending',
  `rtoReason` text DEFAULT NULL,
  `rtoRecipes` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


// fasttag === YES show 
CREATE TABLE `car_fasttag_requests` (
  `id` int(11) NOT NULL,
  `customerId` varchar(255) NOT NULL,
  `rcDocument` varchar(255) NOT NULL,
  `aadhaarDocument` varchar(255) NOT NULL,
  `panDocument` varchar(255) NOT NULL,
  `passportPhoto` varchar(255) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `fasttag_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `status` enum('Pending','Approval','Rejected') DEFAULT 'Pending',
  `fasttagReason` text DEFAULT NULL,
  `fasttagRecipes` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


// insurance === YES show 
CREATE TABLE `car_insurance_requests` (
  `id` int(11) NOT NULL,
  `customerId` varchar(255) NOT NULL,
  `rcDocument` varchar(255) NOT NULL,
  `salesInvoice` varchar(255) NOT NULL,
  `identityProof` varchar(255) NOT NULL,
  `addressProof` varchar(255) NOT NULL,
  `form21` varchar(255) NOT NULL,
  `form22` varchar(255) NOT NULL,
  `tempReg` varchar(255) NOT NULL,
  `puc` varchar(255) NOT NULL,
  `loanDocuments` varchar(255) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `insurance_amount` decimal(10,2) NOT NULL,
  `status` enum('Pending','Approval','Rejected') DEFAULT 'Pending',
  `insuranceReason` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

// autocard === YES show 
CREATE TABLE `car_autocard_requests` (
  `id` int(11) NOT NULL,
  `customerId` varchar(11) NOT NULL,
  `confirm_Benefits` varchar(155) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `autocard_amount` decimal(10,2) NOT NULL,
  `status` enum('Pending','Approval','Rejected') DEFAULT 'Pending',
  `autoCardReason` text DEFAULT NULL,
  `autoCardRecipes` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


// extended_warranty  === YES show 
CREATE TABLE `car_extended_warranty_requests` (
  `id` int(11) NOT NULL,
  `customerId` varchar(255) NOT NULL,
  `request_extended_warranty` varchar(90) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `extendedwarranty_amount` decimal(10,2) NOT NULL,
  `status` enum('Pending','Approval','Rejected') DEFAULT 'Pending',
  `ex_Reason` text DEFAULT NULL,
  `ex_Recipes` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



loans -> car_exchange_requests -> account_management -> orders_accessories_request -> coating_requests -> car_rto_requests -> car_fasttag_requests -> car_insurance_requests -> car_autocard_requests -> car_extended_warranty_requests ===  Approval after show predeliveryinspection 

CREATE TABLE `predeliveryinspection` (
  `id` int(11) NOT NULL,
  `customerId` varchar(12) NOT NULL,
  `status` enum('Pending','Approval','Rejected') DEFAULT 'Pending',
  `PreDeliveryInspectionReason` text DEFAULT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

predeliveryinspection === Approval  after show gate_pass

CREATE TABLE `gate_pass` (
  `id` int(11) NOT NULL,
  `customerId` varchar(12) NOT NULL,
  `status` enum('Pending','Approval','Rejected') DEFAULT 'Pending',
  `gatepassReason` text DEFAULT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

gate_pass === Approval  after show management_security_clearance
CREATE TABLE `management_security_clearance` (
  `id` int(11) NOT NULL,
  `customerId` varchar(12) NOT NULL,
  `status` enum('Pending','Approval','Rejected') DEFAULT 'Pending',
  `securityClearanceReason` text DEFAULT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
