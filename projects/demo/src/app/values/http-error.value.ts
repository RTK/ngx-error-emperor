import {ErrorContextToken} from '@rtk/ngx-error-emperor';

export const HttpErrorContextToken: ErrorContextToken<boolean> =
    new ErrorContextToken((): false => {
        return false;
    });
