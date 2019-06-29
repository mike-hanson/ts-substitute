"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const substitute_context_1 = require("./substitute-context");
/**
 * Static factory for creating substitutes
 *
 */
class Substitute {
    /**
     * Creates a substitute for the specified type
     *
     * @typeparam T The interface being substituted
     *
     * @returns
     * An object with the same shape as the interface and additional methods for
     * configuring the substitute and making assertions about it's usage
     */
    static for() {
        var substituteContext = new substitute_context_1.SubstituteContext();
        return substituteContext.rootProxy;
    }
}
exports.Substitute = Substitute;
//# sourceMappingURL=substitute.js.map