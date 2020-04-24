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
import { DefaultProviderResolver } from "./provider-resolver";

export type MockFactory = (parameter: IParameter, defaultMockFactory: DefaultMockFactory) => IMock<any>;

export declare type OnlyStaticProvider = ValueProvider | ExistingProvider | StaticClassProvider | ConstructorProvider | FactoryProvider;

export type ProviderResolver = (parameter: IParameter, mocked: any, defaultProviderResolver: DefaultProviderResolver) => OnlyStaticProvider;

export interface IOptions<T> {
    providerResolver?: ProviderResolver;
    mockFactory?: MockFactory;
    /**
     * When true the static provider for the tested unit will be skipped.
     * Only providers for the moq dependencies will be returned.
     */
    skipSelf?: boolean;
}

export type MoqInjectorProviders = <T>(type: Type<T>, options?: IOptions<any>) => StaticProvider[];

export const enum Visibility {
    None,
    Self,
    SkipSelf
}

/**
 * Reflects a dependency metadata.
 */
export interface IParameter {
    displayName: string;
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
