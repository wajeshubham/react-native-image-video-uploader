/* eslint-disable prettier/prettier */
import React, {useState} from 'react';

import {
  StyleSheet,
  Text,
  Image,
  ScrollView,
  Dimensions,
  View,
  TouchableWithoutFeedback,
} from 'react-native';
import {Container, Button, H3, Spinner, Icon} from 'native-base';
import Video from 'react-native-video';

import propTypes from 'prop-types';
import {connect} from 'react-redux';

let screenWidth = Dimensions.get('window').width;

const Landing = ({userState, navigation}) => {
  const [buffering, setBuffering] = useState(undefined);

  return (
    <Container style={styles.container}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        style={{width: '100%'}}
        showsVerticalScrollIndicator={false}>
        <H3 style={styles.heading}>Welcome to home</H3>

        <Button
          style={styles.landingPageBtn}
          rounded
          block
          onPress={() => navigation.navigate('ImageUploader')}>
          <Text style={styles.uploadBtnText}>Upload an Image</Text>
        </Button>
        <Button
          style={styles.landingPageBtn}
          rounded
          block
          onPress={() => navigation.navigate('VideoUploader')}>
          <Text style={styles.uploadBtnText}>Upload a Video</Text>
        </Button>

        <H3 style={styles.heading}>My Images</H3>

        {userState.user &&
        userState.user.images &&
        userState.user.images.urls.length > 0 ? (
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{flexGrow: 1}}
            style={{marginBottom: 35}}>
            {userState.user.images.urls.map((src, i) => {
              return (
                <View key={i} style={styles.itemContainer}>
                  <TouchableWithoutFeedback
                    onPress={() => navigation.navigate('ImageView', {url: src})}
                    key={i}>
                    <Image key={i} source={{uri: src}} style={styles.image} />
                  </TouchableWithoutFeedback>
                  <Icon style={styles.resizeBtn} name={'resize'} />
                </View>
              );
            })}
          </ScrollView>
        ) : (
          <View style={styles.noItemsView}>
            <Text style={{color: 'grey', fontSize: 20}}>
              No images were added
            </Text>
          </View>
        )}

        <H3 style={styles.heading}>My Videos</H3>

        {buffering ? <Spinner /> : null}

        {userState.user &&
        userState.user.videos &&
        userState.user.videos.urls.length > 0 ? (
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{flexGrow: 1}}>
            {userState.user.videos.urls.map((src, i) => {
              return (
                <View key={i} style={styles.itemContainer}>
                  <Video
                    source={{uri: src}}
                    style={{
                      ...styles.video,
                      height: buffering ? 0 : 300,
                      borderWidth: buffering ? 0 : 2,
                    }}
                    controls={false}
                    resizeMode="cover"
                    onLoadStart={() => {
                      setBuffering(true);
                    }}
                    onLoad={() => {
                      setBuffering(undefined);
                    }}
                    muted={true}
                  />
                  {!buffering && (
                    <TouchableWithoutFeedback
                      onPress={() =>
                        navigation.navigate('VideoPlayer', {url: src})
                      }>
                      <Icon style={styles.playBtn} name={'play'} />
                    </TouchableWithoutFeedback>
                  )}
                </View>
              );
            })}
          </ScrollView>
        ) : (
          <View style={styles.noItemsView}>
            <Text style={{color: 'grey', fontSize: 20}}>
              No videos were added
            </Text>
          </View>
        )}
      </ScrollView>
    </Container>
  );
};

const mapStateToProps = state => ({
  userState: state.auth,
});

Landing.propTypes = {
  userState: propTypes.object.isRequired,
};

export default connect(mapStateToProps)(Landing);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#262626',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  heading: {
    fontSize: 32,
    textAlign: 'center',
    color: '#E6E6E6',
    padding: 15,
    marginTop: 20,
  },
  image: {
    width: '80%',
    height: 300,
    alignSelf: 'center',
    borderRadius: 10,
    borderColor: 'white',
    borderWidth: 2,
  },
  video: {
    width: '80%',
    alignSelf: 'center',
    marginBottom: 20,
    borderRadius: 10,
    borderColor: 'white',
  },
  landingPageBtn: {
    backgroundColor: '#873EA8',
    width: '100%',
    marginBottom: 20,
  },
  itemContainer: {
    display: 'flex',
    width: screenWidth,
    alignItems: 'center',
    marginLeft: -35,
    marginRight: -25,
  },
  noItemsView: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    flexGrow: 1,
    borderWidth: 2,
    borderColor: 'grey',
    borderRadius: 10,
    marginBottom: 20,
  },
  uploadBtnText: {fontWeight: 'bold', color: 'white', fontSize: 20},
  playBtn: {
    color: 'white',
    fontSize: 40,
    backgroundColor: 'rgba(0,0,0,0.5)',
    textAlign: 'center',
    height: 80,
    paddingTop: 18,
    position: 'absolute',
    top: '33%',
    borderRadius: 100,
    width: 80,
    alignSelf: 'center',
  },
  resizeBtn: {
    color: 'white',
    fontSize: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    textAlign: 'center',
    height: 30,
    position: 'absolute',
    top: 5,
    right: 50,
    borderRadius: 100,
    width: 30,
    alignSelf: 'center',
    paddingTop: 4,
    paddingLeft: 2,
  },
});
