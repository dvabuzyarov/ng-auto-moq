import { IParameter } from "./types";
import { Optional } from "@angular/core";

export function depsFactory(parameters: IParameter[]): any[] {
    return parameters
        .map(p => {
            if (p.optional === true) {
                return [new Optional(), p.token];
            }
            return p.token;
        });
}
