import React, {useState} from 'react';
import {StyleSheet, ScrollView, Image, TouchableOpacity} from 'react-native';
import Snackbar from 'react-native-snackbar';

import {Container, Form, Item, Input, Text, Button, H3} from 'native-base';
import logo from '../../assets/logo-white.png';
import propTypes from 'prop-types';
import {connect, useDispatch} from 'react-redux';
import {signIn} from '../../action/auth';
import {SET_LOADER} from '../../action/action.types';

const SignIn = ({navigation, signIn}) => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const doSignIn = async () => {
    if (!email || !password) {
      Snackbar.show({
        text: 'Please provide all the fields.',
        textColor: 'white',
        backgroundColor: 'red',
      });
    } else {
      let res = await signIn({email, password});
      if (res.success) {
        dispatch({
          type: SET_LOADER,
          payload: false,
        });
      }
    }
  };

  return (
    <Container style={styles.container}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <Image source={logo} style={styles.image} resizeMode="contain" />
        <H3 style={styles.heading}>Welcome to Pic Bucket</H3>
        <Form>
          <Item rounded style={styles.formItem}>
            <Input
              placeholder="user email"
              placeholderTextColor="#797979"
              value={email}
              style={styles.formInput}
              onChangeText={text => setEmail(text)}
            />
          </Item>
          <Item rounded style={styles.formItem}>
            <Input
              placeholder="user password"
              placeholderTextColor="#797979"
              value={password}
              secureTextEntry={true}
              style={styles.formInput}
              onChangeText={text => setPassword(text)}
            />
          </Item>
          <Button style={styles.loginButton} rounded block onPress={doSignIn}>
            <Text style={{fontWeight: 'bold'}}>Login</Text>
          </Button>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.signUpText}>SignUp</Text>
          </TouchableOpacity>
        </Form>
      </ScrollView>
    </Container>
  );
};

const mapDispatchToProps = {
  signIn: data => signIn(data),
};

SignIn.prototypes = {
  signIn: propTypes.func.isRequired,
};

export default connect(null, mapDispatchToProps)(SignIn);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#262626',
    flex: 1,
    justifyContent: 'center',
  },
  heading: {
    fontSize: 32,
    textAlign: 'center',
    color: '#E6E6E6',
    padding: 15,
    marginBottom: 20,
  },
  image: {
    width: null,
    height: 120,
    marginVertical: 35,
  },
  formItem: {
    marginBottom: 20,
    borderColor: '#707070',
    marginLeft: 10,
    marginRight: 10,
  },
  loginButton: {
    borderRadius: 10,
    backgroundColor: '#873EA8',
    marginLeft: 10,
    marginRight: 10,
  },
  formInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
  },

  signUpText: {
    fontWeight: 'bold',
    alignSelf: 'center',
    fontSize: 20,
    marginTop: 20,
    color: '#ffffff',
  },
});
