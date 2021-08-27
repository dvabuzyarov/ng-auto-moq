import { IParameter, OnlyStaticProvider } from "./types";
import { InjectionFactory } from "@testdozer/ng-injector-types";

export class ProviderFactory implements InjectionFactory {
    constructor() {
        return this.factory() as any;
    }

    factory() {
        return (parameter: IParameter, mocked: any): OnlyStaticProvider | undefined =>
            ({provide: parameter.token, useValue: mocked});
    }
}
