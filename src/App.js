import logo from "./logo.svg";
import "./App.css";
//import {faker} from '@faker-js/faker'
import { HummingTable } from "./components/HummingTable/HummingTable";
import React, { useState, useEffect } from "react";
import ResizableTable from "./ResizableTable";

//faker.seed(100);

function App() {
  let dataLength = 28;
  const headerStyle = {
    //가능한 옵션 : backgroundColor, color
    //backgroundColor: "#ACC",
  };

  const columnConfig1 = [
    {
      dataKey: "id",
      label: "아이디",
      width: "8%",
      sortable: true,
      filter: true,
    },
    {
      dataKey: "name",
      label: "이름",
      width: "8%",
      sortable: true,
    },
    {
      dataKey: "other",
      label: "그외 정보",
      width: "calc(50% - 60px)",
      sortable: false,
      children: [
        {
          dataKey: "age",
          label: "나이",
          width: "40%",
          sortable: false,
        },
        {
          dataKey: "address",
          label: "주소",
          width: "60%",
          sortable: false,
          children: [
            {
              dataKey: "street",
              label: "세부 주소1",
              width: "70%",
              sortable: false,
            },
            {
              dataKey: "block",
              label: "세부 주소2",
              width: "30%",
              sortable: false,
              children: [
                {
                  dataKey: "building",
                  label: "동",
                  width: "50%",
                  sortable: false,
                },
                {
                  dataKey: "doorNo",
                  label: "호수",
                  width: "50%",
                  sortable: false,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      dataKey: "company",
      label: "회사 정보",
      width: "34%",
      sortable: false,
      children: [
        {
          dataKey: "companyAddress",
          label: "회사 주소",
          width: "50%",
          sortable: false,
        },
        {
          dataKey: "companyName",
          label: "회사 명",
          width: "50%",
          sortable: false,
        },
      ],
    },
  ];

  const columnConfig2 = [
    {
      dataKey: "id",
      label: "아이디",
      width: "120px",
      //width:"12%",
      sortable: true,
      filter: true,
    },
    {
      dataKey: "name",
      label: "이름",
      width: "0px",
      //width:"12%",
      sortable: true,
      visibility: false,
    },
    {
      dataKey: "age",
      label: "나이",
      width: "120px",
      //width:"12%",
      sortable: true,
    },
    {
      dataKey: "street",
      label: "세부 주소",
      //width:"12%",
      width: "120px",
      sortable: false,
      filter: true,
    },
    {
      dataKey: "building",
      label: "동",
      width: "120px",
      //width:"12%",
      sortable: false,
    },
    {
      dataKey: "doorNo",
      label: "호수",
      width: "120px",
      //width:"12%",
      sortable: false,
    },
    {
      dataKey: "companyAddress",
      label: "회사 주소",
      width: "180px",
      //width:"18%",
      sortable: false,
      filter: true,
    },
    {
      dataKey: "companyName",
      label: "회사 명",
      width: "120px",
      //width:"12%",
      sortable: false,
    },
  ];

  const columnConfig3 = [
    {
      dataKey: "id",
      label: "아이디",
      width: "100px",
      sortable: true,
      filter: true,
    },
    {
      dataKey: "name",
      label: "이름",
      width: "100px",
      sortable: true,
    },
    {
      dataKey: "other",
      label: "그외 정보",
      width: "calc(720px)",
      sortable: false,
      children: [
        {
          dataKey: "age",
          label: "나이",
          width: "300px",
          sortable: false,
        },
        {
          dataKey: "address",
          label: "주소",
          width: "420px",
          sortable: false,
          children: [
            {
              dataKey: "street",
              label: "세부 주소1",
              width: "300px",
              sortable: false,
            },
            {
              dataKey: "block",
              label: "세부 주소2",
              width: "120px",
              sortable: false,
              children: [
                {
                  dataKey: "building",
                  label: "동",
                  width: "60px",
                  sortable: false,
                },
                {
                  dataKey: "doorNo",
                  label: "호수",
                  width: "60px",
                  sortable: false,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      dataKey: "company",
      label: "회사 정보",
      width: "200px",
      sortable: false,
      children: [
        {
          dataKey: "companyAddress",
          label: "회사 주소",
          width: "100px",
          sortable: false,
        },
        {
          dataKey: "companyName",
          label: "회사 명",
          width: "100px",
          sortable: false,
        },
      ],
    },
  ];

  const columnConfig4 = [
    {
      dataKey: "id",
      label: "아이디",
      //width:"120px",
      width: "16%",
      sortable: true,
      filter: true,
      align:"center"
    },
    {
      dataKey: "name",
      label: "이름",
      width: "0%",
      //width:"12%",
      sortable: true,
      visibility: false,
    },
    {
      dataKey: "age",
      label: "나이",
      //width:"120px",
      width: "8%",
      sortable: true,
      align:"right"
    },
    {
      dataKey: "street",
      label: "세부 주소",
      width: "12%",
      // width:"120px",
      sortable: false,
      filter: true,
      align:"right"
    },
    {
      dataKey: "building",
      label: "동",
      // width:"120px",
      width: "12%",
      sortable: false,
    },
    {
      dataKey: "doorNo",
      label: "호수",
      // width:"120px",
      width: "12%",
      sortable: false,
    },
    {
      dataKey: "companyAddress",
      label: "회사 주소",
      // width:"180px",
      width: "28%",
      sortable: false,
      filter: true,
    },
    {
      dataKey: "companyName",
      label: "회사 명",
      // width:"120px",
      width: "12%",
      sortable: false,
    },
  ];
  let tmpData = [];
  for (let i = 0; i < dataLength; i++) {
    if (i === 3 || i === 4) {
      tmpData.push({
        key: i,
        id: "n" + i,
        name: "sim" + i,
        age: i ,
        street: "yeongtong-3",
        building: i + "824",
        doorNo: i + 1 + "503",
        companyAddress: "suwon-si",
        companyName: <button>{"SK" + i}</button>, //"SK"+i
      });
    } else {
      tmpData.push({
        key: i,
        id: "n" + i,
        name: "sim" + i,
        age: i,
        street: "yeongtong-3o",
        building: i + "824",
        doorNo: i + 1 + "503",
        companyAddress: "suwon-si",
        companyName: <button>{"SK" + i}</button>, //"SK"+i
      });
    }
  }

  const [data, setData] = useState(tmpData);
  const [rowShowFlag, setRowShowFlag] = useState(true);
  const [rowSelectionType, setRowSelectionType] = useState("checkbox");
  const [tmpInput, setTmpInput] = useState("");

  useEffect(() => {
    //console.log(data)
  }, []);

  const clickButton1 = () => {
    setData([
      {
        id: "n111",
        name: "sim111",
        age: "111",
        street:
          "yeongtong-rwidth:column.widthwidth:column.widthwidth:column.widthwidth:column.widthwidth:column.widtho",
        building: "824",
        doorNo: "1503",
        companyAddress: "suwon-si",
        companyName: "SK1",
      },
      {
        id: "n222",
        name: "sim222",
        age: "222",
        street: "yeongtong-ro",
        building: "1824",
        doorNo: "11503",
        companyAddress: "suwon-si",
        companyName: "SK2",
      },
    ]);
  };
  const clickButton2 = () => {
    setData([
      {
        id: "n1",
        name: "sim1",
        age: "1",
        street: "yeongtong-ro",
        building: "824",
        doorNo: "1503",
        companyAddress: "suwon-si",
        companyName: "SK1",
      },
      {
        id: "n2",
        name: "sim2",
        age: "2",
        street: "yeongtong-ro",
        building: "1824",
        doorNo: "11503",
        companyAddress: "suwon-si",
        companyName: "SK2",
      },
    ]);
  };
  const clickButton3 = () => {
    let tmp = !rowShowFlag;
    console.log("tmp1 : ", tmp);
    setRowShowFlag(tmp);
  };
  const clickButton4 = () => {
    if (rowSelectionType === "radio") {
      setRowSelectionType("checkbox");
    } else if (rowSelectionType === "checkbox") {
      setRowSelectionType("radio");
    }
  };
  const CustomTag = () => {
    return (
      <div
        id="5"
        style={{
          height: "450px",
          width: "95%",
          backgroundColor: "none",
          position: "relative",
        }}
      >
        <HummingTable
          width={"100%"}
          height={"100%"}
          columns={columnConfig4}
          // dataSource={[]}
          dataSource={data}
          //headerStyle={headerStyle}
          title={"table title test"}
          displayedRowNum="10"
          displayRowNumsYn={rowShowFlag}
          sizeChanger={[5, 10, 20, 40]}
          rowHeight="40px"
          //zebra

          rowSelection={{
            type: rowSelectionType,
            onChange: (selectedRows) => {
              console.log(selectedRows);
            },
          }}
          rowClick={{
            enable: false,
            onClick: (value) => {
              console.log("here is clicked row values :", value);
            },
            // onDoubleClick:(value)=>{
            //   console.log("here is double clicked row : ", value);
            // }
          }}
          // paginationUseYn="N"
          pagination={{
            // dataLength: 1000,
            onClick: (pageNum) => {
              console.log(pageNum);
            },
          }}
          //zebra, ...
        ></HummingTable>
      </div>
    );
  };
  return (
    <div className="App" style={{}}>
      <div id="header-area">
        <h1 style={{fontFamily:"Roboto", fontSize:"2rem", marginLeft:"30px"}}>HummingBird-Component</h1>
      </div>
      <div id="content-area">
      <h2 style={{ marginLeft: "30px" }}>It is very good Table component based on React to represent large Dataset</h2>
      <h3 style={{ marginLeft: "60px" }}>Sample Table Usage case</h3>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          id="simple-usage"
          style={{ height: "550px", width: "95%", backgroundColor: "none" }}
        >
          <div
            id="5"
            style={{ height: "450px", width: "95%", backgroundColor: "none" }}
          >
            <HummingTable
              width={"100%"}
              height={"100%"}
              columns={columnConfig4}
              // dataSource={[]}
              dataSource={data}
              //headerStyle={headerStyle}
              //title={"table title test"}
              displayedRowNum="10"
              //displayRowNumsYn={rowShowFlag}
              //sizeChanger={[5, 10, 20, 40]}
              rowHeight="40px"
              columnResizable = {true}
              //zebra
              //exportToCsv={true}
              rowSelection={{
                type: rowSelectionType,
                onChange: (selectedRows) => {
                  console.log(selectedRows);
                },
              }}
              paginationInitFlag = {false}
              rowClick={{
                enable: false,
                onClick: (value) => {
                  console.log("here is clicked row values :", value);
                },
                onDoubleClick:(value)=>{
                  setData((prev) => {
                    let tmpData = [...prev];
                    tmpData.push([])
                    return tmpData
                  })
                  console.log("here is double clicked row : ", value);
                }
              }}
              // paginationUseYn="N"
              pagination={{
                // dataLength: 1000,
                onClick: (pageNum) => {
                  console.log(pageNum);
                },
              }}
              //zebra, ...
            ></HummingTable>
          </div>
        </div>
      </div>


      {/* <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          id="3"
          style={{ height: "550px", width: "95%", backgroundColor: "none" }}
        >
          <div
            id="5"
            style={{ height: "450px", width: "95%", backgroundColor: "none" }}
          >
            <HummingTable
              width={"100%"}
              height={"100%"}
              columns={columnConfig4}
              // dataSource={[]}
              dataSource={data}
              //headerStyle={headerStyle}
              title={"table title test"}
              displayedRowNum="10"
              displayRowNumsYn={rowShowFlag}
              sizeChanger={[5, 10, 20, 40]}
              rowHeight="40px"
              //zebra
              exportToCsv={true}
              rowSelection={{
                type: rowSelectionType,
                onChange: (selectedRows) => {
                  console.log(selectedRows);
                },
              }}
              paginationInitFlag = {false}
              rowClick={{
                enable: false,
                onClick: (value) => {
                  console.log("here is clicked row values :", value);
                },
                onDoubleClick:(value)=>{
                  setData((prev) => {
                    let tmpData = [...prev];
                    tmpData.push([])
                    return tmpData
                  })
                  console.log("here is double clicked row : ", value);
                }
              }}
              // paginationUseYn="N"
              pagination={{
                // dataLength: 1000,
                onClick: (pageNum) => {
                  console.log(pageNum);
                },
              }}
              //zebra, ...
            ></HummingTable>
          </div>
        </div>
      </div> */}
      <div style={{ height: "50px" }}></div>
      </div>
    </div>
  );
}

export default App;
