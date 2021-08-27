import { Inject } from "@angular/core";
import { IParameter, OnlyStaticProvider } from "./types";
import { ProviderFactory } from "./provider-factory";
import { InjectionFactory, TypeofInjectionFactory } from "@testdozer/ng-injector-types";
import { MockFactory } from "./mock-factory";

export class ParametersStaticProviderFactory implements InjectionFactory {
    constructor(
        @Inject(ProviderFactory)
        private readonly providerFactory: TypeofInjectionFactory<ProviderFactory>,
        @Inject(MockFactory)
        private readonly mockFactory: TypeofInjectionFactory<MockFactory>) {
        return this.factory() as any;
    }

    factory() {
        return <T>(parameters: IParameter []): OnlyStaticProvider[] => {
            const providers: OnlyStaticProvider[] = [];
            for (const parameter of parameters) {
                const mock = this.mockFactory(parameter);
                const staticProvider = this.providerFactory(parameter, mock.object());
                if (staticProvider !== undefined) {
                    providers.push(staticProvider);
                }
            }

            return providers;
        };
    }
}
