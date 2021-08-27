/*eslint-disable max-classes-per-file*/
import { Inject, Injectable, InjectionToken, Optional, Self, SkipSelf } from "@angular/core";
import { Visibility } from "./types";
import { Reflector } from "./reflector";
import { TypeofInjectionFactory } from "@testdozer/ng-injector-types/public_api";

@Injectable()
class Dependency {
}

describe("Reflector", () => {
    let reflector: TypeofInjectionFactory<Reflector>;

    beforeEach(() => {
        reflector = new Reflector() as any;
    });

    it("Returns empty array when a component does not have dependencies", () => {
        class EmptyResolvable {
        }

        const actual = reflector(EmptyResolvable);
        expect(actual).toEqual([]);
    });

    it("Returns class dependency", () => {
        @Injectable()
        class Resolvable {
            constructor(
                private dependency: Dependency) {

            }
        }

        const actual = reflector(Resolvable);
        expect(actual).toEqual([{
            displayName: "Dependency",
            optional: false,
            token: Dependency,
            visibility: Visibility.None
        }]);
    });

    it("Returns optional class dependency", () => {
        @Injectable()
        class Resolvable {
            constructor(
                @Optional()
                private dependency: Dependency) {

            }
        }

        const actual = reflector(Resolvable);
        expect(actual).toEqual([{
            displayName: "Dependency",
            optional: true,
            token: Dependency,
            visibility: Visibility.None
        }]);
    });

    it("Returns self class dependency", () => {
        @Injectable()
        class Resolvable {
            constructor(
                @Self()
                private dependency: Dependency) {

            }
        }

        const actual = reflector(Resolvable);
        expect(actual).toEqual([{
            displayName: "Dependency",
            optional: false,
            token: Dependency,
            visibility: Visibility.Self
        }]);
    });

    it("Returns skip self class dependency", () => {
        @Injectable()
        class Resolvable {
            constructor(
                @SkipSelf()
                private dependency: Dependency) {

            }
        }

        const actual = reflector(Resolvable);
        expect(actual).toEqual([{
            displayName: "Dependency",
            optional: false,
            token: Dependency,
            visibility: Visibility.SkipSelf
        }]);
    });

    it("Returns inject dependency", () => {
        const description = "Token Description";
        const token = new InjectionToken(description);

        @Injectable()
        class Resolvable {
            constructor(
                @Inject(token)
                private dependency: any) {

            }
        }

        const actual = reflector(Resolvable);
        expect(actual).toEqual([{
            displayName: `InjectionToken ${description}`,
            optional: false,
            token,
            visibility: Visibility.None
        }]);
    });

    it("Returns optional inject dependency", () => {
        const description = "Token Description";
        const token = new InjectionToken(description);

        @Injectable()
        class Resolvable {
            constructor(
                @Inject(token)
                @Optional()
                private dependency: any) {

            }
        }

        const actual = reflector(Resolvable);
        expect(actual).toEqual([{
            displayName: `InjectionToken ${description}`,
            optional: true,
            token,
            visibility: Visibility.None
        }]);
    });

    it("Returns self inject dependency", () => {
        const description = "Token Description";
        const token = new InjectionToken(description);

        @Injectable()
        class Resolvable {
            constructor(
                @Inject(token)
                @Self()
                private dependency: any) {

            }
        }

        const actual = reflector(Resolvable);
        expect(actual).toEqual([{
            displayName: `InjectionToken ${description}`,
            optional: false,
            token,
            visibility: Visibility.Self
        }]);
    });

    it("Returns skip self inject dependency", () => {
        const description = "Token Description";
        const token = new InjectionToken(description);

        @Injectable()
        class Resolvable {
            constructor(
                @Inject(token)
                @SkipSelf()
                private dependency: any) {

            }
        }

        const actual = reflector(Resolvable);
        expect(actual).toEqual([{
            displayName: `InjectionToken ${description}`,
            optional: false,
            token,
            visibility: Visibility.SkipSelf
        }]);
    });
});
