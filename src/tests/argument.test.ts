import { assert } from 'chai';

import { Argument } from '../argument';

describe('Argument', () => {
    let target: Argument;
    let value: any;

    beforeEach(() => {
        value = 'something'
        target = new Argument(value);
    });

    it('should be defined', () => {
        assert.isDefined(target)
    });
    
    it('should provide original value through property', () => {
        assert.equal(target.originalValue, value);
    });

    it('should provide type of original value through property', () => {
        assert.equal(target.type, 'String');
    });

    it('should provide description of original value through property', () => {
        assert.equal(target.description, '{String:something}');
    });

    it('should report type correctly for number', () => {
        const argument = new Argument(1);

        assert.equal(argument.type, 'Number');
    });

    it('should report type correctly for boolean', () => {
        const argument = new Argument(false);

        assert.equal(argument.type, 'Boolean');
    });

    it('should report type correctly for date', () => {
        const argument = new Argument(new Date());

        assert.equal(argument.type, 'Date');
    });

    it('should report type correctly for array', () => {
        const array: Array<string> = ['one', 'two', 'three'];
        const argument = new Argument(array);

        assert.equal(argument.type, 'Array');
    });

    it('should report type correctly for object literal', () => {
        const argument = new Argument({});
        
        assert.equal(argument.type, 'Object');
    });

    it('should report type correctly for class', () => {
        class TestClass {};
        const object = new TestClass();
        const argument = new Argument(object);

        assert.equal(argument.type,'TestClass');
    });

    it('should report type correctly for function', () => {
        const argument = new Argument(() => {});

        assert.equal(argument.type, 'Function');
    });

    it('should report type correctly for symbol', () => {
        const argument = new Argument(Symbol.for(value));

        assert.equal(argument.type, 'Symbol');
    });

});
