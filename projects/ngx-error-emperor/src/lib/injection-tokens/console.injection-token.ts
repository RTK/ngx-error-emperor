import {InjectionToken} from '@angular/core';

export const CONSOLE: InjectionToken<Console> = new InjectionToken('Console', {
    providedIn: 'any',
    factory(): Console {
        return globalThis.console;
    }
});
