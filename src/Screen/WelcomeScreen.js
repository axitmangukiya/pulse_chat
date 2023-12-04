import React, {useEffect, useState} from 'react';
import {View, Text, Image} from 'react-native';

//colors
import COLORS from '../utils/colors';

//
import auth from '@react-native-firebase/auth';

const WelcomeScreen = ({navigation}) => {
  //welcomescreen timeout
  useEffect(() => {
    setTimeout(() => {
      auth().onAuthStateChanged(userExist => {
        if (userExist) {
          navigation.replace('hometabs');
        } else {
          navigation.replace('login');
        }
      });
    }, 4000);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.black,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Image
        source={require('../assets/Logo.png')}
        style={{height: '50%', width: '100%', top: '20%'}}
        resizeMode="stretch"
      />
      <View style={{flex: 1, justifyContent: 'flex-end'}}>
        <Text
          style={{
            fontSize: 25,
            color: COLORS.light,
            fontFamily: 'Blenda-Script',
            textAlign: 'center',
            alignContent: 'stretch',
            fontWeight: '700',
            opacity: 0.5,
            bottom: 10,
          }}>
          PulseChat
        </Text>
      </View>
    </View>
  );
};
export default WelcomeScreen;
