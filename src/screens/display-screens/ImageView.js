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
        style={styles.selectedImage}
        resizeMode="contain"
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
    padding: 0,
  },
  selectedImage: {width: '100%', height: '100%'},
});
