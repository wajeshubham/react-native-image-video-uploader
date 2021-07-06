import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import Snackbar from 'react-native-snackbar';
import {SET_LOADER} from './action.types';

export const signUp = data => async dispatch => {
  const {email, password} = data;
  dispatch({
    type: SET_LOADER,
    payload: true,
  });
  auth()
    .createUserWithEmailAndPassword(email, password)
    .then(data => {
      console.log('User creation was succes');

      database()
        .ref('/users/' + data.user.uid)
        .set({
          email,
          uid: data.user.uid,
          images: {
            urls: [],
          },
          videos: {
            urls: [],
          },
        })
        .then(() => console.log('Data set success'))
        .catch(e => console.log(e, 'error'));
      dispatch({
        type: SET_LOADER,
        payload: false,
      });
      Snackbar.show({
        text: 'Account created successfully!',
        textColor: 'white',
        backgroundColor: 'green',
      });
    })
    .catch(error => {
      dispatch({
        type: SET_LOADER,
        payload: false,
      });
      if (error.code === 'auth/email-already-in-use') {
        Snackbar.show({
          text: 'That email address is already in use!',
          textColor: 'white',
          backgroundColor: 'red',
        });
      }

      if (error.code === 'auth/invalid-email') {
        Snackbar.show({
          text: 'That email address is invalid!',
          textColor: 'white',
          backgroundColor: 'red',
        });
      }
      if (error.code === 'auth/weak-password') {
        Snackbar.show({
          text: 'Password should be atleast 6 characters',
          textColor: 'white',
          backgroundColor: 'red',
        });
      }
    });
};

export const signIn = data => async dispatch => {
  const {email, password} = data;
  dispatch({
    type: SET_LOADER,
    payload: true,
  });
  auth()
    .signInWithEmailAndPassword(email, password)
    .then(() => {
      console.log('Signin success');
      Snackbar.show({
        text: 'Signin success.',
        textColor: 'white',
        backgroundColor: 'green',
      });
      dispatch({
        type: SET_LOADER,
        payload: false,
      });
    })
    .catch(error => {
      console.log(error);
      Snackbar.show({
        text: 'Invalid credentials',
        textColor: 'white',
        backgroundColor: 'red',
      });
      dispatch({
        type: SET_LOADER,
        payload: false,
      });
    });
};

export const signOut = () => async dispatch => {
  auth()
    .signOut()
    .then(() => {
      console.log('sign out successfull.');
      Snackbar.show({
        text: 'Signed out successfully.',
        textColor: 'white',
        backgroundColor: 'green',
      });
    })
    .catch(error => {
      console.log(error);
      Snackbar.show({
        text: 'Signout Failed.',
        textColor: 'white',
        backgroundColor: 'red',
      });
    });
};
