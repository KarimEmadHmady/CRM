import { CustomerService } from "../services/customer.service.js";
import { NotificationService } from "../services/notification.service.js";

export class CustomerController {

    static async createCustomerController(req, res, next) {
        try {
            const { name, email, phone, address, category, notes } = req.body;
            const customer = await CustomerService.createCustomerService({ name, email, phone, address, category, notes });
            
            // Send welcome notification
            await NotificationService.createWelcomeNotificationService(customer._id);
            
            res.status(201).json({ success: true, data: customer });
        } catch (error) {
            next(error);
        }
    }

    static async getAllCustomersController(req, res, next) {
        try {
            const { category, status, search } = req.query;
            let customers;

            if (category) {
                customers = await CustomerService.getCustomersByCategoryService(category);
            } else if (status) {
                customers = await CustomerService.getCustomersByStatusService(status);
            } else if (search) {
                customers = await CustomerService.searchCustomersService(search);
            } else {
                customers = await CustomerService.getAllCustomersService();
            }

            res.status(200).json({ success: true, data: customers });
        } catch (error) {
            next(error);
        }
    }

    static async getCustomerByIdController(req, res, next) {
        try {
            const { id } = req.params;
            const customer = await CustomerService.getCustomerByIdService(id);
            
            if (!customer) {
                return res.status(404).json({ success: false, message: "Customer not found" });
            }

            res.status(200).json({ success: true, data: customer });
        } catch (error) {
            next(error);
        }
    }

    static async updateCustomerController(req, res, next) {
        try {
            const { id } = req.params;
            const { name, email, phone, address, category, status, notes, lastContactDate, totalSpent } = req.body;
            
            const updatedCustomer = await CustomerService.updateCustomerService(id, { 
                name, email, phone, address, category, status, notes, lastContactDate, totalSpent 
            });

            if (!updatedCustomer) {
                return res.status(404).json({ success: false, message: "Customer not found" });
            }

            res.status(200).json({ success: true, data: updatedCustomer });
        } catch (error) {
            next(error);
        }
    }

    static async deleteCustomerController(req, res, next) {
        try {
            const { id } = req.params;
            const customer = await CustomerService.deleteCustomerService(id);
            
            if (!customer) {
                return res.status(404).json({ success: false, message: "Customer not found" });
            }

            res.status(200).json({ success: true, message: "Customer deleted successfully" });
        } catch (error) {
            next(error);
        }
    }

    static async updateCustomerStatusController(req, res, next) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            
            const updatedCustomer = await CustomerService.updateCustomerStatusService(id, status);
            
            if (!updatedCustomer) {
                return res.status(404).json({ success: false, message: "Customer not found" });
            }

            res.status(200).json({ success: true, data: updatedCustomer });
        } catch (error) {
            next(error);
        }
    }

    static async getCustomerStatsController(req, res, next) {
        try {
            const stats = await CustomerService.getCustomerStatsService();
            res.status(200).json({ success: true, data: stats });
        } catch (error) {
            next(error);
        }
    }

    static async getCustomersByCategoryController(req, res, next) {
        try {
            const { category } = req.params;
            const customers = await CustomerService.getCustomersByCategoryService(category);
            res.status(200).json({ success: true, data: customers });
        } catch (error) {
            next(error);
        }
    }

    static async getCustomersByStatusController(req, res, next) {
        try {
            const { status } = req.params;
            const customers = await CustomerService.getCustomersByStatusService(status);
            res.status(200).json({ success: true, data: customers });
        } catch (error) {
            next(error);
        }
    }

    static async searchCustomersController(req, res, next) {
        try {
            const { q } = req.query;
            if (!q) {
                return res.status(400).json({ success: false, message: "Search query is required" });
            }
            
            const customers = await CustomerService.searchCustomersService(q);
            res.status(200).json({ success: true, data: customers });
        } catch (error) {
            next(error);
        }
    }

}
