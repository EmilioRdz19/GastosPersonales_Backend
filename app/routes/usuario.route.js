const express = require("express");
const router = express.Router();
const controlador = require('../controllers/usuario.controller');

router.get('/:id', controlador.obtenerUsuario);

router.post('/', controlador.registrarUsuario);

router.delete('/:id', controlador.eliminarUsuario);

module.exports = router;