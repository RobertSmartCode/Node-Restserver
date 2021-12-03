const {response, json} = require('express');
const bcryptjs = require('bcryptjs');

const Usuario=require('../models/usuario');

const { generarJWT } = require('../helper/generar-jwt');
const { googleVerify } = require('../helper/google-verify');


const login = async(req, res = response) => {
    
    const {correo, password}= req.body;

    try {
        //verificar si el email existe
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

const googleSingIn = async(req, res = response) =>{
    const {id_token} = req.body;

    try {

        const {nombre, img, correo} = await googleVerify(id_token);
        
        let usuario = await Usuario.findOne({correo});

        if(!usuario){
            //Tengo que crearlo
            const data = {
                nombre,
                correo,
                rol: 'USER_ROLE',
                password : ':P',
                img,
                google: true

            };

            usuario = new Usuario(data);
            await usuario.save();
        }

        //Si el usuario en la DB
        if(!usuario.estado){
            return res.status(401).json({
                msg: 'Hable con el administrador, Usuario bloqueado'
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

        res.status(400).json({
            ok:false,
            msg: 'El token no se pudo verificar'
        })
        
    }
    
}
module.exports ={
    login,
    googleSingIn
}