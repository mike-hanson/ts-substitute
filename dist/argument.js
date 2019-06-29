"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Internal wrapper for arguments passed to method calls
 *
 * @module tsSubstitute
 */
class Argument {
    /**
     * Constructor
     *
     * @param value The value of the argument
     */
    constructor(value) {
        this.value = value;
    }
    /**
     * Description of the argument derived from the type and value
     */
    get description() {
        return `{${this.type}:${this.originalValue.toString()}}`;
    }
    /**
     * The original value of the argument
     */
    get originalValue() {
        return this.value;
    }
    /**
     * The type of the argument
     */
    get type() {
        return Argument.getType(this.value);
    }
    /**
     * Determine the type of a value
     *
     * @param value Value to evaluate for type
     *
     * @returns Constructor name if available otherwise type returned from typeof
     */
    static getType(value) {
        if (typeof value !== 'undefined' && typeof value.constructor !== 'undefined') {
            return value.constructor.name;
        }
        return typeof value;
    }
}
exports.Argument = Argument;
//# sourceMappingURL=argument.js.map