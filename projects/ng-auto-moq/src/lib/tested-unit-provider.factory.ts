import { StaticProvider, Type } from "@angular/core";
import { InjectionFactory } from "@testdozer/ng-injector-types/public_api";

export class TestedUnitProviderFactory implements InjectionFactory {
    constructor() {
        return this.factory() as any;
    }

    factory() {
        return <T>(type: Type<T>, dependencies: any []): StaticProvider => ({provide: type, useClass: type, deps: [...dependencies]});
    }
}
