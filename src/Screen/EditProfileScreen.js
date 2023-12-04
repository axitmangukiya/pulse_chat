import React, {useEffect, useState} from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  ToastAndroid,
  View,
  Pressable,
} from 'react-native';

//button
import CustomButton from '../components/CustomButton/CustomButton';

//input
import CustomInput from '../components/CustomInput/CustomInput';

//db
import firestore, {firebase} from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

//imagelibrary and camera
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';

//icon
import Icon from 'react-native-vector-icons/Feather';

//modal
import Modal from 'react-native-modal';

//colors
import COLORS from '../utils/colors';

//loader
import Loader from '../utils/Loader';

const EditProfileScreen = ({user, navigation}) => {
  //states
  const [name, setName] = useState();
  const [image, setImage] = useState();
  const [profileDetails, setProfileDetails] = useState();
  const [isVisible, setisVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  //get login user details
  const UserDetail = async () => {
    const querySanp = await firebase
      .firestore()
      .collection('UserData')
      .where('UserID', '==', user.uid)
      .get();
    const Details = querySanp.docs.map(docSnap => docSnap.data());
    setProfileDetails(Details[0]);
    setName(Details[0].name);
  };

  useEffect(() => {
    UserDetail();
  }, []);

  //update user details
  const EditProfile = () => {
    setLoading(true);
    setTimeout(() => {
      try {
        firestore()
          .collection('UserData')
          .where('UserID', '==', user.uid)
          .get()
          .then(querySnap => {
            querySnap.forEach(doc => {
              const data = doc.data();
              console.log('data->', data);
              if (data) {
                doc.ref.update({
                  ProfilePic: image,
                  name: name,
                });
              }
            });
          })
          .catch(error => {
            console.log('error->', error);
          });
        setLoading(false);
      } catch (error) {
        console.log('erro->', error);
      }
    }, 3000);
  };

  let options = {
    quality: 1,
    aspect: [4, 3],
    allowsEditing: true,
    maxHeight: 0,
    maxWidth: 0,
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
    <SafeAreaView style={{backgroundColor: COLORS.MatteBlack, flex: 1}}>
      <Loader visible={loading} />
      <StatusBar
        animated={true}
        translucent={true}
        barStyle={'default'}
        backgroundColor={'rgba(0,0,0,0)'}
      />

      {/* option of camera and photolibrary */}
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
            <Image
              style={{
                height: 100,
                width: 100,
              }}
              resizeMode="cover"
              resizeMethod="scale"
              source={{uri: !image ? profileDetails?.ProfilePic : image}}
            />

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
            setValue={text => setName(text)}
            iconName="account-outline"
            label="Name"
            placeholder="Enter your full name"
          />
          <CustomButton
            title="Submit"
            onPress={() => {
              EditProfile();
              navigation.navigate('hometabs');
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfileScreen;
