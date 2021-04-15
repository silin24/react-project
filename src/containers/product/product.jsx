import React,{Component} from 'react'
import { Card,Button,Table,Input, message,Select} from 'antd';
import { PlusOutlined ,SearchOutlined} from '@ant-design/icons';
import {reqProductList,reqUpdateProdStatus,reqSearchProductList} from '../../api';
import {PAGE_SIZE} from '../../config'
const {Option} = Select;
export default class Product extends Component{
  state = {
    productList:[],
    totalPage:'',
    current:1,//当前页
    searchKeyword:'',
    searchType:'productName',
  }
  componentDidMount(){
    this.getProductList()
  }
  getProductList = async(number=1)=>{
    let result
    //是否是搜索
    if (this.isSearch) {
      let {searchKeyword,searchType} = this.state
      console.log(searchKeyword,searchType);
      result = await reqSearchProductList(number,PAGE_SIZE,searchType,searchKeyword)
    }else result = await reqProductList({'pageNum':number,'pageSize':PAGE_SIZE})
      // console.log(result);
    let {status,data} = result
    if (status === 0) {
      this.setState({
        productList:data.list,
        totalPage:data.total,
        current:number,
        isSearch:false
      })
    }
  }
  updateProdStatus = async(item)=>{
    let productList = [...this.state.productList]
    // let {current} = this.state
    console.log(item);
    let {_id,status} = item
    if (status === 2) status = 1
    else status = 2
    let result = await reqUpdateProdStatus(_id,status)
    if(result.status===0) {
      message.success('更新商品状态成功')
      //方法1:这样可以不发请求再去取productList的值
      productList = productList.map((item)=>{
        if(item._id === _id){
          item.status = status
        }
        return item
      })
      this.setState({productList})
      //方法2: 发请求再取productList的值
      // this.getProductList(current)
    }
    else message.error('更新商品状态失败')
  }
  search = ()=>{
    let {searchKeyword} = this.state
    if (searchKeyword.trim() === "") {
     this.isSearch=false
    }else {
      this.isSearch=true
    }
    this.getProductList()
  }

  render(){
    let {productList} = this.state
    const dataSource = productList
    const columns = [
      {
        title: '商品名称',
        dataIndex: 'name',
        key: 'name',
        width:'15%',
      },
      {
        title: '商品描述',
        dataIndex: 'desc',
        key: 'desc',
      },
      {
        title: '价格',
        dataIndex: 'price',
        key: 'price',
        width:'10%',
        align:'center',
        render:(price)=>{
          return '$'+ price
        },
      },
      {
        title: '状态',
        // dataIndex: 'status',
        key: 'status',
        width:'10%',
        align:'center',
        render:(item)=>{
          return(
            <div>
            <Button type={item.status === 1?"danger":"primary"} onClick={()=>{this.updateProdStatus(item)}}>{item.status === 1 ? '下架':'上架'}</Button>
            <br/>
            <span>{item.status === 1 ? '在售':'已停售'}</span>
            </div>
          )
        },
      },
      {
        title: '操作',
        // dataIndex: 'operation',
        key: 'operation',
        render:(item)=>{
          return (<div>
            <Button type="link" onClick={()=>{this.props.history.push('/admin/prod_about/product/detail/'+item._id)}}>详情</Button>
            <br/>
            <Button type="link" onClick={()=>{this.props.history.push(`/admin/prod_about/product/add_update/${item._id}`)}}>修改</Button>
          </div>)
        },
        width:'10%',
        align:'center'
      },
    ]
    return (
      <div>
        <Card size="small"
          title={
            <div>
              <Select defaultValue="productName" onChange={(value)=>{this.setState({searchType:value})}}>
                <Option value="productName">按名称搜索</Option>
                <Option value="productDesc">按描述搜索</Option>
              </Select>
              <Input
                style={{margin:'0px 10px',width:'20%'}}
                placeholder="请输入搜索关键字"
                allowClear
                onChange={(event)=>{this.setState({searchKeyword:event.target.value})}}
              />
              <Button type="primary" onClick={this.search}><SearchOutlined />搜索</Button>
            </div>
          }
          extra={
            <Button type="primary" onClick={()=>{this.props.history.push('/admin/prod_about/product/add_update')}}>
              <PlusOutlined />
                添加
            </Button>
          }
        >
          <Table
            dataSource={dataSource}
            columns={columns}
            bordered
            rowKey='_id'
            pagination={{
               total:this.state.totalPage,
               pageSize:PAGE_SIZE,
               current:this.state.current,
               onChange:this.getProductList
            }}
          />
        </Card>
      </div>
    )
  }
}