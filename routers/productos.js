const {Router} = require('express');
const { check } = require('express-validator');

const { 
    validarJWT,
    validarCampos,
    esAdminRole,

    } = require('../middlewares');

const {
       existeProductoPorId,
       existeCategoriaPorId, 
       }= require('../helper/db-validators')
const { 
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    borrarProducto
         } = require('../controllers/productos');


const router = Router();

//** {{url}}/api/productos */

//Obtener todas la Productos - publico
router.get('/', obtenerProductos);

//Obtener una producto por id - publico
router.get('/:id', [
check('id', 'No es un ID válido').isMongoId(),
check('id').custom(existeProductoPorId),
validarCampos
], obtenerProducto);

    
//Crear producto - privado- Cualquier Persona con un token valido.
router.post('/',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un ID válido').isMongoId(),
    check('categoria').custom(existeCategoriaPorId ),
    validarCampos
],  crearProducto);

        
//Actualizar - privado - cualquiera con token valido
router.put('/:id',[
    validarJWT,
    //check('categoria', 'No es un ID válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos

], actualizarProducto);

    //Borrar una categoría - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeProductoPorId), 
    validarCampos 

],  borrarProducto);

module.exports =router;