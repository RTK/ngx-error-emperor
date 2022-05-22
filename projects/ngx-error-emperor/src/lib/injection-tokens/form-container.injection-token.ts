import {InjectionToken} from '@angular/core';

import type {FormContainer} from '../types/form-container.type';

export const FORM_CONTAINER: InjectionToken<FormContainer> = new InjectionToken(
    'FORM_CONTAINER'
);
