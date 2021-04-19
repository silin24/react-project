import React,{Component} from 'react'
import {Form,Input,Button,message} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom'
import {createSaveUserInfoAction} from '../../redux/actions/login_action';
import {reqLogin} from '../../api/index';
import 'antd/dist/antd.less'
import './css/login.less'
import logo from '../../static/imgs/logo.png';

const {Item} = Form

class Login extends Component{
  componentDidMount(){
  //  console.log(this);
  }
  //点击登录按钮的回调
  handleSubmit = async (values)=>{
    // console.log(this.props);
    // console.log(values);
    let result = await reqLogin(values)
    // console.log(result);
    let {data,status,msg} = result
    if (status === 0) {
       //1.服务器返回的user信息，还有token交由redux管理  (如果先跳转,数据传不过来)
       this.props.saveUserInfo(data)
       //跳转路由
       this.props.history.replace('/admin')
    }else message.warning(msg,1)
  }
  //密码的验证器---每当在密码输入框输入东西后，都会调用此函数去验证输入是否合法。自定义校验，即：自己写判断
  pwdValidator = (rule,value)=>{
    if(!value){
     return Promise.reject(new Error('密码必须输入'))
    }else if(value.length>12){
     return Promise.reject(new Error('密码必须小于等于12位'))
    }else if(value.length<4){
     return Promise.reject(new Error('密码必须大于等于4位'))
    }else if(!(/^\w+$/).test(value)){
     return Promise.reject(new Error('密码必须是字母、数字、下划线组成'))
    }else{
      return Promise.resolve();
    }
  }

  render(){
    //从redux中获取用户的登录状态
    const {isLogin} = this.props;
    //如果已经登录了，重定向到admin页面
    if(isLogin)return <Redirect to="/admin/home"/>
    return (
      <div className="login">
        <header>
          <img src={logo} alt="logo"/>
          <h1>商品管理系统</h1>
        </header>
        <section>
          <h1>用户登录</h1>
          <Form onFinish={this.handleSubmit} className="login-form">
            <Item name="username" rules= {[
                {required: true, message: '用户名必须输入！'},
                {max: 12, message: '用户名必须小于等于12位'},
                {min: 1, message: '用户名必须大于等于1位'},
                {pattern: /^\w+$/, message: '用户名必须是字母、数字、下划线组成'},
              ]}>
                <Item>
                <Input prefix={<UserOutlined  style={{ color: 'rgba(0,0,0,.25)'}}/>} type="username" placeholder="用户名"/>,
               </Item>
            </Item>
            <Item name="password" rules={[
              {validator: this.pwdValidator},
            ]}
            >
              <Item>
                 <Input prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" />
              </Item>
            </Item>
            <Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                登录
              </Button>
            </Item>
          </Form>
        </section>
      </div>
    )
  }
}

export default connect(
  state => ({isLogin:state.userInfo.isLogin}),
  {
    saveUserInfo:createSaveUserInfoAction,
  }
)(Login)



