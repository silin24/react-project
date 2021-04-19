import React, { Component } from 'react'
import { Menu } from 'antd';
import {MailOutlined} from '@ant-design/icons';
import {Link,withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import menuList from '../../../config/menu_config'
import logo from '../../../static/imgs/logo.png';
import {createSaveTitleAction} from '../../../redux/actions/menu_action'

import  './Left_nav.less';
const { SubMenu } = Menu;


 class LeftNav extends Component {
  state = {
  };
    //用于创建菜单的函数
  createMenu = (target)=>{
    return target.map((item)=>{
      if (!item.children) {
        return (
          <Menu.Item key={item.key} icon={<MailOutlined />} onClick={()=>{this.props.saveTitle(item.title)}} >
              {item.title}
            <Link to={item.path}/>
          </Menu.Item>
        )
      } else{
        return (
          <SubMenu key={item.key} icon={<MailOutlined />} title={item.title}>
             {this.createMenu(item.children)}
          </SubMenu>
        )
      }

    })
  }
  // componentDidMount() {
  //   this.hasAuthMenuList()
  // }
  hasAuthMenuList = ()=>{
    //获取当前用户可以看到的菜单的数组
    const {menus,username} = this.props
    let menuArr = []
    if(username === 'admin') return menuList
    else{
      menuList.forEach((item)=>{
        if (!item.children) {
         menus.forEach((item2)=>{
           item2 === item.key && menuArr.push(item)
          })
        } else {
          if (item.children.some((item3)=>{return menus.indexOf(item3.key) !== -1})) {
            menuArr.push(item)
          }
        }
      })
      console.log(menuArr);
      return menuArr
    }

  }
  render() {
    let {pathname} = this.props.location
    return (
      <div >
        <header className="nav-header">
          <img src={logo} alt="logo"/>
          <h1>商品管理系统</h1>
        </header>
        <Menu
          defaultSelectedKeys={pathname.indexOf('product') !== -1 ? 'product': pathname.split('/').reverse()[0]}
          defaultOpenKeys={pathname.split('/').splice(2)}
          mode="inline"
          theme="dark"
        >
          { this.createMenu( this.hasAuthMenuList()) }
        </Menu>
      </div>
    )
  }
}
export default connect(
  state => ({
    menus:state.userInfo.user.role.menus,
    username:state.userInfo.user.username,
  }),
  {saveTitle:createSaveTitleAction}
)(withRouter(LeftNav))