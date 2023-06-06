import { InjectionToken, Injector, Type } from "@angular/core";
import { IMock, MoqAPI } from "moq.ts";

/**
 * Gets an instance of IMock interface for mocked object according to provided token.
 * Injector should be built with {@link moqInjectorProvidersFactory}.
 *
 * @param token angular token
 * @param injector angular injector
 */
export const resolveMock = <T>(token: Type<T> | InjectionToken<T>, injector: Injector): IMock<T> => {
    const object = injector.get(token) as unknown;
    return object[MoqAPI] as IMock<T>;
};
