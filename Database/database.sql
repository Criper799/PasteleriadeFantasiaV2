-- BASE DE DATOS: PASTELERIA FANTASIA

DROP DATABASE IF EXISTS pasteleria_fantasia;

CREATE DATABASE pasteleria_fantasia;

USE pasteleria_fantasia;

CREATE TABLE productos (
id INT AUTO_INCREMENT PRIMARY KEY,
nombre VARCHAR(100) NOT NULL,
categoria VARCHAR(50) NOT NULL,
precio INT NOT NULL,
imagen VARCHAR(255) NOT NULL,
descripcion TEXT NOT NULL,
ingredientes TEXT NOT NULL,
alergenos VARCHAR(255),
porciones VARCHAR(50) NOT NULL,
es_popular BOOLEAN DEFAULT FALSE,
estado BOOLEAN DEFAULT TRUE,
creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE testimonios (
id INT AUTO_INCREMENT PRIMARY KEY,
nombre VARCHAR(100) NOT NULL,
calificacion INT NOT NULL,
comentario TEXT NOT NULL,
fecha DATE NOT NULL
);

CREATE TABLE pedidos (
id INT AUTO_INCREMENT PRIMARY KEY,
cliente_nombre VARCHAR(100) NOT NULL,
cliente_telefono VARCHAR(20) NOT NULL,
metodo_entrega VARCHAR(20) NOT NULL,
sucursal_id INT,
direccion VARCHAR(255),
fecha_entrega DATE NOT NULL,
hora_entrega VARCHAR(50) NOT NULL,
metodo_pago VARCHAR(20) NOT NULL,
total INT NOT NULL,
creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pedido_items (
id INT AUTO_INCREMENT PRIMARY KEY,
pedido_id INT NOT NULL,
producto_id INT NOT NULL,
es_personalizado BOOLEAN DEFAULT FALSE,
cantidad INT NOT NULL,
precio_unitario INT NOT NULL,
detalles_personalizados TEXT,

FOREIGN KEY (pedido_id)
REFERENCES pedidos(id)
ON DELETE CASCADE
);


CREATE TABLE usuarios (
id INT AUTO_INCREMENT PRIMARY KEY,
nombre VARCHAR(100) NOT NULL,
email VARCHAR(100) NOT NULL UNIQUE,
password VARCHAR(255) NOT NULL,
rol ENUM('admin','usuario') DEFAULT 'usuario',
estado BOOLEAN DEFAULT TRUE,
creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE log_acceso (
id INT AUTO_INCREMENT PRIMARY KEY,
usuario VARCHAR(100) NOT NULL,
ip VARCHAR(100),
evento VARCHAR(20) NOT NULL,
navegador TEXT,
fecha_hora DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO productos
(nombre, categoria, precio, imagen, descripcion, ingredientes, alergenos, porciones, es_popular, estado)
VALUES

('Torta de Chocolate Supremo', 'tortas', 150, '/img/pastel.jpg',
'Una deliciosa torta húmeda y esponjosa elaborada con cacao puro.',
'Cacao puro, crema de leche, azúcar, harina, vainilla',
'Gluten, Lácteos',
'10,20,30',
1,
1),

('Pastel de Moca Imperial', 'tortas', 170, '/img/pasteles.jpg',
'Combinación perfecta entre café espresso y chocolate.',
'Café espresso, cacao, crema batida',
'Gluten, Lácteos',
'10,20,30',
1,
1),

('Alfajores de Dulce de Leche', 'dulces', 90, '/img/alfafor.jpg',
'Alfajores rellenos con dulce de leche artesanal.',
'Maicena, dulce de leche, mantequilla',
'Gluten, Lácteos, Huevo',
'1,6,12',
1,
1),

('Pastel Artesanal de Frutilla', 'tortas', 165, '/img/pas.jpg',
'Pastel artesanal con crema pastelera y frutillas.',
'Frutillas, crema pastelera, merengue',
'Gluten, Lácteos, Huevo',
'10,20,30',
0,
1),

('Dulces Caseros Mixtos', 'dulces', 65, '/img/dul.jpg',
'Selección de dulces variados.',
'Galletas, alfajores, brownies',
'Gluten, Lácteos, Huevo',
'6,12',
0,
1),

('Variedad de Sabores Macarons', 'dulces', 72, '/img/var.jpg',
'Macarons franceses tradicionales.',
'Harina de almendra, claras de huevo',
'Almendras, Huevo, Lácteos',
'6,12',
0,
1),

('Red Velvet de Ensueño', 'tortas', 185,
'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?w=600',
'Bizcocho Red Velvet con queso crema.',
'Buttermilk, cacao, queso crema',
'Gluten, Lácteos, Huevo',
'10,20,30',
1,
1),

('Cupcakes de Arcoíris (Pack x 4)', 'cupcakes', 48,
'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=600',
'Cupcakes decorados con buttercream multicolor.',
'Vainilla, buttercream, chispas',
'Gluten, Lácteos, Huevo',
'4,8,12',
0,
1),

('Donas Glaseadas de Fantasía (Pack x 6)', 'especiales', 54,
'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600',
'Donas con glaseados variados.',
'Masa leudada, chocolate, frutilla',
'Gluten, Lácteos, Huevo',
'6,12',
0,
1);

INSERT INTO testimonios
(nombre, calificacion, comentario, fecha)
VALUES

('María Alejandra Gómez', 5,
'La torta de chocolate supremo es fantástica.',
'2026-05-15'),

('Carlos Hurtado', 5,
'Los alfajores son los mejores que he probado.',
'2026-05-28'),

('Estela Quispe', 4,
'Excelente calidad de repostería.',
'2026-06-02');
