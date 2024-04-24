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
          return (
            <th colSpan={getColSpan(column)} style={{width:column.width}} key={column.label}>
              {column.label}
              {renderHeaders(column.children)}
            </th>
            );
        } else {
          return <th style={{ width: column.width, borderBottom:"1px solid black" }} key={column.label}>{column.label}</th>;
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
      <thead style={headerStyleData}>
        <tr>
          {renderHeaders(columnData)}
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
