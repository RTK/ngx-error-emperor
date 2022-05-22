import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    Optional,
    Self
} from '@angular/core';
import {FormGroup, ValidationErrors} from '@angular/forms';

import {Observable} from 'rxjs';

import {FormError} from '../../classes/form-error/form-error.class';
import {ERROR_INTERCEPTORS} from '../../injection-tokens/error-interceptors.injection-token';
import {FORM_CONTAINER} from '../../injection-tokens/form-container.injection-token';
import type {ErrorInterceptor} from '../../types/error-interceptor.type';
import {FormContainer} from '../../types/form-container.type';
import {noError} from '../../values/no-error.value';

@Component({
    selector: 'ngx-ee-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormComponent {
    public get hasError(): boolean {
        return this._error !== noError;
    }

    public get error(): unknown | symbol {
        return this._error;
    }

    private _error: unknown = noError;

    public constructor(
        @Self() private readonly changeDetectorRef: ChangeDetectorRef,
        @Inject(ERROR_INTERCEPTORS)
        @Optional()
        private readonly errorInterceptorsList:
            | readonly ErrorInterceptor[]
            | undefined,
        @Inject(FORM_CONTAINER) private readonly formContainer: FormContainer,
        @Inject(FormGroup)
        @Optional()
        private readonly formGroup: FormGroup | undefined
    ) {}

    public async onSubmit(event: Event): Promise<void> {
        event.preventDefault();
        event.cancelBubble = true;

        try {
            const result: Promise<void> | Observable<void> | void =
                this.formContainer.submit();

            if (result instanceof Promise) {
                await result;
            } else if (result instanceof Observable) {
                await result.toPromise();
            }

            this._error = noError;
        } catch (e) {
            this.handleError(e);
        } finally {
            this.changeDetectorRef.markForCheck();
        }
    }

    private handleError(error: unknown): void {
        let modifiedError: unknown = error;

        if (Array.isArray(this.errorInterceptorsList)) {
            for (const errorInterceptor of this.errorInterceptorsList) {
                modifiedError = errorInterceptor.handle(modifiedError);
            }
        }

        if (
            this.formGroup &&
            modifiedError instanceof FormError &&
            modifiedError.controlErrors
        ) {
            const entries: readonly (readonly [
                string,
                ValidationErrors | null
            ])[] = Object.entries(
                modifiedError.controlErrors as Record<
                    string,
                    ValidationErrors | null
                >
            );

            for (const [key, value] of entries) {
                if (key in this.formGroup.controls) {
                    this.formGroup.controls[key].setErrors(value);
                }
            }

            this._error = modifiedError.generalError;
        } else {
            this._error = modifiedError;
        }
    }
}
