import {Component, forwardRef, Type} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {FORM_CONTAINER, FormContainer} from '@rtk/ngx-error-emperor';

import type {Observable} from 'rxjs';

import {HttpService} from '../../services/http.service';

@Component({
    selector: 'app-custom-form',
    templateUrl: './custom-form.component.html',
    styleUrls: ['./custom-form.component.scss'],
    viewProviders: [
        {
            provide: FORM_CONTAINER,
            useExisting: CustomFormComponent
        }
    ]
})
export class CustomFormComponent implements FormContainer {
    public readonly form: FormGroup = this.formBuilder.group({
        firstname: [null, [Validators.required]],
        lastname: [null, [Validators.required]],
        email: [null, [Validators.required, Validators.email]]
    });

    public constructor(
        private readonly formBuilder: FormBuilder,
        private readonly httpService: HttpService
    ) {}

    public submit(): void | Promise<void> | Observable<void> {
        return this.httpService.register(this.form.value);
    }
}
