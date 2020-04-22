"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("@jupyter-widgets/base");
//import {Document, DocumentChangedEvent, ModelChangedEvent} from "document"
//import {Receiver, Fragment} from "protocol/receiver"
//import {keys, values} from "core/util/object"
const metadata_1 = require("./metadata");
function bk_require(name) {
    return window.Bokeh.require(name);
}
const { keys, values } = Object;
const version_range = `^${metadata_1.version}`;
class BokehModel extends base_1.DOMWidgetModel {
    defaults() {
        return Object.assign(Object.assign({}, super.defaults()), { _model_name: "BokehModel", _model_module: metadata_1.name, _model_module_version: version_range, _view_name: "BokehView", _view_module: metadata_1.name, _view_module_version: version_range, render_bundle: {} });
    }
}
exports.BokehModel = BokehModel;
BokehModel.serializers = Object.assign({}, base_1.DOMWidgetModel.serializers);
class BokehView extends base_1.DOMWidgetView {
    constructor(options) {
        super(options);
        this._document = null;
        this._blocked = false;
        const { Receiver } = bk_require("protocol/receiver");
        this._receiver = new Receiver();
        this.model.on("change:render_bundle", () => this.render());
        this.listenTo(this.model, "msg:custom", (content, buffers) => this._consume_patch(content, buffers));
    }
    render() {
        const bundle = JSON.parse(this.model.get("render_bundle"));
        const { docs_json, render_items, div } = bundle;
        this.el.innerHTML = div;
        const element = this.el.children[0];
        const json = values(docs_json)[0];
        const { Document } = bk_require("document");
        const { add_document_standalone } = bk_require("embed/standalone");
        this._document = Document.from_json(json);
        for (const item of render_items) {
            const roots = {};
            for (const root_id in item.roots)
                roots[root_id] = element;
            add_document_standalone(this._document, element, roots);
        }
        this._document.on_change((event) => this._change_event(event));
    }
    _change_event(event) {
        const { ModelChangedEvent } = bk_require("document/events");
        if (!this._blocked && event instanceof ModelChangedEvent)
            this.send({ event: "jsevent", id: event.model.id, new: event.new_, attr: event.attr, old: event.old });
    }
    _consume_patch(content, buffers) {
        if (this._document == null)
            return;
        if (content.msg == "patch") {
            const { payload } = content;
            this._receiver.consume(payload != null ? payload : buffers[0].buffer);
            const comm_msg = this._receiver.message;
            if (comm_msg != null && keys(comm_msg.content).length > 0) {
                this._blocked = true;
                try {
                    this._document.apply_json_patch(comm_msg.content, comm_msg.buffers);
                }
                finally {
                    this._blocked = false;
                }
            }
        }
    }
}
exports.BokehView = BokehView;
