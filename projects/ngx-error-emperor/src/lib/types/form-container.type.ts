import type {Observable} from 'rxjs';

/**
 * Interface for classes that service as a container for ngx-ee-form components.
 */
export interface FormContainer {
    submit(): Promise<void> | Observable<void> | void;
}
