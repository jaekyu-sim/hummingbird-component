"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.HummingTable = void 0;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
require("./HummingTable.css");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
//import './button.css';

/**
 * Primary UI component for user interaction
 */
const HummingTable = _ref => {
  let {
    dataSource = [],
    columns = [],
    headerStyle = [],
    title = undefined
  } = _ref;
  /* variable */

  /* useState */
  const [data, setData] = (0, _react.useState)(dataSource);
  const [columnData, setColumnData] = (0, _react.useState)(columns);
  const [headerStyleData, setHeaderStyleData] = (0, _react.useState)(headerStyle);
  const [tableTitle, setTableTitle] = (0, _react.useState)();

  /* custom function */
  // const sortData = (key) => {
  // setData([...data].sort((a, b) => a[key] - b[key]));
  // };

  const makeHeader = () => {
    function countTotalChildren(node) {
      if (!node.children) return 1;

      //let count = node.children.length;

      let count = 0;
      for (let i = 0; i < node.children.length; i++) {
        if (node.children[i].children) {} else {
          count = count + 1;
        }
      }
      node.children.forEach(child => {
        count += countTotalChildren(child);
      });
      return count;
    }
    function generateHeader(tableConfig) {
      let queue = [...tableConfig];
      let depthMap = new Map(); // depth별로 요소를 저장할 맵

      while (queue.length > 0) {
        const node = queue.shift();
        const depth = node.depth || 0; // depth가 없으면 0으로 설정

        if (!depthMap.has(depth)) {
          depthMap.set(depth, []); // 해당 depth의 배열이 없으면 초기화
        }

        // 각 요소의 총 children 개수 계산
        let tmpVal = countTotalChildren(node);
        if (tmpVal > 1) {
          tmpVal = tmpVal / 2;
        }
        node.childCount = tmpVal;
        depthMap.get(depth).push(node); // 해당 depth의 배열에 요소 추가

        // children이 있으면 큐에 추가하고 depth를 증가시켜서 넣음
        if (node.children) {
          node.children.forEach(child => {
            child.depth = depth + 1; // 하위 요소의 depth 증가
            queue.push(child);
          });
        }
      }
      for (let i = 0; i < depthMap.size; i++) {
        depthMap.get(i).forEach((item, idx) => {
          if (depthMap.get(i)[idx].children) {
            depthMap.get(i)[idx].rowSpanCount = 1;
          } else {
            depthMap.get(i)[idx].rowSpanCount = depthMap.size - i;
          }
        });
      }
      return depthMap;
    }

    // Example usage:
    const depthMap = generateHeader(columnData);
    const headers = [];
    depthMap.forEach((columns, depth) => {
      headers.push( /*#__PURE__*/_react.default.createElement("tr", {
        key: depth
      }, columns.map((column, index) => /*#__PURE__*/_react.default.createElement("th", {
        key: index,
        rowSpan: column.rowSpanCount,
        colSpan: column.childCount
      }, column.label))));
    });
    return headers;
  };
  const renderData = (data, columns) => {
    return data.map((row, rowIndex) => /*#__PURE__*/_react.default.createElement("tr", {
      key: rowIndex,
      style: {
        borderBottom: "1px solid black",
        backgroundColor: "#D6EEEE"
      }
    }, renderRowData(row, columns)));
  };
  const renderRowData = (row, columns) => {
    return columns.map((column, index) => {
      if (column.children) {
        return renderRowData(row, column.children);
      } else {
        return /*#__PURE__*/_react.default.createElement("td", {
          key: index,
          style: {
            width: column.width,
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis"
          }
        }, row[column.dataKey]);
      }
    });
  };

  /* useEffect */
  (0, _react.useEffect)(() => {}, []);
  (0, _react.useEffect)(() => {
    setData(dataSource);
    //console.log("data : ", dataSource);
  }, [dataSource]);
  (0, _react.useEffect)(() => {
    //console.log("column : ", columns)
    setColumnData(columns);
  }, [columns]);
  (0, _react.useEffect)(() => {
    setHeaderStyleData(headerStyle);
  }, [headerStyle]);
  (0, _react.useEffect)(() => {
    setTableTitle(title);
  }, [title]);
  return /*#__PURE__*/_react.default.createElement("table", {
    style: {
      width: "100%",
      tableLayout: "fixed",
      padding: "20px"
    }
  }, tableTitle ? /*#__PURE__*/_react.default.createElement("caption", null, tableTitle) : null, /*#__PURE__*/_react.default.createElement("thead", {
    style: headerStyleData
  }, makeHeader()), /*#__PURE__*/_react.default.createElement("tbody", null, renderData(data, columnData)));
};
exports.HummingTable = HummingTable;
var _default = exports.default = HummingTable;
HummingTable.propTypes = {
  /**
   * Is this the principal call to action on the page?
   */

  /**
   * Optional click handler
   */
  onClick: _propTypes.default.func
};