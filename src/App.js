import logo from './logo.svg';
import './App.css';
//import {faker} from '@faker-js/faker'
import { HummingTable } from './components/HummingTable/HummingTable';
import React, {useState, useEffect} from "react";

//faker.seed(100);

function App() {
  const headerStyle = {
    backgroundColor: "#ACC"
  }

  const columnConfig1 = [
    {
        dataKey:"id",
        label:"아이디",
        width:"150px",
        sortable: true,
    },
    {
      dataKey:"name",
      label:"이름",
      width:"100px",
      sortable: true,
    },
    {
        dataKey:"other",
        label:"그외 정보",
        width:"400px",
        sortable: true,
        children: [
          {
            dataKey:"age",
            label:"나이",
            width:"100px",
            sortable: true,
          },
          {
            dataKey:"address",
            label:"주소",
            width:"300px",
            sortable: true,
            children: [
              {
                dataKey:"street",
                label:"세부 주소1",
                width:"100px",
                sortable: true,
              },
              {
                dataKey:"block",
                label:"세부 주소2",
                width:"200px",
                sortable: true,
                children: [
                  {
                    dataKey:"building",
                    label:"동",
                    width:"100px",
                    sortable: true,
                  },
                  {
                    dataKey:"doorNo",
                    label:"호수",
                    width:"100px",
                    sortable: true,
                  }
                ]
              }
            ]
          }
        ]
    },
    {
        dataKey:"company",
        label:"회사 정보",
        width:"300px",
        sortable: false,
        children:[
          {
            dataKey:"companyAddress",
            label:"회사 주소",
            width:"150px",
            sortable: true,
          },
          {
            dataKey:"companyName",
            label:"회사 명",
            width:"150px",
            sortable: true,
          }
        ]
    }
]

const columnConfig2 = [
  {
      dataKey:"id",
      label:"아이디",
      width:"100px",
      sortable: true,
  },
  {
    dataKey:"name",
    label:"이름",
    width:"100px",
    sortable: true,
  },
  {
    dataKey:"other",
    label:"그외 정보",
    width:"200px",
    sortable: true,
  },
  {
    dataKey:"age",
    label:"나이",
    width:"100px",
    sortable: true,
  },
  {
    dataKey:"address",
    label:"주소",
    width:"200px",
    sortable: true,
  },
  {
    dataKey:"street",
    label:"세부 주소1",
    width:"100px",
    sortable: true,
  },
  {
    dataKey:"block",
    label:"세부 주소2",
    width:"100px",
    sortable: true,
  },
  {
    dataKey:"building",
    label:"동",
    width:"100px",
    sortable: true,
  },
  {
    dataKey:"doorNo",
    label:"호수",
    width:"100px",
    sortable: true,
  },
  {
    dataKey:"company",
    label:"회사 정보",
    width:"300px",
    sortable: false,
  },
  {
    dataKey:"companyAddress",
    label:"회사 주소",
    width:"150px",
    sortable: true,
  },
  {
    dataKey:"companyName",
    label:"회사 명",
    width:"150px",
    sortable: true,
  }


]


const data = [
  {
    id: "1",
    name: "sim1",
    age: "1",
    street: "yeongtong-ro",
    building: "824",
    doorNo: "1503",
    companyAddress: "suwon-si",
    companyName: "SK1"
  },
  {
    id: "2",
    name: "sim2",
    age: "2",
    street: "yeongtong-ro",
    building: "1824",
    doorNo: "11503",
    companyAddress: "suwon-si",
    companyName: "SK2"
  },
]


  return (
    <div className="App">
      TEST
      <HummingTable 
        columns={columnConfig1}
        dataSource={data}
        headerStyle={headerStyle}
      ></HummingTable>
    </div>
  );
}

export default App;
