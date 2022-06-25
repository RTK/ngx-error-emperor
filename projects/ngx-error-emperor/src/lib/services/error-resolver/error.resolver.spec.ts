import {TestBed} from '@angular/core/testing';

import {ErrorResolver} from './error.resolver';
import {ERROR_INTERCEPTORS} from '../../injection-tokens/error-interceptors.injection-token';
import type {ErrorInterceptor} from '../../types/error-interceptor.type';

describe('ErrorResolver', (): void => {
    let errorResolver: ErrorResolver;

    let errorInterceptorList: readonly ErrorInterceptor[];

    beforeEach((): void => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: ERROR_INTERCEPTORS,
                    useValue: [
                        {
                            handle: jest.fn((error: unknown): unknown => {
                                return error;
                            })
                        } as ErrorInterceptor,
                        {
                            handle: jest.fn((error: unknown): unknown => {
                                return error;
                            })
                        } as ErrorInterceptor,
                        {
                            handle: jest.fn((error: unknown): unknown => {
                                return error;
                            })
                        } as ErrorInterceptor
                    ]
                }
            ]
        });
    });

    beforeEach((): void => {
        errorInterceptorList = TestBed.inject(ERROR_INTERCEPTORS);
    });

    beforeEach((): void => {
        errorResolver = TestBed.inject(ErrorResolver);
    });

    it('should be created', (): void => {
        expect(errorResolver).toBeTruthy();
    });

    describe('resolveError()', (): void => {
        it('should run errors through all interceptors and throw it if it is no FormError instance', async (): Promise<void> => {
            const error: Error = new Error('test');
            const newError: Error = new Error('new');

            errorInterceptorList[2].handle = jest.fn((): Error => {
                return newError;
            });

            expect(errorResolver.resolveError(error)).toBe(newError);

            expect(errorInterceptorList[0].handle).toHaveBeenCalledWith(error);
            expect(errorInterceptorList[1].handle).toHaveBeenCalledWith(error);
            expect(errorInterceptorList[2].handle).toHaveBeenCalledWith(error);
        });
    });
});
