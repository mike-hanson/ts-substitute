/**
 * @module tsSubstitute
 *
 */
import { Argument } from './argument';
/**
 * Provides the internal context for a substitute member, not intended for programatic usage
 *
 */
export declare class MemberContext {
    readonly property: PropertyKey;
    private readonly assignedValues;
    private readonly calls;
    private readonly methodReturnSetups;
    private hasConfiguredValue;
    private configuredValue;
    private lastAssignedValue;
    private lastCallArgs;
    /**
     * NOT FOR PROGRAMATIC USE
     *
     * @param property Key of the member this context applies to
     */
    constructor(property: PropertyKey);
    /**
     * The current value when the member is a property
     */
    readonly currentValue: any;
    /**
     * Returns string representation of all calls
     */
    readonly allCallsString: string;
    /**
     * The currently assigned values as a string
     */
    readonly assignedValuesString: string;
    /**
     * Indicates whether a property has a value that has been assigned programtically
     */
    readonly hasAssignedValue: boolean;
    /**
     * Indicates whether the member has any calls
     */
    readonly hasCalls: boolean;
    /**
     * Indicates whether a return value has been configured during testing
     */
    readonly hasConfiguredReturnValue: boolean;
    /**
     * Returns the arguments for the last call recorded
     */
    readonly lastCallArguments: Array<Argument>;
    /**
     * Returns the values for arguments to the last call recorded
     */
    readonly lastCallArgumentValues: Array<any>;
    /**
     * Returns a string representation of arguments to the last call
     */
    readonly lastCallArgumentString: string;
    /**
     * Records a call to the method member
     *
     * @param args Arguments passed to the call
     */
    addCall(args: Array<any>): void;
    /**
     * Converts the last call to a method return setup
     *
     * @param valueToReturn The value to be returned
     */
    convertLastCallToReturn(valueToReturn: any, isAsyncReturn?: boolean): void;
    /**
     * Indicates whether a return has been configured for method calls with the specified args
     *
     * @param args The arguments to match
     */
    hasConfiguredMethodReturn(args: Array<any>): boolean;
    /**
     * Gets the configured return value for a call
     *
     * @param args Arguments to match for return value
     */
    getReturnForCall(): any;
    /**
     * Indicates if a specified value has ever been assigned to the member
     *
     * @param value Expected value to have been assigned
     * @param times Expected assignment count
     */
    receivedAssignment(value: any, times?: number): boolean;
    /**
     * Indicates whether a call matching the arguments was received
     *
     * @param args Arguments to test
     * @param times Minimum number of calls that were expected
     */
    receivedCall(args: Array<any>, times?: number): boolean;
    /**
     * Indicates whether any calls to the method member were recorded regardless of arguments
     *
     * @param times Minimum number of calls that were expected
     */
    receivedCallWithAnyArgs(times?: number): boolean;
    /**
     * Configures a value to be returned by the member
     *
     * @param valueToReturn Value to be returned for the member
     */
    returns(valueToReturn: any): void;
    /**
     * Sets a specific value for the member
     *
     * @param valueToAssign Value to be set for the member
     */
    setValue(valueToAssign: any): void;
    private convertArgsToArguments;
    private resetAssignedValues;
    private resetConfiguredValue;
    private hasEmptyCalls;
    private stringifyCall;
    private argumentsMatch;
}
