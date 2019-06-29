"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const substitute_context_1 = require("../substitute-context");
describe('SubstituteContext', () => {
    let target;
    beforeEach(() => {
        target = new substitute_context_1.SubstituteContext();
    });
    it('should be defined', () => {
        chai_1.assert.isDefined(target);
    });
    it('should implement a property to get the root proxy', () => {
        chai_1.assert.isFunction(target.rootProxy, 'Property was not defined');
    });
});
//# sourceMappingURL=substitute-context.test.js.map