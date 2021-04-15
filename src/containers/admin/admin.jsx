import React,{Component} from 'react'
import {connect} from 'react-redux'
import {Redirect,Route,Switch} from 'react-router-dom'
import { Layout } from 'antd';

import Home from '../../components/home/home'
import Category from '../category/category'
import Product from '../product/product'
import AddUpdate from '../product/add_update';
import Detail from '../product/detail';
import User from '../user/user'
import Role from '../role/role'
import Bar from '../bar/bar'
import Line from '../line/line'
import Pie from '../pie/pie'
import './admin.less'

import Header from './Header/Header';
import LeftNav from './Left_nav/Left_nav';
const { Footer, Sider, Content } = Layout;

 class Admin extends Component{

  render(){
     //从redux中获取user和isLogin
     const {isLogin} = this.props.userInfo
     //判断用户是否登录，若未登录跳转login页面
     if(!isLogin) return <Redirect to="/login"/>
    return (
        <Layout className="admin">
        <Sider className='sider'>
          <LeftNav/>
        </Sider>
        <Layout>
          <Header className="header">Header</Header>
          <Content className="content">
          <Switch>
            <Route path="/admin/home" component={Home}/>
            <Route path="/admin/prod_about/category" component={Category}/>
            <Route path="/admin/prod_about/product" component={Product} exact/>
            <Route path="/admin/prod_about/product/detail/:id" component={Detail}/>
            <Route path="/admin/prod_about/product/add_update" component={AddUpdate} exact/>
            <Route path="/admin/prod_about/product/add_update/:id" component={AddUpdate}/>
            <Route path="/admin/user" component={User}/>
            <Route path="/admin/role" component={Role}/>
            <Route path="/admin/charts/bar" component={Bar}/>
            <Route path="/admin/charts/line" component={Line}/>
            <Route path="/admin/charts/pie" component={Pie}/>
            <Redirect to="/admin/home"/>
          </Switch>
          </Content>
          <Footer className="footer">推荐使用谷歌浏览器</Footer>
        </Layout>
      </Layout>
    )
  }
}
export default connect(
  state => ({userInfo:state.userInfo}),
)(Admin)