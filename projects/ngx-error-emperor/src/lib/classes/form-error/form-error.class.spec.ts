import {FormError} from './form-error.class';
import {ValidationErrors} from '@angular/forms';

describe('FormError', (): void => {
    let formError: FormError;

    beforeEach((): void => {
        formError = new FormError({
            originalError: new Error('test')
        });
    });

    it('should create', (): void => {
        expect(formError).toBeTruthy();
    });

    describe('get controlErrors()', (): void => {
        it('should return a copy of the provided object', (): void => {
            const controlErrors: Readonly<Record<string, ValidationErrors | null>> = {
                a: null,
                b: {}
            };

            formError = new FormError({
                originalError: 'test',
                controlErrors
            });

            expect(formError.controlErrors).toEqual(controlErrors);
            expect(formError.controlErrors).not.toBe(controlErrors);
        });
    });

    describe('get generalError()', (): void => {
        it('should return the provided error', (): void => {
            const error: Error = new Error('test');

            formError = new FormError({
                originalError: 'test',
                generalError: error
            });

            expect(formError.generalError).toBe(error);
        })
    });
});
