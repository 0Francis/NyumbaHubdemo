import { Request, Response, NextFunction } from "express";
import { clerkMiddleware, getAuth } from "@clerk/express";
import { db } from "../config/db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

// Extend Express Request to carry our app user
declare global {
  namespace Express {
    interface Request {
      appUser?: typeof users.$inferSelect;
    }
  }
}

// Step 1: Use Clerk's built-in middleware to verify the session
export const verifyClerk = clerkMiddleware();

// Step 2: Require authentication and load local user from DB
export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const auth = getAuth(req);

    if (!auth?.userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.clerkUserId, auth.userId))
      .limit(1);

    if (!user) {
      res.status(403).json({ error: "User profile not found. Please complete registration." });
      return;
    }

    req.appUser = user;
    next();
  } catch (err) {
    next(err);
  }
};
