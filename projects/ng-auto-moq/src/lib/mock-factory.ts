import { IMock, Mock } from "moq.ts";
import { IParameter } from "./types";

export type DefaultMockFactory = typeof mockFactory;

export function mockFactory(parameter: IParameter): IMock<any> {
    return new Mock<any>({name: parameter.displayName});
}
