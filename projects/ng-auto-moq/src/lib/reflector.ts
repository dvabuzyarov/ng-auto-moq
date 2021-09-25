import { Inject, InjectionToken, Optional, resolveForwardRef, Self, SkipSelf, Type } from "@angular/core";
import { IParameter, Visibility } from "./types";
import { InjectionFactory, TypeofInjectionFactory } from "@testdozer/ng-injector-types";
import { TokenNameProvider } from "./token-name.provider";

declare let global: any;

/**
 * Provides dependencies metadata of inspected angular class.
 *
 * @param type The inspected class
 */
export class Reflector implements InjectionFactory {
    constructor(
        @Inject(TokenNameProvider)
        private readonly tokenName: TokenNameProvider) {
        return this.factory() as any;
    }

    private static parameters(type: any): any[][] {
        const paramAnnotations = type.hasOwnProperty("__parameters__") && (type as any)["__parameters__"];
        const reflect = (global || window)["Reflect"];
        const paramTypes = reflect.getOwnMetadata("design:paramtypes", type);
        if (paramTypes || paramAnnotations) {
            return Reflector.zipTypesAndAnnotations(paramTypes, paramAnnotations);
        }
        return [];
    }

    private static zipTypesAndAnnotations(paramTypes: any[], paramAnnotations: any[]): any[][] {
        let result: any[][];

        if (typeof paramTypes === "undefined") {
            result = new Array(paramAnnotations.length);
        } else {
            result = new Array(paramTypes.length);
        }

        for (let i = 0; i < result.length; i++) {
            // TS outputs Object for parameters without types, while Traceur omits
            // the annotations. For now we preserve the Traceur behavior to aid
            // migration, but this can be revisited.
            if (typeof paramTypes === "undefined") {
                result[i] = [];
            } else if (paramTypes[i] !== Object) {
                result[i] = [paramTypes[i]];
            } else {
                result[i] = [];
            }
            if (paramAnnotations && paramAnnotations[i] != null) {
                result[i] = result[i].concat(paramAnnotations[i]);
            }
        }
        return result;
    }

    factory() {
        return <T>(type: Type<T>): IParameter[] => {
            const params = Reflector.parameters(type);
            return params.map(p => this.extractToken(p));
        };
    }

    private extractToken(metadata: any[] | any): IParameter {
        let token: any = null;
        let optional = false;

        if (!Array.isArray(metadata)) {
            if (metadata instanceof Inject) {
                return this.createDependency(metadata.token, optional, Visibility.None);
            } else {
                return this.createDependency(metadata, optional, Visibility.None);
            }
        }

        let visibility: Visibility = Visibility.None;

        for (const paramMetadata of metadata) {
            if (paramMetadata instanceof Type) {
                token = paramMetadata;

            } else if (paramMetadata instanceof Inject) {
                token = paramMetadata.token;

            } else if (paramMetadata instanceof Optional) {
                optional = true;

            } else if (paramMetadata instanceof Self) {
                visibility = Visibility.Self;
            } else if (paramMetadata instanceof SkipSelf) {
                visibility = Visibility.SkipSelf;
            } else if (paramMetadata instanceof InjectionToken) {
                token = paramMetadata;
            }
        }

        token = resolveForwardRef(token);

        return this.createDependency(token, optional, visibility);
    }

    private createDependency(token: any, optional: boolean, visibility: Visibility): IParameter {
        return {displayName: this.tokenName.getName(token), token, optional, visibility};
    }

}


