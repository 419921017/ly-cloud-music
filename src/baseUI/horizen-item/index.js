import React, { useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import Scroll from '../scroll';
import styled from 'styled-components';
import style from './../../assets/gloabl-style';

const List = styled.div`
  display: flex;
  align-items: center;
  height: 30px;
  overflow: hidden;
  > span:first-of-type {
    display: block;
    flex: 0 0 auto;
    padding: 5px 0;
    margin-right: 5px;
    color: grey;
    font-size: ${style['font-size-m']};
    vertical-align: middle;
  }
`;

const ListItem = styled.div`
  flex: 0 0 auto;
  font-size: ${style['font-size-m']};
  padding: 5px 8px;
  border-radius: 10px;
  &.selected {
    color: ${style['theme-color']};
    margin: -1px;
    border: 1px solid ${style['theme-color']};
    opacity: 0.8;
  }
`;

function Horizen(props) {
  const { list, oldVal, title } = props;
  const { handleClick } = props;

  const Category = useRef(null)

  useEffect(() => {
    let categoryDOM = Category.current
    let tagElements = categoryDOM.querySelectorAll('.list-item');
    let totalWidth = 0;
    
    Array.from(tagElements).forEach(ele => {
      totalWidth += ele.offsetWidth
    })
    categoryDOM.style.width = `${totalWidth}px`
  }, [])


  return (
    <Scroll direction="horizental">
      <div ref={Category}>
        <List>
          <span>{title}</span>
          {list.map(item => (
            <ListItem
              key={item.key}
              className={`list-item ${oldVal === item.key ? 'selected' : ''}`}
              onClick={() => handleClick(item.key)}
            >
              <span>{item.name}</span>
            </ListItem>
          ))}
        </List>
      </div>
    </Scroll>
  );
}

Horizen.propTypes = {
  list: PropTypes.array,
  oldVal: PropTypes.string,
  title: PropTypes.string,
  handleClick: PropTypes.func
};

Horizen.defaultProps = {
  list: [],
  oldVal: '',
  title: '',
  handleClick: null
};

export default React.memo(Horizen);
