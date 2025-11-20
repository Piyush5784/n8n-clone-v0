import Imap from "imap";
import "dotenv/config";
import nodemailer from "nodemailer";
import { simpleParser } from "mailparser";
import { randomUUID } from "crypto";
import { ExecutionResult, getCredentials, getCredentialsById } from "./helper";
import { JsonObject } from "@prisma/client/runtime/library";

let emailId: string;
const processedEmails = new Set<string>();

async function parseEmail(buffer: Buffer) {
  return simpleParser(buffer);
}

async function checkReplies(
  imap: Imap,
  fromEmail: string,
  targetEmail: string,
  emailId: string
): Promise<string | null> {
  return new Promise<string | null>((resolve) => {
    if (imap.state !== "authenticated") {
      return resolve(null);
    }

    imap.openBox("INBOX", true, (err, box) => {
      if (err) {
        console.error("Error opening inbox:", err);
        return resolve(null);
      }

      const lastUid = box.uidnext ? box.uidnext - 20 : 1;

      imap.search(
        [
          ["FROM", targetEmail],
          ["UID", `${lastUid}:*`],
        ],
        (searchErr, results) => {
          if (searchErr) {
            console.error("Search error:", searchErr);
            return resolve(null);
          }

          if (!results?.length) {
            return resolve(null);
          }

          const recent = results.slice(-10);
          const f = imap.fetch(recent, { bodies: "", struct: true });
          let resolved = false;
          let messagesProcessed = 0;
          const totalMessages = recent.length;

          const safeResolve = (value: string | null) => {
            if (!resolved) {
              resolved = true;
              resolve(value);
            }
          };

          f.on("message", (msg) => {
            let chunks: Buffer[] = [];

            msg.on("body", (stream) => {
              stream.on("data", (chunk: Buffer) => chunks.push(chunk));
              stream.on("end", async () => {
                try {
                  const parsed = await parseEmail(Buffer.concat(chunks));
                  const id =
                    parsed.messageId || `${parsed.subject}-${parsed.date}`;

                  if (processedEmails.has(id)) {
                    messagesProcessed++;
                    if (messagesProcessed >= totalMessages) {
                      safeResolve(null);
                    }
                    return;
                  }

                  processedEmails.add(id);

                  if (parsed.from?.value?.[0]?.address === fromEmail) {
                    messagesProcessed++;
                    if (messagesProcessed >= totalMessages) {
                      safeResolve(null);
                    }
                    return;
                  }

                  const subject = parsed.subject?.toLowerCase() || "";
                  const bodyText = (parsed.text || parsed.html || "")
                    .replace(/<[^>]+>/g, " ")
                    .toLowerCase();

                  const matchesId =
                    subject.includes(emailId.toLowerCase()) ||
                    bodyText.includes(emailId.toLowerCase());
                  const isReply =
                    subject.includes("re:") || subject.includes("reply");
                  const yesNoMatch = bodyText.match(/\b(yes|no)\b/i);
                  const hasYesNo = !!yesNoMatch;

                  if (matchesId && (isReply || hasYesNo)) {
                    if (hasYesNo) {
                      const response = yesNoMatch![0].toUpperCase();
                      console.log("Found matching reply:", response);
                      return safeResolve(response);
                    }
                  }

                  messagesProcessed++;
                  if (messagesProcessed >= totalMessages) {
                    safeResolve(null);
                  }
                } catch (err) {
                  console.error("Parse error:", err);
                  messagesProcessed++;
                  if (messagesProcessed >= totalMessages) {
                    safeResolve(null);
                  }
                }
              });
            });
          });

          f.on("error", (err) => {
            console.error("Fetch error:", err);
            safeResolve(null);
          });

          f.on("end", () => {
            setTimeout(() => {
              if (!resolved) {
                safeResolve(null);
              }
            }, 500);
          });
        }
      );
    });
  });
}

export async function sendAndAwait(
  userId: string,
  targetEmail: string,
  options?: {
    useEmailConnection?: boolean;
    subject?: string;
    body?: string;
    timeout?: number;
  }
): Promise<ExecutionResult> {
  try {
    const emailCredentials = await getCredentials(userId, "email_connection");
    if (!emailCredentials) {
      return {
        success: false,
        failedReason:
          "No email connection found. Please connect your email first.",
      };
    }

    const data = emailCredentials.data as JsonObject;
    const smtpHost = data.smtpHost as string;
    const smtpPort = data.smtpPort as number;
    const password = data.password as string;
    const fromEmail = data.email as string;

    if (!smtpHost || !smtpPort || !password || !fromEmail) {
      return {
        success: false,
        failedReason: "Missing required email configuration",
      };
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: fromEmail, pass: password },
    });

    if (!targetEmail) {
      return { success: false, failedReason: "Target email missing" };
    }

    emailId = randomUUID().slice(0, 8);

    // Use custom subject and body if provided, otherwise use defaults
    const customSubject =
      options?.subject || `Confirm payment - ID: ${emailId}`;
    const customBody =
      options?.body ||
      `Reply YES or NO to confirm this payment.\n\nEmail ID: ${emailId}`;
    const timeoutMs = (options?.timeout || 120) * 1000; // Convert to milliseconds

    const emailOptions = {
      from: fromEmail,
      to: targetEmail,
      subject: customSubject,
      text: customBody,
    };

    await transporter.sendMail(emailOptions);
    console.log(`Email sent with ID: ${emailId}`);

    const imap = new Imap({
      user: fromEmail,
      password: password,
      host: "imap.gmail.com",
      port: 993,
      tls: true,
      tlsOptions: { rejectUnauthorized: false },
      authTimeout: 10000,
      connTimeout: 10000,
      keepalive: false,
    });

    return new Promise<ExecutionResult>((resolve, reject) => {
      let isResolved = false;
      let interval: NodeJS.Timeout;
      let timeout: NodeJS.Timeout;

      const safeResolve = (result: ExecutionResult, reason: string) => {
        if (!isResolved) {
          isResolved = true;
          console.log(`Resolving: ${reason}`);

          if (interval) clearInterval(interval);
          if (timeout) clearTimeout(timeout);

          try {
            if (imap.state === "authenticated" || imap.state === "connected") {
              imap.end();
            }
          } catch (e) {
            console.error("Error closing IMAP:", e);
          }

          setTimeout(() => resolve(result), 100);
        }
      };

      timeout = setTimeout(() => {
        safeResolve(
          {
            success: false,
            failedReason: "Timeout waiting for reply",
          },
          "Timeout reached"
        );
      }, timeoutMs);

      imap.once("ready", () => {
        console.log("Monitoring for replies");

        interval = setInterval(async () => {
          try {
            const response = await checkReplies(
              imap,
              fromEmail,
              targetEmail,
              emailId
            );
            console.log({ response });
            if (response) {
              clearInterval(interval);
              clearTimeout(timeout);
              console.log(`Found reply: ${response}`);

              try {
                await transporter.sendMail({
                  from: fromEmail,
                  to: targetEmail,
                  subject:
                    response === "YES"
                      ? `Payment Approved - ID: ${emailId}`
                      : `Payment Declined - ID: ${emailId}`,
                  text:
                    response === "YES"
                      ? `Your payment has been approved.\nPayment ID: ${emailId}`
                      : `Your payment has been declined.\nPayment ID: ${emailId}`,
                });
                console.log("Reply processed and confirmation sent");
                imap.end();
                safeResolve({ success: true }, "Reply received and processed");
              } catch (emailError) {
                console.error("Error sending confirmation:", emailError);
                imap.end();
                safeResolve(
                  {
                    success: false,
                    failedReason: "Error sending confirmation email",
                  },
                  "Email confirmation error"
                );
              }
            }
          } catch (err) {
            console.error("Error checking replies:", err);
          }
        }, 3000);
      });

      imap.once("end", () => {
        console.log("IMAP connection ended");
      });

      imap.once("close", () => {
        console.log("IMAP connection closed");
        if (!isResolved) {
          safeResolve(
            { success: false, failedReason: "Connection closed without reply" },
            "IMAP connection closed"
          );
        }
      });

      imap.once("error", (err: Error) => {
        console.error("IMAP error:", err.message);
        if (!isResolved) {
          isResolved = true;
          if (interval) clearInterval(interval);
          if (timeout) clearTimeout(timeout);
          safeResolve(
            {
              success: false,
              failedReason: `IMAP error: ${err.message}`,
            },
            "IMAP error"
          );
        }
      });

      imap.connect();
    });
  } catch (error) {
    return {
      success: false,
      failedReason: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
