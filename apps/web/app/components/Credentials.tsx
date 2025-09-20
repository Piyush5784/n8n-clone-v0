import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "./Buttons";
import CreateCredentialsForm from "./CreateCredentialsForm";
import { BACKEND_URL, TOKEN } from "../config";
import { getCredentails } from "../helpers/function";

const Credentials = () => {
  const [openPopup, setOpenPopup] = useState(false);
  const [credentials, setCredentials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCredentails()
      .then((res) => setCredentials((res as any).credentials))
      .catch(() => setCredentials([]));
    setLoading(false);
  }, []);

  return (
    <div>
      <div className="border-t border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium text-gray-900">Credentials</h3>
          <Button
            variant="green"
            onClick={() => setOpenPopup(true)}
            className="text-xs px-3 py-1"
          >
            Add New
          </Button>
        </div>

        {loading ? (
          <div className="text-sm text-gray-500 bg-gray-50 rounded-md p-3 text-center">
            Loading...
          </div>
        ) : credentials.length === 0 ? (
          <div className="text-sm text-gray-500 bg-gray-50 rounded-md p-3 text-center">
            No credentials configured
          </div>
        ) : (
          <ul className="text-sm text-black flex flex-col gap-3 rounded-md p-3">
            {credentials.map((cred, id) => (
              <div key={id}>
                <li className="bg-white border border-gray-200 p-4 rounded-lg flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                  <div>
                    <div className="font-semibold text-gray-800">
                      {cred.type}
                    </div>
                    <div className="text-xs text-gray-500">ID: {cred.id}</div>
                  </div>
                </li>
              </div>
            ))}
          </ul>
        )}
      </div>
      <CreateCredentialsForm
        isOpen={openPopup}
        onClose={() => setOpenPopup(false)}
      />
    </div>
  );
};

export default Credentials;
