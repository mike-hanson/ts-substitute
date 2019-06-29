## ts-substitute

A framework heavily influenced by and true to the API of [NSubstitute](https://github.com/nsubstitute/NSubstitute) that supports TypeScript *development by contract* through mocking of dependencies declared as interfaces or types. 

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
}
```

Then when you testing *ServiceConsumer* you can use ts-substitute to create a substitute for *IService* that can be tested for interactions and configured to return output specific to the test case.  That is it, simple but powerful.  Read on to learn more.

### Installation
ts-substitute is published as an NPM package and can be installed as a development dependency with the following commmands

```bash
npm install -D ts-substitute
```
or

```bash
yarn add ts-substitute --dev
```

### Usage
ts-substitute exports two static objects *Substitute* and *Arg* these need to be imported into a test module to be used.  *Substitute* is required. *Arg* is used for argument matching when asserting interactions between consumer and substitute so can be considered optional, but you will use it pretty often so the following is the most likely import statement you will use.

```javascript
import { Substitute, Arg } from 'ts-substitute';
```



