import ajax from './ajax'
//引入请求的基本路径
import {BASE_URL} from '../config'
//1、登录
export const reqLogin = ({username, password}) => ajax({
  url: `${BASE_URL}/login`,
  method: 'POST',
  data: {username, password}
})
//获取分类列表
export const reqCategoryList = () => ajax.get('/manage/category/list')
//添加分类
export const reqAddCategory = (categoryName) => ajax.post('/manage/category/add',{categoryName})
//更新分类
export const reqUpdateCategory = ({categoryId,categoryName}) => ajax.post('/manage/category/update',{categoryId,categoryName})
//获取商品分页列表
export const reqProductList = ({pageNum,pageSize}) => ajax.get('/manage/product/list',{params:{pageNum,pageSize}})
//商品上下架
export const reqUpdateProdStatus = (productId,status) => ajax.post('/manage/product/updateStatus',{productId,status})
//根据Name/desc搜索产品分页列表
export const reqSearchProductList = (pageNum,pageSize,searchType,keyWord) => ajax.get('/manage/product/search',{params:{pageNum,pageSize,[searchType]:keyWord}})
//根据商品ID获取商品
export const reqProductInfo = (productId) => ajax.get('/manage/product/info',{params:{productId}})
//根据分类ID获取分类
export const reqCategoryInfo = (categoryId) => ajax.get('/manage/category/info',{params:{categoryId}})
//请求删除图片（根据图片唯一名删除）
export const reqDeletePicture = (name)=> ajax.post(`/manage/img/delete`,{name})
//添加商品
export const reqAddProduct = (productObj)=> ajax.post(`${BASE_URL}/manage/product/add`,{...productObj})
//请求更新商品
export const reqUpdateProduct = (productObj)=> ajax.post(`${BASE_URL}/manage/product/update`,{...productObj})