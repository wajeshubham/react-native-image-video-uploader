/* eslint-disable prettier/prettier */
import React, {useEffect} from 'react';
import 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import {requestPermission} from './utils/AskPermission';

import {SET_USER, IS_AUTHENTICATED, SET_LOADER} from './action/action.types';

import CustomHeader from './layout/CustomHeader';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {connect, useDispatch} from 'react-redux';
import {View, Text} from 'react-native';
import SignUp from './screens/Signup';
import SignIn from './screens/Signin';
import Landing from './screens/Landing';
import ImageUploader from './screens/ImageUploader';
import VideoUploader from './screens/VideoUploader';
import VideoPlayer from './screens/VideoPlayer';
import ImageView from './screens/ImageView';
import {Spinner} from 'native-base';

const Stack = createStackNavigator();

const App = ({authState}) => {
  const dispatch = useDispatch();

  const onAuthStateChanged = user => {
    if (user) {
      database()
        .ref(`/users/${user._user.uid}`)
        .on('value', snapshot => {
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
