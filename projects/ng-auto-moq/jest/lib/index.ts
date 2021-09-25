import { moqInjectorProvidersFactory as original, OnlyStaticProvider, Reflector, TokenNameProvider } from "ng-auto-moq";
import { JestReflector } from "./jest.reflector";

/**
 * Provides the service-to-test and its (moq) dependencies
 */
export const moqInjectorProvidersFactory = (options: { providers?: OnlyStaticProvider[] } = {}) => original({
        providers: [
            {provide: Reflector, useClass: JestReflector, deps: [TokenNameProvider]},
            ...(options.providers || [])
        ]
    });
