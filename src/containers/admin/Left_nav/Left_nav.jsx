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
          { this.createMenu(menuList) }
        </Menu>
      </div>
    )
  }
}
export default connect(
  state => ({}),
  {saveTitle:createSaveTitleAction}
)(withRouter(LeftNav))