const {Router} = require('express');
const { check } = require('express-validator');

const { 
    validarJWT,
    validarCampos,
    esAdminRole,
    } = require('../middlewares');

const {
      existeCategoriaPorId,
       }= require('../helper/db-validators')
const { 
    obtenerCategorias,
    obtenerCategoria,
    crearCategoria,
    actualizarCategoria,
    borrarCategoria
         } = require('../controllers/categorias');


const router = Router();

//** {{url}}/api/categorias */

//Obtener todas la categorías - publico
router.get('/', obtenerCategorias);

//Obtener una categorías por id - publico
router.get('/:id', [
check('id', 'No es un ID válido').isMongoId(),
check('id').custom(existeCategoriaPorId ),
validarCampos
], obtenerCategoria);

    
//Crear categorías - privado- Cualquier Persona con un token valido.
router.post('/',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);

        
//Actualizar - privado - cualquiera con token valido
router.put('/:id',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un ID válido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos

], actualizarCategoria);

    //Borrar una categoría - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeCategoriaPorId), 
    validarCampos 

], borrarCategoria);



module.exports =router;