import type {Observable} from 'rxjs';

export interface FormContainer {
    submit(): Promise<void> | Observable<void> | void;
}
