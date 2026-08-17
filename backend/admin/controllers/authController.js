import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../../db.js";


/*
 * Admin login
 */
export const loginAdmin = async (req, res) => {

    try {

        const { username, password } = req.body;


        if (!username || !password) {

            return res.status(400).json({
                success: false,
                message: "Username and password are required",
            });

        }


        const result = await pool.query(
            `
            SELECT
                id,
                username,
                email,
                password_hash
            FROM admin_users
            WHERE username = $1 OR email = $1
            `,
            [username]
        );


        if (result.rows.length === 0) {

            return res.status(401).json({
                success: false,
                message: "Invalid username or password",
            });

        }


        const admin = result.rows[0];


        const passwordMatch = await bcrypt.compare(
            password,
            admin.password_hash
        );


        if (!passwordMatch) {

            return res.status(401).json({
                success: false,
                message: "Invalid username or password",
            });

        }


        const token = jwt.sign(
            {
                id: admin.id,
                username: admin.username,
                email: admin.email,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "2h",
            }
        );


        /*
         * Store JWT in HTTP-only cookie.
         */
        res.cookie("adminToken", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 2 * 60 * 60 * 1000,
        });


        return res.status(200).json({

            success: true,

            message: "Login successful",

            admin: {
                id: admin.id,
                username: admin.username,
                email: admin.email,
            },

        });


    } catch (error) {

        console.error("Admin login error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });

    }
};


/*
 * Get currently authenticated admin
 */
export const getAdminProfile = async (req, res) => {

    try {

        /*
         * authMiddleware already verified
         * the JWT and placed the decoded
         * information inside req.admin.
         */

        return res.status(200).json({

            success: true,

            admin: {
                id: req.admin.id,
                username: req.admin.username,
                email: req.admin.email,
            },

        });

    } catch (error) {

        console.error("Get admin profile error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to get admin profile",
        });

    }
};


/*
 * Admin logout
 */
export const logoutAdmin = async (req, res) => {

    try {

        res.clearCookie("adminToken", {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        });


        return res.status(200).json({

            success: true,

            message: "Logout successful",

        });

    } catch (error) {

        console.error("Admin logout error:", error);

        return res.status(500).json({
            success: false,
            message: "Logout failed",
        });

    }
};