import {
    ConstructorProvider,
    ExistingProvider,
    FactoryProvider,
    InjectionToken,
    StaticClassProvider,
    Type,
    ValueProvider
} from "@angular/core";

export declare type OnlyStaticProvider = ValueProvider | ExistingProvider | StaticClassProvider | ConstructorProvider | FactoryProvider;

export interface IOptions {
    /**
     * When true the static provider for the tested unit will be skipped.
     * Only providers for the moq dependencies will be returned.
     */
    skipSelf?: boolean;
}


/*eslint-disable @typescript-eslint/naming-convention, no-shadow*/
export const enum Visibility {
    None,
    Self,
    SkipSelf
}

/*eslint-enable @typescript-eslint/naming-convention, no-shadow*/

/**
 * Reflects a dependency metadata.
 */
export interface IParameter {
    /**
     * Dependency token name
     */
    displayName: string;
    /**
     * Dependency token
     */
    token: Type<any> | InjectionToken<any>;
    /**
     * If marked with @Optional()
     */
    optional: boolean;
    /**
     * If marked with @Self() or @SkipSelf()
     */
    visibility: Visibility;
}
