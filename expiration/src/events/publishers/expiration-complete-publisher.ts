import { ExpirationCompleteEvent, Subjects, Publisher} from '@spoilerplate/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
        subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
};

