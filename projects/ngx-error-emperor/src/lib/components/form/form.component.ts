import {
    ChangeDetectorRef,
    Component,
    forwardRef,
    Inject,
    Input,
    Optional,
    Self
} from '@angular/core';
import {FormGroup, ValidationErrors} from '@angular/forms';

import {Observable} from 'rxjs';

import {FormError} from '../../classes/form-error/form-error.class';
import {FORM_CONTAINER} from '../../injection-tokens/form-container.injection-token';
import {ErrorResolver} from '../../services/error-resolver/error.resolver';
import {FormContainer} from '../../types/form-container.type';
import {noError} from '../../values/no-error.value';

@Component({
    selector: 'ngx-ee-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.css']
})
export class FormComponent {
    @Input()
    public formGroup?: FormGroup;

    public get hasError(): boolean {
        return this._error !== noError;
    }

    public get error(): unknown | symbol {
        return this._error;
    }

    protected get relevantFormGroup(): FormGroup | undefined {
        return this.formGroup ?? this.formGroupParent;
    }

    private _error: unknown = noError;

    public constructor(
        @Self() private readonly changeDetectorRef: ChangeDetectorRef,
        private readonly errorResolver: ErrorResolver,
        @Inject(FORM_CONTAINER) private readonly formContainer: FormContainer,
        @Inject(forwardRef(() => FormGroup))
        @Optional()
        private readonly formGroupParent: FormGroup | undefined
    ) {}

    public async submit(event: Event): Promise<void> {
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
        } catch (e: unknown) {
            this.handleError(e);
        } finally {
            this.changeDetectorRef.markForCheck();
        }
    }

    private handleError(error: unknown): void {
        const resolvedError: unknown =
            this.errorResolver.resolveError(error);

        if (this.relevantFormGroup && resolvedError instanceof FormError) {
            if ('controlErrors' in resolvedError) {
                const entries: readonly (readonly [
                    string,
                    ValidationErrors | null
                ])[] = Object.entries(
                    resolvedError.controlErrors as Record<
                        string,
                        ValidationErrors | null
                    >
                );

                for (const [key, value] of entries) {
                    if (key in this.relevantFormGroup.controls) {
                        this.relevantFormGroup.controls[key].setErrors(value);
                    }
                }
            }

            this._error = resolvedError.generalError;
        } else {
            throw error;
        }
    }
}
