import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";

import {
  FiEdit,
  FiTrash2,
  FiFileText,
  FiDollarSign,
  FiCheckCircle,
  FiXCircle,
  FiPlus,
} from "react-icons/fi";

function Dashboard() {
  const [invoices, setInvoices] = useState([]);
  const [allInvoices, setAllInvoices] = useState([]);

  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      navigate("/login");
    }
  }, [navigate]);

  const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);

  useEffect(() => {
    fetchInvoices();
  }, []);

  useEffect(() => {
    filterInvoices();
  }, [status, search, startDate, endDate, allInvoices]);

  const filterInvoices = () => {
    let temp = [...allInvoices];

    // Search Filter
    if (search) {
      const lowerSearch = search.toLowerCase();

      temp = temp.filter((inv) => {
        return (
          String(inv.invoiceNo).toLowerCase().includes(lowerSearch) ||
          String(inv.customerName).toLowerCase().includes(lowerSearch) ||
          String(inv.amount).toLowerCase().includes(lowerSearch) ||
          String(inv.status).toLowerCase().includes(lowerSearch) ||
          String(inv.invoiceDate).toLowerCase().includes(lowerSearch)
        );
      });
    }

    // Status Filter
    if (status) {
      temp = temp.filter((inv) => inv.status === status);
    }

    // Date Filter
    if (startDate) {
      temp = temp.filter(
        (inv) => new Date(inv.invoiceDate) >= new Date(startDate)
      );
    }

    if (endDate) {
      temp = temp.filter(
        (inv) => new Date(inv.invoiceDate) <= new Date(endDate)
      );
    }

    setInvoices(temp);
  };

  const fetchInvoices = async () => {
    try {
      const res = await API.get("/invoices");
      setAllInvoices(res.data);
      setInvoices(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteInvoice = async (id) => {
    await API.delete(`/invoices/${id}`);
    fetchInvoices();
  };

  const resetFilters = () => {
    setStatus("");
    setSearch("");
    setStartDate("");
    setEndDate("");
    setInvoices(allInvoices);
  };

  const paidCount = invoices.filter((i) => i.status === "Paid").length;
  const unpaidCount = invoices.filter((i) => i.status === "Unpaid").length;

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 p-6 md:p-10">
        <h1 className="text-2xl font-semibold mb-8">Dashboard</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Invoices */}
          <div className="bg-white rounded-xl shadow-sm p-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Invoices</p>
              <p className="text-2xl font-semibold tracking-tight text-gray-900">
                {invoices.length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
              <FiFileText size={22} />
            </div>
          </div>

          {/* Total Amount */}
          <div className="bg-white rounded-xl shadow-sm p-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Amount</p>
              <p className="text-2xl font-semibold tracking-tight text-gray-900">
                ₹ {totalAmount.toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-purple-100 text-purple-600">
              <FiDollarSign size={22} />
            </div>
          </div>

          {/* Paid */}
          <div className="bg-white rounded-xl shadow-sm p-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Paid</p>
              <p className="text-2xl font-semibold tracking-tight text-green-600">
                {paidCount}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-100 text-green-600">
              <FiCheckCircle size={22} />
            </div>
          </div>

          {/* Unpaid */}
          <div className="bg-white rounded-xl shadow-sm p-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Unpaid</p>
              <p className="text-2xl font-semibold tracking-tight text-red-500">
                {unpaidCount}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-red-100 text-red-500">
              <FiXCircle size={22} />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 space-y-5">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by invoice # or customer"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          />

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="">All Status</option>
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
              </select>

              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />

              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="flex gap-3 w-full lg:w-auto">
              <button
                onClick={resetFilters}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2.5 rounded-lg text-sm font-semibold transition"
              >
                Reset
              </button>

              <Link
                to="/invoices/new"
                className="inline-flex items-center justify-center gap-2 bg-blue-900 hover:bg-blue-800 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition"
              >
                <FiPlus className="text-base" />
                Create Invoice
              </Link>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white p-2 rounded-2xl shadow-md overflow-x-auto">
          <table className="w-full border-collapse min-w-[700px]">
            <thead className="bg-gray-100 text-sm text-gray-600 uppercase">
              <tr>
                <th className="px-6 py-4 text-left">Invoice #</th>
                <th className="px-6 py-4 text-left">Customer</th>
                <th className="px-6 py-4 text-left">Amount</th>
                <th className="px-6 py-4 text-left">Date</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 text-sm">
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                    No data found
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {inv.invoiceNo}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {inv.customerName}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-800">
                      ₹ {inv.amount}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {inv.invoiceDate.substring(0, 10)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${inv.status === "Paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                          }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <Link
                          to={`/invoices/edit/${inv.id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FiEdit size={18} />
                        </Link>
                        <button
                          onClick={() => deleteInvoice(inv.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
