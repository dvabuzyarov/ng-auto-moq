import { StaticProvider, Type } from "@angular/core";
import { reflector } from "./reflector";
import { typeStaticProvider } from "./static-provider.factory";
import { parametersStaticProviders } from "./parameters-static-providers.factory";
import { IOptions, MoqInjectorProviders } from "./types";
import { depsFactory } from "./deps-factory";

export const moqInjectorProvidersFactory = (
    _reflector = reflector,
    _typeStaticProvider = typeStaticProvider,
    _parametersStaticProviders = parametersStaticProviders,
    _depsFactory = depsFactory): MoqInjectorProviders => <T>(type: Type<T>, options: IOptions<T> = {}): StaticProvider[] => {
        const parameters = _reflector(type);
        const provider = _typeStaticProvider(type, _depsFactory(parameters));
        const providers = Array.from(_parametersStaticProviders(parameters, options.providerFactory, options.mockFactory));
        return options.skipSelf ? providers : [provider, ...providers];
    };
