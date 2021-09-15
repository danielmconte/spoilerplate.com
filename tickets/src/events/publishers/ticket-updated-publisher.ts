import { Publisher, Subjects, TicketUpdatedEvent } from '@spoilerplate/common';


export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}

