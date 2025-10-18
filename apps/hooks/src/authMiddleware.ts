import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { PrismaClient } from "@repo/db/client";

const JWT_SECRET = "mysecjwtpassword";

const prisma = new PrismaClient();
export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({
        message: "Unauthorized User",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(500).json({
        message: "Invalid credentials",
      });
    }
    const verify = jwt.verify(token, JWT_SECRET) as JwtPayload & {
      id?: string;
      userId?: string;
    };

    const userId = verify.id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized User",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized User",
      });
    }

    req.userId = userId;
    req.userEmail = user.email;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized User",
    });
  }
}
