import logo from './logo.svg';
import './App.css';
//import {faker} from '@faker-js/faker'
import { HummingTable } from './components/HummingTable/HummingTable';
import React, {useState, useEffect} from "react";

//faker.seed(100);

function App() {
  const headerStyle = {
    backgroundColor: "#ACC",
    
  }

  const columnConfig1 = [
    {
        dataKey:"id",
        label:"아이디",
        width:"8%",
        sortable: true,
    },
    {
      dataKey:"name",
      label:"이름",
      width:"8%",
      sortable: true,
    },
    {
        dataKey:"other",
        label:"그외 정보",
        width:"50%",
        sortable: true,
        children: [
          {
            dataKey:"age",
            label:"나이",
            width:"30%",
            sortable: true,
          },
          {
            dataKey:"address",
            label:"주소",
            width:"20%",
            sortable: true,
            children: [
              {
                dataKey:"street",
                label:"세부 주소1",
                width:"10%",
                sortable: true,
              },
              {
                dataKey:"block",
                label:"세부 주소2",
                width:"7%",
                sortable: true,
                children: [
                  {
                    dataKey:"building",
                    label:"동",
                    width:"3%",
                    sortable: true,
                  },
                  {
                    dataKey:"doorNo",
                    label:"호수",
                    width:"3%",
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
        width:"24%",
        sortable: false,
        children:[
          {
            dataKey:"companyAddress",
            label:"회사 주소",
            width:"12%",
            sortable: true,
          },
          {
            dataKey:"companyName",
            label:"회사 명",
            width:"12%",
            sortable: true,
          }
        ]
    }
]

const columnConfig2 = [
  {
      dataKey:"id",
      label:"아이디",
      width:"12%",
      sortable: true,
  },
  {
    dataKey:"name",
    label:"이름",
    width:"12%",
    sortable: true,
  },
  {
    dataKey:"age",
    label:"나이",
    width:"12%",
    sortable: true,
  },
  {
    dataKey:"street",
    label:"세부 주소1",
    width:"12%",
    sortable: true,
  },
  {
    dataKey:"building",
    label:"동",
    width:"12%",
    sortable: true,
  },
  {
    dataKey:"doorNo",
    label:"호수",
    width:"12%",
    sortable: true,
  },
  {
    dataKey:"companyAddress",
    label:"회사 주소",
    width:"18%",
    sortable: true,
  },
  {
    dataKey:"companyName",
    label:"회사 명",
    width:"12%",
    sortable: true,
  }


]




const [data, setData] = useState([
  {
    id: "1",
    name: "sim1",
    age: "1",
    street: "yeongtong-r333333333333333333333333333333333333333333333333333333333333333333333333333333o",
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
])

const clickButton1 = () => {
  setData(
    [
      {
        id: "111",
        name: "sim111",
        age: "111",
        street: "yeongtong-ro",
        building: "824",
        doorNo: "1503",
        companyAddress: "suwon-si",
        companyName: "SK1"
      },
      {
        id: "222",
        name: "sim222",
        age: "222",
        street: "yeongtong-ro",
        building: "1824",
        doorNo: "11503",
        companyAddress: "suwon-si",
        companyName: "SK2"
      },
    ]
  )
}
const clickButton2 = () => {
  setData(
    [
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
  )
}

  return (
    <div className="App">
      TEST
      <HummingTable 
        columns={columnConfig1}
        dataSource={data}
        headerStyle={headerStyle}
        title={"table title test"}
      ></HummingTable>

      <button onClick={clickButton1}>click1</button>
      <button onClick={clickButton2}>click2</button>
    </div>
  );
}

export default App;