import {ErrorContextToken} from '../error-context-token/error-context-token.class';

/**
 * Provides context for errors.
 *
 * Provides the same functionalities as Angular HttpContext class.
 */
export class ErrorContext {
    private readonly errorContextTokenMap: Map<
        ErrorContextToken<unknown>,
        unknown
    > = new Map();

    public delete(token: ErrorContextToken<unknown>): ErrorContext {
        this.errorContextTokenMap.delete(token);

        return this;
    }

    public get<T>(token: ErrorContextToken<T>): T {
        if (this.has(token)) {
            return this.errorContextTokenMap.get(token) as T;
        }

        return token.defaultValue();
    }

    public has(token: ErrorContextToken<unknown>): boolean {
        return this.errorContextTokenMap.has(token);
    }

    public keys(): IterableIterator<ErrorContextToken<unknown>> {
        return this.errorContextTokenMap.keys();
    }

    public set<T>(token: ErrorContextToken<T>, value: T): ErrorContext {
        this.errorContextTokenMap.set(token, value);

        return this;
    }
}
