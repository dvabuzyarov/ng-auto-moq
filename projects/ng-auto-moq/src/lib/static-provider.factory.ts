import { StaticProvider, Type } from "@angular/core";

export function typeStaticProvider<T>(type: Type<T>, dependencies: any []): StaticProvider {
    const staticProvider = {provide: type, useClass: type, deps: []};
    for (const token of dependencies) {
        staticProvider.deps.push(token);
    }
    return staticProvider;
}
