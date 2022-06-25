/**
 * A context token to be stored in an ErrorContext instance.
 *
 * Can hold any value.
 */
export class ErrorContextToken<T> {
    public constructor(public readonly defaultValue: () => T) {}
}
