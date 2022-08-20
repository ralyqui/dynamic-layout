import { GRID_ELEMENT, GRID_ELEMENT_VISIBLE, GRID_SELECTOR } from "./config";

const styleSheet = document.createElement("style");
styleSheet.innerText = `
    .${GRID_SELECTOR} {
        position: relative;
        scrollbar-gutter: stable both-edges;
    } 
    .${GRID_ELEMENT} {
        position: absolute;
        height: 0 !important; 
        overflow: hidden;
    }
    .${GRID_ELEMENT_VISIBLE} {
        position: absolute;
    }`;
document.head.appendChild(styleSheet);
