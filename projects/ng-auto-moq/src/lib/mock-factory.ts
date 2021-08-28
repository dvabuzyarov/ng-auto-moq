import { IMock, Mock } from "moq.ts";
import { IParameter } from "./types";
import { InjectionFactory } from "@testdozer/ng-injector-types";

export class MockFactory implements InjectionFactory {
    constructor() {
        return this.factory() as any;
    }

    factory() {
        return (parameter: IParameter): IMock<any> => new Mock<any>({name: parameter.displayName});
    }
}
