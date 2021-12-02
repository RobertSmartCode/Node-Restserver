const {Router} = require('express');
const { check } = require('express-validator');

const {
      validarCampos,
      validarJWT,
      esAdminRole,
      tieneRole
} =  require('../middlewares')

const {esRolValido, emailExiste,existeUsuarioPorId}= require('../helper/db-validators')

const {
      usuariosGet,
      usuariosPost,
      usuariosPut,
      usuariosPatch,
      usuariosDelete        
      } = require('../controllers/usuarios');


      
const router = Router();

router.get('/', usuariosGet );

router.post('/',
[
      check('nombre', 'El nombre es obligatorio').not().isEmpty(),
      check('password', 'El password debe ser más de 6 letras').isLength({min:6}),
      check('correo', 'El correo no es Valido').isEmail(),
      check('correo').custom(emailExiste),
      //check('rol', 'No es un rol valido').isIn(['ADMIN_ROLE','USER_ROLE']),
      check('rol').custom(esRolValido),
      validarCampos

],
usuariosPost);

router.put('/:id',[
check('id', 'No es un ID válido').isMongoId(),
check('id').custom(existeUsuarioPorId),
check('rol').custom(esRolValido),
validarCampos

], usuariosPut );

router.patch('/',usuariosPatch);

router.delete('/:id',[
      validarJWT,
      //esAdminRole,
      tieneRole('ADMIN_ROLE', 'VENTAR_ROLE','OTRO_ROLE'),
      check('id', 'No es un ID válido').isMongoId(),
      check('id').custom(existeUsuarioPorId), 
      validarCampos   
],usuariosDelete);

module.exports =router;