/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {Dimensions, StyleSheet} from 'react-native';

import storage from '@react-native-firebase/storage';
import database from '@react-native-firebase/database';

import Snackbar from 'react-native-snackbar';

import {Container, Text, Button, H3, ActionSheet, Root} from 'native-base';

import ProgressBar from 'react-native-progress/Bar';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import {imageOptions} from '../../utils/option';

import propTypes from 'prop-types';
import {connect} from 'react-redux';

const BUTTON_OPTIONS = ['Click an image', 'Upload from gallery', 'Cancel'];
const screenWidth = Dimensions.get('window').width;

const ImageUploader = ({userState, navigation}) => {
  const [imageUploading, setImageUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [textAnimation, setTextAnimation] = useState(0);

  const chooseImage = async type => {
    if (type === 'CAMERA') {
      launchCamera(imageOptions, response => {
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
    } else {
      launchImageLibrary(imageOptions, response => {
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
    setImageUploading(true);
    try {
      const reference = storage().ref(
        `user/images/` + response.assets[0].fileName,
      );
      const task = reference.putFile(response.assets[0].uri);
      task.on('state_changed', taskSnapshot => {
        /**
         * This event will get execute everytime
         * there's an upload progress
         */
        const percentage =
          (taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 100;

        setUploadStatus(percentage);
      });

      task.then(async () => {
        const url = await reference.getDownloadURL();
        /**
         * Once image is uploaded on storage bucket
         * Store that image in database with respective user
         * by adding images["urls"] as an array field in user object
         */
        await database()
          .ref(`/users/${userState.user.uid}/images`)
          .set({
            urls: userState.user.images
              ? [url, ...userState.user.images.urls]
              : [url],
          });
        setImageUploading(false);
        Snackbar.show({
          text: 'Image uploaded successfully.',
          textColor: 'white',
          backgroundColor: 'green',
        });
        navigation.navigate('Home');
      });
    } catch (error) {
      console.log(error);
    }
  };

  if (imageUploading) {
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
          {imageUploading
            ? 'Uploading' + '.'.repeat(textAnimation)
            : 'Upload an image'}
        </H3>
        {imageUploading ? (
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
            style={styles.formButton}
            rounded
            block
            onPress={() => {
              ActionSheet.show(
                {
                  options: BUTTON_OPTIONS,
                  cancelButtonIndex: 2,
                  title: 'Choose an image',
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
              {imageUploading ? 'Uploading please wait...' : 'Choose image'}
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

ImageUploader.propTypes = {
  userState: propTypes.object.isRequired,
};

export default connect(mapStateToProps)(ImageUploader);

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
  formButton: {
    backgroundColor: '#873EA8',
    width: '100%',
  },
});
