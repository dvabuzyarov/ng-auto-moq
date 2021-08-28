/*eslint-disable max-classes-per-file*/
import { Injectable, InjectionToken, Injector, Optional, Type } from "@angular/core";
import { resolveMock } from "./resolveMock";
import { It } from "moq.ts";
import { IParameter } from "./types";
import { moqInjectorProvidersFactory } from "./index";
import { ProviderFactory } from "./provider-factory";

@Injectable()
export class ValueService {
    getValue(options: { value: number }) {
        return options.value * 10;
    }
}

@Injectable()
export class MasterService {
    constructor(private valueService: ValueService) {
    }

    getValue(value: number) {
        return this.valueService.getValue({value});
    }
}

@Injectable()
export class MasterServiceWithOptionalDependency {
    constructor(@Optional() private valueService: ValueService) {
    }

    getValue(value: number) {
        return this.valueService === null ? -1000 : value;
    }
}

describe("Integration test", () => {
    it("Returns provided value", () => {
        const moqInjectorProviders = moqInjectorProvidersFactory();
        const providers = moqInjectorProviders(MasterService);
        const injector = Injector.create({providers});

        resolveMock(ValueService, injector)
            // the options object should be compared with deep equal logic or any other custom logic
            // the default comparision would not work since for objects it uses reference comparing
            .setup(instance => instance.getValue(It.Is(opt => expect(opt).toEqual({value: 1}))))
            .returns(-1);

        // action section
        const tested = injector.get(MasterService);
        const actual = tested.getValue(1);

        expect(actual).toBe(-1);
    });

    it("Returns provided value with ignored optional", () => {
        const providerFactoryToken = new InjectionToken("ProviderFactory");
        const providerResolver = (defaultProviderResolver) => (parameter: IParameter, mocked: Type<any>) => {
                if (parameter.optional === true) {
                    return undefined;
                }
                return defaultProviderResolver(parameter, mocked);
            };

        const moqInjectorProviders = moqInjectorProvidersFactory({
            providers: [
                {provide: providerFactoryToken, useClass: ProviderFactory, deps: []},
                {provide: ProviderFactory, useFactory: providerResolver, deps: [providerFactoryToken]},
            ]
        });
        const providers = moqInjectorProviders(MasterServiceWithOptionalDependency);
        const injector = Injector.create({providers});

        const tested = injector.get(MasterServiceWithOptionalDependency);
        const actual = tested.getValue(1);

        expect(actual).toBe(-1000);
    });
})
;
