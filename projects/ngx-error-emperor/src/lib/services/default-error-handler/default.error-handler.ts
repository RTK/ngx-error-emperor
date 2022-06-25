import {ErrorHandler, Inject, Injectable} from '@angular/core';

import {AssignedError} from '../../classes/assigned-error/assigned-error.class';
import {CONSOLE} from '../../injection-tokens/console.injection-token';

/**
 * Default error handler if not overwritten.
 *
 * Logs any error to the console.
 *
 * If it is an [AssignedError] instance, the original error will be logged.
 */
@Injectable()
export class DefaultErrorHandler implements ErrorHandler {
    public constructor(@Inject(CONSOLE) private readonly console: Console) {}

    public handleError(error: unknown): void {
        if (error instanceof AssignedError) {
            this.handleDefault(error.error);
        } else {
            this.handleDefault(error);
        }
    }

    private handleDefault(error: unknown): void {
        this.console.error(error);
    }
}
