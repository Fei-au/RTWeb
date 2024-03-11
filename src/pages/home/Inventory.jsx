import React, { useEffect, useState } from "react";
import HomeLayout from "./MyLayout";
import { errorHandler } from "../../requests/errorHandler";
import { get_items } from "../../requests/inventoryRequest";
import { Table } from "antd";
import { utcToLocalDateTimeString } from "../../utils/dateUtils";

const subNav = [
    {title: 'inventory'}
];

const columns = [
    {
        title: 'Image',
        width: 100,
        dataIndex: 'images',
        key: 'images',
        render: (images)=><img style={{width: '100%'}} src={images?.[0]?.full_image_url}/>
    },
    {
      title: 'Item No.',
      width: 100,
      dataIndex: 'item_number',
      key: 'item_number',
    },
    {
        title: 'Title',
        width: 200,
        dataIndex: 'title',
        key: 'title',
        ellipsis: true,
    },
    {
      title: 'B0 Code',
      width: 130,
      dataIndex: 'b_code',
      key: 'b_code',
    },
    {
      title: 'MSRP',
      dataIndex: 'msrp_price',
      key: 'msrp_price',
      width: 100,
    },
    {
      title: 'Bid Price',
      dataIndex: 'bid_start_price',
      key: 'bid_start_price',
      width: 100,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
    },
    {
      title: 'Status Note',
      dataIndex: 'status_note',
      key: 'status_note',
      width: 200,
      ellipsis: true,
    },
    {
      title: 'Add Staff',
      dataIndex: 'add_staff',
      key: 'add_staff',
      width: 100,
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      width: 100,
    },
    {
      title: 'Add date',
      dataIndex: 'add_date',
      key: 'add_date',
      width: 150,
    },
    // {
    //   title: 'Last Modified',
    //   dataIndex: 'last_modified',
    //   key: 'last_modified',
    //   width: 150,
    // },
    {
      title: 'Action',
      key: 'operation',
      fixed: 'right',
      width: 100,
      render: () => <a>Edit</a>,
    },
  ];

const Inventory = ()=>{

    const [items, setItems] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(50);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [total, setTotal] = useState(0)
    const onSelectChange = (newSelectedRowKeys) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
      };
    
      const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
      };
    useEffect(()=>{
        const func = async ()=>{
            try{
                const total = await get_total_item();
                const data = await get_items({page_number: pageNumber, page_size: pageSize});
                setTotal(total)
                setItems(data.map(ele=>{return {
                    ...ele,
                    key: ele.id,
                    add_date: utcToLocalDateTimeString(ele.add_date),
                    last_modified: utcToLocalDateTimeString(ele.last_modified),
                    status: ele.status.status,
                    add_staff: ele?.add_staff?.user?.first_name + ' ' + ele?.add_staff?.user?.last_name
                }}))
            }catch(err){
                errorHandler(err);
            }
        }
        func();
    }, [])

    return (
        <HomeLayout subItems={subNav}>
            <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={items}
                pagination={{current: pageNumber,  pageSize:pageSize}}
                scroll={{y: '70vh'}}
                total={total}
            />
        </HomeLayout>
    );

}

export default Inventory;