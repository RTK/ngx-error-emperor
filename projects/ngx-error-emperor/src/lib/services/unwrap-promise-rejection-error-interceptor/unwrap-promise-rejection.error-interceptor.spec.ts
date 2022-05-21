import {NgZone} from '@angular/core';
import {TestBed} from '@angular/core/testing';

import {UnwrapPromiseRejectionErrorInterceptor} from './unwrap-promise-rejection.error-interceptor';

describe('UnwrapPromiseRejectionErrorInterceptor', (): void => {
    let service: UnwrapPromiseRejectionErrorInterceptor;

    beforeEach((): void => {
        TestBed.configureTestingModule({
            providers: [UnwrapPromiseRejectionErrorInterceptor]
        });
    });

    beforeEach((): void => {
        service = TestBed.inject(UnwrapPromiseRejectionErrorInterceptor);
    });

    it('should be created', (): void => {
        expect(service).toBeTruthy();
    });

    describe('handle()', (): void => {
        it('should do nothing if the provided error cannot be tracked down to a unhandled promise rejection', (): void => {
            expect(service.handle('test')).toBe('test');

            const error: Error = new Error('test');
            expect(service.handle(error)).toBe(error);

            const obj: Record<string, boolean> = {
                test: true
            };
            expect(service.handle(obj)).toBe(obj);
        });

        it('should unwrap the error from a unhandled promise rejection', (done: jest.DoneCallback): void => {
            const error: string = 'test123';
            const zone: NgZone = new NgZone({
                enableLongStackTrace: false,
                shouldCoalesceEventChangeDetection: false,
                shouldCoalesceRunChangeDetection: false
            });

            zone.onError.subscribe({
                next: (zoneError: unknown): void => {
                    expect(service.handle(zoneError)).toBe(error);

                    done();
                }
            });

            zone.run(() => {
                Promise.reject(error);
            });
        });
    });
});
