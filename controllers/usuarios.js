const {response, request} = require('express');
const bcryptjs = require('bcryptjs');


const Usuario = require('../models/usuario');

const usuariosGet = async (req = request, res = response) => {

   // const {q, nombre = 'No name', apikey, page=1, limit} = req.query;
   const {limite=5, desde=0}=req.query;
   const query = {estado:true};
   
   const [total, usuarios] = await Promise.all([
    Usuario.countDocuments(query),
    Usuario.find(query)
   .skip(Number(desde))
   .limit(Number(limite))
   ])
 
    res.json({
      total, 
      usuarios
    });
  }

  const usuariosPost =  async (req, res = response)=> {

   
    const {nombre, correo, password, rol} = req.body;
    const usuario = new Usuario({nombre, correo, password, rol});
   
    //Encryptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    //Guardar en base de datos

    await usuario.save();
    res.json({
        usuario
    });
  }

  const usuariosPut =  async (req, res = response)=> {
        const {id} = req.params;
        const {_id,password,google,correo, ...resto} = req.body;

        //TODO validar contra base de datos
        if(password){
          const salt = bcryptjs.genSaltSync();
          resto.password = bcryptjs.hashSync(password, salt); 
        }

        const usuario = await Usuario.findByIdAndUpdate(id, resto, {new: true});
        
    res.json(usuario);
  }



  const usuariosPatch =  (req, res = response)  => {
    res.json({
        msg : 'patch API - Controlador'
    });
  }


  const usuariosDelete =  async (req, res = response)=> {

    const {id}= req.params;

    //Borrar físicamente
   // const usuario = await Usuario.findByIdAndDelete(id);

    const usuario = await Usuario.findByIdAndUpdate(id, {estado:false});
    //const usuarioAutenticado = req.usuario
    res.json(usuario);
  }


  module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
  }