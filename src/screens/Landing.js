/* eslint-disable prettier/prettier */
import React from 'react';
import {
  StyleSheet,
  Text,
  Image,
  ScrollView,
  Dimensions,
  View,
  TouchableWithoutFeedback,
} from 'react-native';

import {Container, Button, H3} from 'native-base';

import propTypes from 'prop-types';
import {connect} from 'react-redux';
import Video from 'react-native-video';

let screenWidth = Dimensions.get('window').width;

const Landing = ({userState, navigation}) => {
  return (
    <Container style={styles.container}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        style={{width: '100%'}}
        showsVerticalScrollIndicator={false}>
        <H3 style={styles.heading}>Welcome</H3>
        <Button
          style={styles.landingPageBtn}
          rounded
          block
          onPress={() => navigation.navigate('ImageUploader')}>
          <Text style={{fontWeight: 'bold', color: 'white', fontSize: 20}}>
            Upload an Image
          </Text>
        </Button>
        <Button
          style={styles.landingPageBtn}
          rounded
          block
          onPress={() => navigation.navigate('VideoUploader')}>
          <Text style={{fontWeight: 'bold', color: 'white', fontSize: 20}}>
            Upload a Video
          </Text>
        </Button>

        <H3 style={styles.heading}>My Images</H3>

        {userState.user &&
        userState.user.images &&
        userState.user.images.urls.length > 0 ? (
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{flexGrow: 1}}>
            {userState.user.images.urls.map((src, i) => {
              return (
                <View key={i} style={styles.productScrollView}>
                  <TouchableWithoutFeedback
                    onPress={() => navigation.navigate('ImageView', {url: src})}
                    key={i}>
                    <Image key={i} source={{uri: src}} style={styles.image} />
                  </TouchableWithoutFeedback>
                </View>
              );
            })}
          </ScrollView>
        ) : (
          <View style={styles.noImagesView}>
            <Text style={{color: 'white', fontSize: 20}}>
              No images were added
            </Text>
          </View>
        )}

        <H3 style={styles.heading}>My Videos</H3>
        {userState.user &&
        userState.user.videos &&
        userState.user.videos.urls.length > 0 ? (
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{flexGrow: 1}}>
            {userState.user.videos.urls.map((src, i) => {
              return (
                <View key={i} style={styles.productScrollView}>
                  <TouchableWithoutFeedback
                    onPress={() =>
                      navigation.navigate('VideoPlayer', {url: src})
                    }
                    key={i}>
                    <Video
                      source={{uri: src}}
                      style={{
                        width: '80%',
                        height: 300,
                        borderRadius: 10,
                        alignSelf: 'center',
                        marginBottom: 20,
                      }}
                      controls={false}
                      resizeMode="cover"
                    />
                  </TouchableWithoutFeedback>
                </View>
              );
            })}
          </ScrollView>
        ) : (
          <View style={styles.noImagesView}>
            <Text style={{color: 'white', fontSize: 20}}>
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
    padding: 10,
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
  progress: {
    width: '100%',
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 10,
  },
  landingPageBtn: {
    backgroundColor: '#873EA8',
    width: '100%',
    marginBottom: 20,
  },
  productScrollView: {
    display: 'flex',
    justifyContent: 'space-between',
    width: screenWidth,
    alignItems: 'flex-start',
    marginLeft: -35,
    marginRight: -25,
  },
  noImagesView: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    flexGrow: 1,
  },
});
