import { ArgumenMatcher } from './types';
export declare class Arg {
    static any(): ArgumenMatcher & any;
    static any<T extends 'String'>(type: T): ArgumenMatcher & any;
    static any<T extends 'Number'>(type: T): ArgumenMatcher & any;
    static any<T extends 'Boolean'>(type: T): ArgumenMatcher & any;
    static any<T extends 'Symbol'>(type: T): ArgumenMatcher & any;
    static any<T extends 'undefined'>(type: T): ArgumenMatcher & any;
    static any<T extends 'Object'>(type: T): ArgumenMatcher & any;
    static any<T extends 'Function'>(type: T): ArgumenMatcher & any;
    static any<T extends 'Array'>(type: T): ArgumenMatcher & any;
    static any<T extends 'String' | 'Number' | 'Boolean' | 'Symbol' | 'undefined' | 'Object' | 'Function' | 'Array'>(type: T): ArgumenMatcher & any;
    static is(predicate: Function): Function & any;
}
