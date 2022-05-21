import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {assignError, ErrorContext} from '@rtk/ngx-error-emperor';

import {Observable} from 'rxjs';

import {HttpErrorContextToken} from '../values/http-error.value';

@Injectable({
    providedIn: 'root'
})
export class HttpService {
    public constructor(private readonly httpClient: HttpClient) {}

    public getAll(): Observable<void> {
        return this.httpClient
            .get<void>('/test')
            .pipe(
                assignError(new ErrorContext().set(HttpErrorContextToken, true))
            );
    }
}
