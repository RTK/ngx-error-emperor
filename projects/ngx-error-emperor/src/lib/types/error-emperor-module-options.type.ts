/**
 * Options to configure the ErrorEmperorModule.
 */
export interface ErrorEmperorModuleOptions {
    readonly defaultErrorHandlers: {
        readonly unwrapPromises: boolean;
    };
}
