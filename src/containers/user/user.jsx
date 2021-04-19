import React,{Component} from 'react'
import {Card,Button,Table, message,Modal,Form,Input,Select} from 'antd';
import dayjs from 'dayjs'
import {reqUserList,reqAddUser,reqDeleteUser,reqUpdateUser} from '../../api'
import {PAGE_SIZE} from '../../config'
const {Item} = Form
const {Option} = Select


export default class User extends Component{
  formInstance = React.createRef()

  state = {
    isShowModel:false, //是否展示弹窗
    userList:[],//用户列表
    roleList:[],//角色列表
    _id:'',//用户id
    userInfo:{}
  }

  getUserList = async()=>{
    let result = await reqUserList()
    console.log(result);
    const {status,data,msg} = result
    if(status === 0) this.setState({
      userList:data.users.reverse(),
      roleList:data.roles
    })
  }
  componentDidMount(){
    this.getUserList()
  }
  //新增用户弹窗----确定按钮回调
  handleOk = ()=>{
    let {validateFields} = this.formInstance.current
    let {isUpdate,_id} = this.state
    validateFields()
        .then(async values => {
          console.log(values)
          let result
          if (isUpdate) {
            let {email,phone,username,role_id} = values
            result = await reqUpdateUser({_id,username,phone,email,role_id,})
          } else {result = await reqAddUser(values)}
          let {status,msg} = result
          if (status === 0) {
            message.success(isUpdate?'修改用户成功':'添加用户成功',1)
            this.getUserList()
            this.setState({isShowModel:false})
            this.formInstance.current.resetFields()
          }
          else message.error(msg,1)
        })
        .catch(errorInfo => {
          message.error('表单输入有误',1)
        });
  }
  //新增用户弹窗----取消按钮回调
  handleCancel = ()=>{
    this.setState({isShowModel:false})
    this.formInstance.current.resetFields()
  }
  showModel = ()=>{
    this.setState({isShowModel:true});
    if (!this.isUpdate) {
      this.formInstance.current.resetFields()
      console.log('---------');
    }
  }
  deleteUser = (id)=>{
    Modal.confirm({
      content: `确定删除吗?`,
      onOk:async () => {
        let result = await reqDeleteUser(id)
        let {status} = result
        console.log(result);
        if (status === 0) {
          message.success('删除用户成功',1)
          this.getUserList()
        } else message.success('删除用户异常',1)
      }
    })
  }
  updateUser = async(item)=>{
    console.log(item);
    let {email,phone,password,username,role_id,_id} = item
    let {setFieldsValue} = this.formInstance.current
    setFieldsValue({email})
    setFieldsValue({role_id})
    setFieldsValue({username})
    setFieldsValue({phone})
    setFieldsValue({password})
    this.setState({_id});
    this.isUpdate = true
    this.showModel()
  }
  render(){
    const dataSource = this.state.userList
    const columns = [
      {
        title: '用户名',
        dataIndex: 'username',
        key: 'username',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: '电话',
        dataIndex: 'phone',
        key: 'phone',
      },
      {
        title: '注册时间',
        dataIndex: 'create_time',
        key: 'create_time',
        render: time => dayjs(time).format('YYYY年 MM月DD日 HH:mm:ss')
      },
      {
        title: '所属角色',
        dataIndex: 'role_id',
        key: 'role_id',
        render:(id)=>{
          let result = this.state.roleList.find((item)=>{
            return item._id === id
          })
          if(result) return result.name
        }
      },
      {
        title: '操作',
        key: 'option',
        render: (item) => (
          <div>
            <Button onClick={()=>{this.updateUser(item)}}
              type='link'
             >修改
            </Button>
            <Button onClick={()=>{this.deleteUser(item._id)}}
              type='link'
             >删除
            </Button>
          </div>
          )
      }
    ];
    return (
      <div>
        <Card
          title={
            <Button type='primary' onClick={this.showModel}>
              创建用户
            </Button>
          }
        >
          <Table
            dataSource={dataSource} 
            columns={columns}
            bordered
            pagination={{defaultPageSize:PAGE_SIZE}}
            rowKey="_id"
          />
        </Card>
        {/* 新增角色提示框 */}
        <Modal
          forceRender={true}
          title="添加用户"
          visible={this.state.isShowModel}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText="确认"
          cancelText="取消"
        >
          <Form labelCol={{span:4}} wrapperCol={{span:16}} ref={this.formInstance}>
            <Item
              name="username"
              label="用户名"
              rules= {[{required: true, message: '用户名必须输入' }]}
            >
            <Input type="username" placeholder="请输入用户名"/>
            </Item>
            <Item
              name="password"
              label="密码"
              rules={[{required: true, message: '密码必须输入' }]}
            >
              <Input type="password" placeholder="请输入密码"/>
            </Item>
            <Item label="手机号" name="phone"
              rules= {[{required: true, message: '手机号必须输入' }]}
            >
             <Input type="phone" placeholder="请输入手机号"/>
            </Item>
            <Item label="邮箱" name="email"
              rules= {[{required: true, message: '邮箱必须输入' }]}
            >
              <Input type="email" placeholder="请输入邮箱"/>
            </Item>
            <Item label="角色" name="role_id"
              rules={[{required: true, message: '必须选择一个角色' }]}
            >
              <Select>
                <Option value=''>请选择一个角色</Option>
                {
                  this.state.roleList.map((item)=>{
                    return <Option key={item._id} value={item._id}>{item.name}</Option>
                  })
                }
              </Select>
            </Item>
          </Form>
        </Modal>
      </div>
    )
  }
}

