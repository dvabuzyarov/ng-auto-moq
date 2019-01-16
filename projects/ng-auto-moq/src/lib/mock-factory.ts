import { IMock, Mock } from "moq.ts";
import { IMockedObject } from "./types";

export function mockFactory<T>(displayName: string): IMock<T & IMockedObject<T>> {
    const mock = new Mock<T & IMockedObject<T>>(displayName);
    mock.setup(instance => instance.__mock).returns(mock);
    return mock;
}
