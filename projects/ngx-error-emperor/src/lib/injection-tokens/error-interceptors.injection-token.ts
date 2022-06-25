import {InjectionToken} from '@angular/core';

import type {ErrorInterceptor} from '../types/error-interceptor.type';

/**
 * Should provide multiple [ErrorInterceptor] instances.
 */
export const ERROR_INTERCEPTORS: InjectionToken<readonly ErrorInterceptor[]> =
    new InjectionToken('ERROR_INTERCEPTORS');
