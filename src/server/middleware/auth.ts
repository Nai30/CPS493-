import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "change-me-later";

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