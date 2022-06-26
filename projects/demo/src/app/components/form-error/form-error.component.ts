import {Component, Inject, Input, Optional} from '@angular/core';
import {FormGroupDirective, ValidationErrors} from '@angular/forms';

@Component({
    selector: 'app-form-error',
    templateUrl: './form-error.component.html',
    styleUrls: ['./form-error.component.scss']
})
export class FormErrorComponent {
    @Input()
    public controlName?: string;

    public get error(): ValidationErrors | null | undefined {
        return this.controlName
            ? this.formGroupDirective.form.controls[this.controlName].errors
            : void 0;
    }

    public get isHidden(): boolean {
        return this.controlName
            ? this.formGroupDirective.form.controls[this.controlName].valid
            : true;
    }

    public constructor(
        @Inject(FormGroupDirective)
        @Optional()
        private readonly formGroupDirective: FormGroupDirective
    ) {}
}
