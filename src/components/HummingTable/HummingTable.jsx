import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import "./HummingTable.css"
//import './button.css';

/**
 * Primary UI component for user interaction
 */
export const HummingTable = ({ dataSource = [], columns = [], headerStyle = [], title = undefined }) => {
    /* variable */

    /* useState */
    const [data, setData] = useState(dataSource);
    const [columnData, setColumnData] = useState(columns);
    const [headerStyleData, setHeaderStyleData] = useState(headerStyle);
    const [tableTitle, setTableTitle] = useState();

    
      
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
          <tr key={depth} >
            {columns.map((column, index) => (
              <th key={index} rowSpan={column.rowSpanCount} colSpan={column.childCount}>{column.label}</th>
            ))}
          </tr>
        );
      });

      return(
          headers
      )
    }
    
    const renderData = (data, columns) => {
      return data.map((row, rowIndex) => (
          <tr key={rowIndex} style={{borderBottom:"1px solid black", backgroundColor:"#D6EEEE"}}>
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
