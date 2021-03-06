import type {ValidationErrors} from '@angular/forms';

import type {FormErrorOptions} from '../../types/form-error-options.type';

/**
 * Special error to be handled in ngx-ee-form components.
 */
export class FormError extends Error {
    public get controlErrors():
        | Record<string, ValidationErrors | null>
        | undefined {
        return {
            ...this.options.controlErrors
        };
    }

    public get generalError(): unknown | undefined {
        return this.options.generalError;
    }

    public constructor(private readonly options: FormErrorOptions) {
        super('FormError');
    }
}
