import {Component} from '@angular/core';

import {AssignedError, ErrorContext} from '@rtk/ngx-error-emperor';

import {throwError} from 'rxjs';

import {readableErrorContextToken} from '../../error-context-tokens/readable.error-context-token';

@Component({
    selector: 'app-user-actions',
    templateUrl: './user-actions.component.html',
    styleUrls: ['./user-actions.component.scss']
})
export class UserActionsComponent {
    public onDo1(): void {
        throw new AssignedError(
            'Oh no 1!',
            new ErrorContext().set(readableErrorContextToken, true)
        );
    }

    public async onDo2(): Promise<void | never> {
        throw new AssignedError(
            'Oh no 2!',
            new ErrorContext().set(readableErrorContextToken, true)
        );
    }

    public onDo3(): void {
        throwError(
            new AssignedError(
                'Oh no 3!',
                new ErrorContext().set(readableErrorContextToken, true)
            )
        ).subscribe();
    }
}
