const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const jwt = require("jsonwebtoken");

const {
  hashPassword,
  comparePassword,
} = require("../../utils/hash");

//////////////////////////////////////////////////////
//////////////////// REGISTER ////////////////////////
//////////////////////////////////////////////////////

const register = async (data) => {
  const {
    nom,
    email,
    password,
    role,
  } = data;

  // ✅ CHECK EMAIL
  const existingEmploye =
    await prisma.employe.findUnique({
      where: {
        email,
      },
    });

  if (existingEmploye) {
    throw new Error("Email already used");
  }

  // ✅ HASH PASSWORD
  const hashedPassword =
    await hashPassword(password);

  // ✅ CREATE USER
  const employe =
    await prisma.employe.create({
      data: {
        nom,
        email,
        password: hashedPassword,
        role,
      },
    });

  return employe;
};

//////////////////////////////////////////////////////
//////////////////// LOGIN ///////////////////////////
//////////////////////////////////////////////////////

const login = async (data) => {
  const { email, password } = data;

  // ✅ FIND USER
  const employe =
    await prisma.employe.findUnique({
      where: {
        email,
      },
    });

  if (!employe) {
    throw new Error("User not found");
  }

  // ✅ CHECK PASSWORD
  const validPassword =
    await comparePassword(
      password,
      employe.password
    );

  if (!validPassword) {
    throw new Error("Invalid password");
  }

  // ✅ JWT
  const token = jwt.sign(
    {
      id: employe.id,
      role: employe.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  return {
    token,
    user: {
      id: employe.id,
      nom: employe.nom,
      email: employe.email,
      role: employe.role,
    },
  };
};

module.exports = {
  register,
  login,
};