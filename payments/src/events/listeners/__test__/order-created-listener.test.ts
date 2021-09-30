import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderCreatedEvent, OrderStatus } from "@spoilerplate/common";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";
import { Order } from '../../../models/order';

const setup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client);

    const data: OrderCreatedEvent['data'] = {
        // No idea why toHexString is not available.
        id: mongoose.Types.ObjectId().toString(),
        version: 0,
        expiresAt: 'sdgag',
        userId: 'fdfsa',
        status: OrderStatus.Created,
        ticket: {
            id: 'dfasgdfg',
            price: 10
        } 
    };

       // @ts-ignore
       const msg: Message = {
           ack: jest.fn()
       };
       console.log(data.id);
       return { listener, data, msg };
};

it('replicates the order info', async () => {
    const { listener, data, msg} = await setup();

    await listener.onMessage(data, msg);

    const order = await Order.findById(data.id);

    expect(order!.price).toEqual(data.ticket.price);
});

it('acks the message', async () => {
    const { listener, data, msg} = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});