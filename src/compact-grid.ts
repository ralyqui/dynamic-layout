import {
  getGridElements,
  getGridId,
  putGridId,
  getData,
  setData,
  makeVisible,
  parseTagValue,
} from "./helper";
import * as config from "./config";

interface CompactData {
  columnHeight: Map<number, number>;
  columnCnt: number;
  spacing: [number, number]; // Distance separating tiles [x,y]
}

function getColumnWidth(grid: Element, columnAmount: number) {
  return Math.floor((grid as HTMLElement).offsetWidth / columnAmount);
}

/*
  Center the element in their allocated column
 */
function calcLeftOffset(
  columnId: number,
  elemWidth: number,
  columnWidth: number,
  spacingX: number
) {
  let deltaX = spacingX;
  if (columnId === 0 || columnWidth - elemWidth > spacingX / 2) deltaX = 0;
  return (
    columnId * (columnWidth - 1) +
    (columnWidth - elemWidth - deltaX) / 2 +
    deltaX
  );
}

function parseSpacing(grid: Element): [number, number] {
  return [
    parseTagValue(grid.className, config.SPACING_X),
    parseTagValue(grid.className, config.SPACING_Y),
  ];
}

function getElementWidth(grid: Element) {
  const width = grid.className
    .split(" ")
    .filter((cl) =>
      new RegExp(`${config.COMPACT_GRID_SELECTOR}-*`).test(cl)
    )[0];
  const id = parseInt(
    width.substring(config.COMPACT_GRID_SELECTOR.length + 1),
    10
  );

  if (!Number.isNaN(id)) return id;
  return -1;
}

function getElementHeight(el: Element) {
  const element = el as HTMLElement;
  const max = element.style.maxHeight
    ? parseInt(element.style.maxHeight, 10)
    : NaN;
  const min = element.style.minHeight
    ? parseInt(element.style.minHeight, 10)
    : NaN;
  if (!Number.isNaN(max) && el.scrollHeight > max) return max;
  if (!Number.isNaN(min) && el.scrollHeight < min) return min;
  return el.scrollHeight;
}

function calcColumns(grid: Element) {
  const elementWidth = getElementWidth(grid) + parseSpacing(grid)[0];
  return Math.floor((grid as HTMLElement).offsetWidth / elementWidth);
}

function isMarked(el: Element): boolean {
  return el.className.split(" ").some((c) => c === config.ELEMENT_ACTIVE);
}

function markProcessed(el: Element) {
  if (isMarked(el)) return;
  el.classList.add(config.ELEMENT_ACTIVE);
  makeVisible(el);
}

function getMinColumn(gridId: number): [number, number] {
  let minIdx = -1;
  let min = Infinity;

  (getData(gridId) as CompactData).columnHeight.forEach((v, k) => {
    if (v < min) {
      min = v;
      minIdx = k;
    }
  });

  return [minIdx, min];
}

function placeElement(
  e: Element,
  grid: Element,
  columnAmount: number,
  spacing: [number, number]
) {
  const id = getGridId(grid);
  markProcessed(e);
  const [columnId, currentHeight] = getMinColumn(id);
  if (id === -1) return;
  (e as HTMLElement).style.top = `${currentHeight}px`;
  (e as HTMLElement).style.left = `${calcLeftOffset(
    columnId,
    getElementWidth(grid),
    getColumnWidth(grid, columnAmount),
    spacing[0]
  )}px`;
  (getData(id) as CompactData).columnHeight.set(
    columnId,
    currentHeight + getElementHeight(e) + spacing[1]
  );
}

function emptyColumns(cnt: number) {
  const map = new Map<number, number>();
  for (let i = 0; i < cnt; i++) {
    map.set(i, 0);
  }
  return map;
}

function fillColumns(
  grid: Element,
  id: number,
  elements: Element[],
  columnAmount: number,
  spacing: [number, number]
) {
  const data: CompactData = {
    columnHeight: emptyColumns(columnAmount),
    columnCnt: columnAmount,
    spacing: spacing ?? [0, 0],
  };
  setData(id, data);
  for (const e of elements) {
    placeElement(e, grid, columnAmount, spacing);
  }
}

function updateColumns(
  grid: Element,
  id: number,
  elements: Element[],
  columnAmount: number,
  spacing: [number, number]
) {
  for (const e of elements) {
    placeElement(e, grid, columnAmount, spacing);
  }
}

export function renderCompact(grid: Element) {
  const id = getGridId(grid);
  const elements = getGridElements(grid);
  const columnAmount = calcColumns(grid);
  const spacing = parseSpacing(grid);
  if (id === -1) {
    const newId = putGridId(grid);
    fillColumns(grid, newId, elements, columnAmount, spacing);
  } else {
    fillColumns(grid, id, elements, columnAmount, spacing);
  }
}

export function updateCompact(grid: Element) {
  const id = getGridId(grid);
  const elements = getGridElements(grid).filter((el) => !isMarked(el));
  const columnAmount = calcColumns(grid);
  const spacing = parseSpacing(grid);
  if (id !== -1) {
    updateColumns(grid, id, elements, columnAmount, spacing);
  }
}
