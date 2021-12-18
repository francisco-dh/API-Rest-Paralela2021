const express = require('express');
const app = express();
const {router} = require('./routes/index');
const cors = require('cors');

//permite el uso de la api en otras aplicaciones
//app.use(cors());

//permite interpretar la informacion que viene desde los formularios
app.use(express.urlencoded({extended:false}));

//permite interpretar json como objetos de javascript
app.use(express.json());

//obtiene las rutas desde el archivo ./routes/index.js
app.use(router);

//manejador de errores base de express
//manejo de error 404 not found
app.use((req, res, next) => {
    res.status(404).json({
    status: 404,
    error: 'Not Found'
    });
});

//manejo de error 500 internal error
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).json({
        status: 500,
        error: 'Error interno del servidor.'
    });
});

//settings
app.set('PORT', process.env.PORT|| 3000);

//se levanta el servidor en el puerto previamente configuradp
app.listen(app.get('PORT'), ()=>{
    console.log(`Server is on host http://localhost:${app.get('PORT')}`);
});

