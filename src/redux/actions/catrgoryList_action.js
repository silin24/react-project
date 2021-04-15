import {SAVE_CATEGORY_LIST,} from '../action_types'

//创建保存分类信息的action
export const createSaveCategoryListAction = (value)=> {
  return {type:SAVE_CATEGORY_LIST,data:value}
}