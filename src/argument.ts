/**
 * Internal wrapper for arguments passed to method calls
 * 
 * @module tsSubstitute
 */
export class Argument {

    /**
     * Constructor
     * 
     * @param value The value of the argument
     */
    constructor(private value: any) {
    }

    /**
     * Description of the argument derived from the type and value
     */
    public get description() :string {
        return `{${this.type}:${this.originalValue.toString()}}`;
    }

    /**
     * The original value of the argument
     */
    public get originalValue(): any {
        return this.value;
    }

    /**
     * The type of the argument
     */
    public get type(): string {
        
        return Argument.getType(this.value);
    }

    /**
     * Determine the type of a value
     * 
     * @param value Value to evaluate for type
     * 
     * @returns Constructor name if available otherwise type returned from typeof
     */
    public static getType(value: any): string {
        if(typeof value !== 'undefined' && typeof value.constructor !== 'undefined') {
            return value.constructor.name;
        }

        return typeof value;
    }
}