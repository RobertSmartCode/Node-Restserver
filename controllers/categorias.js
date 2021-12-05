const { response, request } = require("express");
const bcryptjs = require('bcryptjs');
const {Categoria } = require("../models");


//obtenerCategorias - paginado -total -populate
const obtenerCategorias = async (req = request , res = response) => {

   // const {q, nombre = 'No name', apikey, page=1, limit} = req.query;
   const {limite=5, desde=0}=req.query;
   const query = {estado:true};
   
   const [total, categorias] = await Promise.all([
    Categoria.countDocuments(query),
    Categoria.find(query)
   .populate('usuario', 'nombre')
   .skip(Number(desde))
   .limit(Number(limite))
   ])
 
    res.json({
      total, 
      categorias
    });
  }

  //obtenerCategoria - populate {}
const obtenerCategoria = async (req = request , res = response) => {
    const {id}= req.params;
    const categoria = await Categoria.findById(id)
                                      .populate('usuario', 'nombre');
    //const usuarioAutenticado = req.usuario
    res.json(categoria);
}


const crearCategoria = async (req, res = response)=>{

    const nombre= req.body.nombre.toUpperCase();

    const categoriaDB= await Categoria.findOne({nombre});

    if(categoriaDB){
        return res.status(400).json({
            msg : `La categortía ${categoriaDB.nombre} ya existe`
        })
    }
    //Generar la data a guardar
    const data ={
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data);
    //Guardar en BD
    await categoria.save();

    res.status(201).json(categoria);


}

//actuallizarCategoria

const actualizarCategoria =  async (req, res = response)=> {
    const {id} = req.params;
    const {estado, usuario, ...data} = req.body;
    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate(id, data, {new: true});
    
res.json(categoria);
}

//borrarCategoria -estado-false

const borrarCategoria =  async (req, res = response)=> {

    const {id}= req.params;

    //Borrar físicamente
   // const categoria = await Categoria.findByIdAndDelete(id);

    const categoria = await Categoria.findByIdAndUpdate(id, {estado:false}, {new: true});
    //const usuarioAutenticado = req.usuario
    res.json(categoria);
  }


module.exports = {
    obtenerCategorias,
    obtenerCategoria,
    crearCategoria,
    actualizarCategoria,
    borrarCategoria
}