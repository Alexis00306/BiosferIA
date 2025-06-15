CREATE DATABASE IF NOT EXIST BIOSFERIA;

CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    apellido VARCHAR(100),
    correo VARCHAR(100) UNIQUE,
    contraseña VARCHAR(255)
);

CREATE TABLE flora (
    id_flora INT AUTO_INCREMENT PRIMARY KEY,
    nombre_comun VARCHAR(100),
    nombre_cientifico VARCHAR(150),
    descripcion TEXT,
    ubicacion VARCHAR(100),
);

CREATE TABLE fauna (
    id_fauna INT AUTO_INCREMENT PRIMARY KEY,
    nombre_comun VARCHAR(100),
    nombre_cientifico VARCHAR(150),
    descripcion TEXT,
    ubicacion VARCHAR(100),
);

CREATE TABLE registros (
    id_registro INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    tipo ENUM('flora', 'fauna'),
    imagen VARCHAR(255),
    id_referencia INT,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);