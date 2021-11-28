const express = require('express')
var cors = require('cors')

class Server {
    
    
    constructor(){
         this.app = express();
         this.port = process.env.PORT;
         this.usuariosPath = '/api/usuarios'
         
         //Middlewares
         this. middlewares();

        //Rutas de mi aplicación
         this.router();

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
        this.app.use(this.usuariosPath, require('../routers/usuarios'));       
    }


    listen(){
        this.app.listen(this.port, ()=>{
            console.log('Servidor corriendo en el puerto', this.port);
        });
    }
}


module.exports = Server;