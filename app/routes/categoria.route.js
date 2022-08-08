const express = require("express");
const router = express.Router();
//requerimos la clase monederoController
const categoriaController = require("../controllers/categoria.controller");

router.get('/', categoriaController.listarCategorias);
router.post('/', categoriaController.agregarCategoria);
router.delete('/:id', categoriaController.eliminarCategoria);



module.exports = router;