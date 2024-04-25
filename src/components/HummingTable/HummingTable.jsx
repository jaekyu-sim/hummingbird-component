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


    const renderHeaders = (columns) => {
      return columns.map(column => {
        if (column.children) {
          console.log("!! has children width : ", column.label, ", ", column.width)
          return (
            <th colSpan={getColSpan(column)} style={{width:column.width}} key={column.dataKey}>
              {column.label}
              {renderHeaders(column.children)}
            </th>
            );
        } else {
          console.log("!! no children width : ", column.label, ", ", column.width)
          return <th style={{ width: column.width }} key={column.dataKey}>{column.label}</th>;
        }
      });
    };
    
    const getColSpan = (column) => {
        if (!column.children) return 1;
        let colSpan = 0;
        column.children.forEach(child => {
          colSpan += getColSpan(child);
        });
        return colSpan;
    };
    
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
              console.log("## row width : ", column, ", ", column.width)
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
      let depthCount = 0;

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
      {/* <thead style={headerStyleData}>
        <tr>
          {renderHeaders(columnData)}
        </tr>
      </thead> */}
      <thead>
        <tr>
          <th rowspan="4"             width="8%">아이디</th>
          <th rowspan="4"             width="8%">이름</th>
          <th rowspan="1" colspan="4" width="8%">그외 정보</th>
          <th rowspan="1" colspan="2" width="8%">회사 정보</th>
        </tr>
        <tr>
          <th rowspan="3"             width="8%">나이</th>
          <th rowspan="1" colspan="3" width="8%">주소</th>
          <th rowSpan="3" width="8%">회사 주소</th>
          <th rowSpan="3" width="8%">회사 명</th>
        </tr>
        <tr>
          <th rowSpan="2"             width="8%">세부 주소1</th>
          <th rowSpan="1" colSpan="2" width="8%">세부 주소2</th>
        </tr>
        <tr>
          <th width="8%">동</th>
          <th width="8%">호수</th>
        </tr>
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
