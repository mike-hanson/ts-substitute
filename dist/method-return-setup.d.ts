import { Argument } from './argument';
export interface MethodReturnSetup {
    arguments: Array<Argument>;
    returnValue: any;
    isAsync: boolean;
}
