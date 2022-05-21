import {ErrorContext} from '../error-context/error-context.class';

export class AssignedError {
    public constructor(
        public readonly error: unknown,
        public readonly context: ErrorContext
    ) {}
}
