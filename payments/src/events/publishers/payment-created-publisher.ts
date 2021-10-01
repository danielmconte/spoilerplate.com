import { Subjects, Publisher, PaymentCreatedEvent } from '@spoilerplate/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
};