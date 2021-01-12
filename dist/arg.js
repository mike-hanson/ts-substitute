"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Arg = void 0;
/**
 * Argument matcher for assertions
 *  */
class Arg {
    static any(type) {
        if (!type) {
            const func = (_arg) => true;
            func['isMatcher'] = true;
            return func;
        }
        if (type === 'Array') {
            const func = (arg) => {
                return Array.isArray(arg.originalValue);
            };
            func['isMatcher'] = true;
            return func;
        }
        const func = (arg) => arg.type === type;
        func['isMatcher'] = true;
        return func;
    }
    static is(predicate) {
        const func = (arg) => predicate(arg);
        func['isMatcher'] = true;
        return func;
    }
}
exports.Arg = Arg;
//# sourceMappingURL=arg.js.map