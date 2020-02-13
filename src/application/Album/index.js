import React from 'react';
import { Container } from './style';

function Album(props) {
  const {route} = props
  console.log('Album', route)
  return <Container>123</Container>;
}

export default React.memo(Album);
