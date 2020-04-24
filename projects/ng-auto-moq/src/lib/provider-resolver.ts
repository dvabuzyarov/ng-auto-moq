import { IParameter, OnlyStaticProvider } from "./types";

export type DefaultProviderResolver = typeof providerResolver;

export function providerResolver(parameter: IParameter, mocked: any): OnlyStaticProvider | undefined {
    return {provide: parameter.token, useValue: mocked};
}
