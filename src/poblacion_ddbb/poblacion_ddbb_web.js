const puppeteer = require('puppeteer');
const {Pool} = require('pg');

const config_database = require('../../config');
const pool = new Pool(config_database);


const getEstaciones = async () => {
    
    elementos = []
    const browser = await puppeteer.launch({headless:true});
    const page = await browser.newPage();

    await page.goto('https://climatologia.meteochile.gob.cl/application/informacion/buscadorDeEstaciones');

    for(fila =1; fila <= 47; fila++){
        for(columna = 1; columna<=8; columna++){
            selector = `.table-bordered > tbody:nth-child(1) > tr:nth-child(${fila}) > td:nth-child(${columna})`;
            await page.waitForSelector(selector);
            elemento = await page.$$eval(selector, e=>e.map((el)=>el.innerText))
            elementos.push(elemento[0]);
            
        } 
    }
    validos = [1,4,5,6];
    cont = 1;
    valores2 = []
    for(i= 10; i<=376; i++){
        if(validos.includes(cont)){
            valores2.push(elementos[i])
            
            if(cont == 6){
                if(valores2[1].includes("'")){
                    valores2[1] = valores2[1].replace("'", "");
                }
                await pool.query(`INSERT INTO estacion(nombre,latitud,longitud,altura_mar,codigo) 
                           VALUES ('${valores2[1]}', '${valores2[2]}', '${valores2[3]}','0','${valores2[0]}');`);
                valores2 = [];
            }
            
        }
        cont++;
        if(cont == 9){
            cont = 1
        }
        
    }
   
    
    await browser.close();
}

const getTempPreci = async () => {
    
    elementos = []
    const browser = await puppeteer.launch({headless:true});
    const page = await browser.newPage();

    await page.goto('https://climatologia.meteochile.gob.cl/application/diario/boletinClimatologicoDiario/actual');

    for(fila =3; fila <= 24; fila++){
        for(columna = 1; columna<=11; columna++){
            selector = `.table-bordered > tbody:nth-child(1) > tr:nth-child(${fila}) > td:nth-child(${columna})`;
            selector_fecha = '#cabezera > strong:nth-child(4)'
            await page.waitForSelector(selector);
            await page.waitForSelector(selector_fecha);
            fecha = await page.$$eval(selector_fecha, e=>e.map((el)=>el.innerText))
            elemento = await page.$$eval(selector, e=>e.map((el)=>el.innerText))
            elementos.push(elemento[0])
            
        } 
    }

    validos = [1,2,4,7];
    cont = 1;
    valores2 = []
    for(i= 0; i<=231; i++){
        if(validos.includes(cont)){
            valores2.push(elementos[i])
            
            if(cont == 7){
                if(valores2[0].includes("'")){
                    valores2[0] = valores2[0].replace("'", "");
                }
                
                
                id_estacion = await pool.query(`select id_estacion from estacion where estacion.nombre = '${valores2[0]}'`);
                if(id_estacion.rows[0] == undefined){
                    id_estacion = null;
                }else{
                    id_estacion = id_estacion.rows[0].id_estacion
                }

                await pool.query(`INSERT INTO precipitacion(fecha,precipitacion,id_estacion) 
                           VALUES ('${formatFecha(fecha[0])}', '${valores2[3]}', ${id_estacion});`);
                
                await pool.query(`INSERT INTO temperatura(fecha,temperatura_max,temperatura_min,id_estacion) 
                           VALUES ('${formatFecha(fecha[0])}', '${valores2[2]}', '${valores2[1]}', ${id_estacion});`);
                
                           valores2=[]
            }  
        }
        cont++;
        if(cont == 12){
            cont = 1
            
        }
        
    }
    await browser.close();
    //16 de Diciembre de 2021
    
}
const formatFecha = (fechaTexto)=>{
    const dictMes = {'Enero':1,'Febrero':2,'Marzo':3,'Abril':4,'Mayo':5, 'Junio':6,'Julio':7,'Agosto':8,'Septiembre':9,'Octubre': 10, 'Noviembre':11, 'Diciembre':12}
    fechita = fechaTexto.split(" ");
    fechaBuena = fechita[0]+'/'+dictMes[fechita[2]]+'/'+fechita[4];
    return(fechaBuena);
}
//getEstaciones();
//getTempPreci();