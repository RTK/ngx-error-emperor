export interface ErrorInterceptor {
    handle(error: unknown): unknown;
}
