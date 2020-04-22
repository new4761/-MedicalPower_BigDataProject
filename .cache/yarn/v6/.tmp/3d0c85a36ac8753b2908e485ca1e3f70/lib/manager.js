"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ContextManager {
    constructor(context) {
        this._context = context;
    }
    get context() {
        if (this._context != null)
            return this._context;
        else
            throw new Error("context was already disposed");
    }
    get isDisposed() {
        return this._context == null;
    }
    dispose() {
        if (this.isDisposed)
            return;
        this._context = null;
    }
}
exports.ContextManager = ContextManager;
