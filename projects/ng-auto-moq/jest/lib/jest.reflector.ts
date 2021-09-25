import { InjectionFactory } from "@testdozer/ng-injector-types";
import { Inject, Optional, Self, SkipSelf, Type } from "@angular/core";
import { IParameter, TokenNameProvider, Visibility } from "ng-auto-moq";
import { ICtorParameter } from "./ctor.parameter";

export class JestReflector implements InjectionFactory {
    constructor(@Inject(TokenNameProvider)
                private readonly tokenNameProvider: TokenNameProvider) {
        return this.factory() as any;
    }

    factory() {
        return <T>(type: Type<T>): IParameter[] => {
            if (((type as any).ctorParameters instanceof Function) === false) {
                throw new Error(
                    `Type should have a static 'ctorParameters' property containing downleveled decorator information.
https://github.com/thymikee/jest-preset-angular/blob/ac9b689d9ba18b5ae2e18e9ed083d2cbbf86b2fd/src/transformers/downlevel-ctor.ts`);
            }
            const params = (type as any).ctorParameters() as ICtorParameter[];
            return params.map(this.toParameter);
        };
    }

    private toParameter = ({type, decorators}: ICtorParameter): IParameter => {

        let visibility: Visibility = Visibility.None;
        let token = type;
        let optional = false;

        for (const {type: decorator, args} of (decorators || [])) {
            if (decorator === Inject) {
                token = args[0];
            } else if (decorator === Optional) {
                optional = true;
            } else if (decorator === Self) {
                visibility = Visibility.Self;
            } else if (decorator === SkipSelf) {
                visibility = Visibility.SkipSelf;
            }
        }


        return {
            token: token as any,
            optional,
            visibility,
            displayName: this.tokenNameProvider.getName(token)
        };
    };
}
