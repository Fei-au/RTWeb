import React, { useEffect, useState, useRef, useContext } from "react";
import HomeLayout from "./MyLayout";
import { errorHandler } from "../../requests/errorHandler";
import { get_status, get_items, get_total_item, update_item, export_items, get_available_sequences, get_next_lot_number } from "../../requests/inventoryRequest";
import { Form, Input, InputNumber, Modal, Select, Table, Image, Button, message, Spin, Space } from "antd";
import { utcToLocalDateTimeString } from "../../utils/dateUtils";
import TextArea from "antd/es/input/TextArea";
import { valueToLabel } from "../../utils/formatUtil";
import './inventory.scss';

const EditableContext = React.createContext(null);
const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};
const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  // const [spinning, setSpinning] = useState(false);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);
  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };
  const save = async () => {
    try {
      // setSpinning(true);
      const values = await form.validateFields();
      // setSpinning(false);
      toggleEdit();
      handleSave({
        ...record,
        ...values,
      });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }finally{
      // setSpinning(false);
    }
  };
  let childNode = children;
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <InputNumber ref={inputRef} onPressEnter={save} onBlur={save} precision={0} min={1}/>
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};


const subNav = [
  { title: 'inventory' }
];

function priceSort (a,b){
  return b.msrp_price - a.msrp_price
}

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

const exportDefaultColumns = [
  {
    title: 'B0 Code',
    width: 130,
    dataIndex: 'b_code',
    key: 'b_code',
  },
  {
    title: 'Title',
    width: 200,
    dataIndex: 'title',
    key: 'title',
    ellipsis: true,
    render: (tit)=><span title={tit} style={{overflow: 'hidden', textOverflow: 'ellipsis'}}>{tit}</span>
  },
  {
    title: 'Description',
    width: 200,
    dataIndex: 'description',
    key: 'description',
    ellipsis: true,
    render: (des)=><span title={des} style={{overflow: 'hidden', textOverflow: 'ellipsis'}}>{des}</span>
  },
  {
    title: 'MSRP',
    dataIndex: 'msrp_price',
    key: 'msrp_price',
    width: 100,
  },
  {
    title: 'Lot',
    width: 120,
    dataIndex: 'sequence',
    key: 'sequence',
    editable: true,
  },
  {
    title: 'Price',
    dataIndex: 'bid_start_price',
    key: 'bid_start_price',
    width: 100,
  },
  {
    title: 'Item Number',
    dataIndex: 'item_number',
    key: 'item_number',
    width: 100,
  },
];

const getStaffName = (staff)=>{
  return staff?.user?.first_name + ' ' + staff?.user?.last_name
}

const Inventory = () => {

  const [messageApi, contextHolder] = message.useMessage();
  const [spinning, setSpinning] = useState(false);
  const [items, setItems] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [total, setTotal] = useState(0)
  const [open, setOpen] = useState(false);
  const [editInitValue, setEditInitValue] = useState({});
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [statusList, setStatusList] = useState([]);
  const [form] = Form.useForm();
  const [auction, setAuction] = useState(null)
  const [avaliableSqsRange, setAvailableSqsRange] = useState([]);
  const [avaliableSqsList, setAvailableSqsList] = useState([]);

  const [exportOpen, setExportOpen] = useState(false);
  const [exportItems, setExportItems] = useState([]);

  useEffect(() => {
    const func = async () => {
      try {
        const pml = [
          get_total_item(),
          get_items({ page_number: pageNumber, page_size: 2000 }),
          get_status(),
        ];
        setSpinning(true);
        const resList = await Promise.all(pml);
        setSpinning(false);
        setTotal(resList[0])
        console.log('totla', resList[0])
        setItems(resList[1].map(ele => {
          return {
            ...ele,
            key: ele.id,
          }
        }))
        setStatusList(resList[2].map(ele=>{return {label: ele.status, value: ele.id}}))
      } catch (err) {
        errorHandler(err);
      }finally{
        setSpinning(false);
      }
    }
    func();
  }, [])

  const getAuctionDetail = async(num)=>{
    try{
      setAuction(num);
      const pmlist = []
      // get last lot number
      pmlist.push(get_next_lot_number(num))
      // get available sequences
      pmlist.push(get_available_sequences(num))
      setSpinning(true);

      const resList = await Promise.all(pmlist)
      setSpinning(false);
      const {range, list} = resList[1]
      setAvailableSqsRange(range);
      setAvailableSqsList(list);
      let i = 2;
      let step = 1;
      setExportItems(exportItems.map((ele, idx)=>{
        if(list.length === 0 && idx < 10){
          step = 3;
        }else{
          step = 1;
        }
        while(list.indexOf(i) !== -1){
          i += step;
        }
        const res = {
          ...ele,
          image_number: resList[0]++,
          sequence: i
        };
        i+=step
        return res
      }))
    }catch(err){
      errorHandler(err);
    }finally{
      setSpinning(false)
    }
  }

  useEffect(()=>{
    if(exportOpen && auction){
      getAuctionDetail(auction);
    }
  }, [exportOpen, auction])

  const handleEditClick = (record, index) => {
    setOpen(true);
    setEditInitValue({origin_data: record, ...record, index, status_id: record.status.id})
  }

  const columns = [
    {
      title: 'Image',
      width: 100,
      dataIndex: 'images',
      key: 'images',
      render: (images) => {return <Image.PreviewGroup
        items={images.map(ele=>ele.full_image_url)}
      >
        <Image
          width={'100%'}
          src={images?.[0]?.full_image_url}
        />
      </Image.PreviewGroup>}
      // render: (images) => <img style={{ width: '100%' }} src={images?.[0]?.full_image_url} />
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
      sorter: (a, b) => a.msrp_price - b.msrp_price,
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
      render: (status)=>status.status
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
      render: (stf)=>getStaffName(stf)
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
      render: (ad)=>utcToLocalDateTimeString(ad),
      sorter: (a, b) => new Date(a.add_date) - new Date(b.add_date),
    },
    // {
    //   title: 'Last Modified',
    //   dataIndex: 'last_modified',
    //   key: 'last_modified',
    //   width: 150,
        // redner:(lm)=> utcToLocalDateTimeString(lm),
    // },
    {
      title: 'Action',
      key: 'operation',
      fixed: 'right',
      width: 100,
      render: (text, record, index) => <a onClick={() => { handleEditClick(record, index) }}>Edit</a>,
    },
  ];
    

  const handleOk = async (fm) => {
    try{
      const {status_id, ...resFm} = fm;
      setConfirmLoading(true);
      await update_item({...resFm, id: editInitValue.id, status_id: parseInt(status_id)});
      messageApi.success('Update item success!')
      setOpen(false);
      const tempItems = items.slice();
      const {origin_data, index, ...res} = editInitValue;
      const statusObj = {
        id: status_id,
        status: valueToLabel(status_id, statusList)
      }
      tempItems[index] = {
        ...origin_data,
        ...resFm,
        status: statusObj,
        msrp_price: parseFloat(resFm.msrp_price).toFixed(2),
        bid_start_price: parseFloat(resFm.bid_start_price).toFixed(2),
      }
      setItems(tempItems);
      setEditInitValue({});
    }catch(err){
      errorHandler(err);
    }finally{
      setConfirmLoading(false);
    }
  }

  const handleExport = ()=>{
    console.log('export')
    // set export preview items
    setExportOpen(true)
    let ei = items.filter(ele=>selectedRowKeys.indexOf(ele.id) !== -1).sort(priceSort);
    // combine descriptions, with last lot number
    ei = ei.map((ele, index)=>{return {
      ...ele,
      index: index,
      // sequence: index+2,
      description: ele.location + '-' + ele.item_number + ' ' + ele.status.status + (ele.status_note ? (' ' + ele.status_note) : '') + '. ' + ele.description + '. MSRP $' + ele.msrp_price + '.',
      // image_number: index+1,
    }})
    setExportItems(ei)
    messageApi.info('Please input auction first to get available sequence numbers.');
  }

  const handleAuctionBlur = (e)=>{
    setAuction(parseInt(e.target.value) || null)
  }

  const getAvailableSequences = ()=>{
    let str = '  ';
    avaliableSqsRange.forEach(ele => {
      str += (ele[0] + ' - ' + ele[1] + ', ')
    });
    return (str.substring(0, str.length - 2))
  }

  const startExport = async ()=>{
    try{
      setSpinning(true);
      const data = exportItems.map(ele=>{
        return {
            id: ele.id,
            sequence: ele.sequence,
            description: ele.description,
            image_number: ele.item_number,
        }
      });
      const csvFile = await export_items({data, auction});
       // Create a URL for the blob
      const fileURL = window.URL.createObjectURL(new Blob([csvFile]));
      // Create a temp <a> element to download the file
      const fileLink = document.createElement('a');
      fileLink.href = fileURL;
      console.log('fileUrl', fileURL)
      // Set the file name in the download attribute
      fileLink.setAttribute('download', `Auction-${auction}.zip`); // Specify the file name here
      // Append to the document and trigger the download
      document.body.appendChild(fileLink);
      fileLink.click();
      // Clean up
      document.body.removeChild(fileLink); // Remove the link from the document
      window.URL.revokeObjectURL(fileURL); // Release the object URL
      setSpinning(false);
      setExportOpen(false);
      messageApi.success('Export success, please find zip file in browser downloads')
    }catch(err){
      errorHandler(err);
    }finally{
      setSpinning(false)
    }
  }

  const handleSave = (row) => {
    const newData = [...exportItems];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    let nextSqs = row.sequence;
    let step = 1;
    for(let i = index + 1; i < newData.length; i++){
      if(avaliableSqsList.length === 0 && i < 10){
        step = 3;
      }else{
        step = 1;
      }
      if(i === index + 1){
        nextSqs += step
      }
      while(avaliableSqsList.indexOf(nextSqs) !== -1){
        nextSqs += step
      }
      newData[i].sequence = nextSqs
      nextSqs += step
    }
    setExportItems(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const exportColumns = exportDefaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  const onSelectChange = (newSelectedRowKeys, selectedRows) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    console.log('selectedRows changed: ', selectedRows);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };


  return (
    <HomeLayout subItems={subNav}>
      {contextHolder}
      <Spin spinning={spinning} fullscreen={true} style={{ zIndex: 1050 }}/>
      <div className="flex justify-end m-4">
        <Button onClick={handleExport} type="primary">
          Export
        </Button>
      </div>
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={items}
        rowKey={record=>record.id} // product list table use item id as key
        // pagination={{ current: pageNumber, pageSize: pageSize, total: total }}
        scroll={{ y: '65vh' }}
      />
      <Modal
        title="Edit item"
        open={open}
        onOk={form.submit}
        confirmLoading={confirmLoading}
        width={800}
        onCancel={()=>{setOpen(false); form.resetFields()}}
      >
        <Form
          form={form}
          {...formItemLayout}
          // variant="filled"
          style={{
            maxWidth: 800,
          }}
          onFinish={handleOk}
          initialValues={editInitValue}
          preserve={false} 
        >
          <Form.Item
            label="Item No."
            name="item_number"
            // rules={[
            //   {
            //     required: true,
            //     message: 'Please input!',
            //   },
            // ]}
          >
            <Input disabled/>
          </Form.Item>
          <Form.Item
            label="Title"
            name="title"
            rules={[
              {
                required: true,
                message: 'Please input title!',
              },
            ]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[
              {
                required: true,
                message: 'Please input Description!',
              },
            ]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            label="B0 Code"
            name="b_code"
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="MSRP"
            name="msrp_price"
            rules={[
              {
                required: true,
                message: 'Please input MSRP!',
              },
            ]}
          >
            <InputNumber 
              precision={2}
              min={0}
              style={{ width: 100 }}
            />
          </Form.Item>
          <Form.Item
            label="Bid Price"
            name="bid_start_price"
            rules={[
              {
                required: true,
                message: 'Please input Bid Price!',
              },
            ]}
          >
            <InputNumber 
              // formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              precision={2}
              min={0}
              style={{ width: 100 }}
            />
          </Form.Item>
          <Form.Item
            label="Status"
            name="status_id"
            rules={[
              {
                required: true,
                message: 'Please select status!',
              },
            ]}
          >
            <Select options={statusList}/>
          </Form.Item>
          <Form.Item
            label="Status Note"
            name="status_note"
            rules={[
              {
                message: 'Please select status note!',
              },
            ]}
          >
            <TextArea />
          </Form.Item>
          <Form.Item
            label="Location"
            name="location"
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Export Preview"
        open={exportOpen}
        onOk={startExport}
        okButtonProps={{disabled: !auction}}
        okText='Start Export'
        onCancel={()=>setExportOpen(false)}
        width={1200}
        className="custom-modal-style"
      >
        <Space>
          <span>Auction Number</span>
          <InputNumber min={0} value={auction} onBlur={(e)=>handleAuctionBlur(e)}/>
          <span>Available Sequence: {getAvailableSequences()}</span>
        </Space>
        <div style={{height: '10px'}}/>
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          rowKey={record=>record.index} // preview table use index as key
          bordered
          columns={exportColumns}
          dataSource={exportItems}
          scroll={{ y: 700 }}
          pagination={{ pageSize: 1000 }}
        />
      </Modal>
    </HomeLayout>
  );

}

export default Inventory;