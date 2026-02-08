const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createInvoice = async (req, res) => {
  const { invoiceNo, customerName, amount, invoiceDate, status } = req.body;
  console.log(req.body);
  

  const invoice = await prisma.invoice.create({
    data: {
      invoiceNo,
      customerName,
      amount: parseFloat(amount),
      invoiceDate: new Date(invoiceDate),
      status
    }
  });

  res.json(invoice);
};

exports.getInvoices = async (req, res) => {
  const { status, search } = req.query;

  let where = {};

  if (status) where.status = status;

  if (search) {
    where.OR = [
      { invoiceNo: { contains: search } },
      { customerName: { contains: search } }
    ];
  }

  const invoices = await prisma.invoice.findMany({ where });

  res.json(invoices);
};

exports.updateInvoice = async (req, res) => {
  const id = parseInt(req.params.id);  

  const invoice = await prisma.invoice.update({
    where: { id },
    data: {
    ...req.body,
    invoiceDate: new Date(req.body.invoiceDate),
  },
  });

  res.json(invoice);
};

exports.deleteInvoice = async (req, res) => {
  const id = parseInt(req.params.id);

  await prisma.invoice.delete({ where: { id } });

  res.json({ message: "Deleted successfully" });
};
