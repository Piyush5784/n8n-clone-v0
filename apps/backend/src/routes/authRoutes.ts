import { PrismaClient } from "@repo/db/client";
import e, { Router } from "express";
import { SigninSchema, SignupSchema } from "../types/index";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

const router = Router();
const prisma = new PrismaClient();
router.post("/signup", async (req, res) => {
  try {
    const parsedData = SignupSchema.safeParse(req.body);

    if (!parsedData.success) {
      return res.status(400).json({
        message: "Invalid data",
      });
    }
    const data = parsedData.data;

    const existingUser = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(data.password, 13);
    const newUser = await prisma.user.create({
      data: {
        username: data.username,
        password: hashedPassword,
        email: data.email,
      },
    });

    return res.json({
      message: "User successfully created",
      userEmail: newUser.email,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create user",
    });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const parsedData = SigninSchema.safeParse(req.body);

    console.log(parsedData);

    if (!parsedData.success) {
      return res.status(400).json({
        message: "Invalid data",
        error: parsedData.error.issues,
      });
    }
    const data = parsedData.data;
    const existingUser = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });
    if (!existingUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const comparePassword = await bcrypt.compare(
      data.password,
      existingUser.password
    );

    if (!comparePassword) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }
    const token = jwt.sign({ id: existingUser.id }, JWT_SECRET);

    return res.json({
      message: "User successfully logged in",
      token,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create user",
    });
  }
});

export const authRoutes = router;
