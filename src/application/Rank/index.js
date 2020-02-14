/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { getRankList } from './store/actionCreator';
import { renderRoutes } from 'react-router-config';

import { filterIndex } from '../../api/utils';
import { List, ListItem, SongList, Container } from './style';
import Scroll from '../../baseUI/scroll';
import Loading from '../../baseUI/loading';
import { EnterLoading } from './../Singers/style';

function Rank(props) {
  const { rankList: list, loading } = props;
  const { getRankListDataDispatch } = props;

  useEffect(() => {
    getRankListDataDispatch();
  }, []);

  const rankList = list ? list.toJS() : [];

  let [officialList, globalList] = filterIndex(rankList);

  const enterDetail = item => {
    props.history.push(`/rank/${item.id}`);
  };

  const renderRankList = (list, global) => {
    return (
      <List globalRank={global}>
        {list.map(item => (
          <ListItem
            key={item.id}
            tracks={item.tracks}
            onClick={() => {
              enterDetail(item);
            }}
          >
            <div className="img_wrapper">
              <img src={item.coverImgUrl} alt="" />
              <div className="decorate"></div>
              <span className="update_frequecy">{item.updateFrequency}</span>
            </div>
            {renderSongList(item.tracks)}
          </ListItem>
        ))}
      </List>
    );
  };

  const renderSongList = list => {
    return list && list.length ? (
      <SongList>
        {list.map((item, index) => {
          return (
            <li key={index}>
              {index + 1}. {item.first} - {item.second}
            </li>
          );
        })}
      </SongList>
    ) : null;
  };

  // 榜单数据未加载出来之前都给隐藏
  let displayStyle = loading ? { display: 'none' } : { display: '' };

  return (
    <Container>
      <Scroll>
        <div>
          <h1 className="offical" style={displayStyle}>
            {' '}
            官方榜{' '}
          </h1>
          {renderRankList(officialList)}
          <h1 className="global" style={displayStyle}>
            {' '}
            全球榜{' '}
          </h1>
          {renderRankList(globalList, true)}
          {loading ? (
            <EnterLoading>
              <Loading></Loading>
            </EnterLoading>
          ) : null}
        </div>
      </Scroll>
      {renderRoutes(props.route.routes)}
    </Container>
  );
}

const mapStateToProps = state => ({
  rankList: state.getIn(['rank', 'rankList']),
  loading: state.getIn(['rank', 'loading'])
});

const mapDispatchToProps = dispatch => ({
  getRankListDataDispatch() {
    dispatch(getRankList());
  }
});
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Rank));
