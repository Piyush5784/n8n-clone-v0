"use client";
import React, { useEffect, useState } from "react";
import {
  Eye,
  EyeOff,
  Edit3,
  Plus,
  Key,
  Shield,
  Settings,
  Save,
  X,
} from "lucide-react";
import { getCredentails } from "../../../../helpers/function";
import CreateCredentialsForm from "../../../../components/CreateCredentialsForm";
import { Button } from "@/components/Buttons";
import { useAuth } from "@/hooks/useAuth";

const getCredentialPassword = async (id: number) => {
  // Simulated password fetch
  return {
    password: `secret_password_${id}_${Math.random().toString(36).slice(2)}`,
  };
};

const updateCredential = async (id: number, data: any) => {
  // Simulated update
  console.log("Updating credential:", id, data);
  return { success: true };
};

const Credentials = () => {
  const [loading, setLoading] = useState(true);
  const [credentials, setCredentials] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCredential, setSelectedCredential] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const { token } = useAuth();
  const [editForm, setEditForm] = useState({
    type: "",
    name: "",
    password: "",
  });

  useEffect(() => {
    fetchCredentials();
  }, []);

  const fetchCredentials = async () => {
    try {
      if (!token) return;
      setLoading(true);
      const res = (await getCredentails(token)) as any;
      setCredentials(res.credentials);
    } catch (error) {
      console.error("Failed to fetch credentials:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCredentialClick = (credential: any) => {
    setSelectedCredential(credential);
    setIsModalOpen(true);
    setShowPassword(false);
    setPassword("");
    setIsEditing(false);
    setEditForm({
      type: credential.type,
      name: credential.name,
      password: "",
    });
  };

  const handleShowPassword = async () => {
    if (!showPassword) {
      try {
        setLoadingPassword(true);
        const res = await getCredentialPassword(selectedCredential.id);
        setPassword(res.password);
        setShowPassword(true);
      } catch (error) {
        console.error("Failed to fetch password:", error);
      } finally {
        setLoadingPassword(false);
      }
    } else {
      setShowPassword(false);
      setPassword("");
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await updateCredential(selectedCredential.id, editForm);
      // Update local state
      setCredentials((prev) =>
        prev.map((cred) =>
          cred.id === selectedCredential.id
            ? { ...cred, type: editForm.type, name: editForm.name }
            : cred
        )
      );
      setIsModalOpen(false);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update credential:", error);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCredential(null);
    setShowPassword(false);
    setPassword("");
    setIsEditing(false);
  };

  if (loading && credentials.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-500 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading credentials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <div className="max-w-4xl pt-4">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-gray-500" />
            <h1 className="text-3xl font-bold text-gray-900">
              Credentials Manager
            </h1>
          </div>
          <p className="text-gray-600">
            Manage your API keys, passwords, and authentication credentials
          </p>
        </div>

        <div className="mb-6">
          <Button onClick={() => setOpenPopup(true)}>
            <Plus className="h-4 w-4" />
            Add New Credential
          </Button>
        </div>
        <CreateCredentialsForm
          isOpen={openPopup}
          onClose={() => setOpenPopup(false)}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {credentials.map((credential) => (
            <div
              key={credential.id}
              onClick={() => handleCredentialClick(credential)}
              className="bg-white border border-gray-200 rounded-xl p-6 cursor-pointer hover:border-gray-500 hover:shadow-xl hover:shadow-gray-500/10 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                  <Key className="h-6 w-6 text-gray-900" />
                </div>
                <Settings className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {credential.title}
              </h3>
              <p className="text-gray-600 text-sm mb-3">{credential.type}</p>
              {/* <div className="text-xs text-gray-500">
                Last updated: {credential}
              </div> */}
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedCredential && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-gray-200 rounded-xl max-w-md w-full p-6 relative">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-6">
              <Key className="h-6 w-6 text-gray-500" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {isEditing ? "Edit Credential" : selectedCredential.name}
                </h2>
                <p className="text-gray-600 text-sm">
                  {selectedCredential.type}
                </p>
              </div>
            </div>

            {/* Modal Content */}
            <div className="space-y-4">
              {isEditing ? (
                // Edit Form
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type ID
                    </label>
                    <input
                      type="text"
                      value={editForm.type}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          type: e.target.value,
                        }))
                      }
                      className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                      placeholder="Enter credential type"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                      placeholder="Enter credential name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password (optional)
                    </label>
                    <input
                      type="password"
                      value={editForm.password}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                      placeholder="Leave blank to keep current password"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleUpdate}
                      disabled={loading}
                      className="flex-1 flex cursor-pointer items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <Save className="h-4 w-4" />
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                // View Mode
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type ID
                    </label>
                    <div className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-gray-900">
                      {selectedCredential.type}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={showPassword ? password : "••••••••••••"}
                        readOnly
                        className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 pr-10 text-gray-900"
                      />
                      <button
                        onClick={handleShowPassword}
                        disabled={loadingPassword}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {loadingPassword ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
                        ) : showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex-1 flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <Edit3 className="h-4 w-4" />
                      Edit Credential
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Credentials;
