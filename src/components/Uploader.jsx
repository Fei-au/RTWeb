import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Upload, message } from "antd";
import FormData from "form-data";
import React from "react";
import { upload_sold_products, upload_url } from "../requests/sellRequest";
import { errorHandler } from "../requests/errorHandler";

const {Dragger} = Upload

const props = {
    name: 'file',
    // maxCount: 1,
    // action: upload_url,
    // async (f)=>{
    //     console.log('flist', fList);
    //     const fd = new FormData();
    //     fd.append('file', f)
    //     const res = await upload_sold_products(fd);
    //     console.log('res', res);
    // },
    // customRequest: async(options)=>{
    //     const { onSuccess, onError, file, onProgress } = options;

    //     const fd = new FormData();
    //     fd.append('file', file)
    //     const res = await upload_sold_products(fd);
    //     console.log('res',res)
    //     onSuccess(res);
    // },
    action: upload_url,
    headers: {
        'responseType': 'blob',
    },
    onChange(info) {
        console.log('here onchange', info)
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
        console.log(info.file.response)
        // const zipFile = info.file.response
        // console.log(typeof zipFile)
        // // Create a URL for the blob
        // const fileURL = window.URL.createObjectURL(new Blob([zipFile]));
        // // Create a temp <a> element to download the file
        // const fileLink = document.createElement('a');
        // fileLink.href = fileURL;
        // console.log('fileUrl', fileURL)
        // // Set the file name in the download attribute
        // fileLink.setAttribute('download', `summary.zip`); // Specify the file name here
        // // Append to the document and trigger the download
        // document.body.appendChild(fileLink);
        // fileLink.click();
        // // Clean up
        // document.body.removeChild(fileLink); // Remove the link from the document
        // window.URL.revokeObjectURL(fileURL); // Release the object URL
        // message.success('Creating summary success, please find zip file in browser downloads')
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
};
const Uploader = () => (
    <Dragger {...props}>
        <p className="ant-upload-drag-icon">
        <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag file to this area to upload</p>
        <p className="ant-upload-hint">
        Support for a single or bulk upload. Strictly prohibited from uploading company data or other
        banned files.
        </p>
    </Dragger>
);
export default Uploader;