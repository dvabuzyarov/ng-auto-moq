import { moqInjectorProvidersFactory } from "./moq-injector-providers.factory";

/**
 * Provides the service-to-test and its (moq) dependencies
 */
export const moqInjectorProviders = moqInjectorProvidersFactory();
