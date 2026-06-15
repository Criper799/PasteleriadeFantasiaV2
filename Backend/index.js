import express from 'express';
import cors from 'cors';
import productoRutas from './rutas/productoRutas.js';
import testimonioRutas from './rutas/testimonioRutas.js';
import pedidoRutas from './rutas/pedidoRutas.js'
import authRutas from './rutas/authRutas.js';;
import logRutas from './rutas/logRutas.js';

const app = express();

app.use(cors());

app.use(express.json());

app.use('/api/productos',productoRutas);

app.use('/api/testimonios',testimonioRutas);

app.use('/api/pedidos',pedidoRutas);

app.use('/api/auth', authRutas);

app.use('/api/logs', logRutas);

const PUERTO = 3001;

app.listen(
    PUERTO,
    () => {
        console.log(
            `Servidor en http://localhost:${PUERTO}`
        );
    }
);