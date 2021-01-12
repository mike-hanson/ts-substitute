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
    isConfiguredValueSequence: boolean;
    configuredValueNextIndex: number;
    /**
     * NOT FOR PROGRAMATIC USE
     *
     * @param property Key of the member this context applies to
     */
    constructor(property: PropertyKey);
    /**
     * The current value when the member is a property
     */
    get currentValue(): any;
    /**
     * Returns string representation of all calls
     */
    get allCallsString(): string;
    /**
     * The currently assigned values as a string
     */
    get assignedValuesString(): string;
    /**
     * Indicates whether a property has a value that has been assigned programtically
     */
    get hasAssignedValue(): boolean;
    /**
     * Indicates whether the member has any calls
     */
    get hasCalls(): boolean;
    /**
     * Indicates whether a return value has been configured during testing
     */
    get hasConfiguredReturnValue(): boolean;
    /**
     * Returns the arguments for the last call recorded
     */
    get lastCallArguments(): Array<Argument>;
    /**
     * Returns the values for arguments to the last call recorded
     */
    get lastCallArgumentValues(): Array<any>;
    /**
     * Returns a string representation of arguments to the last call
     */
    get lastCallArgumentString(): string;
    /**
     * Records a call to the method member
     *
     * @param args Arguments passed to the call
     */
    addCall(args: Array<any>): void;
    /**
     * Converts the last call to a method return setup
     *
     * @param valuesToReturn The values to be returned insequence
     */
    convertLastCallToReturn(...valuesToReturn: any[]): void;
    /**
    * Converts the last call to an async method return setup
    *
    * @param valuesToReturn The values to be returned in sequence
    */
    convertLastCallToReturnAsync(...valuesToReturn: any[]): void;
    /**
     * Indicates whether a return has been configured for method calls with the specified args
     *
     * @param args The arguments to match
     */
    hasConfiguredMethodReturn(args: Array<any>): boolean;
    /**
     * Gets the configured return value for a call
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
     * @param valuesToReturn Value to be returned for the member
     */
    returns(...valuesToReturn: any[]): void;
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
