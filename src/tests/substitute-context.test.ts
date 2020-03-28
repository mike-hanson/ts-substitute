import { assert } from 'chai';

import { SubstituteContext } from '../substitute-context';

describe('SubstituteContext', () => {
    let target: SubstituteContext;
    
    beforeEach(() => {
        target = new SubstituteContext();
    });

    it('should be defined', () => {
        assert.isDefined(target);
    });

    it('should implement a property to get the root proxy', () => {
        assert.isFunction(target.rootProxy, 'Property was not defined');
    });
});
