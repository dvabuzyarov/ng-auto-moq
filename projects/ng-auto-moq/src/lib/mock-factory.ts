import { IMock, Mock } from "moq.ts";
import { IMockedObject, IParameter } from "./types";

export type DefaultMockFactory = typeof mockFactory;

export function mockFactory(parameter: IParameter): IMock<any & IMockedObject<any>> {
    const mock = new Mock<any & IMockedObject<any>>({name: parameter.displayName});
    mock.setup(instance => instance.__mock).returns(mock);
    return mock;
}
