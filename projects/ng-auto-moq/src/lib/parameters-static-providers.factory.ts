import { IParameter, MockFactory, OnlyStaticProvider, ProviderFactory } from "./types";
import { providerFactory } from "./provider-factory";
import { mockFactory } from "./mock-factory";

export function* parametersStaticProviders<T>(
    parameters: IParameter [],
    _providerResolver: ProviderFactory = providerFactory,
    _mockFactory: MockFactory = mockFactory): IterableIterator<OnlyStaticProvider> {

    for (const parameter of parameters) {
        const mock = _mockFactory(parameter, mockFactory);
        const staticProvider = _providerResolver(parameter, mock.object(), providerFactory);
        if (staticProvider !== undefined) {
            yield staticProvider;
        }
    }
}
