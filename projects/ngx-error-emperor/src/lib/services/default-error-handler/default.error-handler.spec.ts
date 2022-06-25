import {TestBed} from '@angular/core/testing';

import {DefaultErrorHandler} from './default.error-handler';

import {AssignedError} from '../../classes/assigned-error/assigned-error.class';
import {ErrorContext} from '../../classes/error-context/error-context.class';
import {CONSOLE} from '../../injection-tokens/console.injection-token';

describe('DefaultErrorHandler', (): void => {
    let defaultErrorHandler: DefaultErrorHandler;

    let console: Console;

    beforeEach((): void => {
        TestBed.configureTestingModule({
            providers: [
                DefaultErrorHandler,
                {
                    provide: CONSOLE,
                    useValue: {
                        error: jest.fn() as unknown
                    } as Console
                }
            ]
        });
    });

    beforeEach((): void => {
        console = TestBed.inject(CONSOLE);
    });

    beforeEach((): void => {
        defaultErrorHandler = TestBed.inject(DefaultErrorHandler);
    });

    it('should be created', (): void => {
        expect(defaultErrorHandler).toBeTruthy();
    });

    describe('handleError()', (): void => {
        it('should log directly to console error output when the error is not an assigned error', (): void => {
            const error: Error = new Error('test');

            defaultErrorHandler.handleError(error);
            expect(console.error).toHaveBeenCalledWith(error);
        });

        it('should unwrap the error from an assigned error, if one gets provided', (): void => {
            const error: Error = new Error('test');
            const errorContext: ErrorContext = new ErrorContext();

            const assignedError: AssignedError = new AssignedError(
                error,
                errorContext
            );

            defaultErrorHandler.handleError(assignedError);
            expect(console.error).toHaveBeenCalledWith(error);
        });
    });
});
