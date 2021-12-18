const XLSX = require('xlsx');
const fs = require('fs');
const pd = require("node-pandas")
const {Pool} = require('pg');

const config_database = require('../../config');
const pool = new Pool(config_database);


const scrappingExcelPrecipitacion = async (ruta_excel)=>{
    //console.log(ruta_excel);
    const workbook = XLSX.readFile(ruta_excel);
    const sheet_name_list = workbook.SheetNames;
    const worksheet = workbook.Sheets[sheet_name_list[0]];
    
    elementos_fila = [];
    buenos = [];
    for(elemento in worksheet){
        elementos_fila.push(worksheet[elemento].v);
    }
    
    cont_elem = 1;
    
    for(el in elementos_fila){
        if(cont_elem == 9){
            id_estacion = await pool.query(`select id_estacion from estacion where estacion.codigo = '${buenos[0]}'`);
            
            if(id_estacion.rows[0] == undefined){
                id_estacion = null;
            }else{
                id_estacion = id_estacion.rows[0].id_estacion
            }

            fecha = buenos[6] + '/' + buenos[5] + '/' + buenos[4];
            
            await pool.query(`INSERT INTO precipitacion(fecha,precipitacion,id_estacion) 
                                VALUES ('${fecha}', '${buenos[7]}', ${id_estacion});`);
            
            buenos = [];
            cont_elem = 1;
        }
        
        buenos.push(elementos_fila[el]);
        
        cont_elem++;
      }
}

const scrappingExcelTemperatura = async (ruta_excel)=>{
    //console.log(ruta_excel);
    const workbook = XLSX.readFile(ruta_excel);
    const sheet_name_list = workbook.SheetNames;
    const worksheet = workbook.Sheets[sheet_name_list[0]];
    
    elementos_fila = [];
    buenos = [];
    for(elemento in worksheet){
        if(!worksheet[elemento].v){
            elementos_fila.push(undefined)
            //console.log(worksheet[elemento].v)
        }else{
            elementos_fila.push(worksheet[elemento].v);
        }
        
        
    }
    //console.log(elementos_fila.length)
    
    cont_elem = 1;
    
    for(el in elementos_fila){
        
        if(cont_elem == 10){
           //console.log(buenos)
           //console.log(buenos[0])
           id_estacion = await pool.query(`select id_estacion from estacion where estacion.codigo = '${buenos[0]}'`);
            
            
            if(buenos[1].includes("'")){
                //console.log('holi')
               // console.log(buenos[0])
              // console.log(buenos[1]) 
               buenos[1] = 'nada'
                //console.log(buenos[1])
                
            }
            if(buenos[8] == undefined){
                //console.log(buenos)
                buenos[8] = 0
                //console.log(buenos[8])
            }

            if(id_estacion.rows[0] == undefined){
                id_estacion = 1;
            }else{
                id_estacion = id_estacion.rows[0].id_estacion
            }

            fecha = buenos[6] + '/' + buenos[5] + '/' + buenos[4];
            //console.log(buenos[0],fecha, buenos[7],buenos[8],id_estacion);
            await pool.query(`INSERT INTO temperatura(fecha,temperatura_max, temperatura_min, id_estacion) 
                                VALUES ('${fecha}', '${buenos[8]}', '${buenos[7]}','${id_estacion}');`);
            
            buenos = [];
            cont_elem = 1;
        }
        
        buenos.push(elementos_fila[el]);
        //console.log(buenos)
        cont_elem++;
      }
}

const papa = async()=>{

    carpetas = ['2013','2016','2017','2018','2019','2020','2021']
    for(carpeta in carpetas){
        archivos = fs.readdirSync(`src/poblacion_ddbb/Precipitaciones/${carpetas[carpeta]}`)
        for await(archivo of archivos){
            console.log(archivo)
            ruta_base = `src/poblacion_ddbb/Precipitaciones/${carpetas[carpeta]}/${archivo}`
            await scrappingExcelPrecipitacion(ruta_base);
        }
    }
}

const papa2 = async()=>{

    carpetas = ['2013','2016','2017','2018','2019','2020','2021']
    for(carpeta in carpetas){
        archivos = fs.readdirSync(`src/poblacion_ddbb/Temperaturas/${carpetas[carpeta]}`)
        for await(archivo of archivos){
            ruta_base = `src/poblacion_ddbb/Temperaturas/${carpetas[carpeta]}/${archivo}`
            console.log(ruta_base)
            await scrappingExcelTemperatura(ruta_base);
        }
    }
}
//scrappingExcel('pancho qliao gil');

//papa();
//papa2();