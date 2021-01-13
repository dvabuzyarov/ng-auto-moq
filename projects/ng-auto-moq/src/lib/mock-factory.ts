import { IMock, Mock } from "moq.ts";
import { IParameter } from "./types";

export type DefaultMockFactory = typeof mockFactory;

export const mockFactory = (parameter: IParameter): IMock<any> => new Mock<any>({name: parameter.displayName});
