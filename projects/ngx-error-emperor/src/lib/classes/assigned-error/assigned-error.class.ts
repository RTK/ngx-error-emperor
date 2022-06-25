import {ErrorContext} from '../error-context/error-context.class';

/**
 * An error that wraps an error object with additional context.
 */
export class AssignedError extends Error {
    public constructor(
        public readonly error: unknown,
        public readonly context: ErrorContext
    ) {
        super('AssignedError');
    }
}
