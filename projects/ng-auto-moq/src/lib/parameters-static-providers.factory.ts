import { StaticProvider } from "@angular/core";
import { IParameter, MockFactory, ProviderResolver } from "./types";
import { providerResolver } from "./provider-resolver";
import { mockFactory } from "./mock-factory";

export function* parametersStaticProviders<T>(
    parameters: IParameter [],
    _providerResolver: ProviderResolver = providerResolver,
    _mockFactory: MockFactory = mockFactory): IterableIterator<StaticProvider> {

    for (const parameter of parameters) {
        const mock = _mockFactory(parameter, mockFactory);
        const staticProvider = _providerResolver(parameter, mock.object(), providerResolver);
        if (staticProvider !== undefined) {
            yield staticProvider;
        }
    }
}
