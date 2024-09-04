"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.HummingTable = void 0;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
require("./HummingTable.css");
var _NoDataIcon = _interopRequireDefault(require("./Icons/NoDataIcon"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
/* library import */

// 아이콘이 저장된 파일 경로를 적어줍니다.
//import './button.css';

const HummingTable = props => {
  /* variable */
  //let widthChangeX = 0;
  let defaultDisplayedRowNum = 10;
  let defaultHeaderColor = "#efefef";
  let clickedRowColor = "#999";

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
  const [tableHeight, setTableHeight] = (0, _react.useState)("100%");
  const [rowZebraYn, setRowZebraYn] = (0, _react.useState)(false);
  const [rowSelectionConfig, setRowSelectionConfig] = (0, _react.useState)({});
  const [selectedRows, setSelectedRows] = (0, _react.useState)([]);
  const [paginationInfo, setPaginationInfo] = (0, _react.useState)();
  const [activeFilterColumn, setActiveFilterColumn] = (0, _react.useState)(null);
  const [activeFilteringDataLists, setActiveFilteringDataLists] = (0, _react.useState)({});
  const [activeFilterCheckedData, setActiveFilterCheckedData] = (0, _react.useState)({});
  const [clickedRowIdx, setClickedRowIdx] = (0, _react.useState)();
  const [rowHeight, setRowHeight] = (0, _react.useState)("27px");
  const [hummingTableWidth, setHummingTableWidth] = (0, _react.useState)("100%");
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

  /* useRef */
  const filterPopupRef = (0, _react.useRef)();
  const latestActiveFilterCheckedData = (0, _react.useRef)(activeFilterCheckedData);

  /* custom function */
  const checkTextOveflow = e => {
    // text-overflow가 발생하지 않은 경우
    if (e.target.clientWidth >= e.target.scrollWidth) {
      return false;
    }
    return true;
  };
  const getDetailValue = e => {
    if (checkTextOveflow(e) === false) {
      return;
    } else {
      ////console.log("true~", e)
    }
  };
  const makeAlldataCheckState = value => {
    console.log("data : ", data);
    let tmpData = [...data];
    let tmpSelectedRows = [...selectedRows];
    //debugger;
    tmpData.forEach((item, rowIndex) => {
      item['_hummingRowSelection'] = value;
      if (selectedRows.indexOf(tmpData[rowIndex]) === -1 && value === true) {
        //debugger;

        tmpSelectedRows = [...tmpSelectedRows, tmpData[rowIndex]];
        setSelectedRows(prev => {
          return [...prev, tmpData[rowIndex]];
        });
      } else if (selectedRows.indexOf(tmpData[rowIndex]) !== -1 && value === false) {
        //debugger;
        tmpSelectedRows = tmpSelectedRows.filter(item => item !== tmpData[rowIndex]);
        setSelectedRows(prev => {
          // filter를 사용하여 tmpData[rowIndex] 제외한 새로운 배열을 반환합니다.
          //debugger;
          //return tmpSelectedRows;
          return prev.filter(item => item !== tmpData[rowIndex]);
        });
      }
    });
    setData(tmpData);
    let tmpSelect = tmpData.filter(item => item["_hummingRowSelection"] === true);
    //props.rowSelection.onChange(tmpSelectedRows)
    props.rowSelection.onChange(tmpSelect);
  };
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
      ////console.log("queue : ", tableConfig)

      //debugger
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

    //debugger;
    /*
    let totalWidth = 0;
    let windowWidth = window.innerWidth;
    
    if(columnData.length !== 0)
    {
      // debugger;
      columnData.forEach((item, idx)=>{
        if(typeof item.width == "string")
        {
          //debugger;
          if(item.dataKey === "_hummingRowSelection" || item.dataKey === "_hummingRowNums")
          {
            totalWidth = totalWidth + 30;
          }
        }
        
      })
        let tmpTotalWidth = totalWidth + document.getElementById("humming-table").clientWidth;//totalWidth;//column 너비 다 합친 값.
      //이제 humming-table-area 의 너비 필요.
      let tmpTableWidth = document.getElementById("tableArea").clientWidth;
      let tmpTableRatio = tmpTableWidth / tmpTotalWidth;
      setHummingTableWidth(tmpTotalWidth * tmpTableRatio * 0.9)
      columnData.forEach((item, idx)=>{
        //item.width = (item.width * tmpTableRatio) + "px";
        
        item.width = Number(item.width.split("px")[0])*tmpTableRatio + "px";
        
        
      })
      
      
    }*/

    const depthMap = generateHeader(columnData);
    const headers = [];
    let filterLists = [];
    //debugger;

    depthMap.forEach((columns, depth) => {
      //debugger;
      headers.push( /*#__PURE__*/_react.default.createElement("tr", {
        id: "humming-table-header-row",
        key: depth,
        style: {
          cursor: "col-resize"
        }
      }, columns.map((column, index) => /*#__PURE__*/_react.default.createElement("th", {
        id: "humming-table-th",
        key: depth + "." + index,
        rowSpan: column.rowSpanCount,
        colSpan: column.childCount
        //onMouseDown={(e) => mouseDownTh(e, depth, index)} 
        //onMouseMove={(e) => mouseOnTh(e, depth, index)}
        //onMouseUp  ={(e) => mouseUpTh(e, depth, index)}
        ,
        style: {
          cursor: JSON.stringify(hoverCell) === JSON.stringify({
            row: depth,
            idx: index
          }) ? 'col-resize' : 'default',
          width: column.width,
          height: "10px",
          //display:"flex",
          textAlign: "center",
          justifyContent: 'center',
          alignItems: "center"
        }
      }, /*#__PURE__*/_react.default.createElement("div", {
        style: {
          display: "flex",
          alignItems: "center",
          width: column.width,
          overflow: "hidden"
        }
      }, /*#__PURE__*/_react.default.createElement("div", {
        style: {
          flex: 1,
          textAlign: "center",
          height: "100%",
          overflow: "hidden"
        }
      }, column.label), /*#__PURE__*/_react.default.createElement("div", {
        style: {
          display: "flex"
        }
      }, column.sortable === true ? /*#__PURE__*/_react.default.createElement("div", {
        onClick: () => {
          const sortedData = [...data].sort((a, b) => {
            if (a[column.dataKey] < b[column.dataKey]) {
              return -1;
            }
            return 0;
          });
          setData(sortedData);
        }
      }, "▲") : "", column.sortable === true ? /*#__PURE__*/_react.default.createElement("div", {
        onClick: () => {
          const sortedData = [...data].sort((a, b) => {
            if (a[column.dataKey] > b[column.dataKey]) {
              return -1;
            }
            return 0;
          });
          setData(sortedData);
        }
      }, "▼") : "", column.filter === true ? /*#__PURE__*/_react.default.createElement("div", {
        onClick: () => {
          setActiveFilterColumn(column.dataKey);
          data.forEach(item => {
            if (filterLists.indexOf(item[column.dataKey]) === -1) {
              filterLists.push(item[column.dataKey]);
            }
          });
          setActiveFilteringDataLists(prev => {
            return filterLists;
          });
          ////console.log(filterLists)
        }
      }, "🔍") : "", activeFilterColumn === column.dataKey && /*#__PURE__*/_react.default.createElement("div", {
        ref: filterPopupRef,
        key: column.dataKey,
        style: {
          position: 'absolute',
          top: '60%',
          right: '0%',
          background: 'white',
          border: '1px solid #ccc',
          zIndex: 1000,
          minHeight: '100px',
          maxHeight: '350px',
          height: '100%',
          maxWidth: '150px',
          width: '100%',
          overflowY: 'auto'
        }
      }, "Column Filter", activeFilteringDataLists.map((item, idx) => {
        return /*#__PURE__*/_react.default.createElement("div", {
          key: item + idx,
          style: {
            textAlign: "left",
            paddingLeft: "5px"
          }
        }, /*#__PURE__*/_react.default.createElement("input", {
          key: item + idx,
          type: "checkbox",
          checked: activeFilterCheckedData[column.dataKey] && activeFilterCheckedData[column.dataKey].includes(item) ? true : false,
          onChange: values => {
            let checkedLists = {
              ...activeFilterCheckedData
            }; //state 변수를 직접 때려박아서 업데이트 하면 안됨. 복사해서 업데이트 해야함.
            //debugger;
            if (checkedLists[column.dataKey]) {
              if (checkedLists[column.dataKey].includes(item)) {
                let tmpCheckedLists = checkedLists[column.dataKey].filter(function (data) {
                  return data !== item;
                });
                if (tmpCheckedLists.length === 0) {
                  delete checkedLists[column.dataKey];
                } else {
                  checkedLists[column.dataKey] = tmpCheckedLists;
                }
              } else {
                checkedLists[column.dataKey].push(item);
              }
            } else {
              checkedLists[column.dataKey] = [item];
            }
            //console.log( checkedLists)

            setActiveFilterCheckedData(checkedLists);
          }
        }), item);
      }))))))));
    });
    return headers;
  };
  const renderData = (data, columns, pageNum) => {
    let pageVal = Number(pageNum);
    let displayedData = [];
    let idx = 0;
    for (let i = (pageVal - 1) * rowNum; i < pageVal * rowNum; i++) {
      ////console.log("i: ", i);
      if (data[i] !== undefined) {
        displayedData.push(data[i]);
        if (showRowNumYn === true) {
          ////console.log("i: ",i)
          displayedData[idx]["_hummingRowNums"] = i + 1;
        }
      } else {
        displayedData.push({});
      }
      idx++;
    }
    if (data.length !== 0) {
      return displayedData.map((row, rowIndex) => /*#__PURE__*/_react.default.createElement("tr", {
        style: {
          height: rowHeight,
          backgroundColor: rowIndex === clickedRowIdx ? clickedRowColor : ""
        },
        key: rowIndex
      }, renderRowData(row, columns, (pageVal - 1) * rowNum + rowIndex)));
    } else {
      //children 없는 column 의 갯수 세어서 colSpan 에 입력. 이때 RowNum, Checkbox 갯수도 같이 파악.
      // header group 이 없으면 상관 없는데, group 인 경우 가장 최 상단의 컬럼 갯수로만 col span 해버리기 때문에 총 갯수 다시 파악해야함.
      //console.log(columnData)
      let columnLength = 0;
      columnData.forEach(item => {
        columnLength = columnLength + item.childCount;
      });
      let tmpRowHeight = Number(rowHeight.split("px")[0]); /////
      let trHeight = rowNum * tmpRowHeight;
      //debugger;
      return /*#__PURE__*/_react.default.createElement("tr", {
        style: {
          height: trHeight + "px"
        }
      }, /*#__PURE__*/_react.default.createElement("td", {
        style: {},
        colSpan: columnLength
      }, /*#__PURE__*/_react.default.createElement(_NoDataIcon.default, null)));
    }
  };
  const renderRowData = (row, columns, rowIndex) => {
    return columns.map((column, index) => {
      if (column.children) {
        return renderRowData(row, column.children, rowIndex);
      } else {
        //////console.log(column, index)
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
              //debugger;
              if (rowSelectionConfig.type === "checkbox") {
                tmpData[rowIndex]["_hummingRowSelection"] = value.target.checked;
                setData(tmpData);
                let tmpSelectedRows = [...selectedRows];
                if (selectedRows.indexOf(tmpData[rowIndex]) === -1 && value.target.checked === true) {
                  tmpSelectedRows = [...tmpSelectedRows, tmpData[rowIndex]];
                  setSelectedRows(prev => {
                    return [...prev, tmpData[rowIndex]];
                  });
                } else if (selectedRows.indexOf(tmpData[rowIndex]) !== -1 && value.target.checked === false) {
                  //debugger;
                  tmpSelectedRows = tmpSelectedRows.filter(item => item !== tmpData[rowIndex]);
                  setSelectedRows(prev => {
                    // filter를 사용하여 tmpData[rowIndex] 제외한 새로운 배열을 반환합니다.
                    return prev.filter(item => item !== tmpData[rowIndex]);
                  });
                } else if (selectedRows.indexOf(tmpData[rowIndex]) === -1 && value.target.checked === false) {
                  //debugger;
                } else {
                  //debugger;
                }
                let tmpSelect = tmpData.filter(item => item["_hummingRowSelection"] === true);
                //props.rowSelection.onChange(tmpSelectedRows)
                props.rowSelection.onChange(tmpSelect);
              } else if (rowSelectionConfig.type === "radio") {
                let tmpSelectedRow = [];
                tmpData.forEach((item, idx) => {
                  if (idx !== rowIndex) {
                    item["_hummingRowSelection"] = false;
                  } else {
                    item["_hummingRowSelection"] = true;
                    tmpSelectedRow = [item];
                  }
                });
                setData(tmpData);
                //tmpData[rowIndex]["_hummingRowSelection"] = value.target.checked;
                //tmpSelectedRows = tmpSelectedRows.filter((item) => item !== tmpData[rowIndex]);

                setSelectedRows(tmpSelectedRow);
                let tmpSelect = tmpData.filter(item => item["_hummingRowSelection"] === true);
                //props.rowSelection.onChange(tmpSelectedRow)
                props.rowSelection.onChange(tmpSelect);
              }
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
          });
        } else {
          //////console.log(column.label, column.width)
          return /*#__PURE__*/_react.default.createElement("td", {
            key: index,
            style: {
              minWidth: column.width,
              maxWidth: column.width,
              cursor: "default",
              whiteSpace: "nowrap"
            },
            onDoubleClick: val => {
              var _props$rowClick;
              if (props.rowClick && props.rowClick.onDoubleClick) (_props$rowClick = props.rowClick) === null || _props$rowClick === void 0 || _props$rowClick.onDoubleClick({
                rowData: row,
                colData: column
              });
            },
            onClick: val => {
              var _props$rowClick2;
              setClickedRowIdx(rowIndex);
              if (props.rowClick && props.rowClick.onClick) (_props$rowClick2 = props.rowClick) === null || _props$rowClick2 === void 0 || _props$rowClick2.onClick({
                rowData: row,
                colData: column
              });
            }
          }, /*#__PURE__*/_react.default.createElement("div", {
            style: {
              width: "100%",
              display: 'flex',
              justifyContent: 'center',
              alignItems: "center"
            }
          }, /*#__PURE__*/_react.default.createElement("div", {
            style: {
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis"
            },
            onMouseOver: e => {
              //////console.log("over~")
              //////console.log(checkTextOveflow(e))
              getDetailValue(e);
            },
            onMouseOut: e => {
              //////console.log("out~")
            }
          }, row[column.dataKey])));
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
      //debugger;
      //////console.log(widthChangeTargetCell1, widthChangeTargetCell2)
      //전체 너비는 바꾸지 않고, 연관된 cell 2 개만 너비를 바꾼다.

      let changeWidth = widthChangeX - e.clientX;
      //////console.log(changeWidth)

      ////console.log("source1 width : ", source1Width, changeWidth, widthChangeTargetCell1.tagName)
      ////console.log("source2 width : ", source2Width, changeWidth, widthChangeTargetCell2.tagName)
      // 첫 번째 셀의 너비 조정
      if (widthChangeTargetCell1) {
        //////console.log(widthChangeTargetCell1.offsetWidth, changeWidth, widthChangeX, e.clientX)

        widthChangeTargetCell1.style.width = source1Width - changeWidth + 'px';
      }

      // 두 번째 셀의 너비 조정
      if (widthChangeTargetCell2) {
        //widthChangeTargetCell2.style.width = widthChangeTargetCell2.offsetWidth - 1 + 'px';

        widthChangeTargetCell2.style.width = source2Width + changeWidth + 'px';
      }
    }
  };
  const mouseDownTh = (e, depth, index) => {
    //////console.log(e, "hello")

    if (cell_left(e)) {
      setMouseDownFlag(true);
      setWidthChangeX(e.clientX);
      ////console.log("왼")

      let downX = e.clientX;
      let downY = e.clientY;
      let newDownX = downX - 10;

      // const newEvent = new MouseEvent('click', {
      //   clientX: newDownX,
      //   clientY: downY,
      //   bubbles: true,
      //   cancelable: true,
      //   view: window
      // });
      let element1 = document.elementFromPoint(downX, downY);
      let element2 = document.elementFromPoint(newDownX, downY);

      // while (element1 && element1.tagName !== 'TH') {
      //   element1 = element1.parentElement;
      // }
      // while (element2 && element2.tagName !== 'TH') {
      //   element2 = element2.parentElement;
      // }

      //////console.log("element1 : ", element1)
      ////console.log("element2 : ", element2)

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
      let newDownX = downX + 10;

      // const newEvent = new MouseEvent('click', {
      //   clientX: newDownX,
      //   clientY: downY,
      //   bubbles: true,
      //   cancelable: true,
      //   view: window
      // });
      let element1 = document.elementFromPoint(downX, downY);
      let element2 = document.elementFromPoint(newDownX, downY);

      // while (element1 && element1.tagName !== 'TH') {
      //   element1 = element1.parentElement;
      // }
      // while (element2 && element2.tagName !== 'TH') {
      //   element2 = element2.parentElement;
      // }

      ////console.log("element1 : ", element1)
      ////console.log("element2 : ", element2)

      setWidthChangeTargetCell1(element1);
      setWidthChangeTargetCell2(element2);
      setSource1Width(element1.offsetWidth);
      setSource2Width(element2.offsetWidth);
    } else {}
  };
  const mouseUpTh = (e, depth, index) => {
    ////console.log(e, "hello")
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
    ////console.log(data)
    let pageNumList = [];
    //debugger;
    if (paginationInfo && paginationInfo.dataLength !== undefined) {
      for (let i = 0; i < paginationInfo.dataLength / Number(rowNum); i++) {
        ////console.log(i)
        pageNumList.push(i + 1);
      }
    } else {
      for (let i = 0; i < data.length / Number(rowNum); i++) {
        ////console.log(i)
        pageNumList.push(i + 1);
      }
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
    }, currentPageRange.length === 0 ? /*#__PURE__*/_react.default.createElement("pre", null, "   ") : currentPageRange.map(value => {
      return /*#__PURE__*/_react.default.createElement("div", {
        key: value,
        className: "paginationNum".concat(selectedPage === value ? ' selected' : ''),
        onClick: val => {
          setSelectedPage(Number(val.target.innerText));
          props.pagination.onClick(Number(val.target.innerText));
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
  const handleClickOutside = event => {
    if (filterPopupRef.current && !filterPopupRef.current.contains(event.target)) {
      setActiveFilterColumn(null);
      //debugger;

      let tmpData = props.dataSource;
      tmpData.forEach(item => {});
      let tmpFilterList = {
        ...latestActiveFilterCheckedData.current
      };
      //console.log("ref : ", tmpFilterList, props.dataSource )
      let tmpKeys = Object.keys(tmpFilterList);
      let tmpFilteredData = tmpData.filter(item => {
        // item -> 데이터 한 줄.

        // key 를 모두 조회하여

        let flag = true;
        for (let i = 0; i < tmpKeys.length; i++) {
          if (tmpFilterList[tmpKeys[i]].indexOf(item[tmpKeys[i]]) === -1) {
            flag = false;
          }
        }
        if (flag) {
          return item;
        }
      });
      //console.log(tmpFilteredData);
      setData(tmpFilteredData);

      //setActiveFilterCheckedData({})
    }
  };

  /* useEffect */
  (0, _react.useEffect)(() => {
    let tmpData = props.dataSource ? props.dataSource : [];
    let tmpColumnData = props.columns ? props.columns : [];
    let tmpHeaderStyleData = props.headerStyle ? props.headerStyle : {
      backgroundColor: defaultHeaderColor
    };
    let tmpTableTitle = props.title ? props.title : null;
    let tmpDisplayedRowNum = props.displayedRowNum ? Number(props.displayedRowNum) : defaultDisplayedRowNum;
    let tmpDisplayRowNumsYn = props.displayRowNumsYn ? props.displayRowNumsYn : false;
    let tmpSizeChanger = props.sizeChanger ? props.sizeChanger : null;
    let tmpTableWidth = props.width ? props.width : "100%";
    let tmpTableHeight = props.height ? props.height : "100%";
    let tmpZebra = props.zebra ? props.zebra : "";
    let tmpRowSelection = props.rowSelection ? props.rowSelection : null;
    let tmpPaginationInfo = props.pagination ? props.pagination : null;
    let tmpRowClick = props.rowClick ? props.rowClick : null;
    let tmpRowHeight;
    if (props.rowHeight === undefined) {
      tmpRowHeight = "27px";
    } else if (props.rowHeight && props.rowHeight.includes("px")) {
      tmpRowHeight = props.rowHeight;
    } else if (!props.rowHeight.includes("px")) {
      throw new Error("row height must be represented in px.");
    } else {
      tmpRowHeight = "27px";
    }
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

      ////console.log(tmpData)
      //displayedData[idx]["_hummingRowSelection"] = <input type={tmpRowSelection.type} onChange={(value) => {//console.log(value)}}/>;

      setRowSelectionConfig(tmpRowSelection);
    }
    setData(tmpData);
    //debugger;
    tmpColumnData.forEach((item, index) => {
      let tmpWidth = item.width;
      if (tmpWidth) {
        if (tmpWidth.charAt(tmpWidth.length - 1) === "%") {
          ////console.log(tmpWidth)
          let tableWidth = Number(document.getElementById("tableArea").offsetWidth);
          tmpWidth = Number(tmpWidth.substr(0, tmpWidth.length - 1)) / 100 * tableWidth;
          tmpColumnData[index].width = tmpWidth + "px"; //""//tmpWidth
        }
      }
    });
    setColumnData(tmpColumnData);
    setHeaderStyleData(tmpHeaderStyleData);
    setTableTitle(tmpTableTitle);
    setRowNum(Number(tmpDisplayedRowNum));
    setShowRowNumYn(tmpDisplayRowNumsYn);
    setSizeChanger(tmpSizeChanger);
    setTableWidth(tmpTableWidth);
    setTableHeight(tmpTableHeight);
    setRowZebraYn(tmpZebra);
    ////console.log(tmpData.length, tmpDisplayedRowNum)
    if (props.paginationYn !== null) {
      setPaginationYn(true);
    } else {
      setPaginationYn(false);
    }
    setPaginationInfo(tmpPaginationInfo);
    setRowHeight(tmpRowHeight);

    //dataSource = [], columns = [], headerStyle = [], title = undefined, displayedRows="20", displayRowNums=true
  }, [props]);
  (0, _react.useEffect)(() => {
    let tmpTableWidth = props.width ? props.width : "100%";
    setTableWidth(tmpTableWidth);
    //debugger;
  }, [props.width]);
  (0, _react.useEffect)(() => {
    let tmpData = props.dataSource ? props.dataSource : [];
    ////console.log("data:",tmpData)
    setData(tmpData);
    ////console.log("data : ", dataSource);
    setClickedRowIdx();
  }, [props.dataSource]);
  (0, _react.useEffect)(() => {
    //console.log("rowIdx : ", clickedRowIdx)
  }, [clickedRowIdx]);
  (0, _react.useEffect)(() => {
    ////console.log("showRowNumYn : ", showRowNumYn)
    let tmpColumnData = props.columns; //columnData
    ////console.log("props.columns : ", props.columns, rowSelectionConfig)

    if (props.rowSelection !== undefined || showRowNumYn === true) {
      //debugger;
      let bufferTmpColumnData = [];
      let rowSelectionColumnConfig = {};
      if (props.rowSelection !== undefined) {
        rowSelectionColumnConfig = {
          dataKey: "_hummingRowSelection",
          label: props.rowSelection.type === "checkbox" ? /*#__PURE__*/_react.default.createElement("input", {
            id: "allCheck",
            type: props.rowSelection.type,
            onChange: value => {
              ////console.log("allchecked: ", value.target.checked)
              makeAlldataCheckState(value.target.checked);
            }
          }) : "",
          width: "30px",
          sortable: "false"
        };
      }
      let rowNumColumnConfig = {
        dataKey: "_hummingRowNums",
        label: "No.",
        width: "30px",
        sortable: "false"
      };
      //debugger;
      if (showRowNumYn === true || props.rowSelection !== undefined) {
        bufferTmpColumnData = tmpColumnData;
        if (props.rowSelection !== undefined) {
          bufferTmpColumnData = [rowSelectionColumnConfig, ...bufferTmpColumnData];
        }
        if (showRowNumYn === true) {
          bufferTmpColumnData = [rowNumColumnConfig, ...bufferTmpColumnData];
        }
      } else {
        bufferTmpColumnData = [...tmpColumnData];
      }
      setColumnData(bufferTmpColumnData);
    } else {
      setColumnData(tmpColumnData);
    }
  }, [props.columns, props.displayRowNumsYn, showRowNumYn]);
  (0, _react.useEffect)(() => {
    let tmpDisplayRowNumsYn = props.displayRowNumsYn ? props.displayRowNumsYn : false;
    setShowRowNumYn(tmpDisplayRowNumsYn);
  }, [props.displayRowNumsYn]);
  (0, _react.useEffect)(() => {
    setSelectedRows([]);
  }, [props.rowSelection]);
  (0, _react.useEffect)(() => {
    latestActiveFilterCheckedData.current = activeFilterCheckedData;
  }, [activeFilterCheckedData]);
  (0, _react.useEffect)(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return /*#__PURE__*/_react.default.createElement("div", {
    id: "hummingbird"
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      textAlign: "center",
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: tableHeight
    }
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      width: tableWidth,
      height: tableHeight
    }
  }, /*#__PURE__*/_react.default.createElement("div", {
    id: "tableArea",
    style: {
      overflowY: "auto",
      maxHeight: "calc(" + tableHeight + " - 33px)",
      width: tableWidth
    }
  }, /*#__PURE__*/_react.default.createElement("table", {
    id: "humming-table",
    style: {
      width: hummingTableWidth,
      fontSize: "70%",
      fontFamily: "monospace, sans-serif, serif"
    }
  }, tableTitle ? /*#__PURE__*/_react.default.createElement("caption", null, tableTitle) : null, /*#__PURE__*/_react.default.createElement("thead", {
    id: "table-header-area",
    style: headerStyleData
  }, makeHeader()), /*#__PURE__*/_react.default.createElement("tbody", {
    id: "table-row-area",
    className: rowZebraYn ? 'zebra' : ''
  }, renderData(data, columnData, selectedPage)))), /*#__PURE__*/_react.default.createElement("div", {
    id: "paginationArea"
  }, paginationComponent()))));
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