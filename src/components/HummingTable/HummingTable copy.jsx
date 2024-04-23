import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
//import './button.css';

/**
 * Primary UI component for user interaction
 */
export const HummingTable = ({ dataSource, columns, headerStyle }) => {
    /* variable */

    /* useState */
    const [data, setData] = useState(dataSource);
    const [columnData, setColumnData] = useState([]);

      
    /* custom function */
    // const sortData = (key) => {
    // setData([...data].sort((a, b) => a[key] - b[key]));
    // };


    const iterateColumns = (columns) => {
      columns.forEach(column => {

        if (!column.dataKey || !column.label) {
          throw new Error('column 의 dataKey와 label은 필수 속성입니다.');
        }

        

        if (column.children) {
          console.log('Children:');
          iterateColumns(column.children);
        }
        else
        {
          setColumnData((prev) => {
            let tmpDataKey = column.dataKey;
            let tmpLabel = column.label;
            let tmpWidth = column.width?column.width:"70px";
            let tmpSortable = column.sortable?column.sortable:false;
            return [...prev, {dataKey: tmpDataKey, label: tmpLabel, width: tmpWidth, sortable: tmpSortable}]
          })
        }
      });
    };


    const TableHeader = ({ columns }) => {
      const renderHeader = (columns) => {
        return (
          <tr>
            
            {columns.map(column => (
              <th key={column.dataKey} style={{ width: column.width, border: "1px solid #444444" }}>
                {column.label}
                {column.children && (
                  <TableHeader columns={column.children} />
                )}
              </th>
            ))}
          </tr>
        );
      };
    
      return <thead>{renderHeader(columns)}</thead>;
    };

    const renderDataCell = (row, column) => {
      if (column.children) {
          return column.children.map(childColumn => {
              return (
                  <React.Fragment key={childColumn.dataKey}>
                      {renderDataCell(row, childColumn)}
                  </React.Fragment>
              );
          });
      } else {
          return (
              <td key={column.dataKey} style={{ border: "1px solid #444444" }}>
                  {row[column.dataKey]}
              </td>
          );
      }
  };

  
    /* useEffect */
    useEffect(() => {

    }, [])

    useEffect(() => {
      setData(dataSource)
    }, [dataSource])
    
    useEffect(() => {

      iterateColumns(columns)
    }, [columns])
    
    useEffect(() => {
      
    }, [headerStyle])



    

  return (

    <table style={{ border: "1px solid #444444", width: "100%" }}>
      
      <TableHeader columns={columns} />
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex} style={{ border: "1px solid #444444" }}>
              {columns.map(column => renderDataCell(row, column))}
          </tr>
        ))}
      </tbody>
    </table>

  );
};

export default HummingTable

HummingTable.propTypes = {
  /**
   * Is this the principal call to action on the page?
   */
  primary: PropTypes.bool,
  /**
   * What background color to use
   */
  backgroundColor: PropTypes.string,
  /**
   * How large should the button be?
   */
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  /**
   * Button contents
   */
  label: PropTypes.string.isRequired,
  /**
   * Optional click handler
   */
  onClick: PropTypes.func,
};

HummingTable.defaultProps = {
  backgroundColor: null,
  primary: false,
  size: 'medium',
  onClick: undefined,
};
