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
    dataSource,
    columns,
    headerStyle,
    title
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

  const renderHeaders = columns => {
    return columns.map(column => {
      if (column.children) {
        return /*#__PURE__*/_react.default.createElement("th", {
          colSpan: getColSpan(column),
          style: {
            width: column.width
          },
          key: column.label
        }, column.label, renderHeaders(column.children));
      } else {
        return /*#__PURE__*/_react.default.createElement("th", {
          style: {
            width: column.width,
            borderBottom: "1px solid black"
          },
          key: column.label
        }, column.label);
      }
    });
  };
  const getColSpan = column => {
    if (!column.children) return 1;
    let colSpan = 0;
    column.children.forEach(child => {
      colSpan += getColSpan(child);
    });
    return colSpan;
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
            width: column.width
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
    let depthCount = 0;
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
  return /*#__PURE__*/_react.default.createElement("table", null, tableTitle ? /*#__PURE__*/_react.default.createElement("caption", null, tableTitle) : null, /*#__PURE__*/_react.default.createElement("thead", {
    style: headerStyleData
  }, /*#__PURE__*/_react.default.createElement("tr", null, renderHeaders(columnData))), /*#__PURE__*/_react.default.createElement("tbody", null, renderData(data, columnData)));
};
exports.HummingTable = HummingTable;
var _default = exports.default = HummingTable;
HummingTable.propTypes = {
  /**
   * Is this the principal call to action on the page?
   */
  primary: _propTypes.default.bool,
  /**
   * What background color to use
   */
  backgroundColor: _propTypes.default.string,
  /**
   * How large should the button be?
   */
  size: _propTypes.default.oneOf(['small', 'medium', 'large']),
  /**
   * Button contents
   */
  label: _propTypes.default.string.isRequired,
  /**
   * Optional click handler
   */
  onClick: _propTypes.default.func
};
HummingTable.defaultProps = {
  backgroundColor: null,
  primary: false,
  size: 'medium',
  onClick: undefined
};