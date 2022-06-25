import type {ValidationErrors} from '@angular/forms';

/**
 * Options for FormError instances.
 */
export interface FormErrorOptions {
    readonly originalError: unknown;

    readonly controlErrors?: Readonly<Record<string, ValidationErrors | null>>;
    readonly generalError?: unknown;
}
