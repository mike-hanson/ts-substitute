/**
 * Internal wrapper for arguments passed to method calls
 *
 * @module tsSubstitute
 */
export declare class Argument {
    private value;
    /**
     * Constructor
     *
     * @param value The value of the argument
     */
    constructor(value: any);
    /**
     * Description of the argument derived from the type and value
     */
    readonly description: string;
    /**
     * The original value of the argument
     */
    readonly originalValue: any;
    /**
     * The type of the argument
     */
    readonly type: string;
    /**
     * Determine the type of a value
     *
     * @param value Value to evaluate for type
     *
     * @returns Constructor name if available otherwise type returned from typeof
     */
    static getType(value: any): string;
}
