/* eslint-disable prettier/prettier */
import React, {useState} from 'react';

import {Dimensions, StyleSheet} from 'react-native';
import {Container, Text, Button, H3, ActionSheet, Root} from 'native-base';

import Snackbar from 'react-native-snackbar';
import ProgressBar from 'react-native-progress/Bar';

import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import storage from '@react-native-firebase/storage';
import database from '@react-native-firebase/database';

import propTypes from 'prop-types';
import {connect} from 'react-redux';

import {videoOptions} from '../../utils/option';

const BUTTON_OPTIONS = ['Shoot a video', 'Cancel'];
const screenWidth = Dimensions.get('window').width;

const VideoUploader = ({userState, navigation}) => {
  const [videoUploading, setVideoUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [textAnimation, setTextAnimation] = useState(0);

  const chooseVideo = async type => {
    /**
     * Imagepicker doesnt support "medium" video quality
     * for android so kept it "low" in videoOptions
     */
    if (type === 'CAMERA') {
      launchCamera(videoOptions, response => {
        if (response.didCancel) {
          console.log('User cancelled Video picker');
        } else if (response.error) {
          console.log('VideoPicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          uploadVideo(response);
        }
      });
    } else {
      launchImageLibrary(videoOptions, response => {
        if (response.didCancel) {
          console.log('User cancelled video picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          uploadVideo(response);
        }
      });
    }
  };

  const uploadVideo = async response => {
    setVideoUploading(true);
    try {
      /**
       * To keep firebase storage bucket segregated create unique
       * folders for each user
       */
      const reference = storage().ref(
        `user/${userState.user.uid}/` + response.assets[0].fileName,
      );

      const task = reference.putFile(response.assets[0].uri);

      task.on('state_changed', taskSnapshot => {
        /**
         * This event will get execute everytime
         * there's upload progress
         */
        const percentage =
          (taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 100;

        setUploadStatus(percentage);
      });

      task.then(async () => {
        const url = await reference.getDownloadURL();
        /**
         * Once video is uploaded on storage bucket
         * Store that video in database with respective user
         * by adding videos["urls"] as an array field in user object
         */
        await database()
          .ref(`/users/${userState.user.uid}/videos`)
          .set({
            urls: userState.user.videos
              ? [url, ...userState.user.videos.urls]
              : [url],
          })
          .then(() => {
            setVideoUploading(false);
          });

        Snackbar.show({
          text: 'Video uploaded successfully.',
          textColor: 'white',
          backgroundColor: 'green',
        });
        navigation.navigate('Home');
      });
    } catch (error) {
      console.log(error);
    }
  };

  if (videoUploading) {
    /**
     * Uploading... text animation
     */
    setTimeout(() => {
      if (textAnimation < 3) {
        setTextAnimation(textAnimation + 1);
      } else {
        setTextAnimation(0);
      }
    }, 500);
  }

  return (
    <Root>
      <Container style={styles.container}>
        <H3 style={styles.heading}>
          {videoUploading
            ? 'Uploading' + '.'.repeat(textAnimation)
            : 'Upload a video'}
        </H3>
        {videoUploading ? (
          <>
            <Text
              style={{
                fontWeight: 'bold',
                color: 'white',
                fontSize: 15,
                marginBottom: 10,
              }}>
              {Math.floor(uploadStatus) || 0}% done{' '}
              {Math.floor(uploadStatus) >= 100
                ? 'working on it...'
                : 'please wait...'}
            </Text>
            <ProgressBar
              progress={(Math.floor(uploadStatus) || 0) / 100}
              color={'#873EA8'}
              width={screenWidth - 50}
            />
          </>
        ) : (
          <Button
            style={styles.uploadButton}
            rounded
            block
            onPress={() => {
              ActionSheet.show(
                {
                  options: BUTTON_OPTIONS,
                  cancelButtonIndex: 1,
                  title: 'Upload options',
                },
                buttonIndex => {
                  if (buttonIndex === 0) {
                    chooseVideo('CAMERA');
                  }
                },
              );
            }}>
            <Text style={{fontWeight: 'bold'}}>Choose a video</Text>
          </Button>
        )}
      </Container>
    </Root>
  );
};

const mapStateToProps = state => ({
  userState: state.auth,
});

VideoUploader.propTypes = {
  userState: propTypes.object.isRequired,
};

export default connect(mapStateToProps)(VideoUploader);

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
  progress: {
    width: '100%',
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 10,
  },
  uploadButton: {
    backgroundColor: '#873EA8',
    width: '100%',
  },
});
