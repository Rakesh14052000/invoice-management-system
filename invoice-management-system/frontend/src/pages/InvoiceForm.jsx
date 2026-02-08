import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { FiArrowLeft, FiSave, FiEdit } from "react-icons/fi";

function InvoiceForm() {
  const [invoiceNo, setInvoiceNo] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [amount, setAmount] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [status, setStatus] = useState("");

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (id) fetchInvoice();
  }, [id]);

  const fetchInvoice = async () => {
    try {
      const res = await API.get("/invoices");
      const invoice = res.data.find((i) => i.id === parseInt(id));

      if (invoice) {
        setInvoiceNo(invoice.invoiceNo);
        setCustomerName(invoice.customerName);
        setAmount(invoice.amount);
        setInvoiceDate(invoice.invoiceDate.substring(0, 10));
        setStatus(invoice.status);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!invoiceNo || !customerName || !amount || !invoiceDate) {
      alert("All fields are required");
      return;
    }

    const data = {
      invoiceNo,
      customerName,
      amount,
      invoiceDate,
      status,
    };

    try {
      if (id) {
        await API.put(`/invoices/${id}`, data);
      } else {
        await API.post("/invoices", data);
      }

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = () => {
    setInvoiceNo("");
    setCustomerName("");
    setAmount("");
    setInvoiceDate("");
    setStatus("");
  };


  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 p-6 md:p-10">

        {/* Form Card */}
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Invoice No */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Invoice Number
              </label>
              <input
                type="text"
                value={invoiceNo}
                onChange={(e) => setInvoiceNo(e.target.value)}
                placeholder="INV-001"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Customer Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Name
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="John Doe"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Amount + Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="5000"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Invoice Date
                </label>
                <input
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm
                      focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="">-- Select --</option>
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Link
                to="/dashboard" onClick={handleCancel}
                className="px-6 py-2.5 rounded-lg text-sm font-medium
                    border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-blue-900 hover:bg-blue-800
                    text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition"
              >
                {id ? <FiEdit /> : <FiSave />}
                {id ? "Edit Invoice" : "Save Invoice"}
              </button>
            </div>
          </form>
        </div >

        {/* Header */}
        <div div className="flex items-center justify-center m-6" >
          <Link
            to="/dashboard" onClick={handleCancel}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
          >
            <FiArrowLeft />
            Back to Dashboard
          </Link>
        </div >
      </div >
    </>
  );
}

export default InvoiceForm;
