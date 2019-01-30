import { IParameter } from "./types";
import { StaticProvider } from "@angular/core";

export type DefaultProviderResolver = typeof providerResolver;

export function providerResolver(parameter: IParameter, mocked: any): StaticProvider | undefined {
    return {provide: parameter.token, useValue: mocked};
}
