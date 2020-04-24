import { StaticProvider, Type } from "@angular/core";
import { reflector } from "./reflector";
import { typeStaticProvider } from "./static-provider.factory";
import { parametersStaticProviders } from "./parameters-static-providers.factory";
import { IOptions, MoqInjectorProviders } from "./types";

export function moqInjectorProvidersFactory(
    _reflector: typeof reflector = reflector,
    _typeStaticProvider: typeof typeStaticProvider = typeStaticProvider,
    _parametersStaticProviders: typeof parametersStaticProviders = parametersStaticProviders): MoqInjectorProviders {
    return <T>(type: Type<T>, options: IOptions<T> = {}): StaticProvider[] => {
        const parameters = _reflector(type);
        const providers = Array.from(_parametersStaticProviders(parameters, options.providerResolver, options.mockFactory));
        const provider = _typeStaticProvider(type, providers.map(p => p.provide));
        return options.skipSelf ? providers : [provider, ...providers];
    };
}
