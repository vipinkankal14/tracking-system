const express = require('express');
const router = express.Router();
const pool = require('../../databaseConnection/mysqlConnection');

const ShowSecurityclearance = async (req, res) => {
    const query = `
        SELECT 
            c.customerId,
            c.firstName,
            c.middleName,
            c.lastName,
            c.email,
            c.mobileNumber1,
            c.mobileNumber2,
            c.createdAt AS customer_created,

            cr.model,
            cr.version,
            cr.color,

            ai.finance,
            ai.accessories,
            ai.coating,
            ai.fast_tag,
            ai.rto,
            ai.insurance,
            ai.extended_warranty,
            ai.auto_card,
            ai.createdAt AS additional_info_created,

            car.status AS auto_card_status,
            car.autoCardReason,
            car.createdAt AS auto_card_request_created,
            car.updatedAt AS auto_card_request_updated,

            ew.id AS extended_warranty_id,
            ew.status AS extended_warranty_status,
            ew.ex_Reason,
            ew.createdAt AS extended_warranty_created,
            ew.updatedAt AS extended_warranty_updated,

            ins.id AS insurance_id,
            ins.status AS insurance_status,
            ins.insuranceReason,
            ins.createdAt AS insurance_created,
            ins.updatedAt AS insurance_updated,

            rto.id AS rto_id,
            rto.status AS rto_status,
            rto.rtoReason,
            rto.createdAt AS rto_created,
            rto.updatedAt AS rto_updated,

            ft.id AS fast_tag_id,
            ft.status AS fast_tag_status,
            ft.fasttagReason,
            ft.createdAt AS fast_tag_created,
            ft.updatedAt AS fast_tag_updated,

            co.id AS coating_id,
            co.status AS coating_status,
            co.coatingReason,
            co.createdAt AS coating_created,
            co.updatedAt AS coating_updated,

            l.id AS loan_id,
            l.status AS loan_status,
            l.financeReason,
            l.createdAt AS loan_created,
            l.updatedAt AS loan_updated,

            oa.id AS accessories_id,
            oa.status AS accessories_status,
            oa.accessorieReason,
            oa.createdAt AS accessories_created,
            oa.updatedAt AS accessories_updated,

            pre.id AS pdi_id,
            pre.status AS pdi_status,
            pre.PreDeliveryInspectionReason,
            pre.createdAt AS pdi_created,
            pre.updatedAt AS pdi_updated,

            sc.id AS sc_id,
            sc.status AS sc_status,
            sc.securityClearanceReason,
            sc.createdAt AS sc_created,
            sc.updatedAt AS sc_updated,

            gp.id AS gp_id,
            gp.status AS gp_status,
            gp.gatepassReason,
            gp.createdAt AS gp_created,
            gp.updatedAt AS gp_updated

             
            

        FROM customers c
        LEFT JOIN carbooking cr 
            ON c.customerId = cr.customerId
        LEFT JOIN additional_info ai 
            ON c.customerId = ai.customerId
        LEFT JOIN car_autocard_requests car 
            ON c.customerId = car.customerId
        LEFT JOIN car_extended_warranty_requests ew
            ON c.customerId = ew.customerId
        LEFT JOIN car_insurance_requests ins
            ON c.customerId = ins.customerId
        LEFT JOIN car_rto_requests rto
            ON c.customerId = rto.customerId
        LEFT JOIN car_fasttag_requests ft
            ON c.customerId = ft.customerId
        LEFT JOIN coating_requests co
            ON c.customerId = co.customerId
        LEFT JOIN loans l
            ON c.customerId = l.customerId
        LEFT JOIN orders_accessories_request oa
            ON c.customerId = oa.customerId
        LEFT JOIN predeliveryinspection pre
            on c.customerId = pre.customerId
        LEFT JOIN management_security_clearance sc
            on c.customerId = sc.customerId
        LEFT JOIN gate_pass gp
            on c.customerId = gp.customerId;
    `;

    try {
        const [results] = await pool.query(query);

        if (results.length === 0) {
            return res.status(200).json({
                success: true,
                data: [],
                message: 'No Security Clearance requests found.',
            });
        }

        // Transform the flat result set into the desired nested structure
        const customersMap = new Map();

        results.forEach(row => {
            if (!customersMap.has(row.customerId)) {
                const customer = {
                    customerId: row.customerId,
                    firstName: row.firstName,
                    middleName: row.middleName,
                    lastName: row.lastName,
                    email: row.email,
                    mobileNumber1: row.mobileNumber1,
                    mobileNumber2:row.mobileNumber2,
                    created_at: row.customer_created,
                    carBooking: {
                        model: row.model,
                        version: row.version,
                        color: row.color
                    },
                    additional_info: {
                        finance: row.finance,
                        accessories: row.accessories,
                        coating: row.coating,
                        fast_tag: row.fast_tag,
                        rto: row.rto,
                        insurance: row.insurance,
                        extended_warranty: row.extended_warranty,
                        auto_card: row.auto_card,
                        created_at: row.additional_info_created
                    },
                    predeliveryinspection: [],
                    management_security_clearance: [],
                    gate_pass : []

                };

                // Conditionally add objects based on additional_info
                if (row.finance === 'Yes') {
                    customer.loans = {
                        id: row.loan_id,
                        status: row.loan_status,
                        financeReason: row.financeReason,
                        createdAt: row.loan_created,
                        updatedAt: row.loan_updated
                    };
                }

                if (row.accessories === 'Yes') {
                    customer.orders_accessories_request = {
                        id: row.accessories_id,
                        status: row.accessories_status,
                        accessorieReason: row.accessorieReason,
                        createdAt: row.accessories_created,
                        updatedAt: row.accessories_updated
                    };
                }

                if (row.coating === 'Yes') {
                    customer.coating_requests = {
                        id: row.coating_id,
                        status: row.coating_status,
                        coatingReason: row.coatingReason,
                        createdAt: row.coating_created,
                        updatedAt: row.coating_updated
                    };
                }

                if (row.fast_tag === 'Yes') {
                    customer.car_fasttag_requests = {
                        id: row.fast_tag_id,
                        status: row.fast_tag_status,
                        fastTagReason: row.fastTagReason,
                        createdAt: row.fast_tag_created,
                        updatedAt: row.fast_tag_updated
                    };
                }

                if (row.rto === 'Yes') {
                    customer.car_rto_requests = {
                        id: row.rto_id,
                        status: row.rto_status,
                        rtoReason: row.rtoReason,
                        createdAt: row.rto_created,
                        updatedAt: row.rto_updated
                    };
                }

                if (row.insurance === 'Yes') {
                    customer.car_insurance_requests = {
                        id: row.insurance_id,
                        status: row.insurance_status,
                        insuranceReason: row.insuranceReason,
                        createdAt: row.insurance_created,
                        updatedAt: row.insurance_updated
                    };
                }

                if (row.extended_warranty === 'Yes') {
                    customer.car_extended_warranty_requests = {
                        id: row.extended_warranty_id,
                        status: row.extended_warranty_status,
                        ex_Reason: row.ex_Reason,
                        createdAt: row.extended_warranty_created,
                        updatedAt: row.extended_warranty_updated
                    };
                }

                if (row.auto_card === 'Yes') {
                    customer.car_autocard_requests = {
                        status: row.auto_card_status,
                        autoCardReason: row.autoCardReason,
                        createdAt: row.auto_card_request_created,
                        updatedAt: row.auto_card_request_updated
                    };
                }

                customersMap.set(row.customerId, customer);

                if (row.pdi_id && !customer.predeliveryinspection.some(predeliveryinspection => predeliveryinspection.id === row.pdi_id)) {
                    customer.predeliveryinspection.push({
                        id: row.pdi_id,
                        status: row.pdi_status,
                        PreDeliveryInspectionReason: row.PreDeliveryInspectionReason,
                        createdAt: row.pdi_created,
                        updatedAt: row.pdi_updated
                    });
                }
                    
                if (row.sc_id && !customer.management_security_clearance.some(management_security_clearance => management_security_clearance.id === row.sc_id)) {
                    customer.management_security_clearance.push({
                    id : row.sc_id,
                    status: row.sc_status,
                    securityClearanceReason: row.securityClearanceReason,
                    createdAt: row.sc_created,
                    updatedAt: row.sc_updated
                    });
                }

                if (row.gp_id && !customer.gate_pass.some(gate_pass => gate_pass.id === row.gp_id)) {
                    customer.gate_pass.push({
                    id : row.gp_id,
                    status: row.gp_status,
                    gatepassReason: row.gatepassReason,
                    createdAt: row.gp_created,
                    updatedAt: row.gp_updated
                    });
                }
            }
        });





        // Filter customers based on additional_info and status conditions
        const filteredCustomers = Array.from(customersMap.values()).filter(customer => {
            const additionalInfo = customer.additional_info;

            // Check each field conditionally
            const financeCheck = additionalInfo.finance === 'No' || (additionalInfo.finance === 'Yes' && customer.loans.status === 'Approval');
            const accessoriesCheck = additionalInfo.accessories === 'No' || (additionalInfo.accessories === 'Yes' && customer.orders_accessories_request.status === 'Approval');
            const coatingCheck = additionalInfo.coating === 'No' || (additionalInfo.coating === 'Yes' && customer.coating_requests.status === 'Approval');
            const fastTagCheck = additionalInfo.fast_tag === 'No' || (additionalInfo.fast_tag === 'Yes' && customer.car_fasttag_requests.status === 'Approval');
            const rtoCheck = additionalInfo.rto === 'No' || (additionalInfo.rto === 'Yes' && customer.car_rto_requests.status === 'Approval');
            const insuranceCheck = additionalInfo.insurance === 'No' || (additionalInfo.insurance === 'Yes' && customer.car_insurance_requests.status === 'Approval');
            const extendedWarrantyCheck = additionalInfo.extended_warranty === 'No' || (additionalInfo.extended_warranty === 'Yes' && customer.car_extended_warranty_requests.status === 'Approval');
            const autoCardCheck = additionalInfo.auto_card === 'No' || (additionalInfo.auto_card === 'Yes' && customer.car_autocard_requests.status === 'Approval');

            // Check if any predeliveryinspection entry has pdi_status as 'Approved'
            const pdiApproved = customer.predeliveryinspection.some(pdi => pdi.status === 'Approval');
            const gatePassApproved = customer.gate_pass.some(gp => gp.status === 'Approval');


            // Return true only if all conditions are satisfied
            return (
                financeCheck &&
                accessoriesCheck &&
                coatingCheck &&
                fastTagCheck &&
                rtoCheck &&
                insuranceCheck &&
                extendedWarrantyCheck &&
                autoCardCheck &&
                pdiApproved &&
                gatePassApproved
            );
        });

        // Return the filtered results
        res.status(200).json({
            success: true,
            data: filteredCustomers,
        });

    } catch (error) {
        console.error('Error fetching Security Clearance requests:', error);

        // Return a generic error message to avoid exposing sensitive details
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching Security Clearance requests.',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
        });
    }
};

module.exports = { ShowSecurityclearance };