import {ErrorContextToken} from '@rtk/ngx-error-emperor';

export const readableErrorContextToken: ErrorContextToken<boolean> =
    new ErrorContextToken((): false => {
        return false;
    });
