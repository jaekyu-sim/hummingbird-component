import React, { useRef } from 'react';



const ResizableTable = ({ children }) => {
    const tableRef = useRef(null);
    const pageX = useRef(null);
    const columns = useRef([]);
    const columnWidths = useRef([]);
  
    const handleMouseDown = (e, index) => {
      pageX.current = e.pageX;
      columns.current[index] = e.target;
      columnWidths.current[index] = e.target.offsetWidth;
  
      const mouseMoveHandler = (e) => {
        const dx = e.pageX - pageX.current;
        const newWidth = columnWidths.current[index] + dx;
        if (newWidth > 0) {
          columns.current[index].style.width = newWidth + 'px';
        }
      };
  
      const mouseUpHandler = () => {
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
      };
  
      document.addEventListener('mousemove', mouseMoveHandler);
      document.addEventListener('mouseup', mouseUpHandler);
    };
  
    return (
      <table ref={tableRef} className="resizable-table">
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.type === 'thead') {
            return React.cloneElement(child, {
              onMouseDown: (e) => handleMouseDown(e, 6), // Change '6' to the index of the resizable column
            });
          }
          return child;
        })}
      </table>
    );
  };
  
  export default ResizableTable;