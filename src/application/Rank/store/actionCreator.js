import { CHANGE_RANK_LIST, CHANGE_LOADING } from './constants';
import { fromJS } from 'immutable';
import { getRankListRequest } from '../../../api/request';


export const changeRankList = (data) => ({
  type: CHANGE_RANK_LIST,
  data: fromJS(data)
})

export const changeRankLoading = (data) => ({
  type: CHANGE_LOADING,
  data
})

export const getRankList = () => dispatch => {
  getRankListRequest()
    .then(res => {
      let list = res && res.list
      dispatch(changeRankList(list))
      dispatch(changeRankLoading(false))
    })
}