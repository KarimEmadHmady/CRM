import { AuthService } from "../services/auth.service.js";

export class AuthController {

    static async registerController(req, res, next) {
        try {
            const { username, email, password, role, permissions } = req.body;
            const result = await AuthService.registerService({ username, email, password, role, permissions });
            res.status(201).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    static async loginController(req, res, next) {
        try {
            const { email, password } = req.body;
            const result = await AuthService.loginService({ email, password });
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    static async getProfileController(req, res, next) {
        try {
            res.status(200).json({ success: true, data: { user: req.user } });
        } catch (error) {
            next(error);
        }
    }

    static async updateProfileController(req, res, next) {
        try {
            const { username, email } = req.body;
            const updatedUser = await AuthService.updateProfileService(req.user._id, { username, email });
            res.status(200).json({ success: true, data: { user: updatedUser } });
        } catch (error) {
            next(error);
        }
    }

    static async changePasswordController(req, res, next) {
        try {
            const { currentPassword, newPassword } = req.body;
            const result = await AuthService.changePasswordService(req.user._id, { currentPassword, newPassword });
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    static async refreshTokenController(req, res, next) {
        try {
            const newToken = AuthService.generateToken(req.user._id);
            res.status(200).json({ success: true, data: { token: newToken } });
        } catch (error) {
            next(error);
        }
    }

}
