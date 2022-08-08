let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: { type: String},
    email: {
        type: String,
        required: ["Se requiere un email", true],
        unique: true,
    },
    monedero: {
        type: Schema.Types.ObjectId,
        ref: 'Monedero',
        default: mongoose.Types.ObjectId()
    },
    estado: { type: Boolean, default: true },
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('Usuario', usuarioSchema, 'Usuario');