import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Upload, message } from "antd";
import FormData from "form-data";
import React from "react";
import { upload_sold_products, upload_url } from "../requests/sellRequest";
import { errorHandler } from "../requests/errorHandler";

const {Dragger} = Upload



function Uploader (props){

  const {addNewLink} = props;

  const handleOnChange = (info)=>{
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
      addNewLink(info.file.response, info.file.name)
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  }
  

  return <Dragger
    name='file'
    action={upload_url}
    onChange={handleOnChange}
  >
      <p className="ant-upload-drag-icon">
      <InboxOutlined />
      </p>
      <p className="ant-upload-text">Click or drag file to this area to upload</p>
      <p className="ant-upload-hint">
        Support for a single or bulk upload. Strictly prohibited from uploading company data or other
        banned files.
      </p>
  </Dragger>
}
export default Uploader;