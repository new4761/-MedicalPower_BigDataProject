import { IDisposable } from "@lumino/disposable";
import { DocumentRegistry } from "@jupyterlab/docregistry";
/**
 * A micro manager that contains the document context
 *
 * This will grow in the future if we implement bokeh.io.push_notebook
 */
export declare type Context = DocumentRegistry.IContext<DocumentRegistry.IModel>;
export declare class ContextManager implements IDisposable {
    private _context;
    constructor(context: Context);
    get context(): Context;
    get isDisposed(): boolean;
    dispose(): void;
}
