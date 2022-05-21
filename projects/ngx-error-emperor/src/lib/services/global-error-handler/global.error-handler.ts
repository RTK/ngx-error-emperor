import {ErrorHandler, Inject, Injectable, Optional} from '@angular/core';

import type {ErrorInterceptor} from '../../types/error-interceptor.type';
import {ERROR_INTERCEPTORS} from '../../injection-tokens/error-interceptors.injection-token';
import {ERROR_HANDLER} from '../../injection-tokens/error-handler.injection-token';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    public constructor(
        @Inject(ERROR_HANDLER)
        @Optional()
        private readonly errorHandler: ErrorHandler,
        @Inject(ERROR_INTERCEPTORS)
        @Optional()
        private readonly errorInterceptorsList:
            | readonly ErrorInterceptor[]
            | undefined
    ) {}

    public handleError(error: unknown): void {
        let modifiedError: unknown = error;

        if (Array.isArray(this.errorInterceptorsList)) {
            for (const errorInterceptor of this.errorInterceptorsList) {
                modifiedError = errorInterceptor.handle(modifiedError);
            }
        }

        this.errorHandler.handleError(modifiedError);
    }
}
