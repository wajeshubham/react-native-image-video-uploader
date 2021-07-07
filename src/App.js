/* eslint-disable prettier/prettier */
import React, {useEffect} from 'react';
import 'react-native-gesture-handler';

// firebase
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

import {requestPermission} from './utils/AskPermission';

import {SET_USER, IS_AUTHENTICATED} from './action/action.types';

// Navigation & redux
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {connect, useDispatch} from 'react-redux';

import {Spinner} from 'native-base';

import CustomHeader from './layout/CustomHeader';

// Screens
import SignUp from './screens/auth-screens/Signup';
import SignIn from './screens/auth-screens/Signin';
import Landing from './screens/Landing';
import ImageUploader from './screens/upload-screens/ImageUploader';
import VideoUploader from './screens/upload-screens/VideoUploader';
import VideoPlayer from './screens/display-screens/VideoPlayer';
import ImageView from './screens/display-screens/ImageView';

const Stack = createStackNavigator();

const App = ({authState}) => {
  const dispatch = useDispatch();

  const onAuthStateChanged = user => {
    if (user) {
      database()
        .ref(`/users/${user._user.uid}`)
        .on('value', snapshot => {
          /**
           * dispatch authenticated use and set it to the global state
           * */
          dispatch({
            type: SET_USER,
            payload: snapshot.val(),
          });
          dispatch({
            type: IS_AUTHENTICATED,
            payload: true,
          });
        });
    } else {
      dispatch({
        type: IS_AUTHENTICATED,
        payload: false,
      });
    }
  };

  useEffect(() => {
    /**
     * Ask user permissions about storage
     * if he/she hasn't accepted already
     */
    requestPermission();
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  return (
    <>
      {authState.loading ? (
        <Spinner
          style={{
            width: '100%',
            height: '100%',
            opacity: 0.5,
            marginTop: 'auto',
            marginBottom: 'auto',
            zIndex: 100,
            backgroundColor: '#262626',
          }}
        />
      ) : null}
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            header: props => <CustomHeader {...props} />,
          }}>
          {authState.isAuthenticated ? (
            <>
              <Stack.Screen name="Home" component={Landing} />

              <Stack.Screen name="ImageUploader" component={ImageUploader} />
              <Stack.Screen name="ImageView" component={ImageView} />

              <Stack.Screen name="VideoUploader" component={VideoUploader} />
              <Stack.Screen name="VideoPlayer" component={VideoPlayer} />
            </>
          ) : (
            <>
              <Stack.Screen name="SignUp" component={SignUp} />
              <Stack.Screen name="SignIn" component={SignIn} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

const mapStateToProps = state => ({
  authState: state.auth,
});

export default connect(mapStateToProps)(App);
