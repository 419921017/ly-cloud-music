import React, { createContext, useReducer } from 'react';
import { fromJS } from 'immutable';

export const CreategoryDataContext = createContext({});

export const CHANGE_CREATEGORY = 'singers/CHANGE_CREATEGORY';
export const CHANGE_ALPHA = 'singers/CHANGE_ALPHA';

const reducer = function(state, action) {
  switch (action.type) {
    case CHANGE_CREATEGORY:
      return state.set('category', action.data);

    case CHANGE_ALPHA:
      return state.set('alpha', action.data);

    default:
      return state;
  }
};

export const Data = props => {
  const [data, dispatch] = useReducer(
    reducer,
    fromJS({ category: '', alpha: '' })
  );

  return (
    <CreategoryDataContext.Provider value={{ data, dispatch }}>
      {props.children}
    </CreategoryDataContext.Provider>
  );
};
