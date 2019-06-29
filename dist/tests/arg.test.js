"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const arg_1 = require("../arg");
const argument_1 = require("../argument");
describe('Arg', () => {
    it('should be defined', () => {
        chai_1.assert.isDefined(arg_1.Arg);
    });
    describe('any', () => {
        it('should return a function that always returns true when no args provided', () => {
            const matcher = arg_1.Arg.any();
            chai_1.assert.isFunction(matcher, 'Actual was not a matching function');
            chai_1.assert.isTrue(matcher(), 'Matcher did not return expected result');
        });
        it('should return a function that returns true if type specified as string and argument is a string', () => {
            const matcher = arg_1.Arg.any('String');
            chai_1.assert.isFunction(matcher, 'Actual was not a matching function');
            chai_1.assert.equal(matcher.length, 1, 'Matcher did not specify expected parameter');
            const argument = new argument_1.Argument('a string');
            chai_1.assert.isTrue(matcher(argument), 'Argument was not matched correctly');
        });
        it('should return a function that returns true if type specified as number and argument is a number', () => {
            const matcher = arg_1.Arg.any('Number');
            chai_1.assert.isFunction(matcher, 'Actual was not a matching function');
            chai_1.assert.equal(matcher.length, 1, 'Matcher did not specify expected parameter');
            const argument = new argument_1.Argument(42);
            chai_1.assert.isTrue(matcher(argument), 'Argument was not matched correctly');
        });
        it('should return a function that returns true if type specified as boolean and argument is a boolean', () => {
            const matcher = arg_1.Arg.any('Boolean');
            chai_1.assert.isFunction(matcher, 'Actual was not a matching function');
            chai_1.assert.equal(matcher.length, 1, 'Matcher did not specify expected parameter');
            const argument = new argument_1.Argument(false);
            chai_1.assert.isTrue(matcher(argument), 'Argument was not matched correctly');
        });
        it('should return a function that returns true if type specified as symbol and argument is a symbol', () => {
            const matcher = arg_1.Arg.any('Symbol');
            chai_1.assert.isFunction(matcher, 'Actual was not a matching function');
            chai_1.assert.equal(matcher.length, 1, 'Matcher did not specify expected parameter');
            const argument = new argument_1.Argument(Symbol.for('somthing'));
            chai_1.assert.isTrue(matcher(argument), 'Argument was not matched correctly');
        });
        it('should return a function that returns true if type specified as undefined and argument is a undefined', () => {
            const matcher = arg_1.Arg.any('undefined');
            chai_1.assert.isFunction(matcher, 'Actual was not a matching function');
            chai_1.assert.equal(matcher.length, 1, 'Matcher did not specify expected parameter');
            const argument = new argument_1.Argument(undefined);
            chai_1.assert.isTrue(matcher(argument), 'Argument was not matched correctly');
        });
        it('should return a function that returns true if type specified as object and argument is an object', () => {
            const matcher = arg_1.Arg.any('Object');
            chai_1.assert.isFunction(matcher, 'Actual was not a matching function');
            chai_1.assert.equal(matcher.length, 1, 'Matcher did not specify expected parameter');
            const argument = new argument_1.Argument({});
            chai_1.assert.isTrue(matcher(argument), 'Argument was not matched correctly');
        });
        it('should return a function that returns true if type specified as function and argument is a function', () => {
            const matcher = arg_1.Arg.any('Function');
            chai_1.assert.isFunction(matcher, 'Actual was not a matching function');
            chai_1.assert.equal(matcher.length, 1, 'Matcher did not specify expected parameter');
            const argument = new argument_1.Argument(() => { });
            chai_1.assert.isTrue(matcher(argument), 'Argument was not matched correctly');
        });
        it('should return a function that returns true if type specified as array and argument is an array', () => {
            const matcher = arg_1.Arg.any('Array');
            chai_1.assert.isFunction(matcher, 'Actual was not a matching function');
            chai_1.assert.equal(matcher.length, 1, 'Matcher did not specify expected parameter');
            const argument = new argument_1.Argument([1, 2, 3]);
            chai_1.assert.isTrue(matcher(argument), 'Argument was not matched correctly');
        });
    });
    describe('is', () => {
        it('should return a function that applies the predicate when invoked', () => {
            let capturedValue;
            const input = new argument_1.Argument('something');
            const actual = arg_1.Arg.is((a) => {
                capturedValue = a.originalValue;
                return true;
            });
            chai_1.assert.isFunction(actual, 'Actual was not a function');
            const result = actual(input);
            chai_1.assert.isTrue(result, 'Result from actual did not match predicate result');
            chai_1.assert.equal(input.originalValue, capturedValue, 'Predicate was not invokec correctly');
        });
    });
});
//# sourceMappingURL=arg.test.js.map