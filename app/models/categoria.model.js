let mongoose = require('mongoose');
let Schema = mongoose.Schema;
//Elementos de respuesta necesarias
let monederoSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    descripcion: { type: String, required: [true, 'La descripcion es necesaria'] },
    estado: { type: Boolean, default: true },
},

    {
        timestamps: true,
        versionKey: false
    });

module.exports = mongoose.model('Categoria', monederoSchema, 'Categoria');