import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';

import {
    ERROR_HANDLER,
    ERROR_INTERCEPTORS,
    NgxErrorEmperorModule,
    NgxErrorEmperorFormModule
} from '@rtk/ngx-error-emperor';

import {AppComponent} from './app.component';
import {CustomFormComponent} from './components/custom-form/custom-form.component';
import {FormErrorComponent} from './components/form-error/form-error.component';
import {UserActionsComponent} from './components/user-actions/user-actions.component';
import {GlobalErrorHandler} from './error-handlers/global.error-handler';
import {FormsErrorInterceptor} from './error-interceptors/forms.error-interceptor';
import {ReadableErrorInterceptor} from './error-interceptors/readable.error-interceptor';

@NgModule({
    declarations: [
        AppComponent,
        CustomFormComponent,
        FormErrorComponent,
        UserActionsComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        NgxErrorEmperorModule.forRoot(),
        NgxErrorEmperorFormModule,
        ReactiveFormsModule
    ],
    providers: [
        {
            provide: ERROR_HANDLER,
            useClass: GlobalErrorHandler
        },
        {
            provide: ERROR_INTERCEPTORS,
            multi: true,
            useClass: FormsErrorInterceptor
        },
        {
            provide: ERROR_INTERCEPTORS,
            multi: true,
            useClass: ReadableErrorInterceptor
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
