import { Argument } from './argument';
import { ArgumenMatcher } from './types';

/**
 * Argument matcher for assertions
 *  */
export class Arg {
  public static any(): ArgumenMatcher & any;
  public static any<T extends 'String'>(type: T): ArgumenMatcher & any;
  public static any<T extends 'Number'>(type: T): ArgumenMatcher & any;
  public static any<T extends 'Boolean'>(type: T): ArgumenMatcher & any;
  public static any<T extends 'Symbol'>(type: T): ArgumenMatcher & any;
  public static any<T extends 'undefined'>(type: T): ArgumenMatcher & any;
  public static any<T extends 'Object'>(type: T): ArgumenMatcher & any;
  public static any<T extends 'Function'>(type: T): ArgumenMatcher & any;
  public static any<T extends 'Array'>(type: T): ArgumenMatcher & any;
  public static any<
    T extends
      | 'String'
      | 'Number'
      | 'Boolean'
      | 'Symbol'
      | 'undefined'
      | 'Object'
      | 'Function'
      | 'Array'
  >(type: T): ArgumenMatcher & any;
  public static any(type?: string): ArgumenMatcher & any {
    if (!type) {
      const func: any = (_arg: Argument) => true;
      func['isMatcher'] = true;
      return func;
    }

    if (type === 'Array') {
      const func: any = (arg: Argument) => {
        return Array.isArray(arg.originalValue);
      };
      func['isMatcher'] = true;
      return func;
    }

    const func: any = (arg: Argument) => arg.type === type;
    func['isMatcher'] = true;
    return func;
  }

  public static is(predicate: Function): Function & any {
    const func: any = (arg: Argument) => predicate(arg);
    func['isMatcher'] = true;
    return func;
  }
}
