const express = require('express');
const cors = require('cors');
const {dbConecction} = require('../database/config');

class Server {
    
    
    constructor(){
         this.app = express();
         this.port = process.env.PORT;

         this.usuariosPath = '/api/usuarios';
         this.authPath = '/api/auth';

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
        this.app.use(this.authPath, require('../routers/auth')); 
        this.app.use(this.usuariosPath, require('../routers/usuarios'));      
    }


    listen(){
        this.app.listen(this.port, ()=>{
            console.log('Servidor corriendo en el puerto', this.port);
        });
    }
}


module.exports = Server;