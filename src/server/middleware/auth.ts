import { Request, Response, NextFunction } from "express";
import { User } from "../types/index";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "change-me-later";
declare global {
    namespace Express {
        interface Request {
            user?: User
        }
    }
}
export function authorize(req: Request, res: Response, next: NextFunction) {
    // 1. Get the token from the "Authorization" header
    // It usually looks like: "Bearer [token_string]"
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).send({ 
            isSuccess: false, 
            message: "No token provided. Please log in." 
        });
    }

    // 2. Try to "verify" the token using our secret key
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // 3. If valid, we attach the user's info to the request object
        // This lets the next function know EXACTLY who is making the request
        (req as any).user = decoded;
        
        // 4. "Next" tells Express to move to the actual route handler
        next();
    } catch (err) {
        return res.status(403).send({ 
            isSuccess: false, 
            message: "Invalid or expired token." 
        });
    }
}
export function requireAuth(role?: string, userId?: number) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).send({
                data: null,
                isSuccess: false,
                message: "You must log in to access this resource",
            })
        }

        if (role && req.user.role !== role) {
            return res.status(403).send({
                data: null,
                isSuccess: false,
                message:
                    "You do not have the required role to access this resource",
            })
        }

        if (userId && req.user.id !== userId) {
            return res.status(403).send({
                data: null,
                isSuccess: false,
                message: "You do not have permission to access this resource",
            })
        }

        return next()
    }
}