import { Injector } from "@angular/core";
import { Reflector } from "./reflector";
import { MoqInjectorProviders } from "./moq-injector-providers";
import { TypeofInjectionFactory } from "@testdozer/ng-injector-types";
import { TestedUnitProviderFactory } from "./tested-unit-provider.factory";
import { DepsFactory } from "./deps-factory";
import { ParametersStaticProviderFactory } from "./parameters-static-providers.factory";
import { ProviderFactory } from "./provider-factory";
import { MockFactory } from "./mock-factory";
import { OnlyStaticProvider } from "./types";
import { TokenNameProvider } from "./token-name.provider";

/**
 * Provides the service-to-test and its (moq) dependencies
 */
export const moqInjectorProvidersFactory = (options: { providers?: OnlyStaticProvider[] } = {}) => {
    const injector = Injector.create({
        providers: [
            {
                provide: MoqInjectorProviders,
                useClass: MoqInjectorProviders,
                deps: [Reflector, TestedUnitProviderFactory, DepsFactory, ParametersStaticProviderFactory]
            },
            {provide: TestedUnitProviderFactory, useClass: TestedUnitProviderFactory, deps: []},
            {provide: DepsFactory, useClass: DepsFactory, deps: []},
            {provide: ProviderFactory, useClass: ProviderFactory, deps: []},
            {provide: ParametersStaticProviderFactory, useClass: ParametersStaticProviderFactory, deps: [ProviderFactory, MockFactory]},
            {provide: MockFactory, useClass: MockFactory, deps: []},
            {provide: Reflector, useClass: Reflector, deps: [TokenNameProvider]},
            {provide: TokenNameProvider, useClass: TokenNameProvider, deps: []},
            ...(options.providers || [])
        ]
    });
    return injector.get(MoqInjectorProviders) as unknown as TypeofInjectionFactory<MoqInjectorProviders>;
};
