/**
 * @module tsSubstitute
 * 
 */
import { Argument } from './argument';
import { MethodReturnSetup } from './method-return-setup';

/**
 * Provides the internal context for a substitute member, not intended for programatic usage
 * 
 */
export class MemberContext {

    private readonly assignedValues: Array<any> = new Array<any>();
    private readonly calls: Array<Array<Argument>> = new Array<Array<Argument>>();
    private readonly methodReturnSetups: Array<MethodReturnSetup> = new Array<MethodReturnSetup>();

    private hasConfiguredValue: boolean = false;
    private configuredValue: any;
    private lastAssignedValue: any;
    private lastCallArgs: Array<Argument>;

    /**
     * NOT FOR PROGRAMATIC USE
     * 
     * @param property Key of the member this context applies to
     */
    constructor(public readonly property: PropertyKey) {
    }

    /**
     * The current value when the member is a property
     */
    public get currentValue(): any {
        return this.hasConfiguredReturnValue ? this.configuredValue : this.lastAssignedValue;
    }

    /**
     * Returns string representation of all calls 
     */

    public get allCallsString(): string {
        return `All Calls:\n${this.calls.map(c => this.stringifyCall(c)).join('\n')}`;
    }

    /**
     * The currently assigned values as a string
     */
    public get assignedValuesString(): string {
        return `[ ${this.assignedValues.join(', ')} ]`;
    }

    /**
     * Indicates whether a property has a value that has been assigned programtically
     */
    public get hasAssignedValue(): boolean {
        return this.assignedValues.length > 0;
    }

    /**
     * Indicates whether the member has any calls
     */
    public get hasCalls(): boolean {
        return this.calls.length > 0;
    }

    /**
     * Indicates whether a return value has been configured during testing
     */
    public get hasConfiguredReturnValue(): boolean {
        return this.hasConfiguredValue;
    }

    /**
     * Returns the arguments for the last call recorded
     */
    public get lastCallArguments(): Array<Argument> {
        return this.lastCallArgs;
    }

    /**
     * Returns the values for arguments to the last call recorded
     */
    public get lastCallArgumentValues(): Array<any> {
        return this.lastCallArgs.map(a => a.originalValue);
    }

    /**
     * Returns a string representation of arguments to the last call
     */
    public get lastCallArgumentString(): string {
        return `Last Call:\n${this.stringifyCall(this.lastCallArgs)}`;
    }

    /**
     * Records a call to the method member
     * 
     * @param args Arguments passed to the call
     */
    public addCall(args: Array<any>): void {
        this.lastCallArgs = args.map(a => new Argument(a));
        this.calls.push(this.lastCallArgs);
    }

    /**
     * Converts the last call to a method return setup
     * 
     * @param valueToReturn The value to be returned
     */
    public convertLastCallToReturn(valueToReturn: any, isAsyncReturn: boolean = false): void {
        this.methodReturnSetups.push({
            arguments: this.lastCallArgs,
            returnValue: valueToReturn,
            isAsync: isAsyncReturn
        });

        this.calls.pop();

        if (this.calls.length > 0) {
            this.lastCallArgs = this.calls[this.calls.length - 1];
        }
    }
    
    /**
     * Indicates whether a return has been configured for method calls with the specified args
     * 
     * @param args The arguments to match
     */
    public hasConfiguredMethodReturn(args: Array<any>): boolean {
        if (this.methodReturnSetups.length === 0) {
            return false;
        }

        const callArgs =  this.convertArgsToArguments(args);
        for (const setup of this.methodReturnSetups) {
            if(this.argumentsMatch(setup.arguments, callArgs) === true) {
                return true;
            }
        }

        return false;
    }

    /**
     * Gets the configured return value for a call
     * 
     * @param args Arguments to match for return value
     */
    public getReturnForCall(): any {
        const args = this.lastCallArgs;
        for (const setup of this.methodReturnSetups) {
            const isMatch = this.argumentsMatch(setup.arguments, args);

            if (isMatch === true) {
                const returnValue = setup.returnValue;
                return setup.isAsync ? Promise.resolve(returnValue) : returnValue;
            }
        }

        return undefined;
    }

    /**
     * Indicates if a specified value has ever been assigned to the member
     *  
     * @param value Expected value to have been assigned
     * @param times Expected assignment count
     */
    public receivedAssignment(value: any, times?: number): boolean {
        const assignmentCount = this.assignedValues.filter(v => v === value).length;
        if (typeof times !== 'undefined') {
            return assignmentCount === times;
        }

        return assignmentCount >= 1;
    }

    /**
     * Indicates whether a call matching the arguments was received
     * 
     * @param args Arguments to test
     * @param times Minimum number of calls that were expected
     */
    public receivedCall(args: Array<any>, times?: number): boolean {
        const minRequired = times || 1;

        if (args.length === 0 && this.hasEmptyCalls(minRequired)) {
            return true;
        }

        const setupArgs = this.convertArgsToArguments(args);
        let matchCount = 0;
        for (const call of this.calls) {
           const isMatch = this.argumentsMatch(setupArgs, call);

            if (isMatch === true) {
                matchCount++;
                if (matchCount >= minRequired) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Indicates whether any calls to the method member were recorded regardless of arguments
     * 
     * @param times Minimum number of calls that were expected
     */
    public receivedCallWithAnyArgs(times?: number): boolean {
        const minRequired = times || 1;
        return this.calls.length >= minRequired;
    }

    /**
     * Configures a value to be returned by the member
     * 
     * @param valueToReturn Value to be returned for the member
     */
    public returns(valueToReturn: any) {
        this.resetAssignedValues();
        this.hasConfiguredValue = true;
        this.configuredValue = valueToReturn;
    }

    /**
     * Sets a specific value for the member
     * 
     * @param valueToAssign Value to be set for the member
     */
    public setValue(valueToAssign: any) {
        this.resetConfiguredValue();
        this.assignedValues.push(valueToAssign);
        this.lastAssignedValue = valueToAssign;
    }
    
    private convertArgsToArguments(args: Array<any>) {
        return args.map(a => new Argument(a));
    }

    private resetAssignedValues(): void {
        this.assignedValues.splice(0, this.assignedValues.length);
        this.lastAssignedValue = undefined;
    }

    private resetConfiguredValue(): void {
        this.configuredValue = undefined;
        this.hasConfiguredValue = false;
    }

    private hasEmptyCalls(calls: number): boolean {
        const actualCalls = this.calls.filter(a => a.length === 0).length;
        return actualCalls === calls;
    }

    private stringifyCall(args: Array<Argument>): string {
        return `[ ${args.map(a => a.description).join(', ')} ]`;
    }

    private argumentsMatch(setupArgs: Array<Argument>, callArgs: Array<Argument>): boolean {
        let isMatch = true;
        for (let i = 0; i < setupArgs.length; i++) {
            const setupArg = setupArgs[i].originalValue;
            const callArg = callArgs[i];
            if (typeof setupArg['isMatcher'] !== 'undefined') {
                if (setupArg(callArg) === false) {
                    isMatch = false;
                    break;
                }
            } else if(setupArg !== callArg.originalValue) {
                isMatch = false;
                break;
            }
        }
        return isMatch;
    }

    // private stringifyCallValues(args: Array<Argument>): string {
    //     return this.stringifyArgValues(args.map(a => a.originalValue));
    // }

    // private stringifyArgValues(args: Array<any>): string {
    //     return `[ ${args.join(', ')} ]`;
    // }
}