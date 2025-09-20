import { JsonObject } from "@prisma/client/runtime/library";
import { PrismaClient } from "@repo/db/client";
import axios from "axios";
import TelegramBot from "node-telegram-bot-api";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

export interface ExecutionResult {
  success: boolean;
  failedReason?: string;
}

export function parseTemplate(template: string, metadata: JsonObject): string {
  if (!template) return "";
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return metadata[key]?.toString() || match;
  });
}

export async function sendEmail(
  userId: string,
  to: string,
  subject: string,
  body: string
): Promise<ExecutionResult> {
  try {
    const emailCredentials = await getCredentials(userId, "resend");

    if (!emailCredentials) {
      console.error("No email credentials found for user:", userId);
      return {
        success: false,
        failedReason: "No email credentials found for user",
      };
    }

    const data = emailCredentials.data;

    if (typeof data !== "object" || data === null || Array.isArray(data)) {
      console.error("Invalid email credentials data format");
      return {
        success: false,
        failedReason: "Invalid email credentials data format",
      };
    }

    const smtpHost = (data as JsonObject).smtpHost as string;
    const smtpPort = (data as JsonObject).smtpPort as number;
    const password = (data as JsonObject).password as string;
    const fromEmail = (data as JsonObject).email as string;

    if (!smtpHost || !smtpPort || !password || !fromEmail) {
      return {
        success: false,
        failedReason:
          "Missing required email configuration (host, port, password, or email)",
      };
    }

    if (!to || !subject) {
      return {
        success: false,
        failedReason: "Missing required email fields (to or subject)",
      };
    }

    console.log({
      smtpHost,
      smtpPort,
      password,
      fromEmail,
      to,
    });

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: fromEmail,
        pass: password,
      },
    });

    const options = {
      from: fromEmail,
      to: to,
      subject: subject,
      text: body, // Changed from 'message' to 'text' for nodemailer
    };

    try {
      await transporter.sendMail(options);
      console.log("Email sent successfully!");
      return {
        success: true,
      };
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
      return {
        success: false,
        failedReason: `Failed to send email: ${emailError instanceof Error ? emailError.message : "Unknown error"}`,
      };
    }
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      success: false,
      failedReason: `Email sending error: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

export async function getCredentials(
  userId: string,
  credentialType: string
): Promise<JsonObject | null> {
  try {
    const credential = await prisma.credentials.findFirst({
      where: {
        userId: userId,
        type: credentialType,
      },
      select: { data: true },
    });
    return (credential?.data as JsonObject) || null;
  } catch (error) {
    console.error(
      `Error fetching credentials for user ${userId}, type ${credentialType}:`,
      error
    );
    return null;
  }
}

export async function sendTelegramMsg(
  userId: string,
  metadata: JsonObject
): Promise<ExecutionResult> {
  try {
    const telegramCredentials = await getCredentials(userId, "telegram");

    if (!telegramCredentials) {
      return {
        success: false,
        failedReason: "No Telegram credentials found for user",
      };
    }

    const data = telegramCredentials.data;
    if (!data || typeof data !== "object") {
      return {
        success: false,
        failedReason: "Telegram credentials data is missing or invalid",
      };
    }

    const botToken = (data as JsonObject).botToken as string;
    const chatId = metadata.chatId as string;
    const message = metadata.message as string;

    if (!botToken) {
      return {
        success: false,
        failedReason: "Bot token not found in Telegram credentials",
      };
    }

    if (!chatId) {
      return {
        success: false,
        failedReason: "Chat ID not found in metadata",
      };
    }

    if (!message) {
      return {
        success: false,
        failedReason: "Message not found in metadata",
      };
    }

    try {
      const bot = new TelegramBot(botToken, {
        request: {
          agentOptions: {
            keepAlive: true,
            family: 4,
          },
          url: "https://api.telegram.org",
        },
      });
      await bot.sendMessage(chatId, message);
      return {
        success: true,
      };
    } catch (botError) {
      return {
        success: false,
        failedReason: `Failed to send Telegram message: ${botError instanceof Error ? botError.message : "Unknown error"}`,
      };
    }
  } catch (error: any) {
    return {
      success: false,
      failedReason: `Telegram sending error: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}
