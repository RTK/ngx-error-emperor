import {ErrorHandler, ModuleWithProviders, NgModule} from '@angular/core';

import {GlobalErrorHandler} from './services/global-error-handler/global.error-handler';
import {DefaultErrorHandler} from './services/default-error-handler/default.error-handler';
import {UnwrapPromiseRejectionErrorInterceptor} from './services/unwrap-promise-rejection-error-interceptor/unwrap-promise-rejection.error-interceptor';
import {ErrorEmperorModuleOptions} from './types/error-emperor-module-options.type';
import {ERROR_HANDLER} from './injection-tokens/error-handler.injection-token';
import {ERROR_INTERCEPTORS} from './injection-tokens/error-interceptors.injection-token';

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
