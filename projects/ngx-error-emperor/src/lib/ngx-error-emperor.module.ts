import {ErrorHandler, ModuleWithProviders, NgModule} from '@angular/core';

import {ERROR_INTERCEPTORS} from './injection-tokens/error-interceptors.injection-token';
import {ERROR_HANDLER} from './injection-tokens/error-handler.injection-token';
import {DefaultErrorHandler} from './services/default-error-handler/default.error-handler';
import {GlobalErrorHandler} from './services/global-error-handler/global.error-handler';
import {UnwrapPromiseRejectionErrorInterceptor} from './services/unwrap-promise-rejection-error-interceptor/unwrap-promise-rejection.error-interceptor';
import type {ErrorEmperorModuleOptions} from './types/error-emperor-module-options.type';

/**
 * Module that sets up the general error handling.
 */
@NgModule()
export class NgxErrorEmperorModule {
    public static forRoot(
        options?: ErrorEmperorModuleOptions
    ): ModuleWithProviders<NgxErrorEmperorModule> {
        return {
            ngModule: NgxErrorEmperorModule,
            providers: [
                {
                    provide: ErrorHandler,
                    useClass: GlobalErrorHandler
                },
                {
                    provide: ERROR_HANDLER,
                    useClass: DefaultErrorHandler
                },

                // default error interceptors
                options?.defaultErrorHandlers?.unwrapPromises === false
                    ? []
                    : {
                          provide: ERROR_INTERCEPTORS,
                          useClass: UnwrapPromiseRejectionErrorInterceptor,
                          multi: true
                      }
            ]
        };
    }
}
