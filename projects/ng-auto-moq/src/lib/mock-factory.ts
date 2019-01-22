import { IMock, Mock } from "moq.ts";
import { IMockedObject, IParameter } from "./types";

export function mockFactory<T>(parameter: IParameter): IMock<T & IMockedObject<T>> {
    const mock = new Mock<T & IMockedObject<T>>(parameter.displayName);
    mock.setup(instance => instance.__mock).returns(mock);
    return mock;
}
