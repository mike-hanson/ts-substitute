/**
 * Defines various types that allow the TypeScript compiler to understand
 * what substitutes look like and how they should behave.
 */

/**
 * Mixin type that adds the returns method to all substitutes
 */
type SubstituteMixin<TReturnType> = {
    /**
     * Configures a member of a substitute to return a specific value
     */
    returns: (...args: TReturnType[]) => void;
};

/**
 * Mixin type that adds the returnsAsync method to any substitute
 */
type AsyncSubstituteMixin<TReturnType> = {

    /**
     * Configures a member to return a specific value wrapped in a promise
     */
    returnsAsync: (...args: TReturnType[]) => void
};

/**
 * Mixin type that adds the andDoes method to members that are
 * functions and do not define parameters
 */
type ParameterlessFunctionSubstituteMixin<TReturnType> = SubstituteMixin<TReturnType> & {
    /**
     * Configures the member to take some action when it is invoked.
     * 
     * @remarks
     * The method is effectively a callback allowing developers to execute an action
     * when the member is invoked by runtime code. 
     */
    andDoes: (func: () => void) => void;
};

/**
 * Mixin type that adds the andDoes method to members that are
 * async functions and do not define parameters
 */
type AsyncParameterlessFunctionSubstituteMixin<TReturnType> = AsyncSubstituteMixin<TReturnType> & {
    /**
     * Configures the member to take some action when it is invoked.
     * 
     * @remarks
     * The method is effectively a callback allowing developers to execute an action
     * when the member is invoked by runtime code. 
     */
    andDoes: (func: () => void) => void;
};

/**
 * Mixin type that adds the andDoes method to members that are
 * functions with parmeters 
 */
type FunctionSubstituteMixin<TArguments extends any[], TReturnType> = SubstituteMixin<TReturnType> & {
    /**
     * Configures the member to take some action when it is invoked.
     * 
     * @remarks
     * The method is effectively a callback allowing developers to execute an action
     * when the member is invoked by runtime code. 
     */
    andDoes: (func: (...args: TArguments) => void) => void;
};

/**
 * Mixin type that adds the andDoes method to members that are async
 * functions with paratmers
 */
type AsyncFunctionSubstituteMixin<TArguments extends any[], TReturnType> = AsyncSubstituteMixin<TReturnType> & {
    /**
     * Configures the member to take some action when it is invoked.
     * 
     * @remarks
     * The method is effectively a callback allowing developers to execute an action
     * when the member is invoked by runtime code. 
     */
    andDoes: (func: (...args: TArguments) => void) => void;
};

/**
 * Union type representing an enum of the methods implemented on substitutes
 * 
 * @remarks
 * This is used to exclude/replace members with these names on target interfaces
 */
type SubstituteMethods = 'andDoes' | 'received' | 'receivedWithAnyArgs' | 'didNotReceive' | 'didNotReceiveWithAnyArgs' | 'returns' | 'returnsAsync';

/**
 * Type that omits subsitute methods from a substituted type
 */
export type OmitProxyMethods<T extends any> = Omit<T, SubstituteMethods>;

/**
 * A substitute type compatible with functions that do not define parameters
 */
export type ParameterlessFunctionSubstitute<TReturnType> =
    (() => (TReturnType & ParameterlessFunctionSubstituteMixin<TReturnType>));

/**
* A substitute type compatible with functions that do not define parameters
*/
export type AsyncParameterlessFunctionSubstitute<TReturnType> =
    (() => (Promise<TReturnType> & AsyncParameterlessFunctionSubstituteMixin<TReturnType>));

/**
 * A substitute type compatible with functions that define parameters
 */
export type FunctionSubstitute<TArguments extends any[], TReturnType> =
    ((...args: TArguments) => (TReturnType & FunctionSubstituteMixin<TArguments, TReturnType>));

/**
 * A substitute type compatible with functions that define parameters and return promises
 */
export type AsyncFunctionSubstitute<TArguments extends any[], TReturnType> =
    ((...args: TArguments) => (Promise<TReturnType> & AsyncFunctionSubstituteMixin<TArguments, TReturnType>));

/**
 * A substitute type compatible with properties
 */
export type PropertySubstitute<TReturnType> = (TReturnType & Partial<ParameterlessFunctionSubstituteMixin<TReturnType>>);

/**
     * Transformation type that maps members from the specified interface
     * onto a substitute for the interface.
     * 
     * @remarks
     * This transformation sets the return type of the subsistute members to
     * void hence Terminating in the name.
     * 
     * This can be read as:
     * for every member of T
     * if the member is a parameterless function, include a paramterless function of the same name that raturns void
     * if the member is a function with paramters, include a function with the same parameters that returns void
     */
type TerminatingObjectTransformation<T> = {
    [P in keyof T]:
    T[P] extends () => infer _R ? () => void :
    T[P] extends (...args: infer F) => infer _R ? (...args: F) => void :
    T[P]
};

/**
 * Transformation type that maps members from the specified interface
 * onto a substitute for the interface.
 * 
 * @remarks
 * This transformation effectively replaces the actual return types of members
 * with subsitutes that can be used to configure the member
 * 
 * This can be read as:
 * for every member of T
 * if the member is a parameterless function, include a paramterless function of the same name that raturns a compatible substitute
 * if the member is a function with paramters, include a function with the same paraters that returns a compatible substitute
 * if the member is a property return a compatible substitute
 */
type ObjectSubstituteTransformation<T extends Object> = {
    [P in keyof T]:
    T[P] extends () => Promise<infer R> ? AsyncParameterlessFunctionSubstitute<R> :
    T[P] extends () => infer R ? ParameterlessFunctionSubstitute<R> :
    T[P] extends (...args: infer F) => Promise<infer R> ? AsyncFunctionSubstitute<F, R> :
    T[P] extends (...args: infer F) => infer R ? FunctionSubstitute<F, R> :
    PropertySubstitute<T[P]>;
};

/**
 * A substitute type compatible with objects that adds methods for asserting
 * interactions with the substitute members
 */
export type ObjectSubstitute<T extends Object, K extends Object = T> = ObjectSubstituteTransformation<T> & {
    /**
     * Asserts that the member was accessed/invoked exactly as specified
     * 
     * @param times Optional expectation that the member was accessed/invoked a minumum number of times
     * 
     * @remarks
     * If times is ommitted the assertion assumes 1 and fails if the member was never accessed/invoked
     */
    received(times?: number): TerminatingObjectTransformation<K>;
    /**
     * Asserts that the member was accessed/invoked with any combination of arguments
     * 
     * @param times Optional expectation that the member was accessed/invoked a minimum number of times
     * 
     * @remarks
     * If times is ommitted the assertion assumes 1 and fails if the member was never accessed/invoked
     */
    receivedWithAnyArgs(times?: number): TerminatingObjectTransformation<K>;
    /**
     * Asserts that the member was never accessed/invoked exactly as specified
     * 
     * @param times Optional expectation that the member was not accessed/invoked a specified number of times
     * 
     * @remarks
     * If times is ommitted the assertion assumes 1 and fails if the member was accessed/invoked
     */
    didNotReceive(times?: number): TerminatingObjectTransformation<K>;
    /**
     * Asserts that the member was never accessed/invoked with any combination of arguments
     * 
     * @param times Optional expectation that the member was not accessed/invoked a specified number of times
     * 
     * @remarks
     * If times is ommitted the assertion assumes 1 and fails if the member was accessed/invoked
     */
    didNotReceiveWithAnyArgs(times?: number): TerminatingObjectTransformation<K>;
};

/**
 * Type definition for matcher functions returned by Args methods
 */
export type ArgumenMatcher = (arg: any) => boolean;