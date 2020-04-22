"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const widgets_1 = require("@lumino/widgets");
/**
 * The MIME types for BokehJS.
 */
const HTML_MIME_TYPE = "text/html";
const JS_MIME_TYPE = "application/javascript";
exports.BOKEHJS_LOAD_MIME_TYPE = "application/vnd.bokehjs_load.v0+json";
exports.BOKEHJS_EXEC_MIME_TYPE = "application/vnd.bokehjs_exec.v0+json";
/**
 * Load BokehJS and CSS into the DOM
 */
class BokehJSLoad extends widgets_1.Widget {
    constructor(_options) {
        super();
        this._load_mimetype = exports.BOKEHJS_LOAD_MIME_TYPE;
        this._script_element = document.createElement("script");
    }
    renderModel(model) {
        const data = model.data[this._load_mimetype];
        this._script_element.textContent = data;
        this.node.appendChild(this._script_element);
        return Promise.resolve();
    }
}
exports.BokehJSLoad = BokehJSLoad;
/**
 * Exec BokehJS in window
 */
class BokehJSExec extends widgets_1.Widget {
    constructor(_options, manager) {
        super();
        // for classic nb compat reasons, the payload in contained in these mime messages
        this._html_mimetype = HTML_MIME_TYPE;
        this._js_mimetype = JS_MIME_TYPE;
        // the metadata is stored here
        this._exec_mimetype = exports.BOKEHJS_EXEC_MIME_TYPE;
        this._script_element = document.createElement("script");
        this._manager = manager;
    }
    get isDisposed() {
        return this._manager == null;
    }
    renderModel(model) {
        const metadata = model.metadata[this._exec_mimetype];
        if (metadata.id !== undefined) {
            // I'm a static document
            const data = model.data[this._js_mimetype];
            this._script_element.textContent = data;
            if (Bokeh !== undefined && Bokeh.embed.kernels !== undefined) {
                this._document_id = metadata.id;
                const { _manager } = this;
                const kernel_proxy = {
                    registerCommTarget(targetName, callback) {
                        var _a;
                        const kernel = (_a = _manager.context.sessionContext.session) === null || _a === void 0 ? void 0 : _a.kernel;
                        if (kernel != null)
                            kernel.registerCommTarget(targetName, callback);
                    },
                };
                Bokeh.embed.kernels[this._document_id] = kernel_proxy;
                _manager.context.sessionContext.statusChanged.connect((_session, status) => {
                    if (status == "restarting" || status === "dead") {
                        delete Bokeh.embed.kernels[this._document_id];
                    }
                }, this);
            }
        }
        else if (metadata.server_id !== undefined) {
            // I'm a server document
            this._server_id = metadata.server_id;
            const data = model.data[this._html_mimetype];
            const d = document.createElement("div");
            d.innerHTML = data;
            const script_attrs = d.children[0].attributes;
            for (const i in script_attrs) {
                this._script_element.setAttribute(script_attrs[i].name, script_attrs[i].value);
            }
            this._script_element.textContent = d.textContent;
        }
        this.node.appendChild(this._script_element);
        return Promise.resolve();
    }
    dispose() {
        var _a;
        if (this.isDisposed)
            return;
        if (this._server_id) {
            const content = {
                code: `import bokeh.io.notebook as ion; ion.destroy_server("${this._server_id}")`,
            };
            const kernel = (_a = this._manager.context.sessionContext.session) === null || _a === void 0 ? void 0 : _a.kernel;
            if (kernel != null)
                kernel.requestExecute(content, true);
            this._server_id = null;
        }
        else if (this._document_id) {
            if (Bokeh.embed.kernels !== undefined) {
                delete Bokeh.embed.kernels[this._document_id];
            }
            this._document_id = null;
        }
        this._manager = null;
    }
}
exports.BokehJSExec = BokehJSExec;
