/* eslint-disable prettier/prettier */
import React from 'react';
import {StyleSheet, Image} from 'react-native';

import {Container} from 'native-base';

const ImageView = ({route}) => {
  const {url} = route.params;

  return (
    <Container style={styles.container}>
      <Image
        source={{uri: url}}
        style={{height: '100%', width: '100%', borderRadius: 10}}
      />
    </Container>
  );
};

export default ImageView;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#262626',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
});
