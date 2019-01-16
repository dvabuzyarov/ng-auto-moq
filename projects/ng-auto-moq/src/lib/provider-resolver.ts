import { IParameter } from "./types";
import { StaticProvider } from "@angular/core";

export function providerResolver<T>(parameter: IParameter, mocked: T): StaticProvider | undefined {
    return {provide: parameter.token, useValue: mocked};
}
