import React, {useState} from 'react';
import {
  Text,
  View,
  Keyboard,
  SafeAreaView,
  ToastAndroid,
  StatusBar,
} from 'react-native';

//button
import CustomButton from '../components/CustomButton/CustomButton';

//input
import CustomInput from '../components/CustomInput/CustomInput';

//authentication
import auth from '@react-native-firebase/auth';

//colors
import COLORS from '../utils/colors';

//loader
import Loader from '../utils/Loader';

const LoginScreen = ({navigation}) => {
  //states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const Email = email.match(/\S+@\S+\.\S+/);

  //login validation
  const validate = () => {
    Keyboard.dismiss();
    if (!email && !password) {
      ToastAndroid.showWithGravityAndOffset(
        'Fill All Field',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
    } else if (!Email) {
      ToastAndroid.showWithGravityAndOffset(
        'Please Fill Valid Email',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        50,
        100,
      );
    } else {
      login();
    }
  };

  //login user
  const login = () => {
    setLoading(true);
    setTimeout(async () => {
      setLoading(false);
      const userData = await auth().signInWithEmailAndPassword(email, password);
      if (userData) {
        ToastAndroid.showWithGravity(
          'Login Succesfuly',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      } else {
        ToastAndroid.showWithGravity(
          'Email or Password Invalid',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      }
    }, 3000);
  };

  //reset password
  const ForgotPassword = () => {
    if (!Email) {
      ToastAndroid.showWithGravityAndOffset(
        'Invalid Email',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        50,
        100,
      );
    } else {
      auth()
        .sendPasswordResetEmail(email)
        .then(() =>
          ToastAndroid.showWithGravityAndOffset(
            'Password reset email sent',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            50,
            100,
          ),
        )
        .catch(error => {
          ToastAndroid.showWithGravityAndOffset(
            'invalid email address',
            error,
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
          );
        });
    }
  };

  return (
    <SafeAreaView style={{backgroundColor: COLORS.white, flex: 1}}>
      <StatusBar
        animated={true}
        translucent={true}
        barStyle={'dark-content'}
        backgroundColor={'rgba(0,0,0,0)'}
      />
      <Loader visible={loading} />
      <View style={{paddingTop: 50, paddingHorizontal: 20}}>
        <Text style={{color: COLORS.black, fontSize: 40, fontWeight: 'bold'}}>
          Log In
        </Text>
        <Text style={{color: COLORS.grey, fontSize: 18, marginVertical: 10}}>
          Enter Your Details to Login
        </Text>
        <View style={{marginVertical: 20}}>
          <CustomInput
            value={email}
            setValue={setEmail}
            iconName="email-outline"
            label="Email"
            placeholder="Enter your email address"
          />
          <CustomInput
            value={password}
            setValue={setPassword}
            iconName="lock-outline"
            label="Password"
            placeholder="Enter your password"
            password
          />
          <Text
            style={{
              color: !Email ? COLORS.white : COLORS.black,
              fontWeight: 'bold',
              fontSize: 16,
              textAlign: 'right',
            }}
            disabled={!Email ? false : true}
            onPress={() => ForgotPassword()}>
            Forgot Password
          </Text>
          <CustomButton
            title="Log In"
            onPress={() => {
              validate();
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                color: COLORS.black,
                fontWeight: 'bold',
                fontSize: 16,
                margin: 2.5,
              }}>
              Don't have account ?
            </Text>
            <Text
              onPress={() => navigation.navigate('signup')}
              style={{
                color: COLORS.darkBlue,
                fontWeight: 'bold',
                fontSize: 16,
                margin: 2.5,
                opacity: 0.8,
              }}>
              Register
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
