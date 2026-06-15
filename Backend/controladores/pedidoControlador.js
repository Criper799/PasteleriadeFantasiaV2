import {
    insertaPedido,
    insertaItem
} from '../modelos/pedidoModelo.js';

export const registraPedido =
async (req, res) => {

    try {

        const pedidoId =
            await insertaPedido(
                req.body
            );

        for (
            const item
            of req.body.items
        ) {

            await insertaItem(
                pedidoId,
                item
            );
        }

        res.status(201)
           .json({
                success: true,
                pedidoId
           });

    } catch (error) {

        res.status(500)
           .json({
                error:
                error.message
           });
    }
};