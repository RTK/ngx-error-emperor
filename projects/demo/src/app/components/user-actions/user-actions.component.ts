import {Component} from '@angular/core';

import {AssignedError, ErrorContext} from '@rtk/ngx-error-emperor';

import {readableErrorContextToken} from '../../error-context-tokens/readable.error-context-token';
import {Observable, throwError} from 'rxjs';

@Component({
    selector: 'app-user-actions',
    templateUrl: './user-actions.component.html',
    styleUrls: ['./user-actions.component.scss']
})
export class UserActionsComponent {
    public async onDo1(): Promise<void | never> {
        throw new AssignedError(
            'Oh no 1!',
            new ErrorContext().set(readableErrorContextToken, true)
        );
    }

    public onDo2(): void {
        throwError((): AssignedError => {
            return new AssignedError(
                'Oh no 2!',
                new ErrorContext().set(readableErrorContextToken, true)
            );
        }).subscribe();
    }
}
