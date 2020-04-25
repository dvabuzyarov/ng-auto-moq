import { IParameter, OnlyStaticProvider } from "./types";

export type DefaultProviderFactory = typeof providerFactory;

export function providerFactory(parameter: IParameter, mocked: any): OnlyStaticProvider | undefined {
    return {provide: parameter.token, useValue: mocked};
}
