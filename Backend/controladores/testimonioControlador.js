import {
    obtTodos,
    inserta
} from '../modelos/testimonioModelo.js';

export const obtTestimonios =
async (req, res) => {

    try {

        const testimonios =
            await obtTodos();

        const datos = testimonios.map((t) => ({
        id: t.id,
        name: t.nombre,
        rating: t.calificacion,
        comment: t.comentario,
        date: new Date(t.fecha).toISOString().split('T')[0]
    }));

        res.status(200).json(datos);
    } catch (error) {

        res.status(500)
           .json({
                error:
                error.message
           });
    }
};

export const insertaTestimonio =
async (req, res) => {

    try {

        const {
            name,
            rating,
            comment
        } = req.body;

        const fecha =
            new Date()
            .toISOString()
            .split('T')[0];

        const id =
            await inserta(
                name,
                rating,
                comment,
                fecha
            );

        res.status(201)
           .json({
                id,
                name,
                rating,
                comment,
                date: fecha
           });

    } catch (error) {

        res.status(500)
           .json({
                error:
                error.message
           });
    }
};