const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();


const prisma = new PrismaClient();

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });

  res.json({ token });
};
