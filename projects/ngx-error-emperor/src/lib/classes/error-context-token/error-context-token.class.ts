export class ErrorContextToken<T> {
    public constructor(public readonly defaultValue: () => T) {}
}
