"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const member_context_1 = require("../member-context");
const argument_1 = require("../argument");
describe('MemberContext', () => {
    let target;
    beforeEach(() => {
        target = new member_context_1.MemberContext('something');
    });
    it('should be defined', () => {
        chai_1.assert.isDefined(target);
    });
    it('should default to no configured return', () => {
        chai_1.assert.isFalse(target.hasConfiguredReturnValue);
    });
    it('should indicate a configured return value exists once set', () => {
        target.returns(1);
        chai_1.assert.isTrue(target.hasConfiguredReturnValue);
    });
    it('should indicate a configured return value exists once set with sequence of values', () => {
        target.returns(1, 2);
        chai_1.assert.isTrue(target.hasConfiguredReturnValue);
    });
    it('should default to no assigned value', () => {
        chai_1.assert.isFalse(target.hasAssignedValue);
    });
    it('should provide assigned value once set', () => {
        const assignedValue = 'something';
        target.setValue(assignedValue);
        chai_1.assert.isTrue(target.hasAssignedValue);
        chai_1.assert.equal(target.currentValue, assignedValue);
    });
    it('should reset any assigned value when configured return set', () => {
        const assignedValue = 'something';
        const configuredReturn = 1;
        target.setValue(assignedValue);
        target.returns(configuredReturn);
        chai_1.assert.isFalse(target.hasAssignedValue);
        chai_1.assert.isTrue(target.hasConfiguredReturnValue);
    });
    it('should reset any assigned value when configured return set to sequcne', () => {
        const assignedValue = 'something';
        target.setValue(assignedValue);
        target.returns(1, 2);
        chai_1.assert.isFalse(target.hasAssignedValue);
        chai_1.assert.isTrue(target.hasConfiguredReturnValue);
    });
    it('should reset any configured return when assigned value set', () => {
        const configuredReturn = 1;
        const assignedValue = 'something';
        target.returns(configuredReturn);
        target.setValue(assignedValue);
        chai_1.assert.isTrue(target.hasAssignedValue);
        chai_1.assert.isFalse(target.hasConfiguredReturnValue);
    });
    it('should correctly indicate a value has been assigned', () => {
        const assignedValue = 'something';
        target.setValue(assignedValue);
        chai_1.assert.isTrue(target.receivedAssignment(assignedValue));
    });
    it('should correctly indicate a value has never been assigned', () => {
        const assignedValue = 'something';
        target.setValue(assignedValue);
        chai_1.assert.isFalse(target.receivedAssignment('something else'));
    });
    it('should correctly indicate undefined has never been explicitly assigned', () => {
        chai_1.assert.isFalse(target.receivedAssignment(undefined));
    });
    it('should correctly indicate undefined has been explicitly assigned', () => {
        target.setValue(undefined);
        chai_1.assert.isTrue(target.receivedAssignment(undefined));
    });
    it('should correctly identify no calls have ever been made', () => {
        chai_1.assert.isFalse(target.hasCalls);
    });
    it('should correctly identify the member has recevied some calls', () => {
        target.addCall([]);
        chai_1.assert.isTrue(target.hasCalls);
    });
    it('should default to no calls recorded with any arguments', () => {
        chai_1.assert.isFalse(target.receivedCallWithAnyArgs());
    });
    it('should correctly indicate whether a call with any arguments has been recorded', () => {
        target.addCall([1, 2, 3]);
        chai_1.assert.isTrue(target.receivedCallWithAnyArgs());
    });
    it('should correctly indicate whether a call was received with zero arguments', () => {
        target.addCall([]);
        chai_1.assert.isTrue(target.receivedCall([], 1));
    });
    it('should correctly indicate whether a call was received with zero arguments multiple times', () => {
        target.addCall([]);
        target.addCall([]);
        chai_1.assert.isTrue(target.receivedCall([], 2));
    });
    it('should correctly indicate whether a call was received with literal argument values', () => {
        target.addCall([1, 2, 3]);
        chai_1.assert.isTrue(target.receivedCall([1, 2, 3], 1));
    });
    it('should correctly indicate whether no call was received with zero arguments', () => {
        chai_1.assert.isFalse(target.receivedCall([], 1));
    });
    it('should return collection of argument objects for last call', () => {
        target.addCall([1, 'something', false]);
        const expected = [
            new argument_1.Argument(1),
            new argument_1.Argument('something'),
            new argument_1.Argument(false)
        ];
        const actual = target.lastCallArguments;
        chai_1.assert.deepEqual(actual, expected);
    });
    it('should return collection of argument values for last call', () => {
        const args = [1, 'something', false];
        target.addCall(args);
        const actual = target.lastCallArgumentValues;
        chai_1.assert.deepEqual(args, actual);
    });
    it('should return string representation of all calls', () => {
        target.addCall([1, 'something', false]);
        target.addCall([2, 'something else', true]);
        const expected = 'All Calls:\n[ {Number:1}, {String:something}, {Boolean:false} ]\n[ {Number:2}, {String:something else}, {Boolean:true} ]';
        const actual = target.allCallsString;
        chai_1.assert.equal(expected, actual);
    });
    it('should return string representation of last call', () => {
        const args = [1, 'something', false];
        const expected = 'Last Call:\n[ {Number:1}, {String:something}, {Boolean:false} ]';
        target.addCall(args);
        const actual = target.lastCallArgumentString;
        chai_1.assert.equal(actual, expected);
    });
    it('should convert last call to return configuration', () => {
        const call1 = [1, 2];
        const call2 = [2, 3];
        target.addCall(call1);
        target.addCall(call2);
        target.convertLastCallToReturn(5);
        chai_1.assert.isTrue(target.hasConfiguredMethodReturn(call2));
        chai_1.assert.deepEqual(target.lastCallArgumentValues, call1);
    });
});
//# sourceMappingURL=member-context.test.js.map