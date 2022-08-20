"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("./config");
var styleSheet = document.createElement("style");
styleSheet.innerText = "\n    .".concat(config_1.GRID_SELECTOR, " {\n        position: relative;\n        scrollbar-gutter: stable both-edges;\n    } \n    .").concat(config_1.GRID_ELEMENT, " {\n        position: absolute;\n        height: 0 !important; \n        overflow: hidden;\n    }\n    .").concat(config_1.GRID_ELEMENT_VISIBLE, " {\n        position: absolute;\n    }");
document.head.appendChild(styleSheet);
