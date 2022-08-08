const Categoria = require("../models/categoria.model");
const mongoose = require("mongoose");
//Creamos una clase que devuelva una función que se ejecute cuando se llame al método get de la ruta /monedero
class CategoriaController {
    constructor() {
        this.listarCategorias = this.listarCategorias.bind(this);
        this.agregarCategoria = this.agregarCategoria.bind(this);
        this.eliminarCategoria = this.eliminarCategoria.bind(this);
    }
    listarCategorias(req, res) {
        try {

            const listar = async () => {
                const categorias = await Categoria.find({ estado: true });
                if (!categorias) return res.status(400).json({ "mensaje": "No hay categorias" });
                return res.status(200).json(categorias);
            }

            listar();
        } catch (error) {
            res.status(500).json({ msg: "Error al listar categorias" });
        }
    }

//funcion de agregar la categoria de gasto
    agregarCategoria(req, res) {
        try {
            const { nombre, descripcion } = req.body;
            if (!nombre || !descripcion) return res.status(400).json({ msg: "Faltan datos" });

            const guardar = async () => {
                const categoria = new Categoria({
                    nombre,
                    descripcion
                });
                await categoria.save();
                return res.status(200).json({ msg: "Se guardó la categoria" });
            }
            guardar();

        }
        catch (err) {
            res.status(500).json({ msg: "Error al guardar" });
        }
    }
//funcion de eliminacion de categoria 
    eliminarCategoria(req, res) {
        const val_id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(val_id)) return res.status(400).json({ "mensaje": "El id no es valido" });
        const eliminar = async () => {
            //validamos si la categoria no se encuentra eliminada
            const categoria = await Categoria.findById(val_id);
            if (!categoria) return res.status(400).json({ "mensaje": "La categoria no existe" });
            if (categoria.estado == false) return res.status(400).json({ "mensaje": "La categoria ya se encuentra eliminada" });
            await Categoria.findByIdAndUpdate(val_id, { estado: false });
            return res.status(200).json({ "mensaje": "Se elimino la categoria" });

        }
        eliminar();

    }

}



module.exports = new CategoriaController();