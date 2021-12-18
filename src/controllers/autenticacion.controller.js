const bcrypt = require('bcrypt');
const {Pool} = require('pg');

const config_database = require('../../config');
const pool = new Pool(config_database);

/*
Permite la autenticacion mediante la utilizacion de un callback
*/
const auth = async (req,res,next)=>{
    try{
        let correo = req.headers['x-api-correo'];
        let password = req.headers['x-api-password'];
    
        const findPassword = `SELECT password FROM usuario WHERE usuario.correo = '${correo}'`;
        const info = await pool.query(findPassword);
        //await compare(password,info.rows[0].password);
        bcrypt.compare(password, info.rows[0].password, function(err, result) {
            
            if(result){
                next();
            }else{
                res.status(401).json('No está autorizado a consumir este servicio.');
            }
        });      
    }catch(e){
        res.status(403).json('Las credenciales proporcionadas no permiten consumir este servicio.');
    }  
}

const compare = async (password,password_db)=>{
    bcrypt.compare(password, password_db, function(err, result) {
        if(result){
            console.log('las contraseñas son iguales')
        }else{
            console.log('las contraseñas no son iguales')
        }
    });      
}

module.exports = {
    auth
}