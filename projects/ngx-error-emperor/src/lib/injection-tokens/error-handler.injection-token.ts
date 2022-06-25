import {ErrorHandler, InjectionToken} from '@angular/core';

/**
 * Should provide an [ErrorHandler] instance.
 */
export const ERROR_HANDLER: InjectionToken<ErrorHandler> = new InjectionToken(
    'ERROR_HANDLER'
);
