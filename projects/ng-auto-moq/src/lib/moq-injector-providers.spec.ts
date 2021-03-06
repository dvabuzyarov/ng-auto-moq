import { Injectable, ValueProvider } from "@angular/core";
import { It, Mock, MoqAPI } from "moq.ts";
import { moqInjectorProviders } from "./moq-injector-providers";
import { IParameter, MockFactory } from "./types";

@Injectable()
class Dependency {
}

describe("Moq injector providers", () => {
    it("Returns a single static provider for a component without dependencies", () => {

        @Injectable()
        class EmptyResolvable {
        }

        const actual = moqInjectorProviders(EmptyResolvable);
        expect(actual).toEqual([{provide: EmptyResolvable, useClass: EmptyResolvable, deps: []}]);
    });

    it("Returns empty array for a component without dependencies when skipSelf option is true", () => {

        @Injectable()
        class EmptyResolvable {
        }

        const actual = moqInjectorProviders(EmptyResolvable, {skipSelf: true});
        expect(actual).toEqual([]);
    });

    it("Returns static providers for the tested unit and its dependencies", () => {

        @Injectable()
        class Resolvable {
            constructor(private dependency: Dependency) {

            }
        }

        const dependencyMock = new Mock<Dependency>();

        const mockFactory = new Mock<MockFactory>()
            .setup(instance => instance(It.Is<IParameter>(param => param.displayName === Dependency.name), It.IsAny()))
            .returns(dependencyMock)
            .object();

        const actual = moqInjectorProviders(Resolvable, {mockFactory});

        const expected = [
            {provide: Resolvable, useClass: Resolvable, deps: [Dependency]},
            {provide: Dependency, useValue: dependencyMock.object()}
        ];
        expect(actual).toEqual(expected);
    });

    it("Mocks dependencies with moq.ts mocks", () => {
        @Injectable()
        class Resolvable {
            constructor(private dependency: Dependency) {

            }
        }

        const actual = moqInjectorProviders(Resolvable) as ValueProvider[];

        const dependencyProvider = actual.find(provider => provider.provide === Dependency);
        expect(dependencyProvider).toBeDefined();
        const mockedDependency = (dependencyProvider.useValue)[MoqAPI];
        expect(mockedDependency.name).toEqual(Dependency.name);
    });
});
