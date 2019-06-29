"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const arg_1 = require("../arg");
const substitute_1 = require("../substitute");
describe('Substitute', () => {
    let sub;
    beforeEach(() => {
        sub = substitute_1.Substitute.for();
    });
    it('should implement a method to create a substitute for a type', () => {
        chai_1.assert.isFunction(substitute_1.Substitute.for, 'Method was not defined');
        chai_1.assert.equal(substitute_1.Substitute.for.length, 0, 'Method does not define correct number of parameters');
    });
    it('should return a substitute for the type', () => {
        sub = substitute_1.Substitute.for();
        chai_1.assert.isDefined(sub);
    });
    it('should be able to set and get properties as if real object', () => {
        sub.numberProp = 1;
        chai_1.assert.equal(sub.numberProp, 1);
    });
    it('should be able to configure a return for a property', () => {
        sub.numberProp.returns(5);
        chai_1.assert.equal(sub.numberProp, 5);
    });
    it('should be able to configure a return for a method call with literal values', () => {
        const expected = 'returned';
        const stringArg = 'something';
        const numberArg = 1;
        sub.stringMethod(stringArg, numberArg).returns(expected);
        const result = sub.stringMethod(stringArg, numberArg);
        chai_1.assert.equal(result, 'returned');
    });
    it('should be able to configure a return for a method call using Arg.any', () => {
        const expected = 'returned';
        const stringArg = 'something';
        const numberArg = 1;
        sub.stringMethod(arg_1.Arg.any('String'), numberArg).returns(expected);
        const result = sub.stringMethod(stringArg, numberArg);
        chai_1.assert.equal(result, 'returned');
    });
    it('should be able to configure a return for a method call using Arg.is', () => {
        const expected = 'returned';
        const stringArg = 'something';
        const numberArg = 1;
        sub.stringMethod(arg_1.Arg.any('String'), arg_1.Arg.is((a) => a.originalValue < 5)).returns(expected);
        const result = sub.stringMethod(stringArg, numberArg);
        chai_1.assert.equal(result, 'returned');
    });
    it('should be able to configure a return value for an async method', () => __awaiter(this, void 0, void 0, function* () {
        const expected = true;
        const stringArg = 'something';
        const numberArg = 1;
        sub.asyncMethod(numberArg, stringArg).returnsAsync(expected);
        const actual = yield sub.asyncMethod(numberArg, stringArg);
        chai_1.assert.equal(actual, expected);
    }));
    it('should be able to configure multiple return values for same method with different args', () => {
        sub.stringMethod('one', 1).returns('ONE');
        sub.stringMethod('two', 2).returns('TWO');
        const actualOne = sub.stringMethod('one', 1);
        chai_1.assert.equal(actualOne, 'ONE');
        const actualTwo = sub.stringMethod('two', 2);
        chai_1.assert.equal(actualTwo, 'TWO');
    });
    it('should not throw exception on valid assertion that a property was assigned a value', () => {
        sub.numberProp = 1;
        sub.received().numberProp = 1;
    });
    it('should throw exception on failed assertion that a property was assigned a value', () => {
        sub.numberProp = 2;
        chai_1.assert.throws(() => sub.received(1).numberProp = 1, 'Expected numberProp to have been assigned the value 1, 1 time/s.\nActual assignments were: [ 2 ]');
    });
    it('should not throw exception on valid assertion that a property was not assigned a value', () => {
        sub.numberProp = 1;
        sub.didNotReceive().numberProp = 2;
    });
    it('should throw exception on failed assertion that a property was not assigned a value', () => {
        const assignedValue = 'something';
        sub.stringProp = assignedValue;
        const expected = `Expected stringProp not to have been assigned the value ${assignedValue}, 1 time/s.\nActual assignments were: [ something ]`;
        chai_1.assert.throws(() => sub.didNotReceive().stringProp = assignedValue, expected);
    });
    it('should not throw exception on valid assertion that a method with no parameters was called', () => {
        sub.voidMethod();
        sub.received().voidMethod();
    });
    it('should throw exception on failed assert that a method without parameters was called', () => {
        const expected = `Expected voidMethod to have been called 1 time/s, but this method was never called.`;
        chai_1.assert.throws(() => sub.received().voidMethod(), expected);
    });
    it('should not throw exception on valid assertion that a method with parameters was called using actual values', () => {
        const arg = 'something';
        sub.voidMethodWithArg(arg);
        sub.received().voidMethodWithArg(arg);
    });
    it('should throw exception on failed assert that a method with parameters was called using actual values', () => {
        const expected = `Expected voidMethodWithArg to have been called 1 time/s, but this method was never called.`;
        const arg = 'something';
        chai_1.assert.throws(() => sub.received().voidMethodWithArg(arg), expected);
    });
    it('should not throw exception on valid assertion that a method with parameters was called using Arg.any', () => {
        sub.voidMethodWithArg('something');
        sub.received().voidMethodWithArg(arg_1.Arg.any('String'));
    });
    it('should throw exception on failed assertion that a method with parameters was called using Arg.any', () => {
        sub.voidMethodWithArg('something');
        const expected = `Expected voidMethodWithArg to have been called 1 time/s, but no matching call was received.\nLast Call:\n[ {String:something} ]\nAll Calls:\n[ {String:something} ]`;
        chai_1.assert.throws(() => sub.received().voidMethodWithArg(arg_1.Arg.any('Number')), expected);
    });
    it('should not throw exception on valid assertion that a method with parameters was called using Arg.is', () => {
        sub.voidMethodWithArg('something');
        sub.received().voidMethodWithArg(arg_1.Arg.is((a) => a.originalValue === 'something'));
    });
    it('should throw exception on failed assertion that a method with parameters was called using Arg.is', () => {
        sub.voidMethodWithArg('something');
        const expected = `Expected voidMethodWithArg to have been called 1 time/s, but no matching call was received.\nLast Call:\n[ {String:something} ]\nAll Calls:\n[ {String:something} ]`;
        chai_1.assert.throws(() => sub.received().voidMethodWithArg(arg_1.Arg.is((a) => a.originalValue === 'something else')), expected);
    });
});
//# sourceMappingURL=substitute.test.js.map