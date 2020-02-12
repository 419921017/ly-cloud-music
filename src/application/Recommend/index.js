/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { forceCheck } from 'react-lazyload';

import * as actionTypes from './store/actionCreators'
import Slider from './../../components/slider';
import RecommendList from './../../components/list';
import Scroll from '../../baseUI/scroll';
import { Content } from './style';
import Loading from './../../baseUI/loading';

function Recommend(props) {
  const { bannerList, recommendList, enterLoading } = props;

  const {getBannerDataDispatch, getRecommendListDataDispatch} = props;

  useEffect(() => {
    if (!bannerList.size) {
      getBannerDataDispatch();
    }
    if (!recommendList.size) {
      getRecommendListDataDispatch()
    }
  }, [])

  const bannerListJS = bannerList ? bannerList.toJS() : []

  const recommendListJS = recommendList ? recommendList.toJS() : []

  return (
    <Content>
      <Scroll className="list" onScroll={forceCheck}>
        <div>
          <Slider bannerList={bannerListJS} />
          <RecommendList recommendList={recommendListJS} />
        </div>
      </Scroll>
      {!!enterLoading && <Loading/>}
    </Content>
  );
}

const mapStateToProps = state => ({
  bannerList: state.getIn(['recommend', 'bannerList']),
  recommendList: state.getIn(['recommend', 'recommendList']),
  enterLoading: state.getIn(['recommend', 'enterLoading'])
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
