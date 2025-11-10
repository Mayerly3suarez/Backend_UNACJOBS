// controllers/usercontroller.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { supabase } = require("../config/db.js");
const { UserModel } = require("../models/User.js");

// 🧾 Registrar usuario
const register = async (req, res) => {
  try {
    const { nombre, apellido, email, password, rol } = req.body;

    if (!nombre || !apellido || !email || !password || !rol) {
      return res.status(400).json({
        success: false,
        message: "Todos los campos son obligatorios",
      });
    }

    const { data: existingUser } = await supabase
      .from(UserModel.table)
      .select("*")
      .eq(UserModel.fields.email, email)
      .single();

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "El usuario ya está registrado",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data: newUser, error } = await supabase
      .from(UserModel.table)
      .insert([
        {
          nombre,
          apellido,
          email,
          password: hashedPassword,
          rol,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: "Usuario registrado exitosamente",
      data: {
        user: {
          id: newUser.id,
          nombre: newUser.nombre,
          apellido: newUser.apellido,
          email: newUser.email,
          rol: newUser.rol,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al registrar el usuario",
    });
  }
};

// 🔐 Inicio de sesión
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email y contraseña son obligatorios",
      });
    }

    const { data: user, error } = await supabase
      .from(UserModel.table)
      .select("*")
      .eq(UserModel.fields.email, email)
      .single();

    if (error || !user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Contraseña incorrecta",
      });
    }

    const token = jwt.sign(
      { identificacion: user.id, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      success: true,
      message: "Inicio de sesión exitoso",
      data: {
        token,
        user: {
          identificacion: user.id,
          nombre: user.nombre,
          apellido: user.apellido,
          email: user.email,
          rol: user.rol,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al iniciar sesión",
    });
  }
};

// 👤 Obtener datos del usuario autenticado
const me = async (req, res) => {
  try {
    const userId = req.user?.identificacion;

    const { data: user, error } = await supabase
      .from(UserModel.table)
      .select("*")
      .eq(UserModel.fields.id, userId)
      .single();

    if (error || !user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      message: "Datos del usuario obtenidos correctamente",
      data: {
        user: {
          identificacion: user.id,
          nombre: user.nombre,
          apellido: user.apellido,
          email: user.email,
          rol: user.rol,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener la información del usuario",
    });
  }
};

module.exports = { register, login, me };
