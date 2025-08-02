CREATE DATABASE IF NOT EXISTS biosferia;
                       
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100),
  apellido VARCHAR(100),
  correo VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  google_id VARCHAR(255) DEFAULT NULL,
  fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE registros (
    id_registro INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    nombre_comun VARCHAR(100),
    nombre_cientifico VARCHAR(150),
    descripcion TEXT,
    ubicacion VARCHAR(100),
    tipo ENUM('flora', 'fauna'),
    imagen VARCHAR(255),
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);