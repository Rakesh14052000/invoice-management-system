const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const { execSync } = require("child_process");
require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const app = express();

app.use(cors());
app.use(express.json());

DATABASE_URL="mysql://root:12345@localhost:3306/invoice_db"
JWT_SECRET=intern-secret-jwt

async function initializeDatabase() {
  try {
    const url = new URL(process.env.DATABASE_URL);

    const connection = await mysql.createConnection({
      host: url.hostname,
      user: url.username,
      password: url.password
    });

    // console.log("Connected to MySQL server");

    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${url.pathname.replace("/", "")}\``
    );

    await connection.end();

    // console.log("Database ensured");

    execSync("npx prisma generate", { stdio: "inherit" });

    execSync("npx prisma db push", { stdio: "inherit" });

    // console.log("Prisma synced");

    const prisma = new PrismaClient();

    const existingUser = await prisma.user.findUnique({
      where: { email: "admin@example.com" }
    });

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash("123456", 10);

      await prisma.user.create({
        data: {
          email: "admin@example.com",
          password: hashedPassword
        }
      });
    } else {
      // console.log("Default admin already exists");
    }

    const existingInvoices = await prisma.invoice.findMany({ take: 1 });
    if (existingInvoices.length === 0) {
      const invoicesData = [
        { invoiceNo: "INV-001", customerName: "Alice Johnson", amount: 250.5, invoiceDate: new Date("2026-01-01T10:00:00"), status: "Paid" },
        { invoiceNo: "INV-002", customerName: "Bob Smith", amount: 150.75, invoiceDate: new Date("2026-01-02T11:00:00"), status: "Unpaid" },
        { invoiceNo: "INV-003", customerName: "Charlie Brown", amount: 500, invoiceDate: new Date("2026-01-03T12:00:00"), status: "Paid" },
        { invoiceNo: "INV-004", customerName: "David Wilson", amount: 320.25, invoiceDate: new Date("2026-01-04T13:00:00"), status: "Unpaid" },
        { invoiceNo: "INV-005", customerName: "Eva Green", amount: 450, invoiceDate: new Date("2026-01-05T14:00:00"), status: "Paid" },
        { invoiceNo: "INV-006", customerName: "Frank Miller", amount: 600, invoiceDate: new Date("2026-01-06T15:00:00"), status: "Unpaid" },
        { invoiceNo: "INV-007", customerName: "Grace Lee", amount: 700.5, invoiceDate: new Date("2026-01-07T16:00:00"), status: "Paid" },
        { invoiceNo: "INV-008", customerName: "Henry Adams", amount: 200.75, invoiceDate: new Date("2026-01-08T17:00:00"), status: "Unpaid" },
        { invoiceNo: "INV-009", customerName: "Ivy White", amount: 900, invoiceDate: new Date("2026-01-09T18:00:00"), status: "Paid" },
        { invoiceNo: "INV-010", customerName: "Jack Black", amount: 100, invoiceDate: new Date("2026-01-10T19:00:00"), status: "Unpaid" },
      ];

      await prisma.invoice.createMany({ data: invoicesData });
      // console.log("10 initial invoices added successfully!");
    }

    await prisma.$disconnect();


  } catch (error) {
    console.error("Database initialization failed:", error);
    process.exit(1);
  }
}

async function startServer() {
  await initializeDatabase();

  const authRoutes = require("./routes/authRoutes");
  const invoiceRoutes = require("./routes/invoiceRoutes");

  app.use("/api/auth", authRoutes);
  app.use("/api/invoices", invoiceRoutes);

  app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
  });
}

startServer();
