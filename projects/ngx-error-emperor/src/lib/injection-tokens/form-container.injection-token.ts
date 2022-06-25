import {InjectionToken} from '@angular/core';

import type {FormContainer} from '../types/form-container.type';

/**
 * Should provide a class that implements the [FormContainer] interface.
 */
export const FORM_CONTAINER: InjectionToken<FormContainer> = new InjectionToken(
    'FORM_CONTAINER'
);
