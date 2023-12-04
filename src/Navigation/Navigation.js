import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {Text, View, Image} from 'react-native';

//Navigation
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

//db
import auth from '@react-native-firebase/auth';
import firestore, {firebase} from '@react-native-firebase/firestore';

//Screens
import WelcomeScreen from '../Screen/WelcomeScreen';
import LoginScreen from '../Screen/LoginScreen';
import SignupScreen from '../Screen/SignupScreen';
import HomeScreen from '../Screen/HomeScreen';
import ChatScreen from '../Screen/ChatScreen';
import SettingScreen from '../Screen/SettingScreen';
import EditProfileScreen from '../Screen/EditProfileScreen';

//Icons
import Icon from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

//Colors
import COLORS from '../utils/colors';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const Navigation = () => {
  const [user, setuser] = useState('');

  useEffect(() => {
    const unregister = auth().onAuthStateChanged(userExist => {
      if (userExist) {
        firestore().collection('UserData').doc(userExist.uid).update({
          status: 'online',
        });
        setuser(userExist);
      } else setuser('');
    });

    return () => {
      unregister();
    };
  }, []);

  const Tabs = () => {
    return (
      <Tab.Navigator
        initialRouteName="home"
        screenOptions={{
          tabBarStyle: {
            backgroundColor: COLORS.JetBlack,
            height: 50,
            borderTopColor: COLORS.JetBlack,
            borderTopWidth: 1,
          },
          tabBarActiveTintColor: COLORS.grey,
          tabBarShowLabel: false,
        }}>
        {user ? (
          <>
            <Stack.Screen
              name="home"
              options={{
                headerRightContainerStyle: {marginEnd: 10},
                headerRight: () => (
                  <Icon
                    name="log-in"
                    selectable={true}
                    color={COLORS.light}
                    size={25}
                    onPress={() => {
                      firestore()
                        .collection('UserData')
                        .doc(user.uid)
                        .update({
                          status: firestore.FieldValue.serverTimestamp(),
                        })
                        .then(() => {
                          firebase.auth().signOut();
                        })
                        .catch(e => {
                          console.log('error->', e);
                        });
                    }}
                  />
                ),
                title: 'PulseChat',
                headerStyle: {backgroundColor: COLORS.JetBlack, height: 120},
                headerTintColor: COLORS.light,
                tabBarIcon: ({color, size}) => (
                  <MaterialCommunityIcons
                    name="message-reply-outline"
                    color={color}
                    size={size}
                  />
                ),
              }}>
              {props => <HomeScreen {...props} user={user} />}
            </Stack.Screen>
            <Stack.Screen
              name="Settings"
              options={{
                headerStyle: {backgroundColor: COLORS.JetBlack, height: 120},
                headerTintColor: COLORS.light,
                title: 'Settings',
                tabBarIcon: ({color, size}) => (
                  <Icon name="settings" color={color} size={size} />
                ),
              }}>
              {props => <SettingScreen {...props} user={user} />}
            </Stack.Screen>
          </>
        ) : (
          <></>
        )}
      </Tab.Navigator>
    );
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="welcome"
        screenOptions={{
          headerStyle: {backgroundColor: COLORS.JetBlack},
          headerTintColor: COLORS.light,
        }}>
        {user ? (
          <>
            {/* <Stack.Screen
              name="home"
              options={{
                headerRight: () => (
                  <Icon
                    name="log-in"
                    selectable={true}
                    color={COLORS.light}
                    size={25}
                    onPress={() => {
                      console.log('123');

                      firestore()
                        .collection('UserData')
                        .doc(user.uid)
                        .update({
                          status: firestore.FieldValue.serverTimestamp(),
                        })
                        .then(() => {
                          firebase.auth().signOut();
                        })
                        .catch(e => {
                          console.log('error->', e);
                        });
                    }}
                  />
                ),
                title: 'Chat',
              }}>
              {props => <HomeScreen {...props} user={user} />}
            </Stack.Screen> */}
            <Stack.Screen name="hometabs" options={{headerShown: false}}>
              {props => <Tabs {...props} user={user} />}
            </Stack.Screen>
            <Stack.Screen
              name="chat"
              options={({route}) => ({
                title: (
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <Image
                      style={{height: 40, width: 40, borderRadius: 20}}
                      source={{uri: route.params.ProfilePic}}
                    />
                    <View
                      style={{
                        paddingHorizontal: 8,
                      }}>
                      <Text style={{color: 'white',fontSize:17}}>{route.params.name}</Text>
                      <Text style={{color: 'white'}}>
                        {route.params.status}
                      </Text>
                    </View>
                  </View>
                ),
              })}>
              {props => <ChatScreen {...props} user={user} />}
            </Stack.Screen>
            <Stack.Screen name="editprofile" options={{title: 'EditProfile'}}>
              {props => <EditProfileScreen {...props} user={user} />}
            </Stack.Screen>
          </>
        ) : (
          <>
            <Stack.Screen
              name="welcome"
              component={WelcomeScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="login"
              component={LoginScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="signup"
              component={SignupScreen}
              options={{headerShown: false}}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
