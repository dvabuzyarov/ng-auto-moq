import { InjectionToken, StaticProvider, Type } from "@angular/core";
import { IMock } from "moq.ts";

export interface IMockedObject<T> {
    __mock: IMock<T>;
}

export type MockFactory = (displayName: string, defaultMockFactory: MockFactory) => IMock<any & IMockedObject<any>>;

export type ProviderResolver = (parameter: IParameter, mocked: any, defaultProviderResolver: ProviderResolver) => StaticProvider;

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
