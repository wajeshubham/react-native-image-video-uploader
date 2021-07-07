/* eslint-disable prettier/prettier */
import React, {useState} from 'react';

import {StyleSheet} from 'react-native';
import {Container, Spinner} from 'native-base';
import Video from 'react-native-video';

const VideoPlayer = ({route}) => {
  const {url} = route.params;
  const [buffering, setBuffering] = useState(undefined);

  return (
    <>
      {buffering ? <Spinner style={styles.spinner} /> : null}

      <Container style={styles.container}>
        <Video
          source={{uri: url}}
          style={styles.videoPlayer}
          controls={true}
          fullscreen={true}
          resizeMode="cover"
          onLoadStart={() => {
            setBuffering(true);
          }}
          onLoad={() => {
            setBuffering(undefined);
          }}
        />
      </Container>
    </>
  );
};

export default VideoPlayer;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#262626',
    flex: 1,
    alignItems: 'center',
  },
  videoPlayer: {
    width: '100%',
    height: 400,
    top: '20%',
  },
  spinner: {
    marginTop: 'auto',
    marginBottom: 'auto',
    width: '100%',
    height: '100%',
    backgroundColor: '#262626',
  },
});
