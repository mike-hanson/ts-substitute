import { assert } from 'chai';

import { Arg } from '../arg';
import { Substitute, SubstituteOf } from '../substitute';
import { ISubstitutable } from './substitutable-interface';
import { Argument } from '../argument';

describe('Substitute', () => {
    
    let sub: SubstituteOf<ISubstitutable>;

    beforeEach(() => {
        sub = Substitute.for<ISubstitutable>();
    });

    it('should implement a method to create a substitute for a type', () => {
        assert.isFunction(Substitute.for, 'Method was not defined');
        assert.equal(Substitute.for.length, 0, 'Method does not define correct number of parameters');
    });

    it('should return a substitute for the type', () => {
        sub = Substitute.for<ISubstitutable>();
        assert.isDefined(sub);
    });

    it('should be able to set and get properties as if real object', () => {    
        sub.numberProp = 1;

        assert.equal(sub.numberProp, 1);
    });

    it('should be able to configure a return for a property', () => {
        sub.numberProp.returns(5);
        
        assert.equal(sub.numberProp, 5);
    });    

    it('should be able to configure a sequence of return values for a property', () => {
        sub.numberProp.returns(5, 6);
        
        assert.equal(sub.numberProp, 5);
        assert.equal(sub.numberProp, 6);
    });

    it('should return last value in sequence configured for a property once end is reached', () => {
        sub.numberProp.returns(5, 6);
        
        assert.equal(sub.numberProp, 5);
        assert.equal(sub.numberProp, 6);
        assert.equal(sub.numberProp, 6);
    });
    

    it('should be able to configure a return for a method call with literal values', () => {
        const expected = 'returned';
        const stringArg = 'something';
        const numberArg = 1;
        sub.stringMethod(stringArg, numberArg).returns(expected);

        const result = sub.stringMethod(stringArg, numberArg);

        assert.equal(result, 'returned');
    });

    it('should be able to configure a return for a method call using Arg.any', () => {
        const expected = 'returned';
        const stringArg = 'something';
        const numberArg = 1;
        sub.stringMethod(Arg.any('String'), numberArg).returns(expected);

        const result = sub.stringMethod(stringArg, numberArg);

        assert.equal(result, 'returned');
    });

    it('should be able to configure a return for a method call using Arg.is', () => {
        const expected = 'returned';
        const stringArg = 'something';
        const numberArg = 1;
        sub.stringMethod(Arg.any('String'), Arg.is((a: Argument) => a.originalValue <5)).returns(expected);

        const result = sub.stringMethod(stringArg, numberArg);

        assert.equal(result, 'returned');
    });

    it('should be able to configure a return value for an async method', async () => {
        const expected = true;
        const stringArg = 'something';
        const numberArg = 1;

        sub.asyncMethod(numberArg, stringArg).returnsAsync(expected);
        
        const actual = await sub.asyncMethod(numberArg, stringArg);

        assert.equal(actual, expected);
    });

    it('should be able to configure multiple return values for same method with different args', () => {        
        sub.stringMethod('one', 1).returns('ONE');
        sub.stringMethod('two', 2).returns('TWO');

        const actualOne = sub.stringMethod('one', 1);
        assert.equal(actualOne, 'ONE');

        const actualTwo = sub.stringMethod('two', 2);
        assert.equal(actualTwo, 'TWO');
    });

    it('should be able to configure multiple return values for same method with same args', () => {        
        sub.stringMethod('one', 1).returns('ONE', 'TWO');

        const actualOne = sub.stringMethod('one', 1);
        assert.equal(actualOne, 'ONE');

        const actualTwo = sub.stringMethod('one', 1);
        assert.equal(actualTwo, 'TWO');
    });    

    it('should be able to configure multiple return values for same method with same args', () => {        
        sub.stringMethod('one', 1).returns('ONE', 'TWO');

        const actualOne = sub.stringMethod('one', 1);
        assert.equal(actualOne, 'ONE');

        const actualTwo = sub.stringMethod('one', 1);
        assert.equal(actualTwo, 'TWO');
    });     

    it('should return last value in sequence configure return for method', () => {        
        sub.stringMethod('one', 1).returns('ONE', 'TWO');

        const actualOne = sub.stringMethod('one', 1);
        assert.equal(actualOne, 'ONE');

        const actualTwo = sub.stringMethod('one', 1);
        assert.equal(actualTwo, 'TWO');

        const actualThree = sub.stringMethod('one', 1);
        assert.equal(actualThree, 'TWO');
    });  

    it('should be able to configure multiple return values for same async method with same args', async () => {        
        sub.asyncMethod(1, 'one').returnsAsync(true, false);

        const actualOne = await sub.asyncMethod(1, 'one');
        assert.equal(actualOne, true);

        const actualTwo = await sub.asyncMethod(1, 'one');
        assert.equal(actualTwo, false);
    }); 

    it('should return last value in sequence configure return for async method', async () => {        
        sub.asyncMethod(1, 'one').returnsAsync(true, false);

        const actualOne = await sub.asyncMethod(1, 'one');
        assert.equal(actualOne, true);

        const actualTwo = await sub.asyncMethod(1, 'one');
        assert.equal(actualTwo, false);

        const actualThree = await sub.asyncMethod(1, 'one');
        assert.equal(actualThree, false);
    });


    it('should not throw exception on valid assertion that a property was assigned a value', () => {
        sub.numberProp = 1;

        sub.received().numberProp = 1;
    });

    it('should throw exception on failed assertion that a property was assigned a value', () => {
        sub.numberProp = 2;

        assert.throws(() => sub.received(1).numberProp = 1, 'Expected numberProp to have been assigned the value 1, 1 time/s.\nActual assignments were: [ 2 ]');
    });
    
    it('should not throw exception on valid assertion that a property was not assigned a value', () => {
        sub.numberProp = 1;

        sub.didNotReceive().numberProp = 2;
    });

    it('should throw exception on failed assertion that a property was not assigned a value', () => {
        const assignedValue = 'something';
        sub.stringProp = assignedValue;

        const expected = `Expected stringProp not to have been assigned the value ${assignedValue}, 1 time/s.\nActual assignments were: [ something ]`;

        assert.throws(() => sub.didNotReceive().stringProp = assignedValue, expected);
    });

    it('should not throw exception on valid assertion that a method with no parameters was called', () => {
        sub.voidMethod();

        sub.received().voidMethod();
    });

    it('should throw exception on failed assert that a method without parameters was called', () => {
        const expected = `Expected voidMethod to have been called 1 time/s, but this method was never called.`;

        assert.throws(() => sub.received().voidMethod(), expected);
    });

    it('should not throw exception on valid assertion that a method with parameters was called using actual values', () => {
        const arg = 'something';
        sub.voidMethodWithArg(arg);

        sub.received().voidMethodWithArg(arg);
    });

    it('should throw exception on failed assert that a method with parameters was called using actual values', () => {
        const expected = `Expected voidMethodWithArg to have been called 1 time/s, but this method was never called.`;
        const arg = 'something';

        assert.throws(() => sub.received().voidMethodWithArg(arg), expected);
    });

    it('should not throw exception on valid assertion that a method with parameters was called using Arg.any', () => {
        sub.voidMethodWithArg('something');

        sub.received().voidMethodWithArg(Arg.any('String'));
    });

    it('should throw exception on failed assertion that a method with parameters was called using Arg.any', () => {
        sub.voidMethodWithArg('something');
        const expected = `Expected voidMethodWithArg to have been called 1 time/s, but no matching call was received.\nLast Call:\n[ {String:something} ]\nAll Calls:\n[ {String:something} ]`;
        

        assert.throws(() => sub.received().voidMethodWithArg(Arg.any('Number')), expected);
    });

    it('should not throw exception on valid assertion that a method with parameters was called using Arg.is', () => {
        sub.voidMethodWithArg('something');

        sub.received().voidMethodWithArg(Arg.is((a:Argument) => a.originalValue === 'something'));
    });

    it('should throw exception on failed assertion that a method with parameters was called using Arg.is', () => {
        sub.voidMethodWithArg('something');
        const expected = `Expected voidMethodWithArg to have been called 1 time/s, but no matching call was received.\nLast Call:\n[ {String:something} ]\nAll Calls:\n[ {String:something} ]`;
        
        assert.throws(() => sub.received().voidMethodWithArg(Arg.is((a:Argument) => a.originalValue === 'something else')), expected);
    });
});
