"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("@jupyter-widgets/base");
const disposable_1 = require("@lumino/disposable");
const manager_1 = require("./manager");
const renderer_1 = require("./renderer");
class NBWidgetExtension {
    createNew(nb, context) {
        const manager = new manager_1.ContextManager(context);
        nb.content.rendermime.addFactory({
            safe: false,
            mimeTypes: [renderer_1.BOKEHJS_LOAD_MIME_TYPE],
            createRenderer: (options) => new renderer_1.BokehJSLoad(options),
        }, 0);
        // the rank has to be -1, so that the priority is higher than the
        // default javascript mime extension (rank=0)
        nb.content.rendermime.addFactory({
            safe: false,
            mimeTypes: [renderer_1.BOKEHJS_EXEC_MIME_TYPE],
            createRenderer: (options) => new renderer_1.BokehJSExec(options, manager),
        }, -1);
        return new disposable_1.DisposableDelegate(() => {
            if (nb.content.rendermime) {
                nb.content.rendermime.removeMimeType(renderer_1.BOKEHJS_EXEC_MIME_TYPE);
            }
            manager.dispose();
        });
    }
}
exports.NBWidgetExtension = NBWidgetExtension;
const metadata_1 = require("./metadata");
const widgets_1 = require("./widgets");
exports.extension = {
    id: metadata_1.name,
    requires: [base_1.IJupyterWidgetRegistry],
    activate: (app, widgets) => {
        // this adds the Bokeh widget extension onto Notebooks specifically
        app.docRegistry.addWidgetExtension("Notebook", new NBWidgetExtension());
        widgets.registerWidget({
            name: metadata_1.name,
            version: metadata_1.version,
            exports: {
                BokehModel: widgets_1.BokehModel,
                BokehView: widgets_1.BokehView,
            },
        });
    },
    autoStart: true,
};
