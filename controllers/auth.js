const {response} = require('express');
const Usuario=require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helper/generar-jwt');

const login = async(req, res = response) => {
    const {correo, password}= req.body;

    try {
        //verificar si el email existeUsuarioPorId
        const usuario = await Usuario.findOne({correo});
        if(!usuario){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos -correo'
            });
        }

        // Si el usuario está activo en mi BD
        if(!usuario.estado){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos -estado:false'
            });
        }

        //Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if(!validPassword){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos -password'
            }); 
        }

        //Generar el JWT
        const token = await generarJWT (usuario.id);
        
    res.json({
        usuario,
        token
      });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg:'Hable con el administrador'
          });  
    }
}
module.exports ={
    login
}