import {HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {AssignedError, ErrorInterceptor} from '@rtk/ngx-error-emperor';

import {readableErrorContextToken} from '../error-context-tokens/readable.error-context-token';

@Injectable()
export class ReadableErrorInterceptor implements ErrorInterceptor {
    public handle(error: unknown): unknown {
        if (
            error instanceof AssignedError &&
            error.context.get(readableErrorContextToken) &&
            error.error instanceof HttpErrorResponse
        ) {
            return new AssignedError(error.error.error.message, error.context);
        }

        return error;
    }
}
