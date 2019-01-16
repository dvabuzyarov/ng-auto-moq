import { InjectionToken, StaticProvider, Type } from "@angular/core";
import { IMock } from "moq.ts";

export interface IMockedObject<T> {
    __mock: IMock<T>;
}

export type MockFactory<T> = (displayName: string, defaultMockFactory: MockFactory<T>) => IMock<T & IMockedObject<T>>;

export type ProviderResolver<T> = (parameter: IParameter, mocked: T, defaultProviderResolver: ProviderResolver<T>) => StaticProvider;

export interface IOptions<T> {
    providerResolver?: ProviderResolver<T>;
    mockFactory?: MockFactory<T>;
}

export type MoqInjectorProviders = <T>(type: Type<T>, options?: IOptions<T>) => StaticProvider[];

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
