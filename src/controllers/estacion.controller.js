const {Pool} = require('pg');

const config_database = require('../../config');
const pool = new Pool(config_database);

const getEstaciones = async (req,res) =>{
    try{
        const estaciones = await pool.query('select * from estacion');

        if(estaciones.rows.length == 0){
            res.status(400).json({
                status: 400,
                error: 'La petición es inválida.'
            });
        }else{
            res.status(200).json(estaciones.rows);
        }
    }catch(err){
        res.status(500).json({
            status: 500,
            error: 'Error interno del servidor.'
        });
       
    }  
}
const getEstacionByNombre = async (req,res) =>{
    try{
        const {nombreEstacion} = req.params
        //console.log(nombreEstacion);
        const estaciones = await pool.query(`select * from estacion where estacion.nombre = '${nombreEstacion}'`);

        if(estaciones.rows.length == 0){
            res.status(400).json({
                status: 400,
                error: 'La petición es inválida.'
            });
        }else{
            res.status(200).json(estaciones.rows[0]);
        }
    }catch(err){
        /*
        res.status(500).json({
            status: 500,
            error: 'Error interno del servidor.'
        });
       */
      console.log(err);
    }  
}

const getEstacionesBydate = async (req,res) =>{
    try{
        const {indicador, fecha_desde, fecha_hasta} = await req.body;
        //fecha_inicio = fecha_desde.split('/');
        //fecha_fin = fecha_hasta.split('/')
        const estaciones = await pool.query(`select * from ${indicador} where ${indicador}.fecha BETWEEN SYMMETRIC '${fecha_desde}' AND '${fecha_hasta}' `);
        console.log(estaciones.rows)
        if(estaciones.rows.length == 0){
            res.status(400).json({
                status: 400,
                error: 'La petición es inválida.'
            });
        }else{
            res.status(200).json(estaciones.rows);
        }
        
    }catch(err){
        console.log(err);
        res.status(500).json({
            status: 500,
            error: 'Error interno del servidor.'
        });
    }  
}

module.exports = {getEstaciones,getEstacionByNombre,getEstacionesBydate};