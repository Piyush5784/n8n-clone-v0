"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { toast } from "sonner";
import { getCredentails } from "../helpers/function";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle } from "lucide-react";
import { Node } from "@xyflow/react";
import { CustomNodeTypes } from "@/(pages)/(restricted)/workflow/[workflowId]/CustomNode";

interface NodeConfigurationModalProps {
  isOpen: boolean;
  onClose: () => void;
  node: Node | null;
  workflowId: string;
  onSave: (nodeId: string, configuration: any) => void;
}

export const NodeConfigurationModal = ({
  isOpen,
  onClose,
  node,
  workflowId,
  onSave,
}: NodeConfigurationModalProps) => {
  const { token } = useAuth();
  const [configuration, setConfiguration] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [emailCredentials, setEmailCredentials] = useState<any[]>([]);
  const [loadingCredentials, setLoadingCredentials] = useState(false);

  const nodeType = node?.data.label as CustomNodeTypes;

  // Fetch email credentials when component mounts or when node changes
  useEffect(() => {
    const fetchCredentials = async () => {
      if (!token) return;
      if (nodeType === "sendEmail" || nodeType === "sendAndAwait") {
        setLoadingCredentials(true);
        try {
          const res = (await getCredentails(token)) as any;
          const emailCreds = res.credentials.filter(
            (cred: any) => cred.type === "resend"
          );
          setEmailCredentials(emailCreds);
        } catch (error) {
          console.error("Failed to fetch email credentials:", error);
          toast.error("Failed to load email credentials");
        } finally {
          setLoadingCredentials(false);
        }
      }
    };

    if (node) {
      setConfiguration((node.data as any).metadata || {});
      fetchCredentials();
    }
  }, [node, token, nodeType]);

  // Don't show modal for trigger or webhook nodes
  if (!isOpen || !node || nodeType === "trigger" || nodeType === "webhook") {
    return null;
  }

  const handleSave = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await axios.post(
        `${BACKEND_URL}/workflow/update-node-metadata`,
        {
          workflowId: workflowId,
          nodeId: node.id,
          metadata: configuration,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const responseData = response.data as {
        success: boolean;
        message?: string;
      };

      if (responseData.success) {
        await onSave(node.id, configuration);
        toast.success("Configuration saved successfully!");
        onClose();
      } else {
        throw new Error(responseData.message || "Failed to save configuration");
      }
    } catch (error) {
      console.error("Error saving configuration:", error);
      toast.error("Failed to save configuration");
    } finally {
      setLoading(false);
    }
  };

  const renderConfigurationFields = () => {
    switch (nodeType) {
      case "sendEmail":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="emailCredential">Email Connection</Label>
              {loadingCredentials ? (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading credentials...</span>
                </div>
              ) : (
                <>
                  <Select
                    value={configuration.emailCredentialId || ""}
                    onValueChange={(value) =>
                      setConfiguration({
                        ...configuration,
                        emailCredentialId: value,
                      })
                    }
                  >
                    <SelectTrigger id="emailCredential">
                      <SelectValue placeholder="Select email credentials" />
                    </SelectTrigger>
                    <SelectContent>
                      {emailCredentials.map((cred) => (
                        <SelectItem key={cred.id} value={cred.id}>
                          {cred.title || `Email Credential ${cred.id}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {emailCredentials.length === 0 && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        No email credentials found. Please create email
                        credentials first.
                      </AlertDescription>
                    </Alert>
                  )}
                </>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="toEmail">To Email</Label>
              <Input
                id="toEmail"
                type="email"
                value={configuration.to || ""}
                onChange={(e) =>
                  setConfiguration({ ...configuration, to: e.target.value })
                }
                placeholder="recipient@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                type="text"
                value={configuration.subject || ""}
                onChange={(e) =>
                  setConfiguration({
                    ...configuration,
                    subject: e.target.value,
                  })
                }
                placeholder="Email subject"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="body">Message Body</Label>
              <Textarea
                id="body"
                value={configuration.body || ""}
                onChange={(e) =>
                  setConfiguration({ ...configuration, body: e.target.value })
                }
                placeholder="Email message content"
                rows={4}
              />
            </div>
          </div>
        );

      case "sendTelegram":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="chatId">Chat ID</Label>
              <Input
                id="chatId"
                type="text"
                value={configuration.chatId || ""}
                onChange={(e) =>
                  setConfiguration({ ...configuration, chatId: e.target.value })
                }
                placeholder="Telegram chat ID"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={configuration.message || ""}
                onChange={(e) =>
                  setConfiguration({
                    ...configuration,
                    message: e.target.value,
                  })
                }
                placeholder="Message to send"
                rows={4}
              />
            </div>
          </div>
        );

      case "AiAgent":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="var1">Variable 1</Label>
              <Input
                id="var1"
                type="number"
                value={configuration.var1 || ""}
                onChange={(e) =>
                  setConfiguration({ ...configuration, var1: e.target.value })
                }
                placeholder="e.g., 12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="var2">Variable 2</Label>
              <Input
                id="var2"
                type="text"
                value={configuration.var2 || ""}
                onChange={(e) =>
                  setConfiguration({
                    ...configuration,
                    var2: e.target.value,
                  })
                }
                placeholder="e.g., 15"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sendResponse"
                  checked={configuration.sendResponse || false}
                  onCheckedChange={(checked) =>
                    setConfiguration({
                      ...configuration,
                      sendResponse: checked,
                    })
                  }
                />
                <Label
                  htmlFor="sendResponse"
                  className="text-sm font-normal cursor-pointer"
                >
                  Enable response sending
                </Label>
              </div>

              {configuration.sendResponse && (
                <div className="space-y-4 pl-6 border-l-2 border-muted">
                  <div className="space-y-2">
                    <Label htmlFor="actionType">Action Type</Label>
                    <Select
                      value={configuration.actionType || ""}
                      onValueChange={(value) =>
                        setConfiguration({
                          ...configuration,
                          actionType: value,
                        })
                      }
                    >
                      <SelectTrigger id="actionType">
                        <SelectValue placeholder="Select action" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Send Email</SelectItem>
                        <SelectItem value="telegram">Send Telegram</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {configuration.actionType === "email" && (
                    <div className="space-y-2">
                      <Label htmlFor="actionEmail">To Email</Label>
                      <Input
                        id="actionEmail"
                        type="email"
                        value={configuration.to || ""}
                        onChange={(e) =>
                          setConfiguration({
                            ...configuration,
                            to: e.target.value,
                          })
                        }
                        placeholder="recipient@example.com"
                      />
                    </div>
                  )}

                  {configuration.actionType === "telegram" && (
                    <div className="space-y-2">
                      <Label htmlFor="actionChatId">Chat ID</Label>
                      <Input
                        id="actionChatId"
                        type="text"
                        value={configuration.chatId || ""}
                        onChange={(e) =>
                          setConfiguration({
                            ...configuration,
                            chatId: e.target.value,
                          })
                        }
                        placeholder="Telegram chat ID"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );

      case "sendAndAwait":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="emailCredential">Email Connection</Label>
              {loadingCredentials ? (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading credentials...</span>
                </div>
              ) : (
                <>
                  <Select
                    value={configuration.emailCredentialId || ""}
                    onValueChange={(value) =>
                      setConfiguration({
                        ...configuration,
                        emailCredentialId: value,
                      })
                    }
                  >
                    <SelectTrigger id="emailCredential">
                      <SelectValue placeholder="Select email credentials" />
                    </SelectTrigger>
                    <SelectContent>
                      {emailCredentials.map((cred) => (
                        <SelectItem key={cred.id} value={cred.id}>
                          {cred.title || `Email Credential ${cred.id}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {emailCredentials.length === 0 && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        No email credentials found. Please create email
                        credentials first.
                      </AlertDescription>
                    </Alert>
                  )}
                </>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="toEmail">To Email</Label>
              <Input
                id="toEmail"
                type="email"
                value={configuration.to || ""}
                onChange={(e) =>
                  setConfiguration({ ...configuration, to: e.target.value })
                }
                placeholder="recipient@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                type="text"
                value={configuration.subject || ""}
                onChange={(e) =>
                  setConfiguration({
                    ...configuration,
                    subject: e.target.value,
                  })
                }
                placeholder="Email subject (optional - defaults to payment confirmation)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="body">Message Body</Label>
              <Textarea
                id="body"
                value={configuration.body || ""}
                onChange={(e) =>
                  setConfiguration({ ...configuration, body: e.target.value })
                }
                placeholder="Email message content (optional - defaults to payment confirmation request)"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeout">Timeout (seconds)</Label>
              <Input
                id="timeout"
                type="number"
                value={configuration.timeout || "120"}
                onChange={(e) =>
                  setConfiguration({
                    ...configuration,
                    timeout: parseInt(e.target.value) || 120,
                  })
                }
                placeholder="120"
                min={10}
                max={600}
              />
              <p className="text-xs text-muted-foreground">
                How long to wait for a reply (10-600 seconds)
              </p>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No configuration options available for this node type.
            </p>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Configure {nodeType === "sendAndAwait" ? "Send & Await" : nodeType}{" "}
            Node
          </DialogTitle>
          <DialogDescription>
            Configure the settings for this node
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-1">
                <p className="text-sm font-medium">Node Information</p>
                <p className="text-sm text-muted-foreground">
                  <strong>Type:</strong>{" "}
                  {nodeType === "sendAndAwait" ? "Send & Await" : nodeType}
                </p>
              </div>
            </CardContent>
          </Card>

          {renderConfigurationFields()}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Saving..." : "Save Configuration"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
