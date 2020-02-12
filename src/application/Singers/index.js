import React, { useState } from 'react';

import Horizen from './../../baseUI/horizen-item';
import { categoryTypes, alphaTypes } from '../../api/conf';
import { NavContainer } from './style';

function Singers(props) {
  let [category, setCategory] = useState('');
  let [alpha, setAlpha] = useState('');

  let handleUpdateCategory = val => {
    setCategory(val);
  };

  let handleUpdateAlpha = val => {
    setAlpha(val);
  };

  return (
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
  );
}

export default React.memo(Singers);
