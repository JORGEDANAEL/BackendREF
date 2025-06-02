const User = require('../models/User');
const bcrypt = require('bcryptjs');

const authController = {
    async register(req, res) {
        try {
            const { username, password } = req.body;
            
            // Verificar si el usuario ya existe
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return res.status(400).json({ message: "El usuario ya existe" });
            }

            // Encriptar la contraseña
            const hashedPassword = await bcrypt.hash(password, 10);

            // Crear nuevo usuario
            const user = new User({
                username,
                password: hashedPassword
            });

            await user.save();
            res.status(201).json({ message: "Usuario creado exitosamente" });
        } catch (error) {
            console.error("Error en registro:", error);
            res.status(500).json({ message: "Error al crear el usuario" });
        }
    },

    async login(req, res) {
        try {
            const { username, password } = req.body;

            // Buscar usuario en la base de datos
            const user = await User.findOne({ username });
            if (!user) {
                return res.status(401).json({ message: "Credenciales inválidas" });
            }

            // Verificar contraseña
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(401).json({ message: "Credenciales inválidas" });
            }

            res.status(200).json({ 
                message: "Login exitoso",
                user: {
                    username: user.username,
                    id: user._id
                }
            });
        } catch (error) {
            console.error("Error en login:", error);
            res.status(500).json({ message: "Error en el servidor" });
        }
    },

    async getUsers(req, res) {
        try {
            const { page = 1, limit = 10, search = '' } = req.query;
            const skip = (page - 1) * limit;

            // Construir el query de búsqueda
            const query = search ? {
                username: { $regex: search, $options: 'i' }
            } : {};

            // Obtener usuarios con paginación y búsqueda
            const users = await User.find(query, { password: 0, __v: 0 })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit));

            // Obtener el total de usuarios para la paginación
            const total = await User.countDocuments(query);

            res.status(200).json({
                users,
                total,
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit)
            });
        } catch (error) {
            console.error("Error al obtener usuarios:", error);
            res.status(500).json({ message: "Error al obtener los usuarios" });
        }
    },

    async updateUser(req, res) {
        try {
            const { id } = req.params;
            const { username, password } = req.body;

            const updateData = {};
            if (username) updateData.username = username;
            if (password) {
                const hashedPassword = await bcrypt.hash(password, 10);
                updateData.password = hashedPassword;
            }

            const updatedUser = await User.findByIdAndUpdate(
                id,
                updateData,
                { new: true, select: '-password -__v' }
            );

            if (!updatedUser) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }

            res.status(200).json(updatedUser);
        } catch (error) {
            console.error("Error al actualizar usuario:", error);
            res.status(500).json({ message: "Error al actualizar el usuario" });
        }
    },

    async deleteUser(req, res) {
        try {
            const { id } = req.params;
            console.log('Intentando eliminar usuario con ID:', id);

            const deletedUser = await User.findByIdAndDelete(id);
            console.log('Resultado de la eliminación:', deletedUser);

            if (!deletedUser) {
                console.log('Usuario no encontrado');
                return res.status(404).json({ message: "Usuario no encontrado" });
            }

            console.log('Usuario eliminado exitosamente');
            res.status(200).json({ 
                message: "Usuario eliminado exitosamente",
                deletedUser: {
                    id: deletedUser._id,
                    username: deletedUser.username
                }
            });
        } catch (error) {
            console.error("Error al eliminar usuario:", error);
            res.status(500).json({ 
                message: "Error al eliminar el usuario",
                error: error.message 
            });
        }
    }
};

module.exports = authController; 