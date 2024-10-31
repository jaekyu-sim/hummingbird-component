/* library import */
import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import "./HummingTable.css";
import NoDataIcon from "./Icons/NoDataIcon"; // 아이콘이 저장된 파일 경로를 적어줍니다.
import SearchIcon from "./Icons/SearchIcon";
//import './button.css';

export const HummingTable = (props) => {
  /* variable */
  //let widthChangeX = 0;
  let defaultDisplayedRowNum = 10;
  let defaultHeaderColor = "#eee";
  let clickedRowColor = "#999";
  let defaultRowHeight = "27px"
  /* useState */
  const [data, setData] = useState([]);
  const [columnData, setColumnData] = useState([]);
  const [headerStyleData, setHeaderStyleData] = useState({});
  //const [rowStyleData, setRowStyleData] = useState({})
  const [tableTitle, setTableTitle] = useState("");
  const [rowNum, setRowNum] = useState();
  const [showRowNumYn, setShowRowNumYn] = useState();
  const [sizeChanger, setSizeChanger] = useState([]);
  const [paginationUseYn, setPaginationUseYn] = useState(true);
  const [selectedPage, setSelectedPage] = useState(1);
  const [tableWidth, setTableWidth] = useState("100%");
  const [tableHeight, setTableHeight] = useState("100%");
  const [rowZebraYn, setRowZebraYn] = useState(false);
  const [rowSelectionConfig, setRowSelectionConfig] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);
  const [paginationInfo, setPaginationInfo] = useState();
  const [activeFilterColumn, setActiveFilterColumn] = useState(null);
  const [activeFilteringDataLists, setActiveFilteringDataLists] = useState({});
  const [activeFilterCheckedData, setActiveFilterCheckedData] = useState({});
  const [clickedRowIdx, setClickedRowIdx] = useState();
  const [rowHeight, setRowHeight] = useState(defaultRowHeight);
  const [hummingTableWidth, setHummingTableWidth] = useState("fit-content");
  const [paginationComponentWidth, setPaginationComponentWidth] = useState();

  const [hoverCell, setHoverCell] = useState({ row: "", idx: "" });
  const [mouseDownFlag, setMouseDownFlag] = useState(false);
  const [widthChangeTargetCell1, setWidthChangeTargetCell1] = useState();
  const [widthChangeTargetCell2, setWidthChangeTargetCell2] = useState();
  const [widthChangeX, setWidthChangeX] = useState(0);
  const [source1Width, setSource1Width] = useState(0);
  const [source2Width, setSource2Width] = useState(0);

  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipContent, setTooltipContent] = useState("");
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showHeaderTooltip, setShowHeaderTooltip] = useState(false);
  const [headerTooltipContent, setHeaderTooltipContent] = useState("");
  const [headerTooltipPosition, setHeaderTooltipPosition] = useState({ x: 0, y: 0 });
  
  

  /* useRef */
  const filterPopupRef = useRef();
  const latestActiveFilterCheckedData = useRef(activeFilterCheckedData);

  /* custom function */
  const checkTextOveflow = (e) => {
    // text-overflow가 발생하지 않은 경우
    if (e.target.clientWidth >= e.target.scrollWidth) {
      return false;
    }

    return true;
  };
  const getDetailValue = (e) => {
    if (checkTextOveflow(e) === false) {
      setShowTooltip(false);
      return;
    } else {
      setTooltipContent(e.target.textContent);
      const rect = e.target.getBoundingClientRect();
      setTooltipPosition({ x: rect.left, y: rect.bottom }); // 툴팁 위치 설정
      setShowTooltip(true); // 툴팁 표시
      
    }
  };
  const getHeaderDetailValue = (e) => {
    if (checkTextOveflow(e) === false) {
      setShowHeaderTooltip(false);
      return;
    } else {
      setHeaderTooltipContent(e.target.textContent);
      const rect = e.target.getBoundingClientRect();
      //debugger;
      setHeaderTooltipPosition({ x: rect.left, y: rect.bottom }); // 툴팁 위치 설정
      setShowHeaderTooltip(true); // 툴팁 표시
      
    }
  };
  const makeAlldataCheckState = (value) => {
    
    let tmpData = [...data];
    let tmpSelectedRows = [...selectedRows];
    //debugger;
    tmpData.forEach((item, rowIndex) => {
      item["_hummingRowSelection"] = value;

      if (selectedRows.indexOf(tmpData[rowIndex]) === -1 && value === true) {
        //debugger;

        tmpSelectedRows = [...tmpSelectedRows, tmpData[rowIndex]];
        setSelectedRows((prev) => {
          return [...prev, tmpData[rowIndex]];
        });
      } else if (
        selectedRows.indexOf(tmpData[rowIndex]) !== -1 &&
        value === false
      ) {
        //debugger;
        tmpSelectedRows = tmpSelectedRows.filter(
          (item) => item !== tmpData[rowIndex]
        );
        setSelectedRows((prev) => {
          // filter를 사용하여 tmpData[rowIndex] 제외한 새로운 배열을 반환합니다.
          //debugger;
          //return tmpSelectedRows;
          return prev.filter((item) => item !== tmpData[rowIndex]);
        });
      }
    });

    setData(tmpData);
    let tmpSelect = tmpData.filter(
      (item) => item["_hummingRowSelection"] === true
    );
    //props.rowSelection.onChange(tmpSelectedRows)
    props.rowSelection.onChange(tmpSelect);
  };
  const makeHeader = () => {
    function countTotalChildren(node) {
      if (!node.children) return 1;

      //let count = node.children.length;

      let count = 0;
      for (let i = 0; i < node.children.length; i++) {
        if (node.children[i].children) {
        } else {
          count = count + 1;
        }
      }

      node.children.forEach((child) => {
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
          node.children.forEach((child) => {
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

    
    const depthMap = generateHeader(columnData);
    const headers = [];
    let filterLists = [];
    //debugger;

    depthMap.forEach((columns, depth) => {
      //debugger;
      headers.push(
        <tr id="humming-table-header-row" key={depth} style={{height:"32px",}}>
          {columns.map((column, index) => {
            if(!column.visibility && column.visibility === false)
            {
              
            }
            else
            {
              return <th
              id="humming-table-th"
              key={depth + "." + index}
              rowSpan={column.rowSpanCount}
              colSpan={column.childCount}
              style={{
                cursor:
                  JSON.stringify(hoverCell) ===
                  JSON.stringify({ row: depth, idx: index })
                    ? "col-resize"
                    : "default",
                width: column.width,
                maxWidth: column.maxWidth?column.maxWidth:null,
                flexShrink:column.independent?0:0,
                flexGrow:column.independent?0:0,
                textAlign: "center",
                justifyContent: "center",
                alignItems: "center",
                // borderLeft:"1px solid #aaa",
                //borderRadius:"15px",
                paddingLeft:"5px",
                paddingRight:"5px",
                
                // border:"3px solid black",
                // borderCollapse:"collapse",
                // boxSizing:"border-box"
              }}
            >
              <div
                style={{
                  width:"100%",
                  alignItems: "center",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  display: "flex",
                  // border:"1px solid black"
                  //borderRight:"1px solid #ccc",
                  
                }}
              >
                <div
                  id="column-label-div"
                  style={{
                    // flex: 1,
                    textAlign: "center",
                    height: "100%",
                    padding: "0px",
                    justifyContent:"center",
                    // display:"flex",
                    width:"100%",
                    textOverflow:"ellipsis",
                    overflow:"hidden",
                    whiteSpace:"nowrap",
                    //padding:"2px"//width 0 일 경우 주의할 포인트.
                    //position:"relative"
                  }}
                  onMouseOver={(e)=>{
                    //debugger;
                    getHeaderDetailValue(e);
                    //setShowHeaderTooltip(true);
                  }}
                  onMouseOut={()=>{
                    setShowHeaderTooltip(false);
                  }}
                >
                  {column.label}
                  {showHeaderTooltip&&<div style={{
                    top: `${headerTooltipPosition.y}px`, // 부모의 아래쪽에 표시
                    left: `${headerTooltipPosition.x}px`, // 가운데 정렬
                    //transform: "translateX(-50%)",
                    backgroundColor:"#333",
                    borderRadius:"5px",
                    color:"#fff",
                    padding:"5px",
                    //width:"100px", 
                    height:"24px", 
                    position:"fixed", 
                    }}>
                    <div>{headerTooltipContent}</div>
                  </div>}
                </div>
                <div style={{ display: "flex",  }}>
                  {column.sortable === true ? (
                    <div
                      style={{cursor:"pointer", marginRight:"1px"}}
                      onClick={() => {
                        const sortedData = [...data].sort((a, b) => {
                          if (a[column.dataKey] < b[column.dataKey]) {
                            return -1;
                          }
                          return 0;
                        });
                        setData(sortedData);
                      }}
                    >
                      {"▲"}
                    </div>
                  ) : (
                    ""
                  )}
                  {column.sortable === true ? (
                    <div
                      style={{cursor:"pointer"}}
                      onClick={() => {
                        const sortedData = [...data].sort((a, b) => {
                          if (a[column.dataKey] > b[column.dataKey]) {
                            return -1;
                          }
                          return 0;
                        });
                        setData(sortedData);
                      }}
                    >
                      {"▼"}
                    </div>
                  ) : (
                    ""
                  )}
                  {column.filter === true ? (
                    <div
                      style={{cursor:"pointer"}}
                      onClick={() => {
                        setActiveFilterColumn(column.dataKey);

                        data.forEach((item) => {
                          if (
                            filterLists.indexOf(item[column.dataKey]) === -1
                          ) {
                            filterLists.push(item[column.dataKey]);
                          }
                        });
                        setActiveFilteringDataLists((prev) => {
                          return filterLists;
                        });
                        ////console.log(filterLists)
                      }}
                    >
                      <SearchIcon></SearchIcon>
                    </div>
                  ) : (
                    ""
                  )}
                  {activeFilterColumn === column.dataKey && (
                    <div
                      id="hummingbird-filter-div"
                      ref={filterPopupRef}
                      key={column.dataKey}
                      style={{}}
                    >
                      {column.label + " Filter"}
                      {activeFilteringDataLists.map((item, idx) => {
                        return (
                          <div
                            key={item + idx}
                            style={{ textAlign: "left", paddingLeft: "5px", display:"flex" }}
                          >
                            {
                              <input
                                key={item + idx}
                                type="checkbox"
                                checked={
                                  activeFilterCheckedData[column.dataKey] &&
                                  activeFilterCheckedData[
                                    column.dataKey
                                  ].includes(item)
                                    ? true
                                    : false
                                }
                                onChange={(values) => {
                                  let checkedLists = {
                                    ...activeFilterCheckedData,
                                  }; //state 변수를 직접 때려박아서 업데이트 하면 안됨. 복사해서 업데이트 해야함.
                                  //debugger;
                                  if (checkedLists[column.dataKey]) {
                                    if (
                                      checkedLists[column.dataKey].includes(
                                        item
                                      )
                                    ) {
                                      let tmpCheckedLists = checkedLists[
                                        column.dataKey
                                      ].filter(function (data) {
                                        return data !== item;
                                      });
                                      if (tmpCheckedLists.length === 0) {
                                        delete checkedLists[column.dataKey];
                                      } else {
                                        checkedLists[column.dataKey] =
                                          tmpCheckedLists;
                                      }
                                    } else {
                                      checkedLists[column.dataKey].push(item);
                                    }
                                  } else {
                                    checkedLists[column.dataKey] = [item];
                                  }
                                  //console.log( checkedLists)

                                  setActiveFilterCheckedData(checkedLists);
                                }}
                              ></input>
                            }
                            {item}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
              
            </th>}
    })}
        </tr>
      );
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
      return displayedData.map((row, rowIndex) => (
        <tr
          style={{
            height: rowHeight,
            backgroundColor: rowIndex === clickedRowIdx ? clickedRowColor : "",
          }}
          key={rowIndex}
        >
          {renderRowData(row, columns, (pageVal - 1) * rowNum + rowIndex)}
        </tr>
      ));
    } else {
      //children 없는 column 의 갯수 세어서 colSpan 에 입력. 이때 RowNum, Checkbox 갯수도 같이 파악.
      // header group 이 없으면 상관 없는데, group 인 경우 가장 최 상단의 컬럼 갯수로만 col span 해버리기 때문에 총 갯수 다시 파악해야함.
      //console.log(columnData)
      let columnLength = 0;
      columnData.forEach((item) => {
        columnLength = columnLength + item.childCount;
      });
      let tmpRowHeight = Number(rowHeight.split("px")[0]); /////
      let trHeight = rowNum * tmpRowHeight;
      //debugger;
      return (
        <tr style={{ height: trHeight + "px" }}>
          <td style={{}} colSpan={columnLength}>
            <NoDataIcon></NoDataIcon>
          </td>
        </tr>
      );
    }
  };

  const renderRowData = (row, columns, rowIndex) => {
    return columns.map((column, index) => {
      if (column.children) {
        return renderRowData(row, column.children, rowIndex);
      } else {
        //////console.log(column, index)
        if (
          column.dataKey === "_hummingRowSelection" &&
          Object.keys(row).length !== 0
        ) {
          return (
            <td
              key={index}
              style={{
                width: column.width,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                
              }}
            >
              <input
                checked={row["_hummingRowSelection"]}
                type={rowSelectionConfig.type}
                onChange={(value) => {
                  let tmpData = [...data];
                  //debugger;
                  if (rowSelectionConfig.type === "checkbox") {
                    tmpData[rowIndex]["_hummingRowSelection"] =
                      value.target.checked;
                    setData(tmpData);
                    let tmpSelectedRows = [...selectedRows];
                    if (
                      selectedRows.indexOf(tmpData[rowIndex]) === -1 &&
                      value.target.checked === true
                    ) {
                      tmpSelectedRows = [...tmpSelectedRows, tmpData[rowIndex]];
                      setSelectedRows((prev) => {
                        return [...prev, tmpData[rowIndex]];
                      });
                    } else if (
                      selectedRows.indexOf(tmpData[rowIndex]) !== -1 &&
                      value.target.checked === false
                    ) {
                      //debugger;
                      tmpSelectedRows = tmpSelectedRows.filter(
                        (item) => item !== tmpData[rowIndex]
                      );
                      setSelectedRows((prev) => {
                        // filter를 사용하여 tmpData[rowIndex] 제외한 새로운 배열을 반환합니다.
                        return prev.filter(
                          (item) => item !== tmpData[rowIndex]
                        );
                      });
                    } else if (
                      selectedRows.indexOf(tmpData[rowIndex]) === -1 &&
                      value.target.checked === false
                    ) {
                      //debugger;
                    } else {
                      //debugger;
                    }
                    let tmpSelect = tmpData.filter(
                      (item) => item["_hummingRowSelection"] === true
                    );
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
                    let tmpSelect = tmpData.filter(
                      (item) => item["_hummingRowSelection"] === true
                    );
                    //props.rowSelection.onChange(tmpSelectedRow)
                    props.rowSelection.onChange(tmpSelect);
                  }
                }}
              ></input>
            </td>
          );
        } else if (
          column.dataKey === "_hummingRowSelection" &&
          Object.keys(row).length === 0
        ) {
          return (
            <td
              key={index}
              style={{
                width: column.width,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            ></td>
          );
        } else {
          //////console.log(column.label, column.width)
          if(!column.visibility && column.visibility === false)
          {
            
          }
          else
          return (
            
            <td
              key={index}
              style={{
                minWidth: column.width,
                maxWidth: column.width,
                width: column.width,
                cursor: "default",
                //zIndex: "1",
              }}
              onDoubleClick={(val) => {
                if (props.rowClick && props.rowClick.onDoubleClick)
                  props.rowClick?.onDoubleClick({
                    rowData: row,
                    colData: column,
                  });
              }}
              onClick={(val) => {
                // debugger;
                if(row["_hummingRowNums"] && (props.rowClick.enable !== false))
                {
                  setClickedRowIdx(rowIndex%rowNum);
                }
                
                if (props.rowClick && props.rowClick.onClick)
                  props.rowClick?.onClick({
                    rowData: row,
                    colData: column,
                  });
              }}
              
            >
              <div style={{width:"100%", display:"flex", justifyContent:"center", alignContent:"center"}}>
                <div style={{width:"90%", marginLeft:"5px", marginRight:"5px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}  onMouseOver={(e) => {
                  getDetailValue(e);
                  //console.log("e", e);
                }}
                onMouseOut={() => {
                  setShowTooltip(false);
                  setTooltipContent("");
                }}>
                  {row[column.dataKey]}
                  {showTooltip && (
                  <div
                    id="hummingbird-tooltip"
                    style={{
                      position: "fixed",
                      top: `${tooltipPosition.y}px`,
                      left: `${tooltipPosition.x}px`,
                      backgroundColor: "#333",
                      color: "#fff",
                      padding: "5px",
                      borderRadius: "5px",
                      zIndex: 1000,
                      //fontSize: "12px",
                      // whiteSpace: "nowrap",
                    }}
                  >
                    {tooltipContent}
                  </div>
                )}
                </div>
              </div>
              
              {/* <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                <div
                  style={{
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                  onMouseOver={(e) => {
                    //////console.log("over~")
                    //////console.log(checkTextOveflow(e))
                    getDetailValue(e);
                  }}
                  onMouseOut={(e) => {
                    //////console.log("out~")
                  }}
                >
                  {row[column.dataKey]}
                </div>
              </div> */}
            </td>
          );
        }
      }
    });
  };

  const cell_left = (obj) => {
    let eventObject = obj;
    if (
      eventObject.nativeEvent.offsetX < 5 &&
      eventObject.nativeEvent.srcElement.cellIndex !== 0
    ) {
      //Cell 의 왼쪽라인을 오차 픽셀 5 범위 안쪽에서 클릭하고, 가장 왼쪽의 Cell 이 아니라면
      return true;
    } else {
      return false;
    }
  };

  const cell_right = (obj) => {
    let eventObject = obj;
    if (
      eventObject.nativeEvent.offsetX >
      eventObject.nativeEvent.srcElement.offsetWidth - 5
    ) {
      return true;
    } else {
      return false;
    }
  };

  const mouseOnTh = (e, depth, index) => {
    if (cell_left(e)) {
      setHoverCell({
        row: depth,
        idx: index,
      });
    } else if (cell_right(e)) {
      setHoverCell({
        row: depth,
        idx: index,
      });
    } else {
      setHoverCell({
        row: "",
        idx: "",
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

        widthChangeTargetCell1.style.width = source1Width - changeWidth + "px";
      }

      // 두 번째 셀의 너비 조정
      if (widthChangeTargetCell2) {
        //widthChangeTargetCell2.style.width = widthChangeTargetCell2.offsetWidth - 1 + 'px';

        widthChangeTargetCell2.style.width = source2Width + changeWidth + "px";
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
    } else {
    }
  };

  const mouseUpTh = (e, depth, index) => {
    ////console.log(e, "hello")
    setMouseDownFlag(false);
  };

  const isLastPage = () => {
    if(paginationInfo)
    {
      if(selectedPage < Math.ceil(paginationInfo.dataLength / Number(rowNum)))
      {
        return false;
      }
      else
      {
        return true;
      }
    }
    else
    {
      if(selectedPage < Math.ceil(data.length / Number(rowNum)))
        {
          return false;
        }
        else
        {
          return true;
        }
    }
  }
  const goNextPage = () => {
    
    if(paginationInfo)
    {
      let tmpValue = Math.ceil(paginationInfo.dataLength / Number(rowNum));
      if (selectedPage < tmpValue) {
        renderData(data, columnData, selectedPage + 1);
        setSelectedPage((prev) => {
          return prev + 1;
        });
      }
    }
    else
    {
      let tmpValue = Math.ceil(data.length / Number(rowNum));
      if (selectedPage < tmpValue) {
        renderData(data, columnData, selectedPage + 1);
        setSelectedPage((prev) => {
          return prev + 1;
        });
      }
    }
  };
  const goLastPage = () => {
    if(paginationInfo)
    {
      let tmpValue = Math.ceil(paginationInfo.dataLength / Number(rowNum));
      if (selectedPage < tmpValue) {
        renderData(data, columnData, selectedPage + 1);
        setSelectedPage((prev) => {
          return tmpValue;
        });
      }
    }
    else
    {

      
      let tmpValue = Math.ceil(data.length / Number(rowNum));
      if (selectedPage < tmpValue) {
        renderData(data, columnData, tmpValue);
        setSelectedPage((prev) => {
          return tmpValue;
        });
      }
    }
  };
  const goPrevPage = () => {
    if (selectedPage !== 1) {
      renderData(data, columnData, selectedPage - 1);
      setSelectedPage((prev) => {
        return prev - 1;
      });
    }
  };
  const goFirstPage = () => {
    if (selectedPage !== 1) {
      renderData(data, columnData, 1);
      setSelectedPage((prev) => {
        return 1;
      });
    }
  };
  const totalDataLength = () => {
    if(paginationInfo && paginationInfo.dataLength)
    {
      return ""+paginationInfo.dataLength
    }
    else
    {
      return ""+data.length
    }
  }

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

    
    let componentWidth;
    if(document.getElementById("humming-table"))
    {
      componentWidth = document.getElementById("humming-table").offsetWidth;
      
    }
    
    return (
      <div id="hummingbird-component-pagination-area" style={{ backgroundColor:"white", width:"100%", position: "relative", paddingTop: "10px" }}>
        
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height:"40px"
          }}
        >
          {paginationUseYn ? (<div style={{position:"absolute", left:"10px"}}>
            {`Showing ` + ((selectedPage-1)*rowNum +1) + " to " + ((selectedPage)*rowNum) + " of " +  totalDataLength() + " entries"}
          </div>) : null}
          {paginationUseYn ? (
            <div
              id="pagination1"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                
              }}
            >
              <div
                className="double-arrow-left"
                onClick={goFirstPage}
                style={{
                  cursor: selectedPage !== 1 ? "pointer" : "not-allowed",
                  marginRight: "5px",
                }}
              ></div>

              <div
                className="arrow-left"
                onClick={goPrevPage}
                style={{
                  cursor: selectedPage !== 1 ? "pointer" : "not-allowed",
                }}
              ></div>
              <div style={{ display: "flex" }}>
                {currentPageRange.length === 0 ? (
                  <pre> </pre>
                ) : (
                  currentPageRange.map((value) => {
                    return (
                      <div
                        key={value}
                        className={`paginationNum${
                          selectedPage === value ? " selected" : ""
                        }`}
                        onClick={(val) => {
                          setSelectedPage(Number(val.target.innerText));
                          // setSelectedRows();
                          setClickedRowIdx()
                          if(paginationInfo)
                          {
                            props.pagination.onClick(
                              Number(val.target.innerText)
                            );

                          }
                          
                        }}
                      >
                        {value}
                      </div>
                    );
                  })
                )}
              </div>
              <div
                className="arrow-right"
                onClick={goNextPage}
                style={{
                  cursor:
                  
                  isLastPage()
                      ? 
                      "not-allowed":
                      "pointer",
                }}
              ></div>
              <div
                className="double-arrow-right"
                onClick={goLastPage}
                style={{
                  cursor:
                  isLastPage()
                      ? "not-allowed":
                      "pointer",
                  marginLeft: "5px",
                }}
              ></div>
            </div>
          ) : null}
          {sizeChanger ? (
            <div
              id="pagination2"
              style={{ position: "absolute", right: "30px" }}
            >
              <select
                id="page-size-changer-selectbox"
                style={{ width: "70px", height:"25px" }}
                value={rowNum}
                onChange={(val) => {
                  setRowNum(Number(val.target.value));
                }}
              >
                {sizeChanger.map((value) => {
                  return (
                    <option key={value} value={Number(value)}>
                      {value}
                    </option>
                  );
                })}
              </select>
            </div>
          ) : null}
        </div>
      </div>
    );
  };

  const handleClickOutside = (event) => {
    if (
      filterPopupRef.current &&
      !filterPopupRef.current.contains(event.target)
    ) {
      setActiveFilterColumn(null);
      //debugger;

      let tmpData = props.dataSource;
      tmpData.forEach((item) => {});
      let tmpFilterList = { ...latestActiveFilterCheckedData.current };
      //console.log("ref : ", tmpFilterList, props.dataSource )
      let tmpKeys = Object.keys(tmpFilterList);
      let tmpFilteredData = tmpData.filter((item) => {
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
  useEffect(() => {
    //let tmpPaginationUseYn = props.paginationUseYn ? props.paginationUseYn : "true";
    let tmpData = props.dataSource ? props.dataSource : [];
    let tmpColumnData = props.columns ? props.columns : [];
    let tmpHeaderStyleData = props.headerStyle
      ? props.headerStyle
      : {
          backgroundColor: defaultHeaderColor,
        };
    let tmpTableTitle = props.title ? props.title : null;
    let tmpDisplayedRowNum = props.displayedRowNum
      ? Number(props.displayedRowNum)
      : defaultDisplayedRowNum;
    let tmpDisplayRowNumsYn = props.displayRowNumsYn
      ? props.displayRowNumsYn
      : false;
    let tmpSizeChanger = props.sizeChanger ? props.sizeChanger : null;
    let tmpTableWidth = props.width ? props.width : "100%";
    let tmpTableHeight = props.height ? props.height : "100%";
    let tmpZebra = props.zebra ? props.zebra : "";
    let tmpRowSelection = props.rowSelection ? props.rowSelection : null;
    let tmpPaginationInfo = props.pagination ? props.pagination : null;
    let tmpRowClick = props.rowClick ? props.rowClick : null;
    let tmpRowHeight;

    // if(!(tmpPaginationUseYn === "true" || tmpPaginationUseYn === "false"))
    // {
    //   throw new Error("paginationUseYn must be represented in true or false")
    // }

    if (props.rowHeight === undefined) {
      tmpRowHeight = defaultRowHeight;
    } else if (props.rowHeight && props.rowHeight.includes("px")) {
      tmpRowHeight = props.rowHeight;
    } else if (!props.rowHeight.includes("px")) {
      throw new Error("row height must be represented in px.");
    } else {
      tmpRowHeight = defaultRowHeight;
    }

    if (tmpRowSelection === null) {
      setRowSelectionConfig(tmpRowSelection);
    } else if (
      tmpRowSelection.type !== "checkbox" &&
      tmpRowSelection.type !== "radio"
    ) {
      throw new Error("rowSelection must have type 'checkbox' or 'radio'");
    } else {
      //정상적으로 rowSelection을 셋팅 할때,
      if (tmpRowSelection.type) {
        tmpData.forEach((item) => {
          item["_hummingRowSelection"] = false;
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
          let tableWidth = Number(
            document.getElementById("tableArea").offsetWidth
          );
          tmpWidth =
            (Number(tmpWidth.substr(0, tmpWidth.length - 1)) / 100) *
            tableWidth;
          tmpColumnData[index].width = tmpWidth + "px"; //""//tmpWidth
        }
        //debugger;
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
    
    if (props.paginationUseYn === "Y" || props.paginationUseYn === undefined) {
      setPaginationUseYn(true);
    } else if(props.paginationUseYn === "N") {
      setPaginationUseYn(false);
    }
    else{
      throw new Error("paginationUSeYn muse be represented in Y or N")
    }
    setPaginationInfo(tmpPaginationInfo);
    setRowHeight(tmpRowHeight);

    //dataSource = [], columns = [], headerStyle = [], title = undefined, displayedRows="20", displayRowNums=true
  }, []);

  useEffect(() => {
    let tmpTableWidth = props.width ? props.width : "100%";
    setTableWidth(tmpTableWidth);
    //debugger;
  }, [props.width]);

  useEffect(() => {
    let tmpData = props.dataSource ? props.dataSource : [];
    ////console.log("data:",tmpData)
    setData(tmpData);
    ////console.log("data : ", dataSource);
    setClickedRowIdx();
    setSelectedPage(1);
  }, [props.dataSource]);

  useEffect(() => {
    //console.log("rowIdx : ", clickedRowIdx)
  }, [clickedRowIdx]);

  useEffect(() => {
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
          label:
            props.rowSelection.type === "checkbox" ? (
              <input
                id="allCheck"
                type={props.rowSelection.type}
                onChange={(value) => {
                  ////console.log("allchecked: ", value.target.checked)
                  makeAlldataCheckState(value.target.checked);
                }}
              />
            ) : (
              ""
            ),
          width: "30px",
          sortable: "false",
        };
      }

      let rowNumColumnConfig = {
        dataKey: "_hummingRowNums",
        label: "No",
        width: "30px",
        maxWidth: "30px",
        sortable: "false",
        independent: true
      };
      //debugger;
      if (showRowNumYn === true || props.rowSelection !== undefined) {
        bufferTmpColumnData = tmpColumnData;

        if (props.rowSelection !== undefined) {
          bufferTmpColumnData = [
            rowSelectionColumnConfig,
            ...bufferTmpColumnData,
          ];
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

  useEffect(() => {
    let tmpDisplayRowNumsYn = props.displayRowNumsYn
      ? props.displayRowNumsYn
      : false;
    setShowRowNumYn(tmpDisplayRowNumsYn);
  }, [props.displayRowNumsYn]);

  useEffect(() => {
    setSelectedRows([]);
  }, [props.rowSelection]);

  useEffect(() => {
    latestActiveFilterCheckedData.current = activeFilterCheckedData;
  }, [activeFilterCheckedData]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div id="hummingbird">
      <div
        style={{
          // textAlign: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: tableHeight,
          overflow: "auto",
          
        }}
      >
        <div  style={{ width:"fit-content" }}>
          <div
            id="tableArea"
            style={{
              display:"flex",
              justifyContent:"center",
              alignItems:"center",
              overflowY: "auto",
              maxHeight: "calc(" + tableHeight + " - 33px)",
              // width: tableWidth,
            }}
          >
            <table
              id="humming-table"
              style={{
                width: hummingTableWidth,
                backgroundColor:"white"
                //border:"1px solid #aaa"
                //fontSize: "70%",
                //fontFamily: "monospace, sans-serif, serif",
              }}
            >
              {tableTitle ? <caption>{tableTitle}</caption> : null}
              <thead id="table-header-area" style={headerStyleData}>
                {makeHeader()}
              </thead>
              <tbody id="table-row-area" className={rowZebraYn ? "zebra" : ""}>
                {renderData(data, columnData, selectedPage)}
              </tbody>
            </table>
          </div>
          <div id="paginationArea" style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
            {/* {paginationYn?paginationComponent():null}
            {sizeChanger?<div>있음2</div>:null} */}
            {paginationComponent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HummingTable;

HummingTable.propTypes = {
  /**
   * Is this the principal call to action on the page?
   */

  /**
   * Optional click handler
   */
  onClick: PropTypes.func,
};
