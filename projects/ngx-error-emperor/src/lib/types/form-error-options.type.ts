import type {ValidationErrors} from '@angular/forms';

export interface FormErrorOptions {
    readonly originalError: unknown;

    readonly controlErrors?: Readonly<Record<string, ValidationErrors | null>>;
    readonly generalError?: unknown;
}
