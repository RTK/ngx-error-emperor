import {ErrorHandler, Inject, Injectable} from '@angular/core';

import {ErrorResolver} from '../error-resolver/error.resolver';

import {ERROR_HANDLER} from '../../injection-tokens/error-handler.injection-token';

/**
 * Global error handler class that will be registered as ERROR_HANDLER via angular.
 *
 * Redirects the error handling to the registered [ErrorHandler] instance.
 */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    public constructor(
        @Inject(ERROR_HANDLER)
        private readonly errorHandler: ErrorHandler,
        private readonly errorResolver: ErrorResolver
    ) {}

    public handleError(error: unknown): void {
        this.errorHandler.handleError(this.errorResolver.resolveError(error));
    }
}
