// llamamos la expresion en el caso es mongo

let mongoose = require('mongoose');
let Schema = mongoose.Schema;


// funcionalidad de respuestas ocasionadas por algun error
let monederoSchema = new Schema({
    periodo: { type: String, required: [true, 'El periodo es necesario'] },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
    },
    descripcion: { type: String, required: [true, 'La descripcion es necesaria'] },
    monto: { type: Number, required: [true, 'El monto es necesario'] },
    estado: { type: Boolean, default: true },
},
    {
        timestamps: true,
        versionKey: false
    });

module.exports = mongoose.model('Ingreso', monederoSchema, 'Ingreso');