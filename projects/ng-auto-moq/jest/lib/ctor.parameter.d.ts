import { Inject, Optional, Self, SkipSelf } from "@angular/core";

export interface ICtorParameter {
    type: unknown | undefined;  // the type of the param that's decorated, if it's a value.
    decorators: {
        type: Inject | Optional | Self | SkipSelf;  // the type of the decorator that's invoked.
        args: any[];       // the arguments passed to the decorator.
    }[];
}
