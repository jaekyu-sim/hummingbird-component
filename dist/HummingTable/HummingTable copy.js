"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.HummingTable = void 0;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
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
    headerStyle
  } = _ref;
  /* variable */

  /* useState */
  const [data, setData] = (0, _react.useState)(dataSource);
  const [columnData, setColumnData] = (0, _react.useState)([]);

  /* custom function */
  // const sortData = (key) => {
  // setData([...data].sort((a, b) => a[key] - b[key]));
  // };

  const iterateColumns = columns => {
    columns.forEach(column => {
      if (!column.dataKey || !column.label) {
        throw new Error('column 의 dataKey와 label은 필수 속성입니다.');
      }
      if (column.children) {
        console.log('Children:');
        iterateColumns(column.children);
      } else {
        setColumnData(prev => {
          let tmpDataKey = column.dataKey;
          let tmpLabel = column.label;
          let tmpWidth = column.width ? column.width : "70px";
          let tmpSortable = column.sortable ? column.sortable : false;
          return [...prev, {
            dataKey: tmpDataKey,
            label: tmpLabel,
            width: tmpWidth,
            sortable: tmpSortable
          }];
        });
      }
    });
  };
  const TableHeader = _ref2 => {
    let {
      columns
    } = _ref2;
    const renderHeader = columns => {
      return /*#__PURE__*/_react.default.createElement("tr", null, columns.map(column => /*#__PURE__*/_react.default.createElement("th", {
        key: column.dataKey,
        style: {
          width: column.width,
          border: "1px solid #444444"
        }
      }, column.label, column.children && /*#__PURE__*/_react.default.createElement(TableHeader, {
        columns: column.children
      }))));
    };
    return /*#__PURE__*/_react.default.createElement("thead", null, renderHeader(columns));
  };
  const renderDataCell = (row, column) => {
    if (column.children) {
      return column.children.map(childColumn => {
        return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, {
          key: childColumn.dataKey
        }, renderDataCell(row, childColumn));
      });
    } else {
      return /*#__PURE__*/_react.default.createElement("td", {
        key: column.dataKey,
        style: {
          border: "1px solid #444444"
        }
      }, row[column.dataKey]);
    }
  };

  /* useEffect */
  (0, _react.useEffect)(() => {}, []);
  (0, _react.useEffect)(() => {
    setData(dataSource);
  }, [dataSource]);
  (0, _react.useEffect)(() => {
    iterateColumns(columns);
  }, [columns]);
  (0, _react.useEffect)(() => {}, [headerStyle]);
  return /*#__PURE__*/_react.default.createElement("table", {
    style: {
      border: "1px solid #444444",
      width: "100%"
    }
  }, /*#__PURE__*/_react.default.createElement(TableHeader, {
    columns: columns
  }), /*#__PURE__*/_react.default.createElement("tbody", null, data.map((row, rowIndex) => /*#__PURE__*/_react.default.createElement("tr", {
    key: rowIndex,
    style: {
      border: "1px solid #444444"
    }
  }, columns.map(column => renderDataCell(row, column))))));
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