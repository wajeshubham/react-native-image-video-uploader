/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {StyleSheet} from 'react-native';

import {Container} from 'native-base';

import Video from 'react-native-video';

const VideoPlayer = ({route}) => {
  const {url} = route.params;
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    setShowControls(true);
    return () => {
      setShowControls(false);
    };
  }, []);
  return (
    <Container style={styles.container}>
      <Video
        source={{uri: url}}
        style={{
          width: '100%',
          height: 400,
          top: '20%',
        }}
        controls={showControls}
        fullscreen={true}
        resizeMode="cover"
      />
    </Container>
  );
};

export default VideoPlayer;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#262626',
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
  },
});
