import React, {useState} from 'react';
import {
  Image,
  Keyboard,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  ToastAndroid,
  View,
  Pressable,
} from 'react-native';

//button
import CustomButton from '../components/CustomButton/CustomButton';

//input
import CustomInput from '../components/CustomInput/CustomInput';

//imagelibrary and camera
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';

//authentication
import auth from '@react-native-firebase/auth';

//db
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

//loader
import Loader from '../utils/Loader';

//icon
import Icon from 'react-native-vector-icons/Feather';

//modal
import Modal from 'react-native-modal';

//colors
import COLORS from '../utils/colors';

const SignupScreen = ({navigation}) => {
  //states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [conformPassword, setConformPassword] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isVisible, setisVisible] = useState(false);

  const Email = email.match(/\S+@\S+\.\S+/);

  //login validation
  const validate = () => {
    Keyboard.dismiss();
    if (!name && !email && !password && !conformPassword) {
      ToastAndroid.showWithGravityAndOffset(
        'Please Fill All Field',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        50,
        100,
      );
    } else if (!Email) {
      ToastAndroid.showWithGravityAndOffset(
        'Please input a valid email',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        50,
        100,
      );
    } else if (password !== conformPassword) {
      ToastAndroid.showWithGravity(
        'wrong Password',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    } else {
      register();
    }
  };

  //create user
  const register = () => {
    setLoading(true);
    setTimeout(async () => {
      try {
        const UserData = await auth().createUserWithEmailAndPassword(
          email,
          password,
        );
        firestore().collection('UserData').doc(UserData.user.uid).set({
          name: name,
          email: UserData.user.email,
          UserID: UserData.user.uid,
          ProfilePic: image,
          status: 'online',
        });
        setLoading(false);
      } catch (error) {
        ToastAndroid.showWithGravity(
          'Something went wrong',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      }
    }, 3000);
  };

  let options = {
    quality: 1,
    aspect: [4, 3],
    allowsEditing: true,
    maxHeight: 0,
    maxWidth: 0,
    mediaType: '',
    presentationStyle: 'pageSheet',
    storageOptions: {
      skipBackup: true,
      path: 'images',
      saveToPhotos: true,
    },
  };

  //access camera
  const handlecamera = () => {
    launchCamera(options, camerafileobj => {
      if (camerafileobj.errorCode || camerafileobj.didCancel) {
        return console.log(
          'launchCamera->',
          'You should handle errors or user cancellation!',
        );
      }
      console.log('camerafileobj->', camerafileobj);
      const cameraimg = camerafileobj.assets[0];
      const uploadTask = storage()
        .ref()
        .child(`/userprofile/${Date.now()}`)
        .putFile(cameraimg.uri);
      uploadTask.on(
        'state_changed',
        snapshot => {
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (progress == 100)
            ToastAndroid.showWithGravity(
              'image uploaded',
              ToastAndroid.SHORT,
              ToastAndroid.CENTER,
            );
        },
        error => {
          ToastAndroid.showWithGravity(
            'error uploading image',
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
          );
          console.log('error->', error);
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            console.log('downloadURL->', downloadURL);
            setImage(downloadURL);
          });
        },
      );
    });
  };

  //access photolibrary
  const handlelibrary = () => {
    launchImageLibrary(options, fileobj => {
      if (fileobj.errorCode || fileobj.didCancel) {
        return console.log(
          'launchImageLibrary->',
          'You should handle errors or user cancellation!',
        );
      }
      console.log('fileobj->', fileobj);
      const img = fileobj.assets[0];
      const uploadTask = storage()
        .ref()
        .child(`/userprofile/${Date.now()}`)
        .putFile(img.uri);
      uploadTask.on(
        'state_changed',
        snapshot => {
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (progress == 100)
            ToastAndroid.showWithGravity(
              'image uploaded',
              ToastAndroid.SHORT,
              ToastAndroid.CENTER,
            );
        },
        error => {
          ToastAndroid.showWithGravity(
            'error uploading image',
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
          );
          console.log('error->', error);
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            console.log('downloadURL->', downloadURL);
            setImage(downloadURL);
          });
        },
      );
    });
  };

  return (
    <SafeAreaView style={{backgroundColor: COLORS.white, flex: 1}}>
      <Loader visible={loading} />
      <StatusBar
        animated={true}
        translucent={true}
        barStyle={'dark-content'}
        backgroundColor={'rgba(0,0,0,0)'}
      />

      {/* camera and photolibrary options */}
      <Modal
        animationIn={'lightSpeedIn'}
        animationOut={'lightSpeedOut'}
        style={{
          width: '100%',
          marginBottom: 0,
          marginLeft: 0,
        }}
        isVisible={isVisible}
        onTouchEnd={() => setisVisible(false)}>
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: 80,
            width: '100%',
            backgroundColor: COLORS.grey,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-evenly',
            borderTopStartRadius: 20,
            borderTopEndRadius: 20,
          }}>
          <Pressable
            style={{
              height: 50,
              width: 50,
              borderRadius: 25,
              backgroundColor: COLORS.light,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => {
              handlecamera();
            }}>
            <Icon name="camera" size={25} color={COLORS.darkBlue} />
          </Pressable>
          <Pressable
            style={{
              height: 50,
              width: 50,
              borderRadius: 25,
              backgroundColor: COLORS.light,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => {
              handlelibrary();
            }}>
            <Icon name="image" size={25} color={COLORS.darkBlue} />
          </Pressable>
        </View>
      </Modal>
      <ScrollView
        contentContainerStyle={{paddingTop: 50, paddingHorizontal: 20}}>
        <Text style={{color: COLORS.black, fontSize: 40, fontWeight: 'bold'}}>
          Register
        </Text>
        <Text style={{color: COLORS.grey, fontSize: 18, marginVertical: 10}}>
          Enter Your Details to Register
        </Text>

        <View style={{alignItems: 'center'}}>
          <View
            style={{
              elevation: 2,
              height: 80,
              width: 80,
              backgroundColor: '#efefef',
              position: 'relative',
              borderRadius: 999,
              overflow: 'hidden',
              alignItems: 'center',
            }}>
            {image == null ? (
              <Image
                style={{
                  height: 100,
                  width: 100,
                }}
                resizeMode="cover"
                resizeMethod="scale"
                source={require('../assets/profile.jpeg')}
              />
            ) : (
              <Image
                style={{
                  height: 100,
                  width: 100,
                }}
                resizeMode="cover"
                resizeMethod="scale"
                source={{uri: image}}
              />
            )}
            <View
              style={{
                opacity: 0.7,
                position: 'absolute',
                right: 0,
                bottom: 0,
                backgroundColor: 'lightgrey',
                width: '100%',
                height: '25%',
              }}>
              <Pressable
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => setisVisible(true)}>
                <Icon name="camera" size={15} color={COLORS.black} />
              </Pressable>
            </View>
          </View>
        </View>

        <View style={{marginVertical: 20}}>
          <CustomInput
            value={name}
            setValue={setName}
            iconName="account-outline"
            label="Name"
            placeholder="Enter your full name"
          />
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
          <CustomInput
            value={conformPassword}
            setValue={setConformPassword}
            iconName="lock-outline"
            label="Conform Password"
            placeholder="Enter your password"
            password
          />
          <CustomButton
            title="Register"
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
              Already have account?
            </Text>
            <Text
              onPress={() => navigation.navigate('login')}
              style={{
                color: COLORS.darkBlue,
                fontWeight: 'bold',
                fontSize: 16,
                margin: 2.5,
              }}>
              Login
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default SignupScreen;
