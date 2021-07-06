/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React from 'react';
import {StyleSheet, Image} from 'react-native';
import {Header, Right, H3, Left, Icon} from 'native-base';
import logo from '../assets/logo-white.png';

import {connect} from 'react-redux';
import propTypes from 'prop-types';
import {signOut} from '../action/auth';
import {TouchableOpacity} from 'react-native-gesture-handler';

const CustomHeader = ({navigation, authState, signOut}) => {
  return (
    <Header
      style={{
        backgroundColor: '#262626',
      }}>
      <Left>
        {navigation.canGoBack() ? (
          <Icon
            name="arrow-back"
            onPress={() => navigation.goBack()}
            style={{color: '#fff'}}
          />
        ) : (
          <Image source={logo} style={styles.headerImage} />
        )}
      </Left>
      <Right>
        {authState.isAuthenticated ? (
          <>
            <TouchableOpacity onPress={signOut}>
              <H3 style={{color: '#fff'}}>Log out</H3>
            </TouchableOpacity>
          </>
        ) : (
          <H3 style={{color: '#fff'}}>LCO</H3>
        )}
      </Right>
    </Header>
  );
};

const mapStateToProps = state => ({
  authState: state.auth,
});

const mapDispatchToProps = {
  signOut,
};

CustomHeader.prototypes = {
  signOut: propTypes.func.isRequired,
  authState: propTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomHeader);

const styles = StyleSheet.create({
  headerImage: {
    width: 50,
    height: 50,
  },
});
