import React, { Component } from "react";
import { Card, Button, List } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { reqProductInfo, reqCategoryInfo } from "../../api";
import "./detail.less";
import {BASE_URL} from '../../config';
export default class Detail extends Component {
  state = {
    productName: "",
    categoryId: "",
    categoryName: "",
    desc: "",
    detail: "",
    imgs: [],
    price: "",
    // isLoading:true
  };
  componentDidMount() {
    console.log(this.props);
    let productId = this.props.match.params.id;
    this.getProductInfo(productId);
  }
  getProductInfo = async (productId) => {
    let result = await reqProductInfo(productId);
    // console.log(result);
    let { status, data } = result;
    let ProductData = data;
    if (status === 0) {
      console.log(ProductData);
      let categoryId = ProductData.categoryId;
      let CategoryInfo = await reqCategoryInfo(categoryId);
      // console.log(CategoryInfo);
      let { status, data } = CategoryInfo;
      if (status === 0) {
        let categoryName = data.name;
        console.log(this);
        this.setState({
          categoryName,
          productName: ProductData.name,
          categoryId: ProductData.categoryId,
          desc: ProductData.desc,
          detail: ProductData.detail,
          imgs: ProductData.imgs,
          price: ProductData.price,
        });
      }
    }
  };
  render() {
    let { productName, desc, categoryName, detail, imgs, price } = this.state;
    return (
      <Card
        title={
          <div>
            <Button type="link" onClick={this.props.history.goBack}>
              <ArrowLeftOutlined />
              <span>返回</span>
            </Button>
            <span>商品详情</span>
          </div>
        }
      >
        <List>
          <List.Item>
            <span className="prod-title">商品名称:</span>
            <span>{productName}</span>
          </List.Item>
          <List.Item>
            <span className="prod-title">商品描述:</span>
            <span>{desc}</span>
          </List.Item>
          <List.Item>
            <span className="prod-title">商品价格:</span>
            <span>${price}</span>
          </List.Item>
          <List.Item>
            <span className="prod-title">所属分类:</span>
            <span>{categoryName}</span>
          </List.Item>
          <List.Item>
            <span className="prod-title">商品图片:</span>
            <img src={`${BASE_URL}/upload/`+imgs[0]} alt="pic"/>
          </List.Item>
          <List.Item>
            <span className="prod-title">商品详情:</span>
            <span dangerouslySetInnerHTML={{__html:detail}}></span>
          </List.Item>
        </List>
      </Card>
    );
  }
}
