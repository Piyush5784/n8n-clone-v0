import axios from "axios";
import React, { useState, useEffect } from "react";
import { BACKEND_URL, TOKEN } from "../config";
import { useRouter } from "next/navigation";

interface CreateCredentialsFormProps {
  isOpen: boolean;
  onClose?: () => void;
  onCredentialsCreated?: () => void;
}

interface EmailCredentials {
  title: string;
  platform: string;
  smtpHost: string;
  smtpPort: number;
  email: string;
  password: string;
  useTLS: boolean;
}

interface TelegramCredentials {
  title: string;
  platform: string;
  botToken: string;
  chatId?: string;
}

const CreateCredentialsForm = ({
  isOpen,
  onClose,
  onCredentialsCreated,
}: CreateCredentialsFormProps) => {
  const [credentialType, setCredentialType] = useState<"resend" | "telegram">(
    "resend"
  );

  const [emailData, setEmailData] = useState<EmailCredentials>({
    title: "Email Credentials",
    platform: "email",
    smtpHost: "",
    smtpPort: 587,
    email: "",
    password: "",
    useTLS: true,
  });

  const [telegramData, setTelegramData] = useState<TelegramCredentials>({
    title: "Telegram Bot Credentials",
    platform: "telegram",
    botToken: "",
    chatId: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useRouter();

  // Reset form data when credential type changes
  useEffect(() => {
    setError(null);
    if (credentialType === "resend") {
      setEmailData({
        title: "Email Credentials",
        platform: "email",
        smtpHost: "",
        smtpPort: 587,
        email: "",
        password: "",
        useTLS: true,
      });
    } else {
      setTelegramData({
        title: "Telegram Bot Credentials",
        platform: "telegram",
        botToken: "",
        chatId: "",
      });
    }
  }, [credentialType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData =
        credentialType === "resend"
          ? {
              title: emailData.title,
              platform: emailData.platform,
              data: {
                smtpHost: emailData.smtpHost,
                smtpPort: emailData.smtpPort,
                email: emailData.email,
                password: emailData.password,
                useTLS: emailData.useTLS,
              },
            }
          : {
              title: telegramData.title,
              platform: telegramData.platform,
              data: {
                botToken: telegramData.botToken,
                chatId: telegramData.chatId,
              },
            };

      const response = await axios.post(
        `${BACKEND_URL}/credentails`,
        { type: credentialType, data: formData },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );

      const result = (await response.data) as { message?: string };

      if (response.status === 200) {
        if (onCredentialsCreated) {
          onCredentialsCreated();
        }
        if (onClose) {
          onClose();
        }
        // Reset form data after successful submission
        if (credentialType === "resend") {
          setEmailData({
            title: "Email Credentials",
            platform: "email",
            smtpHost: "",
            smtpPort: 587,
            email: "",
            password: "",
            useTLS: true,
          });
        } else {
          setTelegramData({
            title: "Telegram Bot Credentials",
            platform: "telegram",
            botToken: "",
            chatId: "",
          });
        }
      } else {
        setError(result?.message || "Failed to create credentials");
      }
    } catch (error: any) {
      console.log(error);
      setError(error.response?.data?.message || "Network error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const renderEmailForm = () => (
    <>
      <div className="mb-4">
        <label htmlFor="title" className="block  text-sm font-medium mb-2">
          Credentials Title
        </label>
        <input
          type="text"
          id="title"
          value={emailData.title}
          onChange={(e) =>
            setEmailData({ ...emailData, title: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="smtpHost" className="block text-sm font-medium mb-2">
          SMTP Host
        </label>
        <input
          type="text"
          id="smtpHost"
          value={emailData.smtpHost}
          onChange={(e) =>
            setEmailData({ ...emailData, smtpHost: e.target.value })
          }
          placeholder="smtp.gmail.com"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="smtpPort" className="block text-sm font-medium mb-2">
          SMTP Port
        </label>
        <input
          type="number"
          id="smtpPort"
          value={emailData.smtpPort}
          onChange={(e) =>
            setEmailData({ ...emailData, smtpPort: parseInt(e.target.value) })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          value={emailData.email}
          onChange={(e) =>
            setEmailData({ ...emailData, email: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="password" className="block text-sm font-medium mb-2">
          Password / App Password
        </label>
        <input
          type="password"
          id="password"
          value={emailData.password}
          onChange={(e) =>
            setEmailData({ ...emailData, password: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={emailData.useTLS}
            onChange={(e) =>
              setEmailData({ ...emailData, useTLS: e.target.checked })
            }
            className="mr-2"
          />
          <span className="text-sm font-medium">Use TLS/SSL</span>
        </label>
      </div>
    </>
  );

  const renderTelegramForm = () => (
    <>
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium mb-2">
          Credentials Title
        </label>
        <input
          type="text"
          id="title"
          value={telegramData.title}
          onChange={(e) =>
            setTelegramData({ ...telegramData, title: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="botToken" className="block text-sm font-medium mb-2">
          Bot Token
        </label>
        <input
          type="text"
          id="botToken"
          value={telegramData.botToken}
          onChange={(e) =>
            setTelegramData({ ...telegramData, botToken: e.target.value })
          }
          placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          Get this from @BotFather on Telegram
        </p>
      </div>

      <div className="mb-4">
        <label htmlFor="chatId" className="block text-sm font-medium mb-2">
          Chat ID (Optional)
        </label>
        <input
          type="text"
          id="chatId"
          value={telegramData.chatId || ""}
          onChange={(e) =>
            setTelegramData({ ...telegramData, chatId: e.target.value })
          }
          placeholder="@channel_name or -100123456789"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          Default chat/channel to send messages to. Can be overridden when
          sending.
        </p>
      </div>
    </>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800/60">
      <div className="bg-white rounded-lg p-6 w-full border max-w-md">
        <h2 className="text-xl font-semibold mb-4">Create New Credentials</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="credentialType"
              className="block text-sm font-medium mb-2"
            >
              Credential Type
            </label>
            <select
              id="credentialType"
              value={credentialType}
              onChange={(e) =>
                setCredentialType(e.target.value as "resend" | "telegram")
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="resend">Resend (Email)</option>
              <option value="telegram">Telegram Bot</option>
            </select>
          </div>

          {credentialType === "resend"
            ? renderEmailForm()
            : renderTelegramForm()}

          {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Credentials"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCredentialsForm;
