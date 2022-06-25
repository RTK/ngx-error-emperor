import {InjectionToken} from '@angular/core';

/**
 * Provides the [console] object from globalThis (window).
 */
export const CONSOLE: InjectionToken<Console> = new InjectionToken('Console', {
    providedIn: 'any',
    factory(): Console {
        return globalThis.console;
    }
});
