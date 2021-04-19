import React, { Component } from "react";
import {connect} from 'react-redux';
import { Card, Button, Form, Input, Select ,message} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import {reqCategoryList,reqProductInfo,reqAddProduct,reqUpdateProduct} from '../../api';
import PictureWall from './picture_wall';
import RichtextEditor from './rich_textEditor';
let { Item } = Form;
const { Option } = Select;

class Addproduct extends Component {
  formInstance = React.createRef()
  pictureWall = React.createRef()
  richtextEditor = React.createRef()

  state = {
    categoryList:[],
    // productName:'',
    // categoryId:"",
    // imgs:[],
    // desc:'',
    // detail:'',
    // price:''
  }
  componentDidMount(){
    this.getCategoryList()
    let productId = this.props.match.params.id;
    if (productId){
      this.getProductInfo(productId)
    }
  }
  getProductInfo = async (productId) => {
    let result = await reqProductInfo(productId);
    //  console.log(result);
    let { status, data } = result;
    if (status === 0) {
     console.log(data);
    let name  = data.name ;
    // console.log(_id);
    let {categoryList} = this.state
    console.log(categoryList);
    //遍历分类数组,取出分类名
    let category = categoryList.find((item)=>{
      return item.name === name
    })
    console.log(category);
    //设置表单值
    let {setFieldsValue} = this.formInstance.current
    setFieldsValue({'name':data.name})
    setFieldsValue({'desc':data.desc})
    setFieldsValue({'price':data.price})
    setFieldsValue({'categoryId':category.name})
    this.richtextEditor.current.setRichText(data.detail)
    this.pictureWall.current.setFileList(data.imgs)
    }
  };
  getCategoryList = async()=>{
    let result = await reqCategoryList()
    let {status,data} = result
    if (status === 0) {
      this.setState({categoryList:data})
    }
  }
  handleSubmit = async(values)=>{
    // console.log(values);
    //从上传组件中获取已经上传的图片数组
    let imgs = this.pictureWall.current.getImgArr()
    //从富文本组件中获取用户输入的文字转换为富文本的字符串
    let detail = this.richtextEditor.current.getRichText()
    let _id = this.props.match.params.id;
    console.log();
    let result
    if(_id) {
      result = await reqUpdateProduct({...values,imgs,detail,_id})
    }else {
      result = await reqAddProduct({...values,imgs,detail})
    }
    const {status,msg} = result
    if(status === 0) {
      message.success('操作成功')
      this.props.history.replace('/admin/prod_about/product')
    }
    else message.error(msg)
  }
  render() {
    return (
      <Card
        title={
          <div>
            <Button type="link" onClick={this.props.history.goBack}>
              <ArrowLeftOutlined />
              <span>返回</span>
            </Button>
            {/* <span>商品添加</span> */}
            <span>{this.props.match.params.id ? '商品修改' : '商品添加'}</span>
          </div>
        }
      >
        <Form
        ref={this.formInstance}
        onFinish={this.handleSubmit}
          labelCol={{ md: 2 }}
          wrapperCol={{ md: 10 }}
        >
          <Item label="商品名称" name="name"
          rules= {[{required: true, message: '商品名称必须输入!'}]} >
            <Input placeholder="商品名称" />
          </Item>
          <Item label="商品描述" name="desc"
          rules= {[{required: true, message: '商品描述必须输入!'}]} >
            <Input placeholder="商品描述" />
          </Item>
          <Item label="商品价格" name="price"
          rules= {[{required: true, message: '商品价格必须输入!'}]} >
            <Input placeholder="商品价格" addonAfter="元" prefix="￥" type="number" />
          </Item>
          <Item label="商品分类" name="categoryId" initialValue=''
          rules= {[{required: true, message: '商品分类必须输入!'}]} >
            <Select>
              <Option value="">请选择分类</Option>
              {
                (this.state.categoryList.length > 0) ? this.state.categoryList.map((item)=>{
                  return <Option key={item._id} value={item._id}>{item.name}</Option>
                  }): this.props.categoryList.map((item)=>{
                    return <Option key={item._id} value={item._id}>{item.name}</Option>
                    })
              }
            </Select>
          </Item>
          <Item label="商品图片" wrapperCol={{ md: 12 }}>
            <PictureWall ref={this.pictureWall}/>
          </Item>
          <Item label="商品详情" wrapperCol={{ md: 16 }}>
            <RichtextEditor ref={this.richtextEditor}/>
          </Item>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Form>
      </Card>
    );
  }
}
export default connect(
  state => ({categoryList:state.categoryList}),
  {
  }
)(Addproduct)