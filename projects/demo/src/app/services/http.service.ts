import {HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {assignError, ErrorContext} from '@rtk/ngx-error-emperor';

import {Observable, throwError} from 'rxjs';

import {formsErrorContextToken} from '../error-context-tokens/forms.error-context-token';
import {readableErrorContextToken} from '../error-context-tokens/readable.error-context-token';

@Injectable({
    providedIn: 'root'
})
export class HttpService {
    public register(data: {
        readonly firstname: string;
        readonly lastname: string;
        readonly email: string;
    }): Observable<void | never> {
        if (
            data.firstname !== 'Bob' ||
            data.lastname === 'Bob' ||
            data.email !== '123@123'
        ) {
            return throwError(
                new HttpErrorResponse({
                    error: {
                        message: 'Provided data is invalid!',
                        data: {
                            firstname: 'Must be Bob!',
                            lastname: 'Must be not Bob!',
                            email: 'Is not good enough!'
                        }
                    },
                    status: 400,
                    url: 'never',
                    statusText: 'broken!'
                })
            ).pipe(
                assignError(
                    new ErrorContext().set(formsErrorContextToken, true)
                )
            );
        }

        return throwError(
            new HttpErrorResponse({
                error: {
                    message: 'Something went wrong!'
                },
                status: 500
            })
        ).pipe(
            assignError(new ErrorContext().set(readableErrorContextToken, true))
        );
    }
}
