const express = require('express');
const router = express.Router();

const {auth} =require('../controllers/autenticacion.controller');

const {getEstaciones,getEstacionByNombre,getEstacionesBydate} = require('../controllers/estacion.controller')

const createUser = require('../controllers/registro.controller');


// ruta devuelve lista de todas las etsaciones
router.get('/apiclima/estaciones',auth,getEstaciones);

//ruta devuelve estacion
router.get('/apiclima/:nombreEstacion/estaciones',auth,getEstacionByNombre);

//
router.post('/apiclima/busqueda',getEstacionesBydate);

//Ruta para facilitar el registro de usuarios en la base de datos
router.get('/apiclima/registro',createUser);



module.exports = {router};
