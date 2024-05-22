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
const HummingTable = props => {
  /* variable */
  //let widthChangeX = 0;
  let defaultDisplayedRowNum = 10;
  let defaultHeaderColor = "#99CCFF";
  let defaultRowColor = "white";

  /* useState */
  const [data, setData] = (0, _react.useState)([]);
  const [columnData, setColumnData] = (0, _react.useState)([]);
  const [headerStyleData, setHeaderStyleData] = (0, _react.useState)({});
  //const [rowStyleData, setRowStyleData] = useState({})
  const [tableTitle, setTableTitle] = (0, _react.useState)("");
  const [rowNum, setRowNum] = (0, _react.useState)();
  const [showRowNumYn, setShowRowNumYn] = (0, _react.useState)();
  const [sizeChanger, setSizeChanger] = (0, _react.useState)([]);
  const [paginationYn, setPaginationYn] = (0, _react.useState)(true);
  const [selectedPage, setSelectedPage] = (0, _react.useState)(1);
  const [tableWidth, setTableWidth] = (0, _react.useState)("100%");
  const [rowZebraYn, setRowZebraYn] = (0, _react.useState)(false);
  const [rowSelectionConfig, setRowSelectionConfig] = (0, _react.useState)({});
  const [selectedRows, setSelectedRows] = (0, _react.useState)([]);
  const [hoverCell, setHoverCell] = (0, _react.useState)({
    row: "",
    idx: ""
  });
  const [mouseDownFlag, setMouseDownFlag] = (0, _react.useState)(false);
  const [widthChangeTargetCell1, setWidthChangeTargetCell1] = (0, _react.useState)();
  const [widthChangeTargetCell2, setWidthChangeTargetCell2] = (0, _react.useState)();
  const [widthChangeX, setWidthChangeX] = (0, _react.useState)(0);
  const [source1Width, setSource1Width] = (0, _react.useState)(0);
  const [source2Width, setSource2Width] = (0, _react.useState)(0);

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
      //console.log("queue : ", tableConfig)

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

    //let tmpColumnData = columnData

    const depthMap = generateHeader(columnData);
    const headers = [];
    depthMap.forEach((columns, depth) => {
      headers.push( /*#__PURE__*/_react.default.createElement("tr", {
        key: depth,
        style: {
          cursor: "col-resize"
        }
      }, columns.map((column, index) => /*#__PURE__*/_react.default.createElement("th", {
        key: depth + "." + index,
        rowSpan: column.rowSpanCount,
        colSpan: column.childCount,
        onMouseDown: e => mouseDownTh(e, depth, index),
        onMouseMove: e => mouseOnTh(e, depth, index),
        onMouseUp: e => mouseUpTh(e, depth, index),
        style: {
          cursor: JSON.stringify(hoverCell) === JSON.stringify({
            row: depth,
            idx: index
          }) ? 'col-resize' : 'default',
          width: column.width,
          height: "30px"
        }
      }, column.label))));
    });
    return headers;
  };
  const renderData = (data, columns, pageNum) => {
    let pageVal = Number(pageNum);
    let displayedData = [];
    let idx = 0;
    for (let i = (pageVal - 1) * rowNum; i < pageVal * rowNum; i++) {
      //console.log("i: ", i);
      if (data[i] !== undefined) {
        displayedData.push(data[i]);
        if (showRowNumYn === true) {
          //console.log("i: ",i)
          displayedData[idx]["_hummingRowNums"] = i + 1;
        }
      } else {
        displayedData.push({});
      }
      idx++;
    }
    return displayedData.map((row, rowIndex) => /*#__PURE__*/_react.default.createElement("tr", {
      style: {
        height: '25px'
      },
      key: rowIndex,
      onClick: val => {}
    }, renderRowData(row, columns, (pageVal - 1) * rowNum + rowIndex)));
  };
  const renderRowData = (row, columns, rowIndex) => {
    return columns.map((column, index) => {
      if (column.children) {
        return renderRowData(row, column.children, rowIndex);
      } else {
        //console.log(column, index)
        if (column.dataKey === "_hummingRowSelection" && Object.keys(row).length !== 0) {
          return /*#__PURE__*/_react.default.createElement("td", {
            key: index,
            style: {
              width: column.width,
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis"
            }
          }, /*#__PURE__*/_react.default.createElement("input", {
            checked: row["_hummingRowSelection"],
            type: rowSelectionConfig.type,
            onChange: value => {
              let tmpData = [...data];
              tmpData[rowIndex]["_hummingRowSelection"] = value.target.checked;
              setData(tmpData);
              let tmpSelectedRows = [...selectedRows];
              if (selectedRows.indexOf(tmpData[rowIndex]) === -1 && value.target.checked === true) {
                tmpSelectedRows = [...tmpSelectedRows, tmpData[rowIndex]];
                setSelectedRows(prev => {
                  return [...prev, tmpData[rowIndex]];
                });
              } else if (selectedRows.indexOf(tmpData[rowIndex]) !== -1 && value.target.checked === false) {
                tmpSelectedRows = tmpSelectedRows.filter(item => item !== tmpData[rowIndex]);
                setSelectedRows(prev => {
                  // filter를 사용하여 tmpData[rowIndex] 제외한 새로운 배열을 반환합니다.
                  return prev.filter(item => item !== tmpData[rowIndex]);
                });
              }
              props.rowSelection.onChange(tmpSelectedRows);
            }
          }));
        } else if (column.dataKey === "_hummingRowSelection" && Object.keys(row).length === 0) {
          return /*#__PURE__*/_react.default.createElement("td", {
            key: index,
            style: {
              width: column.width,
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis"
            }
          }, /*#__PURE__*/_react.default.createElement("div", null));
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
      }
    });
  };
  const cell_left = obj => {
    let eventObject = obj;
    if (eventObject.nativeEvent.offsetX < 5 && eventObject.nativeEvent.srcElement.cellIndex !== 0) {
      //Cell 의 왼쪽라인을 오차 픽셀 5 범위 안쪽에서 클릭하고, 가장 왼쪽의 Cell 이 아니라면
      return true;
    } else {
      return false;
    }
  };
  const cell_right = obj => {
    let eventObject = obj;
    if (eventObject.nativeEvent.offsetX > eventObject.nativeEvent.srcElement.offsetWidth - 5) {
      return true;
    } else {
      return false;
    }
  };
  const mouseOnTh = (e, depth, index) => {
    if (cell_left(e)) {
      setHoverCell({
        row: depth,
        idx: index
      });
    } else if (cell_right(e)) {
      setHoverCell({
        row: depth,
        idx: index
      });
    } else {
      setHoverCell({
        row: "",
        idx: ""
      });
    }

    //setMouseDownFlag
    if (mouseDownFlag) {
      //console.log(widthChangeTargetCell1, widthChangeTargetCell2)
      //전체 너비는 바꾸지 않고, 연관된 cell 2 개만 너비를 바꾼다.

      let changeWidth = widthChangeX - e.clientX;
      //console.log(changeWidth)

      // 첫 번째 셀의 너비 조정
      if (widthChangeTargetCell1) {
        //console.log(widthChangeTargetCell1.offsetWidth, changeWidth, widthChangeX, e.clientX)

        widthChangeTargetCell1.style.width = source1Width - changeWidth + 'px';
      }

      // 두 번째 셀의 너비 조정
      if (widthChangeTargetCell2) {
        //widthChangeTargetCell2.style.width = widthChangeTargetCell2.offsetWidth - 1 + 'px';

        widthChangeTargetCell2.style.width = source2Width + changeWidth - 5 + 'px';
      }
    }
  };
  const mouseDownTh = (e, depth, index) => {
    //console.log(e, "hello")

    if (cell_left(e)) {
      setMouseDownFlag(true);
      setWidthChangeX(e.clientX);
      //console.log("왼")

      let downX = e.clientX;
      let downY = e.clientY;
      let newDownX = downX - 5;

      // const newEvent = new MouseEvent('click', {
      //   clientX: newDownX,
      //   clientY: downY,
      //   bubbles: true,
      //   cancelable: true,
      //   view: window
      // });
      const element1 = document.elementFromPoint(downX, downY);
      const element2 = document.elementFromPoint(newDownX, downY);

      //console.log("element1 : ", element1)
      //console.log("element2 : ", element2)

      setWidthChangeTargetCell1(element2);
      setWidthChangeTargetCell2(element1);
      setSource1Width(element2.offsetWidth);
      setSource2Width(element1.offsetWidth);
    } else if (cell_right(e)) {
      setMouseDownFlag(true);
      setWidthChangeX(e.clientX);
      //console.log("오")
      let downX = e.clientX;
      let downY = e.clientY;
      let newDownX = downX + 5;

      // const newEvent = new MouseEvent('click', {
      //   clientX: newDownX,
      //   clientY: downY,
      //   bubbles: true,
      //   cancelable: true,
      //   view: window
      // });
      const element1 = document.elementFromPoint(downX, downY);
      const element2 = document.elementFromPoint(newDownX, downY);

      //console.log("element1 : ", element1)
      //console.log("element2 : ", element2)

      setWidthChangeTargetCell1(element1);
      setWidthChangeTargetCell2(element2);
      setSource1Width(element1.offsetWidth);
      setSource2Width(element2.offsetWidth);
    } else {}
  };
  const mouseUpTh = (e, depth, index) => {
    //console.log(e, "hello")
    setMouseDownFlag(false);
  };
  const goNextPage = () => {
    let tmpValue = Math.ceil(data.length / Number(rowNum));
    if (selectedPage !== tmpValue) {
      renderData(data, columnData, selectedPage + 1);
      setSelectedPage(prev => {
        return prev + 1;
      });
    }
  };
  const goLastPage = () => {
    let tmpValue = Math.ceil(data.length / Number(rowNum));
    if (selectedPage !== tmpValue) {
      renderData(data, columnData, tmpValue);
      setSelectedPage(prev => {
        return tmpValue;
      });
    }
  };
  const goPrevPage = () => {
    if (selectedPage !== 1) {
      renderData(data, columnData, selectedPage - 1);
      setSelectedPage(prev => {
        return prev - 1;
      });
    }
  };
  const goFirstPage = () => {
    if (selectedPage !== 1) {
      renderData(data, columnData, 1);
      setSelectedPage(prev => {
        return 1;
      });
    }
  };
  const paginationComponent = () => {
    //console.log(data)
    let pageNumList = [];
    for (let i = 0; i < data.length / Number(rowNum); i++) {
      //console.log(i)
      pageNumList.push(i + 1);
    }
    const startPage = Math.floor((selectedPage - 1) / 10) * 10 + 1;
    const endPage = Math.min(startPage + 9, pageNumList.length);

    // Get the current range of pages to display
    const currentPageRange = pageNumList.slice(startPage - 1, endPage);
    return /*#__PURE__*/_react.default.createElement("div", {
      style: {
        position: 'relative',
        paddingTop: "10px"
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, paginationYn ? /*#__PURE__*/_react.default.createElement("div", {
      id: "pagination1",
      style: {
        display: 'flex',
        justifyContent: "center",
        alignItems: "center"
      }
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "double-arrow-left",
      onClick: goFirstPage,
      style: {
        cursor: selectedPage !== 1 ? "pointer" : "not-allowed",
        marginRight: "5px"
      }
    }), /*#__PURE__*/_react.default.createElement("div", {
      className: "arrow-left",
      onClick: goPrevPage,
      style: {
        cursor: selectedPage !== 1 ? "pointer" : "not-allowed"
      }
    }), /*#__PURE__*/_react.default.createElement("div", {
      style: {
        display: "flex"
      }
    }, currentPageRange.map(value => {
      return /*#__PURE__*/_react.default.createElement("div", {
        key: value,
        className: "pagnationNum".concat(selectedPage === value ? ' selected' : ''),
        onClick: val => {
          setSelectedPage(Number(val.target.innerText));
        }
      }, value);
    })), /*#__PURE__*/_react.default.createElement("div", {
      className: "arrow-right",
      onClick: goNextPage,
      style: {
        cursor: selectedPage !== Math.ceil(data.length / Number(rowNum)) ? "pointer" : "not-allowed"
      }
    }), /*#__PURE__*/_react.default.createElement("div", {
      className: "double-arrow-right",
      onClick: goLastPage,
      style: {
        cursor: selectedPage !== Math.ceil(data.length / Number(rowNum)) ? "pointer" : "not-allowed",
        marginLeft: "5px"
      }
    })) : null, sizeChanger ? /*#__PURE__*/_react.default.createElement("div", {
      id: "pagination2",
      style: {
        position: 'absolute',
        right: '30px'
      }
    }, /*#__PURE__*/_react.default.createElement("select", {
      style: {
        width: "50px"
      },
      value: rowNum,
      onChange: val => {
        setRowNum(Number(val.target.value));
      }
    }, sizeChanger.map(value => {
      return /*#__PURE__*/_react.default.createElement("option", {
        key: value,
        value: Number(value)
      }, value);
    }))) : null));
  };

  /* useEffect */
  (0, _react.useEffect)(() => {
    let tmpData = props.dataSource ? props.dataSource : [];
    let tmpColumnData = props.columns ? props.columns : [];
    let tmpHeaderStyleData = props.headerStyle ? props.headerStyle : {
      backgroundColor: defaultHeaderColor,
      color: "black"
    };
    let tmpTableTitle = props.title ? props.title : null;
    let tmpDisplayedRowNum = props.displayedRowNum ? Number(props.displayedRowNum) : defaultDisplayedRowNum;
    let tmpDisplayRowNumsYn = props.displayRowNumsYn ? props.displayRowNumsYn : false;
    let tmpSizeChanger = props.sizeChanger ? props.sizeChanger : null;
    let tmpTableWidth = props.width ? props.width : "100%";
    let tmpZebra = props.zebra ? props.zebra : "";
    let tmpRowSelection = props.rowSelection ? props.rowSelection : null;
    if (tmpRowSelection === null) {
      setRowSelectionConfig(tmpRowSelection);
    } else if (tmpRowSelection.type !== 'checkbox' && tmpRowSelection.type !== 'radio') {
      throw new Error("rowSelection must have type 'checkbox' or 'radio'");
    } else {
      //정상적으로 rowSelection을 셋팅 할때,
      if (tmpRowSelection.type) {
        tmpData.forEach(item => {
          item['_hummingRowSelection'] = false;
        });
      }

      //console.log(tmpData)
      //displayedData[idx]["_hummingRowSelection"] = <input type={tmpRowSelection.type} onChange={(value) => {console.log(value)}}/>;

      setRowSelectionConfig(tmpRowSelection);
    }
    setData(tmpData);
    setColumnData(tmpColumnData);
    setHeaderStyleData(tmpHeaderStyleData);
    setTableTitle(tmpTableTitle);
    setRowNum(Number(tmpDisplayedRowNum));
    setShowRowNumYn(tmpDisplayRowNumsYn);
    setSizeChanger(tmpSizeChanger);
    setTableWidth(tmpTableWidth);
    setRowZebraYn(tmpZebra);
    //console.log(tmpData.length, tmpDisplayedRowNum)
    if (props.paginationYn !== null) {
      setPaginationYn(true);
    } else {
      setPaginationYn(false);
    }

    //dataSource = [], columns = [], headerStyle = [], title = undefined, displayedRows="20", displayRowNums=true
  }, [props]);
  (0, _react.useEffect)(() => {
    let tmpData = props.dataSource ? props.dataSource : [];
    //console.log("data:",tmpData)
    setData(tmpData);
    //console.log("data : ", dataSource);
  }, [props.dataSource]);
  (0, _react.useEffect)(() => {
    //console.log("showRowNumYn : ", showRowNumYn)
    let tmpColumnData = props.columns; //columnData
    //console.log("props.columns : ", props.columns, rowSelectionConfig)

    if (props.rowSelection !== null || showRowNumYn === true) {
      let bufferTmpColumnData = [];
      let rowSelectionColumnConfig = {
        dataKey: "_hummingRowSelection",
        label: props.rowSelection.type === "checkbox" ? /*#__PURE__*/_react.default.createElement("input", {
          id: "allCheck",
          type: props.rowSelection.type
        }) : "",
        width: "30px",
        sortable: "false"
      };
      let rowNumColumnConfig = {
        dataKey: "_hummingRowNums",
        label: "No.",
        width: "30px",
        sortable: "false"
      };
      if (props.rowSelection !== null) {
        bufferTmpColumnData = [rowSelectionColumnConfig, ...tmpColumnData];
      }
      if (showRowNumYn === true) {
        bufferTmpColumnData = [rowNumColumnConfig, ...bufferTmpColumnData];
      }
      setColumnData(bufferTmpColumnData);
    } else {
      setColumnData(tmpColumnData);
    }
  }, [props.columns, props.displayRowNumsYn,, showRowNumYn]);
  (0, _react.useEffect)(() => {
    let tmpDisplayRowNumsYn = props.displayRowNumsYn ? props.displayRowNumsYn : false;
    setShowRowNumYn(tmpDisplayRowNumsYn);
  }, [props.displayRowNumsYn]);
  return /*#__PURE__*/_react.default.createElement("div", {
    style: {
      width: tableWidth
    }
  }, /*#__PURE__*/_react.default.createElement("div", {
    id: "tableArea"
  }, /*#__PURE__*/_react.default.createElement("table", {
    style: {}
  }, tableTitle ? /*#__PURE__*/_react.default.createElement("caption", null, tableTitle) : null, /*#__PURE__*/_react.default.createElement("thead", {
    style: headerStyleData
  }, makeHeader()), /*#__PURE__*/_react.default.createElement("tbody", {
    className: rowZebraYn ? 'zebra' : ''
  }, renderData(data, columnData, selectedPage)))), /*#__PURE__*/_react.default.createElement("div", {
    id: "paginationArea"
  }, paginationComponent()));
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