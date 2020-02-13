import React, {
  useState,
  useRef,
  useEffect,
  useImperativeHandle,
  useMemo
} from 'react';
import PropTypes from 'prop-types';
import BScroll from 'better-scroll';
import styled from 'styled-components';

import { debounce } from './../../api/utils';
import Loading from './../../baseUI/loading';
import LoadingV2 from './../../baseUI/loading-v2';

const ScrollContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const PullUpLoading = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 5px;
  width: 60px;
  height: 60px;
  margin: auto;
  z-index: 100;
`;

export const PullDownLoading = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0px;
  height: 30px;
  margin: auto;
  z-index: 100;
`;

const Scroll = React.forwardRef((props, ref) => {
  const { direction, click, refresh, bounceTop, bounceBottom } = props;

  const { pullUp, pullDown, onScroll, pullUpLoading, pullDownLoading } = props;

  const [bScroll, setBScroll] = useState();
  const scrollContainerRef = useRef();

  let pullUpDebounce = useMemo(() => debounce(pullUp, 300), [pullUp]);

  let pullDownDebounce = useMemo(() => debounce(pullDown, 300), [pullDown]);
  /**
   * @summary 初始化
   */
  useEffect(() => {
    const scroll = new BScroll(scrollContainerRef.current, {
      scrollX: direction === 'horizental',
      scrollY: direction === 'vertical',
      probeType: 3,
      click: click,
      bounce: {
        top: bounceTop,
        bottom: bounceBottom
      }
    });
    setBScroll(scroll);

    return () => {
      setBScroll(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * @summary 实例绑定scroll事件
   */
  useEffect(() => {
    if (!onScroll || !bScroll) {
      return;
    }

    bScroll.on('scroll', srcoll => {
      onScroll(srcoll);
    });

    return () => {
      bScroll.off('scroll');
    };
  }, [onScroll, bScroll]);

  /**
   * @summary 进行上拉到底的判断，调用上拉刷新的函数
   */
  useEffect(() => {
    if (!bScroll || !pullUp) {
      return;
    }

    bScroll.on('scrollEnd', () => {
      if (bScroll.y <= bScroll.maxScrollY + 100) {
        // pullUp();
        pullUpDebounce();
      }
    });

    return () => {
      bScroll.off('scrollEnd');
    };
  }, [bScroll, pullUp, pullUpDebounce]);

  /**
   * @summary 进行下拉的判断，调用下拉刷新的函数
   */
  useEffect(() => {
    if (!bScroll || !pullDown) {
      return;
    }
    bScroll.on('touchEnd', pos => {
      // 判断用户的下拉动作
      if (pos.y > 50) {
        // pullDown();
        pullDownDebounce();
      }
    });

    return () => {
      bScroll.off('touchEnd');
    };
  }, [bScroll, pullDown, pullDownDebounce]);

  /**
   * @summary 每次重新渲染都要刷新实例，防止无法滑动
   */
  useEffect(() => {
    if (refresh && bScroll) {
      bScroll.refresh();
    }
  });

  useImperativeHandle(ref, () => ({
    refresh() {
      if (bScroll) {
        bScroll.refresh();
        bScroll.scrollTo(0, 0);
      }
    },
    getBScroll() {
      if (bScroll) {
        return bScroll;
      }
    }
  }));

  const PullUpdisplayStyle = pullUpLoading
    ? { display: '' }
    : { display: 'none' };
  const PullDowndisplayStyle = pullDownLoading
    ? { display: '' }
    : { display: 'none' };

  return (
    <ScrollContainer ref={scrollContainerRef}>
      {props.children}
      {/* 滑到底部加载动画 */}
      <PullUpLoading style={PullUpdisplayStyle}>
        <Loading></Loading>
      </PullUpLoading>
      {/* 顶部下拉刷新动画 */}
      <PullDownLoading style={PullDowndisplayStyle}>
        <LoadingV2></LoadingV2>
      </PullDownLoading>
    </ScrollContainer>
  );
});

Scroll.propTypes = {
  direction: PropTypes.oneOf(['vertical', 'horizental']), // 滚动的方向
  click: PropTypes.bool, // 是否支持点击
  refresh: PropTypes.bool, // 是否刷新
  onScroll: PropTypes.func, // 滑动触发的回调函数
  pullUp: PropTypes.func, // 上拉加载逻辑
  pullDown: PropTypes.func, // 下拉加载逻辑
  pullUpLoading: PropTypes.bool, // 是否显示上拉 loading 动画
  pullDownLoading: PropTypes.bool, // 是否显示下拉 loading 动画
  bounceTop: PropTypes.bool, // 是否支持向上吸顶
  bounceBottom: PropTypes.bool // 是否支持向下吸底
};

Scroll.defaultProps = {
  direction: 'vertical',
  click: true,
  refresh: true,
  onScroll: null,
  pullUpLoading: false,
  pullDownLoading: false,
  pullUp: null,
  pullDown: null,
  bounceTop: true,
  bounceBottom: true
};

export default Scroll;
