import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import "./HummingTable.css"
//import './button.css';

/**
 * Primary UI component for user interaction
 */
export const HummingTable = (props) => {
    /* variable */
    //let widthChangeX = 0;
    let defaultDisplayedRowNum = 10;
    let defaultHeaderColor = "#99CCFF";
    let defaultRowColor = "white";

    /* useState */
    const [data, setData] = useState([]);
    const [columnData, setColumnData] = useState([]);
    const [headerStyleData, setHeaderStyleData] = useState({});
    //const [rowStyleData, setRowStyleData] = useState({})
    const [tableTitle, setTableTitle] = useState("");
    const [rowNum, setRowNum] = useState();
    const [showRowNumYn, setShowRowNumYn] = useState();
    const [sizeChanger, setSizeChanger] = useState([]);
    const [paginationYn, setPaginationYn] = useState(true);
    const [selectedPage, setSelectedPage] = useState(1);
    const [tableWidth, setTableWidth] = useState("100%")
    const [rowZebraYn, setRowZebraYn] = useState(false);
    

    const [hoverCell, setHoverCell] = useState({row: "", idx: ""})
    const [mouseDownFlag, setMouseDownFlag] = useState(false)
    const [widthChangeTargetCell1, setWidthChangeTargetCell1] = useState();
    const [widthChangeTargetCell2, setWidthChangeTargetCell2] = useState();
    const [widthChangeX, setWidthChangeX] = useState(0);
    const [source1Width, setSource1Width] = useState(0);
    const [source2Width, setSource2Width] = useState(0);

    
      
    /* custom function */
    // const sortData = (key) => {
    // setData([...data].sort((a, b) => a[key] - b[key]));
    // };

    


    const makeHeader = () => {

      function countTotalChildren(node) {
        if (!node.children) return 1;
      
        //let count = node.children.length;
      
        let count = 0;
        for(let i = 0 ; i < node.children.length ; i++)
        {
          if(node.children[i].children)
          {
      
          }
          else
          {
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
            if(tmpVal > 1)
            {
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
    
        for(let i = 0 ; i< depthMap.size ; i++)
        {
          depthMap.get(i).forEach((item, idx) => {
            if(depthMap.get(i)[idx].children)
            {
              depthMap.get(i)[idx].rowSpanCount = 1
            }
            else
            {
              depthMap.get(i)[idx].rowSpanCount = depthMap.size - i
            }
            
    
          })
        }
      
        return depthMap;
      }
      
      // Example usage:

      //let tmpColumnData = columnData
      

      const depthMap = generateHeader(columnData);
      const headers = [];
      
      depthMap.forEach((columns, depth) => {
        headers.push(
          <tr key={depth} style={{cursor:"col-resize"}}>
            {columns.map((column, index) => (
              <th 
                key={depth+"."+index} 
                rowSpan={column.rowSpanCount} 
                colSpan={column.childCount} 
                onMouseDown={(e) => mouseDownTh(e, depth, index)} 
                onMouseMove={(e) => mouseOnTh(e, depth, index)}
                onMouseUp  ={(e) => mouseUpTh(e, depth, index)}
                style={{
                  cursor: JSON.stringify(hoverCell) === JSON.stringify({row: depth, idx: index})? 'col-resize': 'default',
                  width:column.width,
                  height:"30px"
                }}
                >
                  {column.label}
              </th>
            ))}
          </tr>
        );
      });

      return(
          headers
      )
    }
    
    const renderData = (data, columns, pageNum) => {
      
      let pageVal = Number(pageNum);
      let displayedData = []
      let idx = 0;
      for(let i = (pageVal-1)*rowNum ; i < (pageVal)*rowNum ; i++)
      {
        //console.log("i: ", i);
        if(data[i] !== undefined)
        {
          displayedData.push(data[i])
          if(showRowNumYn === true)
          {
            //console.log("i: ",i)
            displayedData[idx]["_hummingRowNums"] = i+1
          }
        }
        else
        {
          displayedData.push({})
        }
        idx++;
      }
      return displayedData.map((row, rowIndex) => (
          <tr key={rowIndex} style={{borderBottom:"1px solid black", backgroundColor:rowZebraYn&&rowIndex%2===0?"#eee":"", height:"30px"}}>
              {renderRowData(row, columns)}
          </tr>
      ));
    };
    
    const renderRowData = (row, columns) => {
        return columns.map((column, index) => {
            if (column.children) {
                return renderRowData(row, column.children);
            } else {
              
                return <td key={index} style={{width:column.width, overflow:"hidden", whiteSpace:"nowrap", textOverflow:"ellipsis"}}>{row[column.dataKey]}</td>;
            }
        });
    };
    
    const cell_left = (obj) => {
      let eventObject = obj;
      if(eventObject.nativeEvent.offsetX < 5 && eventObject.nativeEvent.srcElement.cellIndex !== 0)
      {
        //Cell 의 왼쪽라인을 오차 픽셀 5 범위 안쪽에서 클릭하고, 가장 왼쪽의 Cell 이 아니라면
        return true;
      }
      else
      {
        return false;
      }
    }

    const cell_right = (obj) => {
      let eventObject = obj;
      if(eventObject.nativeEvent.offsetX > eventObject.nativeEvent.srcElement.offsetWidth-5)
      {
        
        return true;
      }
      else
      {
        return false;
      }
    }

    const mouseOnTh = (e, depth, index) => {
      if(cell_left(e))
      {
        setHoverCell({
          row: depth,
          idx: index
        })


      }
      else if(cell_right(e))
      {
        setHoverCell({
          row: depth,
          idx: index
        })
      }
      else
      {
        setHoverCell({
          row: "",
          idx: ""
        })
      }

      //setMouseDownFlag
      if(mouseDownFlag)
      {
        //console.log(widthChangeTargetCell1, widthChangeTargetCell2)
        //전체 너비는 바꾸지 않고, 연관된 cell 2 개만 너비를 바꾼다.
        
        let changeWidth = widthChangeX - e.clientX ;
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
    }

    const mouseDownTh = (e, depth, index) => {
      //console.log(e, "hello")
      
      

      

      if(cell_left(e))
      {
        setMouseDownFlag(true)
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
        
        
        setWidthChangeTargetCell1(element2)
        setWidthChangeTargetCell2(element1)
        setSource1Width(element2.offsetWidth)
        setSource2Width(element1.offsetWidth)
      }
      else if(cell_right(e))
      {
        setMouseDownFlag(true)
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
        
        setWidthChangeTargetCell1(element1)
        setWidthChangeTargetCell2(element2)

        setSource1Width(element1.offsetWidth)
        setSource2Width(element2.offsetWidth)
      }
      else
      {

      }


    }

    const mouseUpTh = (e, depth, index) => {
      //console.log(e, "hello")
      setMouseDownFlag(false)
    }

    const goNextPage = () => {
      let tmpValue = Math.ceil(data.length / Number(rowNum))
      if(selectedPage !== tmpValue)
      {
        renderData(data, columnData, selectedPage + 1);
        setSelectedPage((prev) => {
          return (prev+1)
        })
      }
    }
    const goLastPage = () => {
      let tmpValue = Math.ceil(data.length / Number(rowNum))
      if(selectedPage !== tmpValue)
      {
        renderData(data, columnData, tmpValue);
        setSelectedPage((prev) => {
          return (tmpValue)
        })
      }

    }
    const goPrevPage = () => {
      if(selectedPage !== 1)
      {
        renderData(data, columnData, selectedPage - 1);
        setSelectedPage((prev) => {
          return (prev-1)
        })
      }

    }
    const goFirstPage = () => {
      if(selectedPage !== 1)
      {
        renderData(data, columnData, 1);
        setSelectedPage((prev) => {
          return (1)
        })
      }

    }

    const paginationComponent = () => {
      //console.log(data)
      let pageNumList = []
      for(let i = 0 ; i < data.length / Number(rowNum) ; i++)
      {
        //console.log(i)
        pageNumList.push(i+1)
      }

      const startPage = Math.floor((selectedPage - 1) / 10) * 10 + 1;
      const endPage = Math.min(startPage + 9, pageNumList.length);

      // Get the current range of pages to display
      const currentPageRange = pageNumList.slice(startPage - 1, endPage);


      return (
        <div style={{ position: 'relative', paddingTop:"10px"}}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {paginationYn ? (
              <div id="pagination1" style={{ display: 'flex', justifyContent:"center", alignItems:"center" }}>
                <div className='double-arrow-left' onClick={goFirstPage} style={{cursor:selectedPage!==1?"pointer":"not-allowed", marginRight:"5px"}} ></div>
                <div className='arrow-left' onClick={goPrevPage} style={{cursor:selectedPage!==1?"pointer":"not-allowed"}} ></div>
                <div style={{display:"flex"}} >
                  {currentPageRange.map((value)=>{
                    
                    return <div key={value} className={`pagnationNum${selectedPage === value ? ' selected' : ''}`} onClick={(val) => {
                      setSelectedPage(Number(val.target.innerText))
                    }}>{value}</div>
                  })}
                </div>
                <div className='arrow-right' onClick={goNextPage} style={{cursor:selectedPage!==Math.ceil(data.length / Number(rowNum))?"pointer":"not-allowed"}}></div> 
                <div className='double-arrow-right' onClick={goLastPage} style={{cursor:selectedPage!==Math.ceil(data.length / Number(rowNum))?"pointer":"not-allowed", marginLeft:"5px"}}></div> 
              </div>
            ) : null}
            {sizeChanger ? (
              <div id="pagination2" style={{ position: 'absolute', right: '30px' }}>
                <select style={{width:"50px"}} value={(rowNum)} onChange={(val) => {
                  setRowNum(Number(val.target.value))
                  }}>
                  {sizeChanger.map((value)=>{
                      return(<option key={value} value={Number(value)} >{value}</option>)
                  })}
                </select>
              </div>
            ) : null}
          </div>
        </div>
      )
    }
    

  
    /* useEffect */
    useEffect(() => {

      let tmpData = props.dataSource?props.dataSource:[];
      let tmpColumnData = props.columns?props.columns:[];
      let tmpHeaderStyleData = props.headerStyle?props.headerStyle:{
        backgroundColor:defaultHeaderColor,
        color:"black",
      }
      let tmpTableTitle = props.title?props.title:null;
      let tmpDisplayedRowNum = props.displayedRowNum?Number(props.displayedRowNum):defaultDisplayedRowNum;
      let tmpDisplayRowNumsYn = props.displayRowNumsYn?props.displayRowNumsYn:false;
      let tmpSizeChanger = props.sizeChanger?props.sizeChanger:null;
      let tmpTableWidth = props.width?props.width:"100%";
      let tmpZebra = props.zebra?props.zebra:"";

      setData(tmpData);
      setColumnData(tmpColumnData);
      setHeaderStyleData(tmpHeaderStyleData);

      setTableTitle(tmpTableTitle);
      setRowNum(Number(tmpDisplayedRowNum));
      setShowRowNumYn(tmpDisplayRowNumsYn);
      setSizeChanger(tmpSizeChanger);
      setTableWidth(tmpTableWidth)
      setRowZebraYn(tmpZebra);
      //console.log(tmpData.length, tmpDisplayedRowNum)
      if(tmpData.length > Number(tmpDisplayedRowNum) && props.paginationYn !== null)
      {
        setPaginationYn(true)
      }
      else
      {
        setPaginationYn(false)
      }
      //dataSource = [], columns = [], headerStyle = [], title = undefined, displayedRows="20", displayRowNums=true
    }, [props])

    useEffect(() => {
      let tmpData = props.dataSource?props.dataSource:[]
      //console.log("data:",tmpData)
      setData(tmpData)
      //console.log("data : ", dataSource);

    }, [props.dataSource])
    
    useEffect(() => {
      //console.log("showRowNumYn : ", showRowNumYn)
      let tmpColumnData = props.columns//columnData
      if(showRowNumYn === true)
      {
        let rowNumColumnConfig = {dataKey: "_hummingRowNums", label: "No.", width:"30px", sortable:"false"}
        setColumnData((prev) => {
          return[rowNumColumnConfig, ...prev]
        })
      }
      else
      {
        setColumnData(tmpColumnData)
      }
    }, [props.columns, props.displayRowNumsYn, showRowNumYn])
    

    useEffect(() => {
      let tmpDisplayRowNumsYn = props.displayRowNumsYn?props.displayRowNumsYn:false
      setShowRowNumYn(tmpDisplayRowNumsYn)
      
    }, [props.displayRowNumsYn])


    

  return (

    <div style={{width:tableWidth}}>
      <div id="tableArea" >
        <table style={{width:"100%", tableLayout:"fixed", padding:"20px"}}>
          {tableTitle?<caption>{tableTitle}</caption>:null}
          <thead style={headerStyleData}>
            {makeHeader()}
          </thead>
          <tbody>
            {renderData(data, columnData, selectedPage)}
          </tbody>
        </table>
      </div>
      <div id="paginationArea">
        {/* {paginationYn?paginationComponent():null}
        {sizeChanger?<div>있음2</div>:null} */}
        {paginationComponent()}
      </div>
      {"selectedPage : " + JSON.stringify(selectedPage)}
    </div>
  );
};

export default HummingTable

HummingTable.propTypes = {
  /**
   * Is this the principal call to action on the page?
   */
  
  /**
   * Optional click handler
   */
  onClick: PropTypes.func,
};