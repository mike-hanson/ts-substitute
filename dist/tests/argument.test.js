"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const argument_1 = require("../argument");
describe('Argument', () => {
    let target;
    let value;
    beforeEach(() => {
        value = 'something';
        target = new argument_1.Argument(value);
    });
    it('should be defined', () => {
        chai_1.assert.isDefined(target);
    });
    it('should provide original value through property', () => {
        chai_1.assert.equal(target.originalValue, value);
    });
    it('should provide type of original value through property', () => {
        chai_1.assert.equal(target.type, 'String');
    });
    it('should provide description of original value through property', () => {
        chai_1.assert.equal(target.description, '{String:something}');
    });
    it('should report type correctly for number', () => {
        const argument = new argument_1.Argument(1);
        chai_1.assert.equal(argument.type, 'Number');
    });
    it('should report type correctly for boolean', () => {
        const argument = new argument_1.Argument(false);
        chai_1.assert.equal(argument.type, 'Boolean');
    });
    it('should report type correctly for date', () => {
        const argument = new argument_1.Argument(new Date());
        chai_1.assert.equal(argument.type, 'Date');
    });
    it('should report type correctly for array', () => {
        const array = ['one', 'two', 'three'];
        const argument = new argument_1.Argument(array);
        chai_1.assert.equal(argument.type, 'Array');
    });
    it('should report type correctly for object literal', () => {
        const argument = new argument_1.Argument({});
        chai_1.assert.equal(argument.type, 'Object');
    });
    it('should report type correctly for class', () => {
        class TestClass {
        }
        ;
        const object = new TestClass();
        const argument = new argument_1.Argument(object);
        chai_1.assert.equal(argument.type, 'TestClass');
    });
    it('should report type correctly for function', () => {
        const argument = new argument_1.Argument(() => { });
        chai_1.assert.equal(argument.type, 'Function');
    });
    it('should report type correctly for symbol', () => {
        const argument = new argument_1.Argument(Symbol.for(value));
        chai_1.assert.equal(argument.type, 'Symbol');
    });
});
//# sourceMappingURL=argument.test.js.map