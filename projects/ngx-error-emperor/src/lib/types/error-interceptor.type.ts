/**
 * Interface for error interceptors.
 *
 * In the handle function any error gets passed to be handled or to be "ignored". If you do not handle the error make
 * sure to return the original error as it is.
 */
export interface ErrorInterceptor {
    handle(error: unknown): unknown;
}
