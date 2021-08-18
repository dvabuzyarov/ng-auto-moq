import {
    ConstructorProvider,
    ExistingProvider,
    FactoryProvider,
    InjectionToken,
    StaticClassProvider,
    StaticProvider,
    Type,
    ValueProvider
} from "@angular/core";
import { IMock } from "moq.ts";
import { DefaultMockFactory } from "./mock-factory";
import { DefaultProviderFactory } from "./provider-factory";

export type MockFactory = (parameter: IParameter, defaultMockFactory: DefaultMockFactory) => IMock<any>;

export declare type OnlyStaticProvider = ValueProvider | ExistingProvider | StaticClassProvider | ConstructorProvider | FactoryProvider;

export type ProviderFactory = (parameter: IParameter, mocked: any, defaultProviderResolver: DefaultProviderFactory) => OnlyStaticProvider;

export interface IOptions<T> {
    /**
     * Creates one of angular Provider for provided dependency and constructed mock
     */
    providerFactory?: ProviderFactory;
    /**
     * Constructs a mock object for provided dependency
     */
    mockFactory?: MockFactory;
    /**
     * When true the static provider for the tested unit will be skipped.
     * Only providers for the moq dependencies will be returned.
     */
    skipSelf?: boolean;
}

export type MoqInjectorProviders = <T>(type: Type<T>, options?: IOptions<any>) => StaticProvider[];

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
