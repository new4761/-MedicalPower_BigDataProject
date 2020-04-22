import { DOMWidgetModel, DOMWidgetView } from "@jupyter-widgets/base";
declare type DocsJson = any;
declare type RenderItem = any;
declare type DocumentChangedEvent = any;
declare type Fragment = any;
export declare type RenderBundle = {
    docs_json: DocsJson;
    render_items: RenderItem[];
    div: string;
};
export declare class BokehModel extends DOMWidgetModel {
    defaults(): any;
    static serializers: {
        [x: string]: {
            deserialize?: ((value?: any, manager?: import("@jupyter-widgets/base").ManagerBase<any> | undefined) => any) | undefined;
            serialize?: ((value?: any, widget?: import("@jupyter-widgets/base").WidgetModel | undefined) => any) | undefined;
        };
    };
}
export declare class BokehView extends DOMWidgetView {
    private _document;
    private _receiver;
    private _blocked;
    constructor(options?: any);
    render(): void;
    protected _change_event(event: DocumentChangedEvent): void;
    protected _consume_patch(content: {
        msg: "patch";
        payload?: Fragment;
    }, buffers: DataView[]): void;
}
export {};
