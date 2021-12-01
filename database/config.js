const mongoose = require('mongoose');
mongoose.set('returnOriginal', false);

const dbConecction = async() =>{
    try {
        await mongoose.connect(process.env.MONGODB_CNN,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            //useCreateIndex :true,
            //useFindAndModify: false
        });
        console.log('Base de datos online');

    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de iniciar la base de datos')
    }

}




module.exports ={
    dbConecction
}