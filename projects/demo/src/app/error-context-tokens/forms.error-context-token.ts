import {ErrorContextToken} from '@rtk/ngx-error-emperor';

export const formsErrorContextToken: ErrorContextToken<boolean> =
    new ErrorContextToken((): false => {
        return false;
    });
