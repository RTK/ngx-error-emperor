import {Inject, Injectable, Optional} from '@angular/core';

import {ERROR_INTERCEPTORS} from '../../injection-tokens/error-interceptors.injection-token';
import type {ErrorInterceptor} from '../../types/error-interceptor.type';

/**
 * Service to be used to resolve an error.
 *
 * Runs an error through all registered [ErrorInterceptor] instances and reassigns the error each time.
 * Returns the value from the last [ErrorInterceptor].
 */
@Injectable({
    providedIn: 'root'
})
export class ErrorResolver {
    public constructor(
        @Inject(ERROR_INTERCEPTORS)
        @Optional()
        private readonly errorInterceptorsList:
            | readonly ErrorInterceptor[]
            | undefined
    ) {}

    public resolveError(error: unknown): unknown {
        let resolvedError: unknown = error;

        if (Array.isArray(this.errorInterceptorsList)) {
            for (const errorInterceptor of this.errorInterceptorsList) {
                resolvedError = errorInterceptor.handle(resolvedError);
            }
        }

        return resolvedError;
    }
}
