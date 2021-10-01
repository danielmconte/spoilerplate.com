import mongoose from 'mongoose';
import request from 'supertest';
import { OrderStatus } from '@spoilerplate/common';
import { app } from '../../app';
import { Order } from '../../models/order';
import { stripe } from '../../stripe';
import { Payment } from '../../models/payment';

jest.mock('../../stripe');

it('returns a 404 when purchasing an order that does not exist', async () => {
    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin())
        .send({
            token: 'dfasdf',
            orderId: mongoose.Types.ObjectId().toString()
        })
        .expect(404);
});

it('returns a 401 when purchasing an order that does not belong to user', async () => {
    const order = Order.build({
        id: mongoose.Types.ObjectId().toString(),
        userId: mongoose.Types.ObjectId().toString(),
        version: 0,
        price: 20,
        status: OrderStatus.Created
    });
    await order.save();

    await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
        token: 'dfasdf',
        orderId: order.id
    })
    .expect(401);
});

it('returns a 400 when purchasing a cancelled order', async () => {
    const userId = mongoose.Types.ObjectId().toString();

    const order = Order.build({
        id: mongoose.Types.ObjectId().toString(),
        userId,
        version: 0,
        price: 20,
        status: OrderStatus.Cancelled
    });
    await order.save();

    await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
        orderId: order.id,
        token: 'asfdsaf'
    })
    .expect(400);

});

it('returns a 201 with valid inputs', async () => {
    const userId = mongoose.Types.ObjectId().toString();

    const order = Order.build({
        id: mongoose.Types.ObjectId().toString(),
        userId,
        version: 0,
        price: 20,
        status: OrderStatus.Created
    });
    await order.save();

    await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
        orderId: order.id,
        token: 'tok_visa'
    })
    .expect(201);

    const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0]
    const stripeCharge = await(stripe.charges.create as jest.Mock).mock.results[0].value;
    
    expect(chargeOptions.source).toEqual('tok_visa');
    expect(chargeOptions.amount).toEqual(20 * 100);
    expect(chargeOptions.currency).toEqual('usd');

    const payment = await Payment.findOne({
        orderId: order.id,
        stripeId: stripeCharge.id
    });

    expect(payment).toBeDefined();
    expect(payment!.orderId).toEqual(order.id);
    expect(payment!.stripeId).toEqual(stripeCharge.id);
});