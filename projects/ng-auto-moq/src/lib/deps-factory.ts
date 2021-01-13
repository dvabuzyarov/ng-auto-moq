import { IParameter } from "./types";
import { Optional } from "@angular/core";

export const depsFactory = (parameters: IParameter[]): any[] => parameters
        .map(p => {
            if (p.optional === true) {
                return [new Optional(), p.token];
            }
            return p.token;
        });
