import React, {useState, useEffect} from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  Modal,
  TouchableOpacity,
} from 'react-native';

//colors
import COLORS from '../utils/colors';

//db
import {firebase} from '@react-native-firebase/firestore';

//searchbar
import {Searchbar} from 'react-native-paper';

const HomeScreen = ({user, navigation}) => {
  //states
  const [users, setUsers] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showprofile, setShowprofile] = useState(false);
  const [userName, setUserName] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  console.log('users->', users);

  //get allusers from db
  const getUsers = async () => {
    const querySanp = await firebase
      .firestore()
      .collection('UserData')
      .where('UserID', '!=', user.uid)
      .get();
    const allusers = querySanp.docs.map(docSnap => docSnap.data());
    setUsers(allusers);
  };

  useEffect(() => {
    getUsers();
    filterUsersByName();
  }, [searchQuery]);

  const filterUsersByName = () => {
    if (users === null) {
      return [];
    }
    const filtered = users
      .filter(function (item) {
        return item.name.toLowerCase().includes(searchQuery.toLowerCase());
      })
      .map(function ({profilepic, name, email}) {
        return {profilepic, name, email};
      });
    setFilteredUsers(filtered);
  };

  //show profile pictor
  const ShowImage = () => {
    return (
      <Modal
        onRequestClose={() => {
          setIsVisible(!isVisible);
        }}
        animationType="fade"
        transparent={true}
        visible={isVisible}>
        <TouchableOpacity
          onPress={() => setIsVisible(!isVisible)}
          activeOpacity={2}
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}>
          <View
            style={{
              height: '30%',
              width: '70%',
            }}>
            {/* <View
              style={{
                backgroundColor: 'rgba(0,0,0,0.5)',
                paddingHorizontal: 10,
                paddingVertical: 5,
              }}>
              <Text
                style={{
                  color: COLORS.light,
                  fontSize: 20,
                }}>
                {userName}
              </Text>
            </View> */}
            <View
              style={{
                opacity: 0.5,
                position: 'relative',
                right: 0,
                bottom: 0,
                backgroundColor: COLORS.MatteBlack,
                width: '100%',
                height: '15%',
                paddingHorizontal: 5,
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  color: COLORS.light,
                  fontSize: 18,
                  opacity: 1,
                }}>
                {userName}
              </Text>
            </View>
            <Image
              style={{height: '100%', width: '100%'}}
              source={{uri: showprofile}}
              resizeMode="cover"
            />
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  //users name and profile
  const RenderCard = ({item}) => {
    return (
      <View style={styles.mycard}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {
            setIsVisible(true);
            setShowprofile(item.ProfilePic);
            setUserName(item.name);
          }}>
          <Image
            source={{uri: item.ProfilePic}}
            style={styles.img}
            resizeMode="cover"
          />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {
            navigation.navigate('chat', {
              name: item.name,
              UserID: item.UserID,
              ProfilePic: item.ProfilePic,
              status:
                typeof item.status === 'string'
                  ? item.status
                  : item.status === String,
            });
          }}>
          <View>
            <View style={{justifyContent: 'center'}}>
              <Text style={styles.text}>{item.name}</Text>
              <Text style={styles.text}>{item.email}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: COLORS.MatteBlack}}>
      <StatusBar
        animated={true}
        translucent={true}
        barStyle={'default'}
        backgroundColor={'rgba(0,0,0,0)'}
      />
      <Searchbar
        style={{
          height: 50,
          justifyContent: 'center',
          marginHorizontal: 10,
          top: 5,
        }}
        value={searchQuery}
        onChangeText={text => setSearchQuery(text)}
        placeholder="Search Here ...."
      />
      <FlatList
        data={searchQuery ? filteredUsers : users}
        renderItem={({item}) => {
          return <RenderCard item={item} />;
        }}
        keyExtractor={item => item.UserID}
        ListEmptyComponent={() => {
          <View style={{alignItems: 'center', marginTop: 20}}>
            <Text style={{color: COLORS.light, fontSize: 18}}>
              {searchQuery ? 'User not found' : 'No users available'}
            </Text>
          </View>;
        }}
      />
      {isVisible && showprofile && <ShowImage />}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  img: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginStart: 3,
    borderColor: 'limegreen',
    borderWidth: 2,
    alignSelf: 'center',
  },
  text: {
    fontSize: 16,
    marginStart: 15,
    color: COLORS.black,
  },
  mycard: {
    flexDirection: 'row',
    backgroundColor: COLORS.light,
    height: 60,
    marginVertical: 10,
    marginHorizontal: 10,
    padding: 5,
    borderRadius: 20,
    shadowColor: COLORS.blue,
    shadowOpacity: 2,
    shadowRadius: 10,
    shadowOffset: {height: 20, width: '100%'},
  },
});
