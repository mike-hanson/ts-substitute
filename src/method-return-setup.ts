import { Argument } from './argument';

export interface MethodReturnSetup {
    arguments: Array<Argument>;
    returnValues: any[];
    isAsync: boolean;
    nextIndex: number;
}