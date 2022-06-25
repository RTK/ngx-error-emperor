import {HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {
    AssignedError,
    ErrorInterceptor,
    FormError
} from '@rtk/ngx-error-emperor';

import {formsErrorContextToken} from '../error-context-tokens/forms.error-context-token';

@Injectable()
export class FormsErrorInterceptor implements ErrorInterceptor {
    public handle(error: unknown): FormError | unknown {
        if (
            error instanceof AssignedError &&
            error.context.get(formsErrorContextToken) &&
            error.error instanceof HttpErrorResponse &&
            error.error.status === 400
        ) {
            return new FormError({
                originalError: error,
                controlErrors: error.error.error.data,
                generalError: error.error.error.message
            });
        }

        return error;
    }
}
