import "reflect-metadata";
import { Injectable, Injector } from "@angular/core";
import { moqInjectorProviders } from "./moq-injector-providers";
import { resolveMock } from "./resolveMock";
import { It } from "moq.ts";

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

describe("Integration test", () => {
    let injector: Injector;

    beforeEach(() => {
        const providers = moqInjectorProviders(MasterService);
        injector = Injector.create({providers});
    });

    it("Returns provided value", () => {
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
});
