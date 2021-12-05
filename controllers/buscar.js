const { response } = require("express");
const { ObjectId } = require("mongoose").Types;
const { Usuario, Categoria, Producto } = require("../models");

const coleccionesPermitidas = [
     'usuarios',
    'categorias',
    'productos',
    'roles'
]

const buscarUsuarios = async(termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino);
    if(esMongoID){
        const usuario = await Usuario.findById(termino);
        return res.json({
               reults: (usuario) ? [usuario] : []
            });
    }

    const regex = new RegExp(termino, 'i');
    const usuarios = await Usuario.find({
        $or: [{nombre:regex}, {correo:regex}],
        $and : [{estado:true}]
    });

    return res.json({
        reults: usuarios
     });
}

const buscarCategorias = async(termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino);
    if(esMongoID){
        const categoria = await Categoria.findById(termino);
        return res.json({
               reults: (categoria) ? [categoria] : []
            });
    }

    const regex = new RegExp(termino, 'i');
    const categorias = await Categoria.find({nombre:regex, estado:true});

    return res.json({
        reults: categorias
     });
}
const buscarProductos = async(termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino);
    if(esMongoID){
        const producto = await Producto.findById(termino)
                                       .populate('categoria','nombre');
        return res.json({
               reults: (producto) ? [producto] : []
            });
    }

    const regex = new RegExp(termino, 'i');
    const productos = await Producto.find({nombre:regex, estado:true})
                                    .populate('categoria','nombre');
    return res.json({
        reults: productos
     });
}


const buscar = (req, res = response )=>{

    const {coleccion, termino} =req.params;

    if(!coleccionesPermitidas.includes(coleccion)){
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas} `
        })
    }

 switch (coleccion) {
     case 'usuarios':
        buscarUsuarios(termino,res)
         break;
     case 'categorias': 
        buscarCategorias(termino,res) 
        break;  
        
    case 'productos':
        buscarProductos(termino,res) 
        break;
 
     default:
         res.status(500).json({
            msg: 'Se me olvidó hacer esta busqueda'
        });
 }
//  res.json({
//     coleccion,
//     termino
//})
}


module.exports = {
    buscar,
    buscarUsuarios,
    buscarCategorias,
    buscarProductos
}