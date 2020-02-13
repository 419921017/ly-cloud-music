import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import LazyLoad, { forceCheck } from 'react-lazyload';

import Horizen from './../../baseUI/horizen-item';
import Loading from './../../baseUI/loading';
import { categoryTypes, alphaTypes } from '../../api/conf';
import { NavContainer, ListContainer, List, ListItem } from './style';
import Scroll from '../../baseUI/scroll';
import {
  getSingerList,
  getHotSingerList,
  changePageCount,
  refreshMoreSingerList,
  changePullUpLoading,
  changePullDownLoading,
  changeEnterLoading,
  refreshMoreHotSingerList
} from './store/actionCreator';

function Singers(props) {
  let [category, setCategory] = useState('');
  let [alpha, setAlpha] = useState('');

  const {
    singerList,
    enterLoading,
    pullUpLoading,
    pullDownLoading,
    pageCount
  } = props;

  const {
    getHotSingerDispatch,
    updateDispatch,
    pullDownRefreshDispatch,
    pullUpRefreshDispatch
  } = props;

  const scrollRef = useRef(null);

  useEffect(() => {
    getHotSingerDispatch();
  }, []);

  // 渲染函数，返回歌手列表
  const renderSingerList = () => {
    const list = singerList ? singerList.toJS() : [];
    return (
      <List>
        {list.map((item, index) => {
          return (
            <ListItem key={item.accountId + '' + index}>
              <div className="img_wrapper">
                <LazyLoad
                  placeholder={
                    <img
                      width="100%"
                      height="100%"
                      src={require('./singer.png')}
                      alt="music"
                    />
                  }
                >
                  <img
                    src={`${item.picUrl}?param=300x300`}
                    width="100%"
                    height="100%"
                    alt="music"
                  />
                </LazyLoad>
              </div>
              <span className="name">{item.name}</span>
            </ListItem>
          );
        })}
      </List>
    );
  };

  let handleUpdateCategory = val => {
    scrollRef && scrollRef.current.refresh();
    if (val) {
      if (category === val) {
        setCategory('');
        getHotSingerDispatch();
      } else {
        setCategory(val);
        updateDispatch(val, alpha);
      }
    }
  };

  let handleUpdateAlpha = val => {
    scrollRef && scrollRef.current.refresh();

    if (val) {
      if (alpha === val) {
        setAlpha('');
        getHotSingerDispatch();
      } else {
        setAlpha(val);
        updateDispatch(category, val);
      }
    }
  };

  const handlePullUp = () => {
    pullUpRefreshDispatch(category, alpha, category === '', pageCount);
  };

  const handlePullDown = () => {
    pullDownRefreshDispatch(category, alpha);
  };

  return (
    <div>
      <NavContainer>
        <Horizen
          list={categoryTypes}
          title={'分类 (默认热门):'}
          handleClick={val => handleUpdateCategory(val)}
          oldVal={category}
        />
        <Horizen
          list={alphaTypes}
          title={'首字母:'}
          handleClick={val => handleUpdateAlpha(val)}
          oldVal={alpha}
        />
      </NavContainer>

      <ListContainer>
        <Scroll
          pullUp={handlePullUp}
          pullDown={handlePullDown}
          pullUpLoading={pullUpLoading}
          pullDownLoading={pullDownLoading}
          onScroll={forceCheck}
          ref={scrollRef}
        >
          {renderSingerList()}
        </Scroll>
        {!!enterLoading && <Loading />}
      </ListContainer>
    </div>
  );
}

const mapStateToProps = state => ({
  singerList: state.getIn(['singers', 'singerList']),
  enterLoading: state.getIn(['singers', 'enterLoading']),
  pullUpLoading: state.getIn(['singers', 'pullUpLoading']),
  pullDownLoading: state.getIn(['singers', 'pullDownLoading']),
  pageCount: state.getIn(['singers', 'pageCount'])
});

const mapDispatchToProps = dispatch => ({
  getHotSingerDispatch() {
    dispatch(getHotSingerList());
  },
  updateDispatch(category, alpha) {
    dispatch(changePageCount(0)); //由于改变了分类，所以pageCount清零
    dispatch(changeEnterLoading(true)); //loading，现在实现控制逻辑，效果实现放到下一节，后面的loading同理
    dispatch(getSingerList(category, alpha));
  },
  // 滑到最底部刷新部分的处理
  pullUpRefreshDispatch(category, alpha, hot, count) {
    dispatch(changePullUpLoading(true));
    dispatch(changePageCount(count + 1));
    if (hot) {
      dispatch(refreshMoreHotSingerList());
    } else {
      dispatch(refreshMoreSingerList(category, alpha));
    }
  },
  //顶部下拉刷新
  pullDownRefreshDispatch(category, alpha) {
    dispatch(changePullDownLoading(true));
    dispatch(changePageCount(0)); //属于重新获取数据
    if (category === '' && alpha === '') {
      dispatch(getHotSingerList());
    } else {
      dispatch(getSingerList(category, alpha));
    }
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(Singers));
