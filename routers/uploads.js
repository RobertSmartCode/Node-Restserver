const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarArchivoSubir, } = require('../middlewares');
const { cargarArchivo, actualizarImagen, actualizarImagenCloudinary,  mostrarImagen} = require('../controllers/uploads');
const {  coleccionesPermitidas} = require('../helper/index');


const router = Router();


router.post( '/',validarArchivoSubir, cargarArchivo );

router.put('/:coleccion/:id', [
   validarArchivoSubir,
    check('id','El id debe de ser de mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios','productos'] ) ),
    validarCampos
], actualizarImagenCloudinary )


router.get('/:coleccion/:id', [
    check('id','El id debe de ser de mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios','productos'] ) ),
    validarCampos
], mostrarImagen  )



module.exports = router;