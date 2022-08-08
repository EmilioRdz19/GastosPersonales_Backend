const Monedero = require("../models/monedero.model");
const Gasto = require("../models/gasto.model");
const Ingreso = require("../models/ingreso.model");
const mongoose = require("mongoose");
//Creamos una clase que devuelva una función que se ejecute cuando se llame al método get de la ruta /monedero
class MonederoController {
    constructor() {
        this.listarGastoseIngresos = this.listarGastoseIngresos.bind(this);
        this.buscarPorId = this.buscarPorId.bind(this);
        this.guardar = this.guardar.bind(this);
        this.editar = this.editar.bind(this);
        this.eliminar = this.eliminar.bind(this);
    }
    listarGastoseIngresos(req, res) {
        try {
            const val_id = req.params.id;
            if (!mongoose.Types.ObjectId.isValid(val_id)) return res.status(400).json({ "mensaje": "El id no es valido" });

            const listar = async () => {

                //Listamos todos los gastos e ingresos de un monedero
                const response = await Monedero.find({ '_id': val_id }, { gastos: 1, ingresos: 1 })//Ahora poblamos el array de gastos y ingresos
                    .populate({
                        path: 'gastos',
                        model: 'Gasto',
                        populate: {
                            path: 'categoria',
                            model: 'Categoria'
                        }
                    }).populate({
                        path: 'ingresos',
                        model: 'Ingreso',
                        populate: {
                            path: 'categoria',
                            model: 'Categoria'
                        }
                    });

                //Retornamos la lista de gastos y ingresos
                return res.status(200).json({ "msg": response })

            }

            listar();
        } catch (error) {
            res.status(500).json({ msg: "Error al listar gastos e ingresos" });
        }
    }

    buscarPorId(req, res) {
        try {
            const val_id = req.params.id;
            const { tipo } = req.body;
            if (!mongoose.Types.ObjectId.isValid(val_id)) return res.status(400).json({ "mensaje": "El id no es valido" });
            if (!tipo || (tipo != "gasto" && tipo != "ingreso")) return res.status(400).json({ "mensaje": "El tipo no es valido" });
            const buscar = async () => {
                if (tipo === "gasto") {
                    const response = await Gasto.findById(val_id);
                    if (!response) return res.status(400).json({ "msg": "No se encontró el gasto" });
                    return res.status(200).json({ "msg": response })
                } else if (tipo === "ingreso") {
                    const response = await Ingreso.findById(val_id);
                    if (!response) return res.status(400).json({ "msg": "No se encontró el ingreso" });
                    return res.status(200).json({ "msg": response })
                } else {
                    return res.status(400).json({ msg: "Tipo de gasto o ingreso no válido" });
                }
            }
            buscar();
        } catch (error) {
            res.status(500).json({ msg: "Error al buscar" });
        }
    }

    guardar(req, res) {
        try {
            const { monedero, periodo, categoria, tipo, descripcion, monto } = req.body;
            if (!monedero || !periodo || !categoria || !tipo || !descripcion || !monto) return res.status(400).json({ msg: "Faltan datos" });
            if (!mongoose.Types.ObjectId.isValid(categoria)) return res.status(400).json({ msg: "La categoria no es valida" });
            const guardar = async () => {
                const response = await Monedero.findOne({ '_id': monedero });
                if (!response) return await Monedero.create({ '_id': monedero });
                //ahora que el monedero existe, agregamos el gasto o ingreso

                if (tipo == "gasto") {
                    const gasto = await Gasto.create({
                        'periodo': periodo,
                        'categoria': categoria,
                        'descripcion': descripcion,
                        'monto': monto,
                        'estado': true
                    });
                    await Monedero.updateOne({ '_id': monedero }, { $push: { 'gastos': gasto } });
                    return res.status(200).json({ msg: "Se agregó el gasto" });
                } else if (tipo == "ingreso") {
                    const ingreso = await Ingreso.create({
                        'periodo': periodo,
                        'categoria': categoria,
                        'descripcion': descripcion,
                        'monto': monto,
                        'estado': true
                    });
                    await Monedero.updateOne({ '_id': monedero }, { $push: { 'ingresos': ingreso } });
                    return res.status(200).json({ "msg": "Se agregó el ingreso", "ingreso": ingreso });
                } else {
                    return res.status(400).json({ msg: "Tipo de gasto o ingreso no válido" });
                }
            }
            guardar();

        }
        catch (err) {
            res.status(500).json({ msg: "Error al guardar" });
        }
    }

    editar(req, res) {
        try {
            const { monedero, periodo, categoria, descripcion, monto } = req.body;
            const id = req.params.id;
            if (!monedero || !periodo || !categoria || !descripcion || !monto) return res.status(400).json({ msg: "Faltan datos" });

            const editar = async () => {
                //Buscamos que el monedero exista
                const response = await Monedero.findOne({ '_id': monedero });
                if (!response) return res.status(400).json({ msg: "No se encontró el monedero" });

                //Buscamos dentro del response el gasto o ingreso con filter
                const gasto = response.gastos.filter(g => g._id == id);
                const ingreso = response.ingresos.filter(i => i._id == id);
                if (gasto.length > 0) {
                    await Gasto.updateOne({ '_id': id }, { $set: { 'periodo': periodo, 'categoria': categoria, 'descripcion': descripcion, 'monto': monto } });
                    return res.status(200).json({ msg: "Se editó el gasto" });
                } else if (ingreso.length > 0) {
                    await Ingreso.updateOne({ '_id': id }, { $set: { 'periodo': periodo, 'categoria': categoria, 'descripcion': descripcion, 'monto': monto } });
                    return res.status(200).json({ msg: "Se editó el ingreso" });
                } else {
                    return res.status(400).json({ msg: "No se encontró el gasto o ingreso" });
                }

            }
            editar();
        } catch (error) {
            res.status(500).json({ msg: "Error al editar" });
        }
    }

    eliminar(req, res) {
        const val_id = req.params.id;
        const { tipo } = req.body;

        if (!mongoose.Types.ObjectId.isValid(val_id)) return res.status(400).json({ "mensaje": "El id no es valido" });
        if (!tipo || (tipo != "gasto" && tipo != "ingreso")) return res.status(400).json({ "mensaje": "El tipo no es valido" });
        const eliminar = async () => {
            if (tipo === "gasto") {
                const response = await Gasto.findById(val_id);
                if (!response) return res.status(400).json({ "msg": "No se encontró el gasto" });
                if (response.estado === false) return res.status(400).json({ "msg": "El gasto ya se encuentra eliminado" });
                await Gasto.updateOne({ '_id': val_id }, { $set: { 'estado': false } });
                return res.status(200).json({ "msg": "Se eliminó el gasto" });
            } else if (tipo === "ingreso") {
                const response = await Ingreso.findById(val_id);
                if (!response) return res.status(400).json({ "msg": "No se encontró el ingreso" });
                if (response.estado === false) return res.status(400).json({ "msg": "El ingreso ya se encuentra eliminado" });
                await Ingreso.updateOne({ '_id': val_id }, { $set: { 'estado': false } });
                return res.status(200).json({ "msg": "Se eliminó el ingreso" });
            } else {
                return res.status(400).json({ msg: "Tipo de gasto o ingreso no válido" });
            }
        }
        eliminar();

    }

}



module.exports = new MonederoController();