const Usuario = require("../models/usuario.model");
const mongoose = require("mongoose");
const controlador = {

    obtenerUsuario(req, res) {
        try {
            const busqueda = async () => {
                const response = await Usuario.findOne({ "email": req.params.id })
                if (response) return res.status(200).json(response);
                else return res.status(404).json({
                    message: "No se encontró el usuario"
                });
            }
            busqueda()
        } catch (error) {
            console.log(error);
        }
    },

    registrarUsuario(req, res) {
        try {
            const email = req.body.email;
            if (!email.includes("@")) return res.json({ error: "El email no tiene un formato de correo electronico" });
            const registrar = async () => {
                const response = await Usuario.find({ "email": req.body.email })
                if (response.length > 0) return res.json({ "mensaje": "El usuario ya existe" })
                const usuario = new Usuario(req.body);
                const response2 = await usuario.save();
                return res.json(response2);
            }

            registrar();
        } catch (error) {
            res.status(200).json({ "error": error });
        }
    },


    eliminarUsuario(req, res) {
        try {
            let val_id = req.params.id;
            if (!val_id) return res.status(400).json({ "mensaje": "Se requiere un id" });
            if (!mongoose.Types.ObjectId.isValid(val_id)) return res.status(400).json({ "mensaje": "El id no es valido" });

            const eliminar = async () => {
                //Buscamos el usuario y validamos si ya se elimino o aun no
                const response = await Usuario.findById(val_id);
                if (!response) return res.status(404).json({ "mensaje": "No se encontró el usuario" });
                if (!response.estado) return res.status(200).json({ "mensaje": "El usuario ya se elimino" });
                const a = await Usuario.findByIdAndUpdate(val_id, { $set: { "estado": false } })
                if (a) return res.status(200).json({ "mensaje": "El usuario se elimino correctamente" });
            }
            eliminar();
        } catch (error) {
            res.status(500).json(error);
        }
    }
};

module.exports = controlador;