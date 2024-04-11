import React, {useState} from 'react';
import PropTypes from 'prop-types';
//import './button.css';

/**
 * Primary UI component for user interaction
 */
export const HummingTable = ({ primary, backgroundColor, size, label, ...props }) => {


      
      // 데이터를 정렬하기 위한 함수
      const sortData = (key) => {
        setData([...data].sort((a, b) => a[key] - b[key]));
      };


    const headers = [
        {
            dataKey:"id",
            label:"아이디"
        },
        {
            dataKey:"name",
            label:"이름"
        },
        {
            dataKey:"age",
            label:"나이"
        },
    ]

    const [data, setData] = useState([
        { id: 1, name: 'John', age: 30 },
        { id: 2, name: 'Jane', age: 25 },
        { id: 3, name: 'Doe', age: 40 }
      ]);

  return (

    <table style={{border: "1px solid #444444"}}>
        <thead>
          <tr>
            {headers.map(header => (
              <th key={header.dataKey}>{header.label}</th>
            ))}
          </tr>
        </thead>
        <tbody >
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} style={{border: "1px solid #444444"}}>
                <td key={row.id} style={{border: "1px solid #444444"}}>{row.id}</td>
                <td key={row.name} style={{border: "1px solid #444444"}}>{row.name}</td>
                <td key={row.age} style={{border: "1px solid #444444"}}>{row.age}</td>
            </tr>
          ))}
        </tbody>
      </table>
  );
};

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
