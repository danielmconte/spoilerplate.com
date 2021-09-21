import { Publisher, OrderCreatedEvent, Subjects } from '@spoilerplate/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
