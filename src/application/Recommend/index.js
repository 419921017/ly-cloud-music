/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import * as actionTypes from './store/actionCreators'
import Slider from './../../components/slider';
import RecommendList from './../../components/list';
import Scroll from '../../baseUI/scroll';
import { Content } from './style';

function Recommend(props) {
  const { bannerList, recommendList } = props;

  const {getBannerDataDispatch, getRecommendListDataDispatch} = props;

  useEffect(() => {
    getBannerDataDispatch();
    getRecommendListDataDispatch()
  }, [])

  const bannerListJS = bannerList ? bannerList.toJS() : []

  const recommendListJS = recommendList ? recommendList.toJS() : []

  return (
    <Content>
      <Scroll className="list">
        <div>
          <Slider bannerList={bannerListJS} />
          <RecommendList recommendList={recommendListJS} />
        </div>
      </Scroll>
    </Content>
  );
}

const mapStateToProps = state => ({
  bannerList: state.getIn(['recommend', 'bannerList']),
  recommendList: state.getIn(['recommend', 'recommendList'])
})

const mapDispatchToProps = dispatch => ({
  getBannerDataDispatch() {
    dispatch(actionTypes.getBannerList())
  },
  getRecommendListDataDispatch() {
    dispatch(actionTypes.getRecommendList())
  }
})


export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Recommend));
