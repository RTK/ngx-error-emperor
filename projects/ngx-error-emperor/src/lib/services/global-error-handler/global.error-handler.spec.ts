import type {ErrorHandler} from '@angular/core';
import {TestBed} from '@angular/core/testing';

import {GlobalErrorHandler} from './global.error-handler';

import {AssignedError} from '../../classes/assigned-error/assigned-error.class';
import {ErrorContext} from '../../classes/error-context/error-context.class';
import {ErrorContextToken} from '../../classes/error-context-token/error-context-token.class';
import {ERROR_HANDLER} from '../../injection-tokens/error-handler.injection-token';
import {ERROR_INTERCEPTORS} from '../../injection-tokens/error-interceptors.injection-token';
import type {ErrorInterceptor} from '../../types/error-interceptor.type';

describe('GlobalErrorHandler', (): void => {
    let service: GlobalErrorHandler;

    let errorHandler: ErrorHandler;
    let errorInterceptorList: readonly ErrorInterceptor[];

    beforeEach((): void => {
        TestBed.configureTestingModule({
            providers: [
                GlobalErrorHandler,
                {
                    provide: ERROR_HANDLER,
                    useValue: {
                        handleError: jest.fn()
                    } as ErrorHandler
                },
                {
                    provide: ERROR_INTERCEPTORS,
                    useValue: {
                        handle: jest.fn((error: unknown): unknown => {
                            return error;
                        })
                    } as ErrorInterceptor,
                    multi: true
                },
                {
                    provide: ERROR_INTERCEPTORS,
                    useValue: {
                        handle: jest.fn((error: unknown): unknown => {
                            return error;
                        })
                    } as ErrorInterceptor,
                    multi: true
                },
                {
                    provide: ERROR_INTERCEPTORS,
                    useValue: {
                        handle: jest.fn((error: unknown): unknown => {
                            return error;
                        })
                    } as ErrorInterceptor,
                    multi: true
                }
            ]
        });
    });

    beforeEach((): void => {
        errorHandler = TestBed.inject(ERROR_HANDLER);
        errorInterceptorList = TestBed.inject(ERROR_INTERCEPTORS);
    });

    beforeEach((): void => {
        service = TestBed.inject(GlobalErrorHandler);
    });

    it('should be created', (): void => {
        expect(service).toBeTruthy();
    });

    describe('handleError()', (): void => {
        it('should run the provided error through all available error interceptors and then pass it to the error handler', (): void => {
            const originalError: Error = new Error('test123');
            const errorContext: ErrorContext = new ErrorContext();
            const errorContextToken: ErrorContextToken<boolean> =
                new ErrorContextToken((): false => {
                    return false;
                });
            const assignedError: AssignedError = new AssignedError(
                originalError,
                errorContext.set(errorContextToken, true)
            );

            class CustomError {
                public constructor(public readonly error: unknown) {}
            }

            (errorInterceptorList[1].handle as jest.Mock).mockImplementation(
                (error: unknown): unknown => {
                    if (
                        error instanceof AssignedError &&
                        error.context.get(errorContextToken)
                    ) {
                        return new CustomError(error.error);
                    }

                    return error;
                }
            );

            service.handleError(assignedError);
            expect(errorHandler.handleError).toHaveBeenCalledWith(
                new CustomError(originalError)
            );
        });
    });
});
