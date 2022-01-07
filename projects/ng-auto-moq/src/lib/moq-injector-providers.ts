import { Inject, StaticProvider, Type } from "@angular/core";
import { Reflector } from "./reflector";
import { TestedUnitProviderFactory } from "./tested-unit-provider.factory";
import { ParametersStaticProviderFactory } from "./parameters-static-providers.factory";
import { IOptions } from "./types";
import { DepsFactory } from "./deps-factory";
import { InjectionFactory, TypeofInjectionFactory } from "@testdozer/ng-injector-types";


export class MoqInjectorProviders implements InjectionFactory {
    constructor(
        @Inject(Reflector)
        private readonly reflector: TypeofInjectionFactory<Reflector>,
        @Inject(TestedUnitProviderFactory)
        private readonly testedUnitProviderFactory: TypeofInjectionFactory<TestedUnitProviderFactory>,
        @Inject(DepsFactory)
        private readonly depsFactory: TypeofInjectionFactory<DepsFactory>,
        @Inject(ParametersStaticProviderFactory)
        private readonly parametersStaticProviderFactory: TypeofInjectionFactory<ParametersStaticProviderFactory>) {
        return this.factory() as any;
    }

    factory() {
        return <T>(type: Type<T>, options: IOptions = {skipSelf: false, skipOptional: false}): StaticProvider[] => {
            const parameters = this.reflector(type);
            const provider = this.testedUnitProviderFactory(type, this.depsFactory(parameters));
            const onlyRequiredParameters = options.skipOptional
                ? parameters.filter(({optional}) => optional === false)
                : parameters;
            const providers = Array.from(this.parametersStaticProviderFactory(onlyRequiredParameters));
            return options?.skipSelf ? providers : [provider, ...providers];
        };
    }

}
