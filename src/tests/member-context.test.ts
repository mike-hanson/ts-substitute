import { assert } from 'chai';

import { MemberContext } from '../member-context';
import { Argument } from '../argument';

describe('MemberContext', () => {
  let target: MemberContext;

  beforeEach(() => {
    target = new MemberContext('something');
  });

  it('should be defined', () => {
    assert.isDefined(target);
  });

  it('should default to no configured return', () => {
    assert.isFalse(target.hasConfiguredReturnValue);
  });

  it('should indicate a configured return value exists once set', () => {
    target.returns(1);

    assert.isTrue(target.hasConfiguredReturnValue);
  });

  it('should indicate a configured return value exists once set with sequence of values', () => {
    target.returns(1, 2);

    assert.isTrue(target.hasConfiguredReturnValue);
  });

  it('should default to no assigned value', () => {
    assert.isFalse(target.hasAssignedValue);
  });

  it('should provide assigned value once set', () => {
    const assignedValue = 'something';

    target.setValue(assignedValue);

    assert.isTrue(target.hasAssignedValue);
    assert.equal(target.currentValue, assignedValue);
  });

  it('should reset any assigned value when configured return set', () => {
    const assignedValue = 'something';
    const configuredReturn = 1;

    target.setValue(assignedValue);
    target.returns(configuredReturn);

    assert.isFalse(target.hasAssignedValue);
    assert.isTrue(target.hasConfiguredReturnValue);
  });

  it('should reset any assigned value when configured return set to sequcne', () => {
    const assignedValue = 'something';

    target.setValue(assignedValue);
    target.returns(1, 2);

    assert.isFalse(target.hasAssignedValue);
    assert.isTrue(target.hasConfiguredReturnValue);
  });

  it('should reset any configured return when assigned value set', () => {
    const configuredReturn = 1;
    const assignedValue = 'something';

    target.returns(configuredReturn);
    target.setValue(assignedValue);

    assert.isTrue(target.hasAssignedValue);
    assert.isFalse(target.hasConfiguredReturnValue);
  });

  it('should correctly indicate a value has been assigned', () => {
    const assignedValue = 'something';

    target.setValue(assignedValue);

    assert.isTrue(target.receivedAssignment(assignedValue));
  });

  it('should correctly indicate a value has never been assigned', () => {
    const assignedValue = 'something';

    target.setValue(assignedValue);

    assert.isFalse(target.receivedAssignment('something else'));
  });

  it('should correctly indicate undefined has never been explicitly assigned', () => {
    assert.isFalse(target.receivedAssignment(undefined));
  });

  it('should correctly indicate undefined has been explicitly assigned', () => {
    target.setValue(undefined);

    assert.isTrue(target.receivedAssignment(undefined));
  });

  it('should correctly identify no calls have ever been made', () => {
    assert.isFalse(target.hasCalls);
  });

  it('should correctly identify the member has recevied some calls', () => {
    target.addCall([]);

    assert.isTrue(target.hasCalls);
  });

  it('should default to no calls recorded with any arguments', () => {
    assert.isFalse(target.receivedCallWithAnyArgs());
  });

  it('should correctly indicate whether a call with any arguments has been recorded', () => {
    target.addCall([1, 2, 3]);

    assert.isTrue(target.receivedCallWithAnyArgs());
  });

  it('should correctly indicate whether a call was received with zero arguments', () => {
    target.addCall([]);

    assert.isTrue(target.receivedCall([], 1));
  });

  it('should correctly indicate whether a call was received with zero arguments multiple times', () => {
    target.addCall([]);
    target.addCall([]);

    assert.isTrue(target.receivedCall([], 2));
  });

  it('should correctly indicate whether a call was received with literal argument values', () => {
    target.addCall([1, 2, 3]);

    assert.isTrue(target.receivedCall([1, 2, 3], 1));
  });

  it('should correctly indicate whether no call was received with zero arguments', () => {
    assert.isFalse(target.receivedCall([], 1));
  });

  it('should return collection of argument objects for last call', () => {
    target.addCall([1, 'something', false]);
    const expected = [
      new Argument(1),
      new Argument('something'),
      new Argument(false)
    ];

    const actual = target.lastCallArguments;

    assert.deepEqual(actual, expected);
  });

  it('should return collection of argument values for last call', () => {
    const args = [1, 'something', false];
    target.addCall(args);

    const actual = target.lastCallArgumentValues;

    assert.deepEqual(args, actual);
  });

  it('should return string representation of all calls', () => {
    target.addCall([1, 'something', false]);
    target.addCall([2, 'something else', true]);
    const expected =
      'All Calls:\n[ {Number:1}, {String:something}, {Boolean:false} ]\n[ {Number:2}, {String:something else}, {Boolean:true} ]';

    const actual = target.allCallsString;

    assert.equal(expected, actual);
  });

  it('should return string representation of last call', () => {
    const args = [1, 'something', false];
    const expected =
      'Last Call:\n[ {Number:1}, {String:something}, {Boolean:false} ]';
    target.addCall(args);

    const actual = target.lastCallArgumentString;

    assert.equal(actual, expected);
  });

  it('should convert last call to return configuration', () => {
    const call1 = [1, 2];
    const call2 = [2, 3];
    target.addCall(call1);
    target.addCall(call2);

    target.convertLastCallToReturn(5);

    assert.isTrue(target.hasConfiguredMethodReturn(call2));
    assert.deepEqual(target.lastCallArgumentValues, call1);
  });
});
