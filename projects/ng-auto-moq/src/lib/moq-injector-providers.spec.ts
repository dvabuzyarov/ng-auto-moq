import { InjectionToken } from "@angular/core";
import { createMoqInjector, resolve, resolveMock } from "../tests.components/createMoqInjector";
import { MoqInjectorProviders } from "./moq-injector-providers";
import { Reflector } from "./reflector";
import { DepsFactory } from "./deps-factory";
import { TestedUnitProviderFactory } from "./tested-unit-provider.factory";
import { ParametersStaticProviderFactory } from "./parameters-static-providers.factory";

class TestedUnit {
}

describe("Moq injector providers", () => {
    beforeEach(() => {
        createMoqInjector(MoqInjectorProviders);
    });
    it("Returns a single static provider for a component without dependencies", () => {
        const parameters = [];
        const dependencies = [];

        resolveMock(Reflector)
            .setup(instance => instance(TestedUnit))
            .returns(parameters);
        resolveMock(DepsFactory)
            .setup(instance => instance(parameters))
            .returns(dependencies);
        resolveMock(TestedUnitProviderFactory)
            .setup(instance => instance(TestedUnit, dependencies))
            .returns({provide: TestedUnit, useClass: TestedUnit, deps: []});
        resolveMock(ParametersStaticProviderFactory)
            .setup(instance => instance(parameters))
            .returns([]);

        const provider = resolve(MoqInjectorProviders);
        const actual = provider(TestedUnit);

        expect(actual).toEqual([{provide: TestedUnit, useClass: TestedUnit, deps: []}]);
    });

    it("Returns empty array for a component without dependencies when skipSelf option is true", () => {

        const parameters = [];
        const dependencies = [];

        resolveMock(Reflector)
            .setup(instance => instance(TestedUnit))
            .returns(parameters);
        resolveMock(DepsFactory)
            .setup(instance => instance(parameters))
            .returns(dependencies);
        resolveMock(TestedUnitProviderFactory)
            .setup(instance => instance(TestedUnit, dependencies))
            .returns({provide: TestedUnit, useClass: TestedUnit, deps: []});
        resolveMock(ParametersStaticProviderFactory)
            .setup(instance => instance(parameters))
            .returns([]);

        const provider = resolve(MoqInjectorProviders);
        const actual = provider(TestedUnit, {skipSelf: true});

        expect(actual).toEqual([]);
    });

    it("Returns static providers for the tested unit and its dependencies", () => {
        const parameters = [];
        const dependencies = [];
        const testedUnitProvider = {provide: TestedUnit, useClass: TestedUnit, deps: []};
        const dependencyProvider = {provide: new InjectionToken("a"), useValue: undefined, deps: []};

        resolveMock(Reflector)
            .setup(instance => instance(TestedUnit))
            .returns(parameters);
        resolveMock(DepsFactory)
            .setup(instance => instance(parameters))
            .returns(dependencies);
        resolveMock(TestedUnitProviderFactory)
            .setup(instance => instance(TestedUnit, dependencies))
            .returns(testedUnitProvider);
        resolveMock(ParametersStaticProviderFactory)
            .setup(instance => instance(parameters))
            .returns([dependencyProvider]);

        const provider = resolve(MoqInjectorProviders);
        const actual = provider(TestedUnit);


        const expected = [
            testedUnitProvider,
            dependencyProvider
        ];

        expect(actual).toEqual(expected);
    });
});
