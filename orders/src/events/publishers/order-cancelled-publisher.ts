import { Subjects, Publisher, OrderCancelledEvent } from '@spoilerplate/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}