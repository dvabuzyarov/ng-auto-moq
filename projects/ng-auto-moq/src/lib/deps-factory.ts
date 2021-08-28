import { Optional } from "@angular/core";
import { IParameter } from "./types";
import { InjectionFactory } from "@testdozer/ng-injector-types";

export class DepsFactory implements InjectionFactory {
    constructor() {
        return this.factory() as any;
    }

    factory() {
        return (parameters: IParameter[]): any[] => parameters
            .map(p => {
                if (p.optional === true) {
                    return [new Optional(), p.token];
                }
                return p.token;
            });
    }
}
