import React, { Component } from 'react'
import { Upload, Modal,message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {BASE_URL} from '../../config';
import {reqDeletePicture} from '../../api';
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
export default class picture_wall extends Component {
  state = {
    previewVisible: false, //展示预览窗
    previewImage: '',//预览的图片的url地址或base64编码
    previewTitle: '',
    fileList: [],
  };
   //从fileList提取出所有该商品对应的图片名字，构建一个数组，供新增商品使用。
   getImgArr = ()=>{
    let result = []
    this.state.fileList.forEach((item)=>{
      result.push(item.name)
    })
    return result
  }
  setFileList = (imgArr)=>{
    let fileList = []
    imgArr.forEach((item,index)=>{
      fileList.push({uid:-index,name:item,url:`${BASE_URL}/upload/${item}`})
    })
    this.setState({fileList})
  }
  //关闭预览窗
  handleCancel = () => this.setState({ previewVisible: false });
  //展示预览窗
  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };

  handleChange = async({file, fileList }) => {
    //若文件上传成功
    if(file.status === 'done'){
      console.log(file.response.data.url);
      fileList[fileList.length-1].url = file.response.data.url
      fileList[fileList.length-1].name = file.response.data.name
    }
    //删除图片(真删除从服务器删除)
    if(file.status === 'removed'){
      let result = await reqDeletePicture(file.name)
      const {status,msg} = result
      if(status===0) message.success('删除图片成功')
      else message.error(msg)
    }
    this.setState({ fileList });
  }
  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    return (
      <>
        <Upload
          action={`${BASE_URL}/manage/img/upload`} //接收图片服务器的地址
          listType="picture-card" //照片墙的展示样式
          // method="post"
          name="image"
          fileList={fileList} //图片列表,一个数组里面包含着多个图片对象
          onPreview={this.handlePreview} //点击预览的回调
          onChange={this.handleChange} //图片状态改变的回调
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </>
    );
  }
}
