let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let monederoSchema = new Schema({
    gastos: [{
        type: Schema.Types.ObjectId, ref: 'Gasto'
    }],
    ingresos: [{
        type: Schema.Types.ObjectId, ref: 'Ingreso'
    }],
    estado: { type: Boolean, default: true },
},
    {
        timestamps: true,
        versionKey: false
    });

module.exports = mongoose.model('Monedero', monederoSchema, 'Monedero');