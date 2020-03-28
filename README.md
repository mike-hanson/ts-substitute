## ts-substitute

A framework heavily influenced by and true to the API of [NSubstitute](https://github.com/nsubstitute/NSubstitute) that supports TypeScript *development by contract* through mocking of dependencies declared as interfaces or types.

### Credit
Credit for the core ideas of using Proxies and TypeScript types utilised in this library must be given to [Mathias Lykkegaard](https://github.com/ffMathy) and the work he did on his [Substitute](https://github.com/ffMathy/FluffySpoon.JavaScript.Testing.Faking) library.  I initially used his library but hit some problems and struggled to resolve them on the code base at the time, a reflection of my lack of knowledge rather than the code.  I decided to create my own library that was more limited in functionality and supported the way I work using Mathias' ideas and work with it directly from my repo.  

### What doesn't it do
First of all let us clarify what ts-substitute doesn't do.  Since it is designed specifically to support *development by contract* ts-substitute has no support for substituting instances of types.  As you will see, when you create a substitute using the factory method you provide a generic type parameter that determines the shape of the substitute.  We do not create an instance of this type nor do we support passing an instance to the factory method as other frameworks do.  Behind the scenes ts-substitute is using proxies as substitutes for the specified type.  We use the advanced type features of TypeScript to ensure the proxies look like the specified type so that editors and tools provide the rich experience they are designed for e.g. intellisense and static type checking.

If you are looking to do any of the following or anything similar then ts-substitute is not for you, a quick search of the internet will find other libraries that may be more appropriate:

+ Spy on Angular, React or Vue.js components expecting lifecycle events to be fired
+ Spy on instances of a class expecting existing behavior to work when not overridden

### What does it do
As mentioned above ts-substitute is designed to support *development by contract* using TypeScript.  That is development where dependencies of one type are declared as interfaces and through various mechanisms (Factory Pattern, IoC) injected into the consuming type. Typically practicing TDD and applying SOLID principles will lead to this pattern.  If you write code like this:

```javascript

export interface IService {
    doIt(arg1: string, arg2: number): string;
}

export class ServiceConsumer : {
    constructor(private myService: IService) {}

    callDoIt(arg1: string, arg2: string) {
        const result = this.myService.doIt(arg1, arg2);

        /// do something with result
    }
}
```

Then when testing *ServiceConsumer* you can use ts-substitute to create a substitute for *IService* that can be tested for interactions and configured to return output specific to the test case.  That is it, simple but powerful.  Read on to learn more.

### Installation
ts-substitute is published as an NPM package under the @testpossessed namespace

```bash
npm install -D @testpossessed/ts-substitute
```

### Usage
ts-substitute exports two static objects *Substitute* and *Arg* these need to be imported into a test module to be used.  *Substitute* is required. *Arg* is used for argument matching when asserting interactions between consumer and substitute so can be considered optional, but you will use it pretty often so the following is the most likely import statement you will use.

```javascript
import { Substitute, Arg } from 'ts-substitute';
```

With the imports taken care of you can write tests like this (jasmine syntax)

```javascript

describe('ServiceConsumer', () => {
    let sub: SubstituteOf<IService>;
    let service: ServiceConsumer;

    beforeEach(() => {
        sub = Substitute.for<IService>();
        service = new ServiceConsumer(sub);
    });

    it('should use service', () => {
        sub.doIt(Arg.any<string>(), Arg.any<string>()).returns('return this');

        service.callDoIt('one', 'two');

        expect(sub.recieved().doIt('one', 'two'));
    });
});

```

#WIP
This readme is very much a work in progress and should be completed at some point.  However the library was developed applying TDD so the tests should provide plenty of usage examples in the meantime.  Also TypeDoc has been setup to generate API documentation from comments.  The latest API documentation can be generated and viewed with using lite-server.

```bash
npm start
```

Or you can run

```bash
npm run docgen
```
Then open docs/index.html in a browser



