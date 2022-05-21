import {Injectable} from '@angular/core';

import {ErrorInterceptor} from '../../types/error-interceptor.type';

/**
 * Unwraps unhandled promise rejections.
 */
@Injectable()
export class UnwrapPromiseRejectionErrorInterceptor
    implements ErrorInterceptor
{
    public handle(error: unknown): unknown {
        if (error && typeof error === 'object') {
            const entries: [string, unknown][] = Object.entries(error);

            if (entries.length > 0 && entries[0][0] === 'rejection') {
                return entries[0][1];
            }
        }

        return error;
    }
}
