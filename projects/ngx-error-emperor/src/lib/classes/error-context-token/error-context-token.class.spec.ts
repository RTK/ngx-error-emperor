import {ErrorContextToken} from './error-context-token.class';

describe('ErrorContextToken', (): void => {
    let errorContextToken: ErrorContextToken<boolean>;

    beforeEach((): void => {
        errorContextToken = new ErrorContextToken((): boolean => {
            return false;
        });
    });

    it('should create', (): void => {
        expect(errorContextToken).toBeTruthy();
    });
});
