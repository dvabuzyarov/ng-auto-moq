[![Build Status](https://travis-ci.org/dvabuzyarov/ng-auto-moq.svg?branch=master)](https://travis-ci.org/dvabuzyarov/ng-auto-moq)
[![NPM version:latest](https://img.shields.io/npm/v/ng-auto-moq/latest.svg?style=flat-square)](https://www.npmjs.com/package/ng-auto-moq)
[![NPM version:next](https://img.shields.io/npm/v/ng-auto-moq/next.svg?style=flat-square)](https://www.npmjs.com/package/ng-auto-moq)
[![npm downloads](https://img.shields.io/npm/dt/ng-auto-moq.svg?style=flat-square)](https://www.npmjs.com/package/ng-auto-moq)
[![Dependency Status](http://img.shields.io/david/dvabuzyarov/ng-auto-moq.svg?style=flat-square)](https://david-dm.org/dvabuzyarov/ng-auto-moq)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com/)
[![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/ng-auto-moq.svg)](https://www.npmjs.com/package/ng-auto-moq)
[![License](https://img.shields.io/npm/l/ng-auto-moq.svg)](https://www.npmjs.com/package/ng-auto-moq)

This is a special angular injector builder for unit testing purposes. 
It creates an injector configuration that automatically mocks all dependencies of tested unit with [moq.ts](https://github.com/dvabuzyarov/moq.ts).

It can be used with angular [TestBed](https://angular.io/api/core/testing/TestBed) class and with a regular [injector](https://angular.io/api/core/Injector).

Here is adapted test configuration example from [the official angular documentation.](https://angular.io/guide/testing#service-tests)
```typescript
import "reflect-metadata";
import { moqInjectorProviders, resolveMock } from "ng-auto-moq"; 
import { MoqAPI } from "moq.ts";

@Injectable()
export class MasterService {
  constructor(private valueService: ValueService) { }
  getValue() { return this.valueService.getValue(); }
}

@Injectable()
export class ValueService {
  getValue() { return 10; }
}

let masterService: MasterService;
let valueService: ValueService;

beforeEach(() => {

  TestBed.configureTestingModule({
    // Provide both the service-to-test and its (moq) dependency
    providers: moqInjectorProviders(MasterService)
  });
  // Inject both the service-to-test and its (spy) dependency
  masterService = TestBed.get(MasterService);
  valueService = TestBed.get(ValueService);
  
  (valueService[MoqAPI] as IMock<ValueService>)
  .setup(instance => instance.getValue())
  .returns(-1);
  
  //or
  
  resolveMock(ValueService, TestBed.get(Injector)) 
    .setup(instance => instance.getValue())
    .returns(-1);
});
```

Services testing could be also done in simplified manner with a regular injector. With this approach tests
could be performed in nodejs environment without involving a browser. It gives performance improvement and less dependencies should be install, suits well for CI environment.
If you are using [jasmine](https://jasmine.github.io)
just run it from command prompt with the following command:
```bash
jasmine *.spec.js
``` 
     
```typescript
import "reflect-metadata";
import { moqInjectorProviders, resolveMock } from "ng-auto-moq";
import {It} from "moq.ts";
import { Injectable, Injector } from "@angular/core";

@Injectable()
export class ValueService {
    getValue(options: { value: number }) {
        return options.value * 10;
    }
}

@Injectable()
export class MasterService {
    constructor(private valueService: ValueService) {
    }

    getValue(value: number) {
        return this.valueService.getValue({value});
    }
}

describe("Integration test", () => {
    let injector: Injector;

    beforeEach(() => {
        const providers = moqInjectorProviders(MasterService);
        injector = Injector.create({providers});
    });

    it("Returns provided value", () => {
        // setup section
        resolveMock(ValueService, injector)
            // the options object should be compared with deep equal logic or any other custom logic
            // the default comparision would not work since for objects it uses reference comparing
            .setup(instance => instance.getValue(It.Is(opt => expect(opt).toEqual({value: 1}))))
            .returns(-1);

        //action section
        const tested = injector.get(MasterService);
        const actual = tested.getValue(1);

        //assertion section
        expect(actual).toBe(-1);
    });    
});

```

With options of moqInjectorProviders you can control how dependencies are configured. 
Let's say you have a class with [@Optional](https://angular.io/api/core/Optional) dependency, and you want to test both cases when 
the dependency is available and when it isn't.  

```typescript
import "reflect-metadata";
import { moqInjectorProviders, DefaultProviderFactory, IParameter, ProviderFactory } from "ng-auto-moq";

@Injectable()
export class MasterService {
  constructor(@Optional() private valueService: ValueService) { }
  getValue() { return this.valueService ? this.valueService.getValue() : -1; }
}

it("Returns provided value when optional dependencies are not available", ()=>{
    // setup section
    const providerFactory: ProviderFactory = (parameter: IParameter, mocked: Type<any>, defaultProviderFactory: DefaultProviderFactory) => {
        if (parameter.optional === true) {
            return undefined;
        }
        return defaultProviderFactory(parameter, mocked);
    };
    
    const providers = moqInjectorProviders(MasterService, {providerFactory});
    const injector = Injector.create({providers});
    
    //action section
    const tested = injector.get(MasterService);
    const actual = tested.getValue();
    
    //assertion section
    expect(actual).toBe(-1);
})
```

Another option is mockFactory that allows to customize the dependency mocking process. You can pre configure the mock 
and decide to throw an exception when interaction with the mocked object is not expected.

```typescript
import "reflect-metadata";
import { moqInjectorProviders, MockFactory, IParameter, DefaultMockFactory } from "ng-auto-moq";
import { It } from "moq.ts";

let injector: Injector;

beforeEach(() => {
    const mockFactory: MockFactory = (parameter: IParameter, defaultMockFactory: DefaultMockFactory) =>{
        return defaultMockFactory(parameter)
        .setup(() => It.IsAny())
        .throws(new Error("setup is missed"));
    };
    injector = Injector.create(moqInjectorProviders(MasterService, {mockFactory}));
});

it("Throws an exception", ()=>{
    //action section
    const tested = injector.get(MasterService);
    
    //assertion section
    expect(()=> tested.getValue()).toThrow();
})
```
