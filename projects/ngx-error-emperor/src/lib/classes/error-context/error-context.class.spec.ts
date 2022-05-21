import {ErrorContext} from './error-context.class';

import {ErrorContextToken} from '../error-context-token/error-context-token.class';

describe('ErrorContext', (): void => {
    let errorContext: ErrorContext;

    beforeEach((): void => {
        errorContext = new ErrorContext();
    });

    it('should create', (): void => {
        expect(errorContext).toBeTruthy();
    });

    describe('delete()', (): void => {
        it('should return the error context', (): void => {
            expect(
                errorContext.delete(
                    new ErrorContextToken<void>(() => {
                        return void 0;
                    })
                )
            ).toBe(errorContext);
        });

        it('should remove the provided token from the store', (): void => {
            const token: ErrorContextToken<string> = new ErrorContextToken(
                (): string => {
                    return 'test';
                }
            );

            errorContext.set(token, '123');
            expect(errorContext.has(token)).toBe(true);

            errorContext.delete(token);
            expect(errorContext.has(token)).toBe(false);
        });
    });

    describe('get()', (): void => {
        it('should return the value that has been associated with the token on provision', (): void => {
            const value: string = '321';

            const token: ErrorContextToken<string> = new ErrorContextToken(
                (): string => {
                    return 'test';
                }
            );

            errorContext.set(token, value);
            expect(errorContext.get(token)).toBe(value);
        });

        it('should return the tokens default value when no token has been stored yet', (): void => {
            const value: string = 'test';

            const token: ErrorContextToken<string> = new ErrorContextToken(
                (): string => {
                    return value;
                }
            );

            expect(errorContext.get(token)).toBe(value);
        });
    });

    describe('has()', (): void => {
        it('should return true if a token as been stored, otherwise false', (): void => {
            const token: ErrorContextToken<string> = new ErrorContextToken(
                (): string => {
                    return 'test';
                }
            );

            expect(errorContext.has(token)).toBe(false);

            errorContext.set(token, '123');
            expect(errorContext.has(token)).toBe(true);
        });
    });

    describe('keys()', (): void => {
        it('should return an iterable of all stored tokens', (): void => {
            const token1: ErrorContextToken<string> = new ErrorContextToken(
                (): string => {
                    return 'test';
                }
            );
            const token2: ErrorContextToken<string> = new ErrorContextToken(
                (): string => {
                    return '123';
                }
            );

            errorContext.set(token1, 'test');
            errorContext.set(token2, '123');

            expect(Array.from(errorContext.keys())).toEqual([token1, token2]);
        });
    });

    describe('set()', (): void => {
        it('should associate a token with a value in the store', (): void => {
            const value: string = '123';

            const token: ErrorContextToken<string> = new ErrorContextToken(
                (): string => {
                    return 'test';
                }
            );

            expect(errorContext.has(token)).toBe(false);

            errorContext.set(token, value);
            expect(errorContext.has(token)).toBe(true);
            expect(errorContext.get(token)).toBe(value);
        });
    });
});
