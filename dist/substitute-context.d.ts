/**
 * Provides the internal context for a substitute, not intended for programatic usage
 *
 * @remarks
 * This class is the heart of tsSubstitute acting as the main controller and state manager.
 * It provides a proxy for the substitute root and another for members, both
 * of which delegate to this component
 *
 */
export declare class SubstituteContext {
    private readonly fakedProperties;
    private readonly memberContexts;
    private internalRootProxy;
    private internalMemberProxy;
    private pendingReceivedExpectation;
    private pendingDidNotReceiveExpectation;
    private isReturnsPending;
    private isReturnsAsyncPending;
    private rootContext;
    private memberContext;
    /**
     * @ignore
     */
    constructor();
    /**
     * A Proxy for the root substitute
     *
     * @returns Proxy
     */
    get rootProxy(): any;
    private handleRootApply;
    private handleRootGet;
    private handleRootSet;
    private handleMemberApply;
    private handleMemberGet;
    private handleMemberSet;
    private shouldBeHandledByMemberProxy;
    private assertMemberReceivedCall;
    private assertPropertyAssigned;
    private assertPropertyNotAssigned;
    private getOrCreateMemberContext;
    private getMemberContext;
    private handleReceived;
    private handleDidNotReceive;
    private handleReturns;
    private handleReturnsAsync;
    private shouldFakeProperty;
    private isDefined;
}
