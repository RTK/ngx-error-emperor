import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';

import {
    ERROR_HANDLER,
    ERROR_INTERCEPTORS,
    NgxErrorEmperorModule
} from '@rtk/ngx-error-emperor';

import {AppComponent} from './app.component';
import {CustomFormComponent} from './components/custom-form/custom-form.component';
import {GlobalErrorHandler} from './error-handlers/global.error-handler';
import {FormsErrorInterceptor} from './error-interceptors/forms.error-interceptor';
import {ReadableErrorInterceptor} from './error-interceptors/readable.error-interceptor';
import { UserActionsComponent } from './components/user-actions/user-actions.component';

@NgModule({
    declarations: [AppComponent, CustomFormComponent, UserActionsComponent],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        NgxErrorEmperorModule.forRoot(),
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
