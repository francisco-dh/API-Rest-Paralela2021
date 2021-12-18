const config_database = require('../../config');
const {Pool} = require('pg');

const pool = new Pool(config_database);

const bcrypt = require('bcrypt');

/*
Facilita el registro de usuarios(cifra la contraseña con bcrypt)
*/
const getHash = async (req,res)=>{
    try{
        let usuario = req.headers['x-api-correo']
        let password = req.headers['x-api-password'];
        bcrypt.hash(password, 10,  async (err, hash) => {
            await pool.query(`INSERT INTO usuario(correo,password) VALUES ('${usuario}', '${hash}') `);
        });
        res.status(201).json('Usuario creado con exito');
    }catch(e){
        res.satus(400).json('No esta ingresando nombre o usuario correctamente');
    }
    
}

module.exports = getHash;