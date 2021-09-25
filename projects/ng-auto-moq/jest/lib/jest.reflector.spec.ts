/*eslint-disable max-classes-per-file*/
import { createMoqInjector, resolve, resolveMock } from "../../src/tests.components/createMoqInjector";
import { JestReflector } from "./jest.reflector";
import { ICtorParameter } from "./ctor.parameter";
import { IParameter, TokenNameProvider, Visibility } from "ng-auto-moq";
import { Inject, InjectionToken, Optional, Self, SkipSelf } from "@angular/core";

describe("Jest reflector", () => {

    beforeEach(() => {
        createMoqInjector(JestReflector);
    });

    it("Throws exception when type does not have ctorParameters", () => {
        class Test {
        }

        const reflector = resolve(JestReflector);

        expect(() => reflector(Test)).toThrow();
    });

    it("Returns an empty array when type does not have dependencies", () => {
        class Test {
            static ctorParameters() {
                return [];
            }
        }

        const reflector = resolve(JestReflector);

        const actual = reflector(Test);
        expect(actual).toEqual([]);
    });

    it("Returns parameter for a regular dependency", () => {
        class Test {
            static ctorParameters() {
                return [{type: Test}] as ICtorParameter[];
            }
        }

        const displayName = "display name";

        resolveMock(TokenNameProvider)
            .setup(instance => instance.getName(Test))
            .returns(displayName);

        const reflector = resolve(JestReflector);

        const actual = reflector(Test);
        expect(actual).toEqual([{token: Test, visibility: Visibility.None, optional: false, displayName}] as IParameter[]);
    });

    it("Returns parameter for a dependency with Inject decorator", () => {
        const displayName = "display name";
        const token = new InjectionToken("token");

        class Test {
            static ctorParameters() {
                return [{type: Test, decorators: [{type: Inject, args: [token]}]}] as ICtorParameter[];
            }
        }

        resolveMock(TokenNameProvider)
            .setup(instance => instance.getName(token))
            .returns(displayName);

        const reflector = resolve(JestReflector);

        const actual = reflector(Test);
        expect(actual).toEqual([{token, visibility: Visibility.None, optional: false, displayName}] as IParameter[]);
    });

    it("Returns parameter for a dependency with Optional decorator", () => {
        const displayName = "display name";
        const token = new InjectionToken("token");

        class Test {
            static ctorParameters() {
                return [{type: Test, decorators: [{type: Inject, args: [token]}, {type: Optional, args: []}]}] as ICtorParameter[];
            }
        }

        resolveMock(TokenNameProvider)
            .setup(instance => instance.getName(token))
            .returns(displayName);

        const reflector = resolve(JestReflector);

        const actual = reflector(Test);
        expect(actual).toEqual([{token, visibility: Visibility.None, optional: true, displayName}] as IParameter[]);
    });

    it("Returns parameter for a dependency with Self decorator", () => {
        const displayName = "display name";
        const token = new InjectionToken("token");

        class Test {
            static ctorParameters() {
                return [{
                    type: Test, decorators: [
                        {type: Inject, args: [token]},
                        {type: Optional, args: []},
                        {type: Self, args: []},
                    ]
                }] as ICtorParameter[];
            }
        }

        resolveMock(TokenNameProvider)
            .setup(instance => instance.getName(token))
            .returns(displayName);

        const reflector = resolve(JestReflector);

        const actual = reflector(Test);
        expect(actual).toEqual([{token, visibility: Visibility.Self, optional: true, displayName}] as IParameter[]);
    });

    it("Returns parameter for a dependency with SkipSelf decorator", () => {
        const displayName = "display name";
        const token = new InjectionToken("token");

        class Test {
            static ctorParameters() {
                return [{
                    type: Test, decorators: [
                        {type: Inject, args: [token]},
                        {type: Optional, args: []},
                        {type: SkipSelf, args: []},
                    ]
                }] as ICtorParameter[];
            }
        }

        resolveMock(TokenNameProvider)
            .setup(instance => instance.getName(token))
            .returns(displayName);

        const reflector = resolve(JestReflector);

        const actual = reflector(Test);
        expect(actual).toEqual([{token, visibility: Visibility.SkipSelf, optional: true, displayName}] as IParameter[]);
    });

});
