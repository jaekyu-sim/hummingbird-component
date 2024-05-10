import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import "./HummingTable.css"
//import './button.css';

/**
 * Primary UI component for user interaction
 */
export const HummingTable = ({ dataSource = [], columns = [], headerStyle = [], title = undefined, displayRowNum="20" }) => {
    /* variable */
    //let widthChangeX = 0;

    /* useState */
    const [data, setData] = useState(dataSource);
    const [columnData, setColumnData] = useState(columns);
    const [headerStyleData, setHeaderStyleData] = useState(headerStyle);
    const [tableTitle, setTableTitle] = useState();
    const [rowNum, setRowNum] = useState(displayRowNum);

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
                style={{cursor: JSON.stringify(hoverCell) === JSON.stringify({row: depth, idx: index})? 'col-resize': 'default'}}
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
    
    const renderData = (data, columns) => {
      if(data.length < rowNum)
      {
         
        for(let i = 0 ; i < rowNum - data.length + 1; i++)
        {
          data.push({

          })
        }
      }
      else
      {
        //페이징 로직 필요
      }
      return data.map((row, rowIndex) => (
          <tr key={rowIndex} style={{borderBottom:"1px solid black", backgroundColor:"#D6EEEE", height:"20px"}}>
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
        console.log(widthChangeTargetCell1, widthChangeTargetCell2)
        //전체 너비는 바꾸지 않고, 연관된 cell 2 개만 너비를 바꾼다.
        
        let changeWidth = widthChangeX - e.clientX ;
        console.log(changeWidth)
        

          // 첫 번째 셀의 너비 조정
          if (widthChangeTargetCell1) {
            console.log(widthChangeTargetCell1.offsetWidth, changeWidth, widthChangeX, e.clientX)

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
      console.log(e, "hello")
      
      

      

      if(cell_left(e))
      {
        setMouseDownFlag(true)
        setWidthChangeX(e.clientX);
        console.log("왼")

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
        console.log("오")
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
      console.log(e, "hello")
      setMouseDownFlag(false)



    }

    

  
    /* useEffect */
    useEffect(() => {

    }, [])

    useEffect(() => {
      setData(dataSource)
      //console.log("data : ", dataSource);

    }, [dataSource])
    
    useEffect(() => {
      //console.log("column : ", columns)
      setColumnData(columns)
    }, [columns])
    
    useEffect(() => {
      setHeaderStyleData(headerStyle)
    }, [headerStyle])

    useEffect(() => {
      setTableTitle(title)
    }, [title])

    useEffect(() => {
      let tmpNum = Number(displayRowNum);
      setRowNum(tmpNum);
    }, [displayRowNum])


    

  return (

    <table style={{width:"100%", tableLayout:"fixed", padding:"20px"}}>
      {tableTitle?<caption>{tableTitle}</caption>:null}
      <thead style={headerStyleData}>
        {makeHeader()}
      </thead>
      <tbody>
        {renderData(data, columnData)}
      </tbody>
    </table>

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
