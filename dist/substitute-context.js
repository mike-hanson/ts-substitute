"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubstituteContext = void 0;
const member_context_1 = require("./member-context");
/**
 * Provides the internal context for a substitute, not intended for programatic usage
 *
 * @remarks
 * This class is the heart of tsSubstitute acting as the main controller and state manager.
 * It provides a proxy for the substitute root and another for members, both
 * of which delegate to this component
 *
 */
class SubstituteContext {
    /**
     * @ignore
     */
    constructor() {
        this.fakedProperties = ['valueOf', '$$typeof', 'length', 'toString', 'inspect', 'prototype', 'name', 'stack'];
        this.memberContexts = new Map();
        this.handleReceived = (times) => {
            this.pendingReceivedExpectation = times || 1;
            return this.internalMemberProxy;
        };
        this.handleDidNotReceive = (times) => {
            this.pendingDidNotReceiveExpectation = times || 1;
            return this.internalMemberProxy;
        };
        this.handleReturns = () => {
            this.isReturnsPending = true;
            return this.internalMemberProxy;
        };
        this.handleReturnsAsync = () => {
            this.isReturnsAsyncPending = true;
            return this.handleReturns();
        };
        this.internalRootProxy = new Proxy(() => { }, {
            get: (target, property) => {
                return this.handleRootGet(target, property);
            },
            set: (target, property, value) => {
                return this.handleRootSet(target, property, value);
            },
            apply: (target, thisArg, args) => {
                return this.handleRootApply(target, thisArg, args);
            }
        });
        this.internalMemberProxy = new Proxy(() => { }, {
            get: (target, property) => {
                return this.handleMemberGet(target, property);
            },
            set: (target, property, value) => {
                return this.handleMemberSet(target, property, value);
            },
            apply: (target, thisArg, args) => {
                return this.handleMemberApply(target, thisArg, args);
            }
        });
    }
    /**
     * A Proxy for the root substitute
     *
     * @returns Proxy
     */
    get rootProxy() {
        return this.internalRootProxy;
    }
    handleRootApply(_target, _thisArg, args) {
        if (this.isDefined(this.rootContext)) {
            this.rootContext.addCall(args);
            if (this.rootContext.hasConfiguredMethodReturn(args) === true) {
                const returnValue = this.rootContext.getReturnForCall();
                return returnValue;
            }
        }
        return this.internalMemberProxy;
    }
    handleRootGet(_target, property) {
        if (property === 'returns') {
            return this.handleReturns();
        }
        if (property === 'returnsAsync') {
            return this.handleReturnsAsync();
        }
        if (property === 'received') {
            return this.handleReceived;
        }
        if (property === 'didNotReceive') {
            return this.handleDidNotReceive;
        }
        if (this.shouldBeHandledByMemberProxy(property)) {
            return this.internalMemberProxy;
        }
        if (property !== 'constructor') {
            if (!this.isDefined(this.rootContext) || this.rootContext.property !== property) {
                this.rootContext = this.getOrCreateMemberContext(property);
            }
            if (this.rootContext.hasAssignedValue || this.rootContext.hasConfiguredReturnValue) {
                return this.rootContext.currentValue;
            }
        }
        return this.rootProxy;
    }
    handleRootSet(_target, property, value) {
        const memberContext = this.getOrCreateMemberContext(property);
        try {
            memberContext.setValue(value);
            return true;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }
    handleMemberApply(_target, _thisArg, args) {
        if (this.isReturnsPending === true) {
            if (this.isDefined(this.rootContext)) {
                if (this.rootContext.hasCalls) {
                    if (this.isReturnsAsyncPending) {
                        this.rootContext.convertLastCallToReturnAsync(...args);
                    }
                    else {
                        this.rootContext.convertLastCallToReturn(...args);
                    }
                }
                else {
                    this.rootContext.returns(...args);
                }
                this.isReturnsPending = false;
                this.isReturnsAsyncPending = false;
            }
        }
        else if (this.isDefined(this.pendingReceivedExpectation)) {
            const expectation = this.pendingReceivedExpectation;
            this.pendingReceivedExpectation = undefined;
            this.assertMemberReceivedCall(args, expectation);
        }
        return this.rootProxy;
    }
    handleMemberGet(_target, property) {
        if (property === 'returns') {
            return this.handleReturns();
        }
        if (property === 'returnsAsync') {
            return this.handleReturnsAsync();
        }
        this.memberContext = this.getOrCreateMemberContext(property);
        return this.internalMemberProxy;
    }
    handleMemberSet(_target, property, value) {
        if (this.isDefined(this.pendingReceivedExpectation)) {
            this.assertPropertyAssigned(property, value);
            this.pendingReceivedExpectation = undefined;
        }
        if (this.isDefined(this.pendingDidNotReceiveExpectation)) {
            this.assertPropertyNotAssigned(property, value);
            this.pendingDidNotReceiveExpectation = undefined;
        }
        return true;
    }
    shouldBeHandledByMemberProxy(property) {
        return typeof property === 'symbol'
            || this.shouldFakeProperty(property);
    }
    assertMemberReceivedCall(args, times) {
        const actualTimes = times || 1;
        if (!this.memberContext.receivedCall(args, times)) {
            const actualMsg = this.memberContext.hasCalls === false ? 'but this method was never called.' :
                `but no matching call was received.\n${this.memberContext.lastCallArgumentString}\n${this.memberContext.allCallsString}`;
            const errMsg = `Expected ${this.memberContext.property.toString()} to have been called ${actualTimes} time/s, ${actualMsg}`;
            throw new Error(errMsg);
        }
    }
    assertPropertyAssigned(property, value) {
        const membercontext = this.getMemberContext(property);
        if (membercontext.receivedAssignment(value, this.pendingReceivedExpectation) === false) {
            const errMsg = `Expected ${property.toString()} to have been assigned the value ${value}, ${this.pendingReceivedExpectation} time/s.\nActual assignments were: ${membercontext.assignedValuesString}`;
            throw new Error(errMsg);
        }
    }
    assertPropertyNotAssigned(property, value) {
        const membercontext = this.getMemberContext(property);
        if (membercontext.receivedAssignment(value, this.pendingReceivedExpectation) === true) {
            const errMsg = `Expected ${property.toString()} not to have been assigned the value ${value}, ${this.pendingDidNotReceiveExpectation} time/s.\nActual assignments were: ${membercontext.assignedValuesString}`;
            throw new Error(errMsg);
        }
    }
    getOrCreateMemberContext(property) {
        let context = this.getMemberContext(property);
        if (!this.isDefined(context)) {
            context = new member_context_1.MemberContext(property);
            this.memberContexts.set(property, context);
        }
        return context;
    }
    getMemberContext(property) {
        return this.memberContexts.get(property);
    }
    shouldFakeProperty(property) {
        return property === Symbol.toPrimitive || this.fakedProperties.indexOf(property) !== -1;
    }
    isDefined(target) {
        return typeof target !== 'undefined';
    }
}
exports.SubstituteContext = SubstituteContext;
//# sourceMappingURL=substitute-context.js.map