import { StaticProvider } from "@angular/core";
import { IParameter, MockFactory, ProviderResolver } from "./types";
import { providerResolver} from "./provider-resolver";
import { mockFactory} from "./mock-factory";

export function* parametersStaticProviders<T>(
    parameters: IParameter [],
    _providerResolver: ProviderResolver<T> = providerResolver,
    _mockFactory: MockFactory<T> = mockFactory): IterableIterator<StaticProvider> {

    for (const parameter of parameters) {
        const mock = _mockFactory(parameter.displayName, mockFactory);
        const staticProvider = _providerResolver(parameter, mock.object(), providerResolver);
        if (staticProvider !== undefined) {
            yield staticProvider;
        }
    }
}
