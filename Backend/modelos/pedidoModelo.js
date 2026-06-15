import { pool } from '../config/bd.js';

export const insertaPedido = async (
    datos
) => {

    const {
        fullName,
        phone,
        deliveryMethod,
        locationId,
        address,
        deliveryDate,
        deliveryTime,
        paymentMethod,
        total
    } = datos;

    const [resultado] =
        await pool.query(
            `INSERT INTO pedidos
            (
                cliente_nombre,
                cliente_telefono,
                metodo_entrega,
                sucursal_id,
                direccion,
                fecha_entrega,
                hora_entrega,
                metodo_pago,
                total
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                fullName,
                phone,
                deliveryMethod,
                locationId,
                address,
                deliveryDate,
                deliveryTime,
                paymentMethod,
                total
            ]
        );

    return resultado.insertId;
};

export const insertaItem = async (
    pedidoId,
    item
) => {

    await pool.query(
        `INSERT INTO pedido_items
        (
            pedido_id,
            producto_id,
            es_personalizado,
            cantidad,
            precio_unitario,
            detalles_personalizados
        )
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
            pedidoId,
            item.product.id,
            item.isCustom ? 1 : 0,
            item.quantity,
            item.product.price,
            null
        ]
    );
};