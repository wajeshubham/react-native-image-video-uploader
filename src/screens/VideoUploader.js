/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {StyleSheet} from 'react-native';

import storage from '@react-native-firebase/storage';
import database from '@react-native-firebase/database';

import Snackbar from 'react-native-snackbar';

import {Container, Text, Button, H3, ActionSheet, Root} from 'native-base';

import ProgressBar from 'react-native-progress/Bar';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import {videoOptions} from '../utils/option';

import propTypes from 'prop-types';
import {connect} from 'react-redux';
import {requestPermission} from '../utils/AskPermission';

const VideoUploader = ({userState, navigation}) => {
  const [videoUploading, setVideoUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);

  const chooseImage = async type => {
    if (type === 'CAMERA') {
      launchCamera(videoOptions, response => {
        if (response.didCancel) {
          console.log('User cancelled Video picker');
        } else if (response.error) {
          console.log('VideoPicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          uploadImage(response);
        }
      });
    } else {
      launchImageLibrary(videoOptions, response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          uploadImage(response);
        }
      });
    }
  };

  const uploadImage = async response => {
    setVideoUploading(true);
    console.log(response, '///////////');
    try {
      const reference = storage().ref(
        `user/${userState.user.uid}/` + response.assets[0].fileName,
      );
      const task = reference.putFile(response.assets[0].uri);
      task.on('state_changed', taskSnapshot => {
        const percentage =
          (taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 100;
        setUploadStatus(percentage);
      });

      task.then(async () => {
        const url = await reference.getDownloadURL();
        await database()
          .ref(`/users/${userState.user.uid}/videos`)
          .set({
            urls: userState.user.videos
              ? [url, ...userState.user.videos.urls]
              : [url],
          });
        setVideoUploading(false);
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

  return (
    <Root>
      <Container style={styles.container}>
        <H3 style={styles.heading}>Upload a video</H3>
        {videoUploading ? (
          <>
            <Text
              style={{
                fontWeight: 'bold',
                color: 'white',
                fontSize: 15,
                marginBottom: 10,
              }}>
              {Math.floor(uploadStatus) || 0}% done please wait...
            </Text>
            <ProgressBar progress={uploadStatus} style={styles.progress} />
          </>
        ) : (
          <Button
            style={styles.formButton}
            rounded
            block
            onPress={() => {
              ActionSheet.show(
                {
                  options: ['Shoot a video', 'Upload from gallery', 'Cancel'],
                  cancelButtonIndex: 2,
                  title: 'Upload options',
                },
                buttonIndex => {
                  if (buttonIndex === 0) {
                    chooseImage('CAMERA');
                  } else if (buttonIndex === 1) {
                    chooseImage('GALLERY');
                  }
                },
              );
            }}>
            <Text style={{fontWeight: 'bold'}}>
              {videoUploading ? 'Uploading please wait...' : 'Choose video'}
            </Text>
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
  image: {
    width: '80%',
    height: 200,
    alignSelf: 'center',
    marginTop: 35,
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
  formButton: {
    backgroundColor: '#873EA8',
    width: '100%',
  },
});
