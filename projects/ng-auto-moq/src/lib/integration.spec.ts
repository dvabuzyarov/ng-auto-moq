import "reflect-metadata";
import { Injectable, Injector, Optional, Type } from "@angular/core";
import { moqInjectorProviders } from "./moq-injector-providers";
import { resolveMock } from "./resolveMock";
import { It } from "moq.ts";
import { IParameter } from "./types";
import { DefaultProviderFactory } from "./provider-factory";

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
        const providers = moqInjectorProviders(MasterService);
        const injector = Injector.create({providers});

        // setup section
        resolveMock(ValueService, injector)
            // the options object should be compared with deep equal logic or any other custom logic
            // the default comparision would not work since for objects it uses reference comparing
            .setup(instance => instance.getValue(It.Is(opt => expect(opt).toEqual({value: 1}))))
            .returns(-1);

        // action section
        const tested = injector.get(MasterService);
        const actual = tested.getValue(1);

        // assertion section
        expect(actual).toBe(-1);
    });

    it("Returns provided value with ignored optional", () => {
        // setup section
        const providerResolver = (parameter: IParameter, mocked: Type<any>, defaultProviderResolver: DefaultProviderFactory) => {
            if (parameter.optional === true) {
                return undefined;
            }
            return defaultProviderResolver(parameter, mocked);
        };

        const providers = moqInjectorProviders(MasterServiceWithOptionalDependency, {providerFactory: providerResolver});
        const injector = Injector.create({providers});

        // action section
        const tested = injector.get(MasterServiceWithOptionalDependency);
        const actual = tested.getValue(1);

        // assertion section
        expect(actual).toBe(-1000);
    });
});
