import {Subject} from 'rxjs';

import {assignError} from './assign-error.function';

import {AssignedError} from '../../classes/assigned-error/assigned-error.class';
import {ErrorContext} from '../../classes/error-context/error-context.class';

describe('assignError', (): void => {
    it('should exist', (): void => {
        expect(typeof assignError).toBe('function');
    });

    it('should catch errors from the provided stream and wrap them into an assigned error with the provided error context', (done: jest.DoneCallback): void => {
        const error: Error = new Error('test');
        const errorContext: ErrorContext = new ErrorContext();
        const source$: Subject<void> = new Subject();

        source$.pipe(assignError(errorContext)).subscribe({
            error: (handledError: unknown): void => {
                expect(handledError instanceof AssignedError).toBe(true);
                expect((handledError as AssignedError).error).toBe(error);
                expect((handledError as AssignedError).context).toBe(
                    errorContext
                );

                done();
            }
        });

        source$.error(error);
    });
});
