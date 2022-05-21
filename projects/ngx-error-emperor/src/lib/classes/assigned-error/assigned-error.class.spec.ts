import {AssignedError} from './assigned-error.class';

import {ErrorContext} from '../error-context/error-context.class';

describe('AssignedError', (): void => {
    let assignedError: AssignedError;

    beforeEach((): void => {
        assignedError = new AssignedError('test', new ErrorContext());
    });

    it('should create', (): void => {
        expect(assignedError).toBeTruthy();
    });
});
