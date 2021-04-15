import React, { Component } from 'react'
import {connect} from 'react-redux';
import {Button,Modal} from 'antd'
import dayjs from 'dayjs'
import screenfull from 'screenfull';
import * as Icon from '@ant-design/icons';
import { withRouter } from 'react-router';
import {createDeleteUserInfoAction} from '../../../redux/actions/login_action'
import './Header.less'
import menuList from '../../../config/menu_config'
const {confirm} = Modal;



 class Header extends Component {
  state = {
    date:dayjs().format('YYYY年 MM月DD日 HH:mm:ss'),
    isFullScreen:false,
    title:''
  }
  componentDidMount(){
    // console.log(this);
    //监听全屏的切换
    screenfull.on('change', () => {
      let isFullScreen = !this.state.isFullScreen
      this.setState({isFullScreen})
    });
    //更新时间
    this.timeId = setInterval(() => {
      this.setState({date:dayjs().format('YYYY年 MM月DD日 HH:mm:ss')})
    }, 1000);
    this.getTitle()
  }
  componentWillUnmount(){
    //清除更新时间定时器
    clearInterval(this.timeId)
  }
  //切换全屏
  fullScreen = ()=>{
    screenfull.toggle()
  }
  //退出登录
  logout = ()=>{
    let {deleteUserInfo} = this.props
    confirm({
      title: '确定退出？',
      content: '若退出需要重新登录',
      cancelText:'取消',
      okText:'确认',
      onOk(){
        // saveTitle('')
        deleteUserInfo()
      },
    });
  }
  getTitle = ()=>{
    let {pathname} = this.props.location
    let pathKey = pathname.split('/').reverse()[0]
    if (pathname.indexOf('product') !== -1) pathKey = 'product'
    let title = ''
    menuList.forEach((item)=>{
      if (item.children instanceof Array) {
        let tmp = item.children.find((item2)=>{
          return pathKey === item2.key
        })
        if(tmp) title = tmp.title
      } else {
        if ( pathKey === item.key) title = item.title
      }
    })
    this.setState({title})
  }


  render() {
    let isFullScreen = this.state.isFullScreen
    let {user} = this.props.userInfo
    return (
      <div>
        <header className="header">
        <div className="header-top">
            <Button size="small" onClick={this.fullScreen}>
              {React.createElement(
                Icon[isFullScreen ? 'FullscreenExitOutlined':'FullscreenOutlined'],
              )}
            </Button>
            <span className="username">欢迎&nbsp;{user.username}</span>
            <Button type="link" onClick={this.logout}>退出登录</Button>
        </div>
        <div className="header-bottom">
            <div className="header-bottom-left">
              {this.props.title || this.state.title}
            </div>
            <div className="header-bottom-right">
              {this.state.date}
            </div>
        </div>
      </header>
      </div>
    )
  }
}
export default connect(
  (state)=>(
    {
      userInfo:state.userInfo,
      title:state.title
    }
    ),
    {deleteUserInfo:createDeleteUserInfoAction}
)(withRouter(Header))
