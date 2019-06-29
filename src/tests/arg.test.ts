import { assert } from 'chai';

import { Arg } from '../arg';
import { Argument } from '../argument';

describe('Arg', () => {

    it('should be defined', () => {
        assert.isDefined(Arg)
    });

    describe('any', () => {
        
        it('should return a function that always returns true when no args provided', () => {
            const matcher = Arg.any();
            assert.isFunction(matcher, 'Actual was not a matching function');
            assert.isTrue(matcher(), 'Matcher did not return expected result');
        });

        it('should return a function that returns true if type specified as string and argument is a string', () => {
            const matcher = Arg.any('String');
            assert.isFunction(matcher, 'Actual was not a matching function');
            assert.equal(matcher.length, 1, 'Matcher did not specify expected parameter')

            const argument: Argument = new Argument('a string');
            assert.isTrue(matcher(argument), 'Argument was not matched correctly')
        });

        it('should return a function that returns true if type specified as number and argument is a number', () => {
            const matcher = Arg.any('Number');
            assert.isFunction(matcher, 'Actual was not a matching function');
            assert.equal(matcher.length, 1, 'Matcher did not specify expected parameter')

            const argument: Argument = new Argument(42);
            assert.isTrue(matcher(argument), 'Argument was not matched correctly')
        });

        it('should return a function that returns true if type specified as boolean and argument is a boolean', () => {
            const matcher = Arg.any('Boolean');
            assert.isFunction(matcher, 'Actual was not a matching function');
            assert.equal(matcher.length, 1, 'Matcher did not specify expected parameter')

            const argument: Argument = new Argument(false);
            assert.isTrue(matcher(argument), 'Argument was not matched correctly')
        });

        it('should return a function that returns true if type specified as symbol and argument is a symbol', () => {
            const matcher = Arg.any('Symbol');
            assert.isFunction(matcher, 'Actual was not a matching function');
            assert.equal(matcher.length, 1, 'Matcher did not specify expected parameter')

            const argument: Argument = new Argument(Symbol.for('somthing'));
            assert.isTrue(matcher(argument), 'Argument was not matched correctly')
        });

        it('should return a function that returns true if type specified as undefined and argument is a undefined', () => {
            const matcher = Arg.any('undefined');
            assert.isFunction(matcher, 'Actual was not a matching function');
            assert.equal(matcher.length, 1, 'Matcher did not specify expected parameter')

            const argument: Argument = new Argument(undefined);
            assert.isTrue(matcher(argument), 'Argument was not matched correctly')
        });

        it('should return a function that returns true if type specified as object and argument is an object', () => {
            const matcher = Arg.any('Object');
            assert.isFunction(matcher, 'Actual was not a matching function');
            assert.equal(matcher.length, 1, 'Matcher did not specify expected parameter')

            const argument: Argument = new Argument({});
            assert.isTrue(matcher(argument), 'Argument was not matched correctly')
        });

        it('should return a function that returns true if type specified as function and argument is a function', () => {
            const matcher = Arg.any('Function');
            assert.isFunction(matcher, 'Actual was not a matching function');
            assert.equal(matcher.length, 1, 'Matcher did not specify expected parameter')

            const argument: Argument = new Argument(() => {});
            assert.isTrue(matcher(argument), 'Argument was not matched correctly')
        });

        it('should return a function that returns true if type specified as array and argument is an array', () => {
            const matcher = Arg.any('Array');
            assert.isFunction(matcher, 'Actual was not a matching function');
            assert.equal(matcher.length, 1, 'Matcher did not specify expected parameter')

            const argument: Argument = new Argument([1, 2, 3]);
            assert.isTrue(matcher(argument), 'Argument was not matched correctly')
        });
    });

    describe('is', () => {
        it('should return a function that applies the predicate when invoked', () => {
            let capturedValue: string;
            const input: Argument = new Argument('something');
            
            const actual = Arg.is((a:Argument) => {
                capturedValue = a.originalValue;
                return true;});

            assert.isFunction(actual, 'Actual was not a function');
            
            const result = actual(input);

            assert.isTrue(result, 'Result from actual did not match predicate result')
            assert.equal(input.originalValue, capturedValue, 'Predicate was not invokec correctly');
        });
    });

});
