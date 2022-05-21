import {ErrorHandler, InjectionToken} from '@angular/core';

export const ERROR_HANDLER: InjectionToken<ErrorHandler> = new InjectionToken(
    'ERROR_HANDLER'
);
