import { IParameter, OnlyStaticProvider } from "./types";

export type DefaultProviderFactory = typeof providerFactory;

export const providerFactory = (parameter: IParameter, mocked: any): OnlyStaticProvider | undefined =>
    ({provide: parameter.token, useValue: mocked});
