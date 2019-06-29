/**
 * @module tsSubstitute
 */
import { MemberContext } from './member-context';

/**
 * Provides the internal context for a substitute, not intended for programatic usage
 * 
 * @remarks
 * This class is the heart of tsSubstitute acting as the main controller and state manager.
 * It provides a proxy for the substitute root and another for members, both
 * of which delegate to this component
 *  
 */
export class SubstituteContext {
    private readonly fakedProperties: Array<PropertyKey> = ['valueOf', '$$typeof', 'length', 'toString', 'inspect', 'prototype', 'name', 'stack'];
    private readonly memberContexts: Map<PropertyKey, MemberContext> = new Map<PropertyKey, MemberContext>();

    private internalRootProxy: any;
    private internalMemberProxy: any;
    private pendingReceivedExpectation: number;
    private pendingDidNotReceiveExpectation: number;
    private isReturnsPending: boolean;
    private isReturnsAsyncPending: boolean;
    private rootContext: MemberContext;
    private memberContext: MemberContext;

    /**
     * @ignore
     */
    constructor() {
        this.internalRootProxy = new Proxy(() => { }, {
            get: (target: any, property: PropertyKey) => {
                return this.handleRootGet(target, property);
            },
            set: (target: any, property: PropertyKey, value: any): boolean => {
                return this.handleRootSet(target, property, value);
            },
            apply: (target: any, thisArg: any, args: any) => {
                return this.handleRootApply(target, thisArg, args);
            }
        });

        this.internalMemberProxy = new Proxy(() => { }, {
            get: (target: any, property: PropertyKey) => {
                return this.handleMemberGet(target, property);
            },
            set: (target: any, property: PropertyKey, value: any): boolean => {
                return this.handleMemberSet(target, property, value);
            },
            apply: (target: any, thisArg: any, args: any) => {
                return this.handleMemberApply(target, thisArg, args);
            }
        });
    }

    /** 
     * A Proxy for the root substitute
     * 
     * @returns Proxy
     */
    public get rootProxy(): any {
        return this.internalRootProxy;
    }

    private handleRootApply(_target: any, _thisArg: any, args: any): any {

        if (this.isDefined(this.rootContext)) {
            this.rootContext.addCall(args);

            if(this.rootContext.hasConfiguredMethodReturn(args) === true) {
                const returnValue = this.rootContext.getReturnForCall();
                return returnValue;
            }
        }

        return this.internalMemberProxy;
    }

    private handleRootGet(_target: any, property: PropertyKey): any {

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



    private handleRootSet(_target: any, property: PropertyKey, value: any): boolean {

        const memberContext = this.getOrCreateMemberContext(property);

        try {
            memberContext.setValue(value);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    private handleMemberApply(_target: any, _thisArg: any, args: any[]) {
        if (this.isReturnsPending === true) {
            if (this.isDefined(this.rootContext)) {
                if (this.rootContext.hasCalls) {
                    this.rootContext.convertLastCallToReturn(args[0], this.isReturnsAsyncPending);
                } else {
                    const argValue = args[0];
                    this.rootContext.returns(argValue);
                }
                this.isReturnsPending = false;
                this.isReturnsAsyncPending = false;
            }
        } else if (this.isDefined(this.pendingReceivedExpectation)) {
            const expectation = this.pendingReceivedExpectation;
            this.pendingReceivedExpectation = undefined;
            this.assertMemberReceivedCall(args, expectation);
        }

        return this.rootProxy;
    }

    private handleMemberGet(_target: any, property: PropertyKey) {
        
        if (property === 'returns') {
            return this.handleReturns();
        }
        
        if (property === 'returnsAsync') {
            return this.handleReturnsAsync();
        }

        this.memberContext = this.getOrCreateMemberContext(property);
        return this.internalMemberProxy;
    }

    private handleMemberSet(_target: any, property: PropertyKey, value: any) {
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

    private shouldBeHandledByMemberProxy(property: PropertyKey): any {
        return typeof property === 'symbol'
            || this.shouldFakeProperty(property);
    }

    private assertMemberReceivedCall(args: Array<any>, times?: number) {
        const actualTimes = times || 1;
        if (!this.memberContext.receivedCall(args, times)) {
            const actualMsg = this.memberContext.hasCalls === false ? 'but this method was never called.' :
                `but no matching call was received.\n${this.memberContext.lastCallArgumentString}\n${this.memberContext.allCallsString}`;
            const errMsg = `Expected ${this.memberContext.property.toString()} to have been called ${actualTimes} time/s, ${actualMsg}`;
            throw new Error(errMsg);
        }
    }

    private assertPropertyAssigned(property: PropertyKey, value: any) {
        const membercontext = this.getMemberContext(property);
        if (membercontext.receivedAssignment(value, this.pendingReceivedExpectation) === false) {
            const errMsg = `Expected ${property.toString()} to have been assigned the value ${value}, ${this.pendingReceivedExpectation} time/s.\nActual assignments were: ${membercontext.assignedValuesString}`;
            throw new Error(errMsg);
        }
    }

    private assertPropertyNotAssigned(property: PropertyKey, value: any) {
        const membercontext = this.getMemberContext(property);
        if (membercontext.receivedAssignment(value, this.pendingReceivedExpectation) === true) {
            const errMsg = `Expected ${property.toString()} not to have been assigned the value ${value}, ${this.pendingDidNotReceiveExpectation} time/s.\nActual assignments were: ${membercontext.assignedValuesString}`;
            throw new Error(errMsg);
        }
    }

    private getOrCreateMemberContext(property: PropertyKey): MemberContext {
        let context = this.getMemberContext(property);
        if (!this.isDefined(context)) {
            context = new MemberContext(property);
            this.memberContexts.set(property, context);
        }
        return context;
    }

    private getMemberContext(property: PropertyKey) {
        return this.memberContexts.get(property);
    }

    private handleReceived = (times?: number): any => {
        this.pendingReceivedExpectation = times || 1;
        return this.internalMemberProxy;
    }

    private handleDidNotReceive = (times?: number): any => {
        this.pendingDidNotReceiveExpectation = times || 1;
        return this.internalMemberProxy;
    }

    private handleReturns = () => {
        this.isReturnsPending = true;
        return this.internalMemberProxy;
    }

    private handleReturnsAsync = () => {
        this.isReturnsAsyncPending = true;
        return this.handleReturns();
    }


    private shouldFakeProperty(property: PropertyKey): boolean {
        return property === Symbol.toPrimitive || this.fakedProperties.indexOf(property) !== -1;
    }

    private isDefined(target: any | undefined) {
        return typeof target !== 'undefined';
    }
}