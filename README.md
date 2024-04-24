# Hummingbird component

This component library object is react quickly like as most compact library to act fast compare to other library.

## How to start

run below command

```
npm i hummingbird-component
```

## Using like that
```javascript
import {HummingTable} from "hummingbird-component"

...

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

...

return (
    <div className="App">
      test
      <HummingTable 
        columns={columnConfig1}
        dataSource={data}
        headerStyle={headerStyle}
      ></HummingTable>
      <button onClick={cliskButton}>click</button>
    </div>
  );




```

