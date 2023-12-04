import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';

//db
import firestore from '@react-native-firebase/firestore';
import {firebase} from '@react-native-firebase/auth';

//colors
import COLORS from '../utils/colors';

//loader
import Loader from '../utils/Loader';

//icon
import Icon from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const SettingScreen = ({user, navigation}) => {
  //state
  const [profile, setProfile] = useState('');
  const [loading, setLoading] = useState(false);
  // console.log('profile->', profile.ProfilePic);

  //get login user details
  useEffect(() => {
    firestore()
      .collection('UserData')
      .doc(user.uid)
      .get()
      .then(docSnap => {
        const Details = docSnap.data();
        setProfile(Details);
      });
  }, []);

  const deleteAccount = () => {
    setLoading(true);
    setTimeout(async () => {
      try {
        const uid = firebase.auth().currentUser.uid;
        await firebase
          .auth()
          .currentUser.delete(uid)
          .then(() => {
            firestore().collection('UserData').doc(uid).delete();
            ToastAndroid.showWithGravity(
              'Account Deleted Successfully',
              ToastAndroid.SHORT,
              ToastAndroid.CENTER,
            );
          })
          .catch(error => {
            console.log('error->', error);
          });
        setLoading(false);
      } catch (error) {
        console.log('err->', error);
      }
    }, 3000);
  };

  return (
    <View style={styles.container}>
      <Loader visible={loading} />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: 10,
          borderBottomColor: COLORS.grey,
          paddingBottom: 10,
          borderBottomWidth: 1,
          top: 10,
        }}>
        {!profile ? (
          <Image
            style={styles.img}
            source={require('../assets/profile.jpeg')}
            resizeMode="cover"
          />
        ) : (
          <Image
            style={styles.img}
            source={{uri: profile?.ProfilePic}}
            resizeMode="cover"
          />
        )}
        <View style={{justifyContent: 'center'}}>
          <Text style={styles.text}>{!profile ? '' : profile.name}</Text>
          <Text style={styles.text}>{!profile ? '' : profile.email}</Text>
        </View>
      </View>

      {/* for a edit profile */}
      <TouchableOpacity
        onPress={() => navigation.navigate('editprofile')}
        activeOpacity={0.8}
        style={{
          height: 50,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Icon
          name="edit"
          size={25}
          style={{marginStart: 10}}
          color={COLORS.light}
        />
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 10,
          }}>
          <Text style={{fontWeight: '500', fontSize: 20, color: COLORS.light}}>
            EditProfile
          </Text>
        </View>
      </TouchableOpacity>

      {/*delete currentuser  */}
      <TouchableOpacity
        onPress={() => deleteAccount()}
        activeOpacity={0.8}
        style={{
          height: 50,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <MaterialCommunityIcons
          name="delete-outline"
          size={25}
          style={{marginStart: 10}}
          color={COLORS.light}
        />
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 10,
          }}>
          <Text style={{fontWeight: '500', fontSize: 20, color: COLORS.light}}>
            Delete Account
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.MatteBlack,
    paddingHorizontal: 10,
  },
  img: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'limegreen',
  },
  text: {
    fontSize: 17,
    color: COLORS.light,
    marginHorizontal: 10,
  },
  btn: {
    alignItems: 'center',
    height: 50,
    width: '50%',
    justifyContent: 'center',
    borderColor: 'black',
    borderRadius: 10,
  },
});
