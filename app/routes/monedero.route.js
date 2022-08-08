const express = require("express");
const router = express.Router();
//requerimos la clase monederoController
const monederoController = require("../controllers/monedero.controller");

router.get('/:id', monederoController.listarGastoseIngresos);
router.get("/item/:id", monederoController.buscarPorId);
router.post('/', monederoController.guardar);
router.put('/item/:id', monederoController.editar);
router.delete('/item/:id', monederoController.eliminar);


module.exports = router;