# ngx-error-emperor

Angular error handling with context.

## Motivation

Error handling can be a tedious task and often is integrated as an afterthought even though
there will only be one reason why an operation has succeeded but thousands of reasons why an operation has failed.

Keeping track of all different kind of error causes gets especially difficult when the actual context gets lost from where
the error has been raised from. A `HttpErrorResponse` provides the information, that the error comes from a `Http` action
but the concrete origin only gets obvious after mindfully scanning its properties, such a `url` and `method`.

Next the question arises as to where to handle the error exactly. In some cases we may want to handle errors in isolation,
in other cases we need a generic handler approach. But we do not wish to secure each action separately but instead want
a global solution.

## Solution

`ngx-error-emperor` takes the `HttpInterceptor` pattern integrated in the `@angular/core` package and maps it to error handling.
A global error handler gets installed, that runs the error through all registered `ErrorInterceptor` implementations, so that a
generic error, such as the `HttpErrorResponse` can be mapped to an error that contains a human-readable text to be displayed in a
dialog.

To get around the issue of dissecting an `unknown` error object to make sure that the error might be the `HttpErroResponse` originating
from my _API A_ and not from my _API B_, this library offers the possibility to create an `AssignedError` object, which contains a `ErrorContext`.

The `ErrorContext` maps the `HttpContext` pattern from `@angular/common` to the issue at hand. With the `ErrorContext` we can pair any error that will
arise from our API calls to _API A_ with an `ErrorContext` that holds an `ErrorContextToken` that clearly identifies the error source.

By providing a custom `ErrorHandler` implementation, the error handling can be centralised, but can react to specific error sources.

## Usage

### Import module in your root module

Import the `NgxErrorEmperor` module via the `forRoot()` method in your root module.

This will set this library's central error handler.
**Do not overwrite the Angular `ErrorHandler` token yourself, otherwise this library might not work correctly.**

```ts
import {NgxErrorEmperorModule} from '@rtk/ngx-error-emperor';

...

@NgModule({
    imports: [
        NgxErrorEmperor.forRoot()
    ]
})
class AppModule {
}
```

#### Module configuration

The `forRoot` optionally takes a configuration object. Per default some `HttpInterceptors` are active by default.
If you wish to disable them, you can turn them off via the configuration object.

```ts
@NgModule({
    imports: [
        NgxErrorEmperor.forRoot({
            defaultErrorHandlers: {
                unwrapPromises: false // must be explicitly set to false
            }
        })
    ]
})
class AppModule {}
```

### Install custom `HttpInterceptor` classes

Create an injectable class that implements the `ErrorInterceptor` interface. Afterwards, provide it under the `ERROR_INTERCEPTORS`
token with the `multi` flag set to `true`. **If multi is not set to true, the library will throw an error!**

_my-error-interceptor.ts_

```ts
import {AssignedError, ErrorInterceptor} from '@rtk/ngx-error-emperor';

import {MyErrorToken} from './error-tokens/my-error-token';
import {MyReadableError} from './shared';

@Injectable()
export class MyErrorInterceptor implements ErrorInterceptor {
    public handle(error: unknown): unknown {
        if (error instanceof AssignedError) {
            if (error.context.get(MyErrorToken)) {
                // e.g. maps the error from an API to a "ReadableError" associated with a message from the API
                return MyReadableError(error.error.message);
            }
        }

        return error;
    }
}
```

_module.ts_

```ts
import {ERROR_INTERCEPTORS, NgxErrorEmperorModule} from '@rtk/ngx-error-emperor';

import {MyErrorInterceptor} from './error-interceptors/my-error-interceptor';

@NgModule({
    imports: [
        NgxErrorEmperorModule.forRoot()
    ],
    providers: [
        {
            provide: ERROR_INTERCEPTORS,
            useClass: MyErrorInterceptor,
            multi: true
        }
    ]
})
```

### Install the error handler

By default, the default implementation for an error handler, which is bundled with this library, will be used. It will only log errors
to the console. If an `AssignedError` is provided, it will be unwrapped and the original error is printed.

To have error handling that suits your project you need to create a new `ErrorHandler` class, that implements the Angular interface. Afterwards, provide it
in your root module via the `ERROR_HANDLER` token.

_my-error-handler.ts_

```ts
@Injectable()
class MyErrorHandler implements ErrorHandler {
    public handleError(error: unknown): void {
        // do your magic. Display a dialog, send a request, open a petition against all errors or run away from your errors
    }
}
```

_module.ts_

```ts
import {ERROR_HANDLER, NgxErrorEmperorModule} from '@rtk/ngx-error-emperor';

import {MyErrorHandler} from './my-error-handler';

@NgModule({
    imports: [
        NgxErrorEmperorModule.forRoot()
    ],
    providers: [
        {
            provide: ERROR_HANDLER,
            useClass: MyErrorHandler
        }
    ]
})
```

### Add context to your errors

Whenever you have an action that might arise errors, like a http-request, you can add context. For good integration into the
Angular ecosystem this library provides a helper function `assignError` that can be used as an RxJs operator.

```ts
import {HttpClient} from '@angular/common/http';

import {ErrorContextToken} from '@rtk/ngx-error-emperor';

const myContextToken: ErrorContextToken<boolean> = new ErrorContextToken(
    (): false => false
);

@Injectable({
    providedIn: 'root'
})
class APIServiceA {
    public constructor(private readonly httpClient: HttpClient) {}

    public getAll(): Observable<void> {
        return this.httpClient
            .get<void>('/test/1')
            .pipe(assignError(new ErrorContext().set(myContextToken, true)));
    }
}
```

Any error, that arises from the `getAll` method, will be thrown as an `AssignedError` with a `ErrorContext` that contains a
`myContextToken` object. In any `ErrorInterceptor` this `AssignedError` can now be identified via the `myContextToken` to be an error that
originates from the `ApiServiceA.getAll()` method, so it may be transformed into a generic error with which your `ErrorHandler` class can work
with to take adequate measurements.

### Form component

For easier form management with `ReactiveFormsModule`, a `FormComponent` can be used. The goal of the `FormComponent` is to catch
errors that happen inside the form's context to provide feedback locally. Normally, a form consists of multiple inputs and each input can
hold errors that will most likely be displayed right next to the input. The `FormComponent` aims to handle e.g., backend errors that hold information about
which inputs exhibit errors.

```ts
import {FormControl, FormGroup} from '@angular/forms';

import {FORM_CONTAINER} from '@rtk/ngx-error-emperor';

@Component({
    template: `
        <ngx-ee-form #eeForm [formGroup]="myForm">
            <p *ngIf="eeForm.hasError">{{ eeForm.error }}</p>

            <input formControlName="firstname" placeholder="Firstname" />
            <p *ngIf="myForm.controls.firstname.errors">
                {{ myForm.controls.firstname.errors?.form }}
            </p>

            <button type="submit">Submit form</button>
        </ngx-ee-form>
    `,
    viewProviders: [
        {
            provide: FORM_CONTAINER,
            useExisting: MyFormComponent
        }
    ]
})
class MyFormComponent implements FormGroup {
    public readonly myForm: FormGroup = new FormGroup({
        firsntame: new FormControl(null)
    });

    public constructor(private readonly service: Service) {}

    public async submit(): Promise<void> {
        await service.doAction(this.myForm.value);
    }
}
```

```ts
import {Injectable} from '@angular/core';

import {FormError} from '@rtk/ngx-error-emperor';

@Injectable()
export class Service {
    public async doAction(): Promise<void> {
        throw new FormError({
            originalError: new Error(
                'This is the error that originally happened'
            ),
            controlErrors: {
                firstname: 'Too long'
            },
            generalError: 'There was an error on your side!'
        });
    }
}
```

If an error is thrown from inside the `submit` method, it will be analyzed. If it appears to be a `FormError`, each control error will be assigned automatically.
The `FormComponent` also holds a reference to a general error, so that additional information can be provided to the user.
