const express = require('express');
const cors = require('cors');
const {dbConecction} = require('../database/config');

class Server {
    
    
    constructor(){
         this.app = express();
         this.port = process.env.PORT;
        
         this.path = {
            auth:       '/api/auth',
            buscar:     '/api/buscar',
            categorias: '/api/categorias',
            productos:  '/api/productos',
            usuarios:   '/api/usuarios'

         }

         //Conectar a Base de Datos
         this.conectarDB();
         
         //Middlewares
         this. middlewares();

        //Rutas de mi aplicación
         this.router();

    }

    async conectarDB(){
        await dbConecction();

    }

    middlewares(){

        //CORS
        this.app.use(cors());

        //Lectura y Parseo  de body
        this.app.use(express.json());

        //Directorio Público
        this.app.use(express.static('public'));
    
    }
    router(){  
        this.app.use(this.path.auth, require('../routers/auth')); 
        this.app.use(this.path.buscar, require('../routers/buscar')); 
        this.app.use(this.path.categorias, require('../routers/categorias')); 
        this.app.use(this.path.productos, require('../routers/productos')); 
        this.app.use(this.path.usuarios, require('../routers/usuarios'));      
    }


    listen(){
        this.app.listen(this.port, ()=>{
            console.log('Servidor corriendo en el puerto', this.port);
        });
    }
}


module.exports = Server;