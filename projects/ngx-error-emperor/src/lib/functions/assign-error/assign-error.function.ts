import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

import {ErrorContext} from '../../classes/error-context/error-context.class';
import {AssignedError} from '../../classes/assigned-error/assigned-error.class';

export function assignError<T>(
    errorContext: ErrorContext
): <E>(source$: Observable<E>) => Observable<E> {
    return <E>(source$: Observable<E>): Observable<E> => {
        return source$.pipe(
            catchError((error: unknown): Observable<never> => {
                return throwError(new AssignedError(error, errorContext));
            })
        );
    };
}
