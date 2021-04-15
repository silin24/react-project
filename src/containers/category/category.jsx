import React,{Component} from 'react'
import {connect} from 'react-redux';
import { Card,Button,Table,Modal,Form,Input, message} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {reqCategoryList} from '../../api';
import {PAGE_SIZE} from '../../config';
import {reqAddCategory,reqUpdateCategory} from '../../api';
import {createSaveCategoryListAction} from '../../redux/actions/catrgoryList_action';




 class Category extends Component{
  formInstance = React.createRef()
  state = {
    CategoryList:[],
    visible:false,
    showModelType:'',
    categoryName:'',//当前分类name
    categoryId:'' ,// 当前分类id
  }
  componentDidMount(){
    this.getCategoryList()
  }
  getCategoryList = async()=>{
    let result = await reqCategoryList()
    let {status,data} = result
    if (status === 0) {
      this.setState({CategoryList:data})
    }
    this.props.saveCategoryList(data)
  }
  //添加分类
  showModalAdd = (a) => {
    this.setState({
      showModelType:a,
      categoryName:'',
      categoryId:'',
      visible:true
    })
  };
  toAdd = async(name)=>{
    let {resetFields} = this.formInstance.current
    let result = await reqAddCategory(name)
    let {status,data} = result
    if (status === 0) {
      message.success('添加分类成功',1)
      let CategoryList = [...this.state.CategoryList]
      CategoryList.unshift(data)
      this.setState({
        CategoryList,
        visible:false
      })
       resetFields()
    } else {
      message.error('添加分类失败',1)
    }
  }
  //修改分类
  showModalUpdate = (item,b) => {
     let {setFieldsValue} = this.formInstance.current
    let {_id,name} = item
    setFieldsValue({'categoryName':name})
    this.setState({
      categoryName:name,
      categoryId:_id,
      visible:true,
      showModelType:b
    })
  };
  toUptate = async(obj)=>{
    // console.log(this.formInstance.current);
   let {resetFields} = this.formInstance.current
   let result = await reqUpdateCategory(obj)
   console.log(result);
   let {status} = result
   if (status === 0) {
     message.success('更新分类成功',1)
     this.getCategoryList()
     this.setState({
      visible:false
    })
     resetFields()
   }else {
    message.error('更新分类失败',1)
  }
  }
  handleOk = () => {
    let {validateFields} = this.formInstance.current
    validateFields()
        .then(values => {
          console.log(values);
          let {showModelType} = this.state
            if (showModelType === "添加") {
              console.log(values.catrgoryName);
              this.toAdd(values.catrgoryName)
            } else {
              console.log(values);
              const categoryId = this.state.categoryId
              const categoryName = values.categoryName
               let obj = {categoryId,categoryName}
              this.toUptate(obj)
            }
        })
        .catch(errorInfo => {
          message.error('表单输入有误',1)
        });
  };
  handleCancel = () => {
    let {resetFields} = this.formInstance.current
    this.setState({
      visible:false
    })
    resetFields()
  };

  render(){
    const dataSource = this.state.CategoryList
    const columns = [
      {
        title: '分类名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '操作',
        // dataIndex: 'name',
        key: 'category',
        render:(item)=>{
          return <Button type="link" onClick={()=>{this.showModalUpdate(item,'修改')}}>修改分类</Button>
        },
        width:'25%',
        align:'center'
      },
    ];
    let {visible,showModelType} = this.state
    return (
    <div>
      <Card size="small"  extra={
        <Button type="primary" onClick={()=>{this.showModalAdd("添加")}}>
        <PlusOutlined />
          添加
        </Button>
      }>
        <Table
          dataSource={dataSource}
          columns={columns}
          bordered
          rowKey="_id"
          pagination={{pageSize:PAGE_SIZE,showQuickJumper:true}}
        />
      </Card>
      <Modal forceRender={true} title={showModelType+"分类"} okText="确定" cancelText="取消" visible={visible} onOk={this.handleOk} onCancel={this.handleCancel}>
       <Form ref={this.formInstance} >
        <Form.Item
        name="categoryName"
        rules= {[{required: true, message: '分类名必须输入!'}]} >
          <Input type="catrgoryName" placeholder='请输入分类名'/>
        </Form.Item>
       </Form>
      </Modal>
    </div>
    )
  }
}
export default connect(
  state => ({}),
  {
    saveCategoryList:createSaveCategoryListAction,
  }
)(Category)