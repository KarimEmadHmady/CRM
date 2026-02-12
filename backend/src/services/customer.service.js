import { Customer } from "../modles/customer.model.js";
import { v4 as uuid } from "uuid";

export class CustomerService {

    static async createCustomerService({ name, email, phone, address, category, notes }) {
        const id = uuid();
        return await Customer.create({ id, name, email, phone, address, category, notes });
    }

    static async getAllCustomersService() {
        return await Customer.find().sort({ createdAt: -1 });
    }

    static async getCustomerByIdService(id) {
        return await Customer.findById(id);
    }

    static async updateCustomerService(id, { name, email, phone, address, category, status, notes, lastContactDate, totalSpent }) {
        const updateData = { name, email, phone, address, category, status, notes, lastContactDate, totalSpent };
        Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);
        return await Customer.findByIdAndUpdate(id, updateData, { new: true });
    }

    static async deleteCustomerService(id) {
        return await Customer.findByIdAndDelete(id);
    }

    static async getCustomersByCategoryService(category) {
        return await Customer.find({ category }).sort({ createdAt: -1 });
    }

    static async getCustomersByStatusService(status) {
        return await Customer.find({ status }).sort({ createdAt: -1 });
    }

    static async searchCustomersService(query) {
        const searchRegex = new RegExp(query, 'i');
        return await Customer.find({
            $or: [
                { name: searchRegex },
                { email: searchRegex },
                { phone: searchRegex },
                { notes: searchRegex }
            ]
        }).sort({ createdAt: -1 });
    }

    static async updateCustomerStatusService(id, status) {
        return await Customer.findByIdAndUpdate(id, { status }, { new: true });
    }

    static async getCustomerStatsService() {
        const stats = await Customer.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);
        
        const categoryStats = await Customer.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            }
        ]);

        return {
            statusStats: stats,
            categoryStats: categoryStats,
            totalCustomers: await Customer.countDocuments()
        };
    }

}
