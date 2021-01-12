"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberContext = void 0;
const argument_1 = require("./argument");
/**
 * Provides the internal context for a substitute member, not intended for programatic usage
 *
 */
class MemberContext {
    /**
     * NOT FOR PROGRAMATIC USE
     *
     * @param property Key of the member this context applies to
     */
    constructor(property) {
        this.property = property;
        this.assignedValues = new Array();
        this.calls = new Array();
        this.methodReturnSetups = new Array();
        this.hasConfiguredValue = false;
    }
    /**
     * The current value when the member is a property
     */
    get currentValue() {
        if (!this.hasConfiguredReturnValue) {
            return this.lastAssignedValue;
        }
        if (!this.isConfiguredValueSequence) {
            return this.configuredValue;
        }
        const result = this.configuredValue[this.configuredValueNextIndex];
        this.configuredValueNextIndex++;
        if (this.configuredValueNextIndex === this.configuredValue.length) {
            this.configuredValueNextIndex--;
        }
        return result;
    }
    /**
     * Returns string representation of all calls
     */
    get allCallsString() {
        return `All Calls:\n${this.calls.map(c => this.stringifyCall(c)).join('\n')}`;
    }
    /**
     * The currently assigned values as a string
     */
    get assignedValuesString() {
        return `[ ${this.assignedValues.join(', ')} ]`;
    }
    /**
     * Indicates whether a property has a value that has been assigned programtically
     */
    get hasAssignedValue() {
        return this.assignedValues.length > 0;
    }
    /**
     * Indicates whether the member has any calls
     */
    get hasCalls() {
        return this.calls.length > 0;
    }
    /**
     * Indicates whether a return value has been configured during testing
     */
    get hasConfiguredReturnValue() {
        return this.hasConfiguredValue;
    }
    /**
     * Returns the arguments for the last call recorded
     */
    get lastCallArguments() {
        return this.lastCallArgs;
    }
    /**
     * Returns the values for arguments to the last call recorded
     */
    get lastCallArgumentValues() {
        return this.lastCallArgs.map(a => a.originalValue);
    }
    /**
     * Returns a string representation of arguments to the last call
     */
    get lastCallArgumentString() {
        return `Last Call:\n${this.stringifyCall(this.lastCallArgs)}`;
    }
    /**
     * Records a call to the method member
     *
     * @param args Arguments passed to the call
     */
    addCall(args) {
        this.lastCallArgs = args.map(a => new argument_1.Argument(a));
        this.calls.push(this.lastCallArgs);
    }
    /**
     * Converts the last call to a method return setup
     *
     * @param valuesToReturn The values to be returned insequence
     */
    convertLastCallToReturn(...valuesToReturn) {
        this.methodReturnSetups.push({
            arguments: this.lastCallArgs,
            returnValues: valuesToReturn,
            isAsync: false,
            nextIndex: 0
        });
        this.calls.pop();
        if (this.calls.length > 0) {
            this.lastCallArgs = this.calls[this.calls.length - 1];
        }
    }
    /**
    * Converts the last call to an async method return setup
    *
    * @param valuesToReturn The values to be returned in sequence
    */
    convertLastCallToReturnAsync(...valuesToReturn) {
        this.methodReturnSetups.push({
            arguments: this.lastCallArgs,
            returnValues: valuesToReturn,
            isAsync: true,
            nextIndex: 0
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
    hasConfiguredMethodReturn(args) {
        if (this.methodReturnSetups.length === 0) {
            return false;
        }
        const callArgs = this.convertArgsToArguments(args);
        for (const setup of this.methodReturnSetups) {
            if (this.argumentsMatch(setup.arguments, callArgs) === true) {
                return true;
            }
        }
        return false;
    }
    /**
     * Gets the configured return value for a call
     */
    getReturnForCall() {
        const args = this.lastCallArgs;
        for (const setup of this.methodReturnSetups) {
            const isMatch = this.argumentsMatch(setup.arguments, args);
            if (isMatch === true) {
                const returnValue = setup.returnValues[setup.nextIndex];
                setup.nextIndex++;
                if (setup.nextIndex === setup.returnValues.length) {
                    setup.nextIndex--;
                }
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
    receivedAssignment(value, times) {
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
    receivedCall(args, times) {
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
    receivedCallWithAnyArgs(times) {
        const minRequired = times || 1;
        return this.calls.length >= minRequired;
    }
    /**
     * Configures a value to be returned by the member
     *
     * @param valuesToReturn Value to be returned for the member
     */
    returns(...valuesToReturn) {
        this.resetAssignedValues();
        this.hasConfiguredValue = true;
        this.isConfiguredValueSequence = valuesToReturn.length > 1;
        this.configuredValue = valuesToReturn;
        this.configuredValueNextIndex = 0;
    }
    /**
     * Sets a specific value for the member
     *
     * @param valueToAssign Value to be set for the member
     */
    setValue(valueToAssign) {
        this.resetConfiguredValue();
        this.assignedValues.push(valueToAssign);
        this.lastAssignedValue = valueToAssign;
    }
    convertArgsToArguments(args) {
        return args.map(a => new argument_1.Argument(a));
    }
    resetAssignedValues() {
        this.assignedValues.splice(0, this.assignedValues.length);
        this.lastAssignedValue = undefined;
    }
    resetConfiguredValue() {
        this.configuredValue = undefined;
        this.hasConfiguredValue = false;
    }
    hasEmptyCalls(calls) {
        const actualCalls = this.calls.filter(a => a.length === 0).length;
        return actualCalls === calls;
    }
    stringifyCall(args) {
        return `[ ${args.map(a => a.description).join(', ')} ]`;
    }
    argumentsMatch(setupArgs, callArgs) {
        let isMatch = true;
        for (let i = 0; i < setupArgs.length; i++) {
            const setupArg = setupArgs[i].originalValue;
            const callArg = callArgs[i];
            if (typeof setupArg['isMatcher'] !== 'undefined') {
                if (setupArg(callArg) === false) {
                    isMatch = false;
                    break;
                }
            }
            else if (setupArg !== callArg.originalValue) {
                isMatch = false;
                break;
            }
        }
        return isMatch;
    }
}
exports.MemberContext = MemberContext;
//# sourceMappingURL=member-context.js.map