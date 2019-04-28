import { InjectionToken, Injector, Type } from "@angular/core";
import { IMock } from "moq.ts";
import { IMockedObject } from "./types";

/**
 * Gets an instance of IMock interface for mocked object according to provided token.
 * Injector should be built with {@link moqInjectorProviders}.
 * @param token angular token
 * @param injector angular injector
 */
export function resolveMock<T>(token: Type<T> | InjectionToken<T> | T, injector: Injector): IMock<T> {
    const object = injector.get(token) as unknown;
    return (object as IMockedObject<T>).__mock;
}
