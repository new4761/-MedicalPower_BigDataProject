"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
// Entry point for the notebook bundle containing custom model definitions.
//
// Setup notebook base URL
//
// Some static assets may be required by the custom widget javascript. The base
// url for the notebook is not known at build time and is therefore computed
// dynamically.
window.__webpack_public_path__ = document.querySelector("body").getAttribute("data-base-url") + "nbextensions/jupyter_bokeh";
tslib_1.__exportStar(require("./index"), exports);
