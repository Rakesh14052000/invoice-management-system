const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  createInvoice,
  getInvoices,
  updateInvoice,
  deleteInvoice
} = require("../controllers/invoiceController");

router.use(auth);

router.post("/", createInvoice);
router.get("/", getInvoices);
router.put("/:id", updateInvoice);
router.delete("/:id", deleteInvoice);

module.exports = router;
