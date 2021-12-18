CREATE DATABASE apiclima;
\c apiclima
CREATE TABLE IF NOT EXISTS usuario(
    id_usuario integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    correo text  NOT NULL, 
    password text NOT NULL
);

CREATE TABLE IF NOT EXISTS estacion (
    id_estacion integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    nombre text,
    latitud  text,
    longitud text,
    altura_mar text,
    codigo text
);
CREATE TABLE IF NOT EXISTS precipitacion (
    id_precipitacion integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    fecha text,
    precipitacion text,
    id_estacion integer,
    CONSTRAINT fk_estacion 
        FOREIGN KEY(id_estacion) 
            REFERENCES estacion(id_estacion)
);

CREATE TABLE IF NOT EXISTS temperatura (
    id_temperatura integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    fecha text,
    temperatura_max text,
    temperatura_min text,
    id_estacion integer,
    CONSTRAINT fk_estacion 
        FOREIGN KEY(id_estacion) 
            REFERENCES estacion(id_estacion)
);


insert into usuario(correo,password) values('test@test.cl','admin123');

insert into estacion(nombre, latitud, longitud, altura_mar) values('Estacion test 1', 'latitud 1', 'longitud 1', '4000');
insert into estacion(nombre, latitud, longitud, altura_mar) values('Estacion test 2', 'latitud 1', 'longitud 1', '2000');

insert into precipitacion(fecha,precipitacion,id_estacion) values('28/03/1997','20.000 mm', 1);
insert into precipitacion(fecha,precipitacion,id_estacion) values('28/03/2014','20 mm', 2);

insert into temperatura(fecha, temperatura_max, temperatura_min, id_estacion) values('04/03/2019','32,1', '-5', 1);
insert into temperatura(fecha, temperatura_max, temperatura_min, id_estacion) values('04/09/2003','24', '5', 2);

INSERT INTO temperatura(fecha,temperatura_max, temperatura_min, id_estacion) VALUES ('04/09/2003', '24', '5',1);