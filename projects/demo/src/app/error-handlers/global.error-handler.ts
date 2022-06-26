import {ErrorHandler, Injectable} from '@angular/core';

import {AssignedError} from '@rtk/ngx-error-emperor';

import {readableErrorContextToken} from '../error-context-tokens/readable.error-context-token';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    public handleError(error: unknown): void {
        if (
            error instanceof AssignedError &&
            error.context.get(readableErrorContextToken) &&
            typeof error.error === 'string'
        ) {
            window.alert(error.error);
        } else if (error instanceof AssignedError) {
            window.console.error(error.error);
        } else {
            window.console.error(error);
        }
    }
}
