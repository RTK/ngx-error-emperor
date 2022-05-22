import {ErrorHandler, Inject, Injectable} from '@angular/core';

import {AssignedError} from '../../classes/assigned-error/assigned-error.class';
import {CONSOLE} from '../../injection-tokens/console.injection-token';

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
