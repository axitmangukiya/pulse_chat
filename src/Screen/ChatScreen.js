import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Clipboard,
  Alert,
  Image,
  TouchableOpacity,
  ToastAndroid,
  Pressable,
} from 'react-native';

//chat component
import {GiftedChat, Bubble, InputToolbar, Send} from 'react-native-gifted-chat';

//db
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

//image picker from camera and image library
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

//colors
import COLORS from '../utils/colors';

//icons
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/Feather';

//modal
import Modal from 'react-native-modal';

export default function ChatScreen({user, route}) {
  //states
  const [messages, setMessages] = useState([]);
  const [picImage, setPicImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [isVisible, setisVisible] = useState(false);

  const {UserID} = route.params;

  //unique db docid
  const docid =
    UserID > user.uid ? user.uid + '-' + UserID : UserID + '-' + user.uid;

  //get messages from other users
  useEffect(() => {
    const messageRef = firestore()
      .collection('UsersChat')
      .doc(docid)
      .collection('Messages')
      .orderBy('createdAt', 'desc');

    const unSubscribe = messageRef.onSnapshot(querySnap => {
      const allmsg = querySnap.docs.map(docSanp => {
        const data = docSanp.data();
        if (data.createdAt) {
          return {
            ...docSanp.data(),
            createdAt: docSanp.data().createdAt.toDate(),
          };
        } else {
          return {
            ...docSanp.data(),
            createdAt: new Date(),
          };
        }
      });
      setMessages(allmsg);
    });

    return () => {
      unSubscribe();
    };
  }, [messages]);

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
  const handlecamera = async () => {
    const result = await launchCamera(options);
    if (result.didCancel && result.didCancel === true) {
      ToastAndroid.showWithGravity(
        'Somthing Want Wrong',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    } else {
      setPicImage(result);
      uploadimage(result);
      console.log('result->', result);
    }
  };

  //access image library
  const handlelibrary = async () => {
    const result = await launchImageLibrary(options);
    if (result.didCancel && result.didCancel === true) {
      // ToastAndroid.showWithGravity(
      //   'Somthing Want Wrong',
      //   ToastAndroid.SHORT,
      //   ToastAndroid.CENTER,
      // );
    } else {
      setPicImage(result);
      uploadimage(result);
      console.log('result->', result);
    }
  };

  //send images
  const uploadimage = async () => {
    if (picImage && picImage.assets) {
      const refrences = storage().ref(picImage.assets[0].fileName);
      const pathTofile = picImage.assets[0].uri;
      await refrences
        .putFile(pathTofile)
        .then(res => console.log('res', res))
        .catch(e => console.log('e', e));
      console.log('filepath->', picImage.assets[0].fileName, 'pathTofile');
    }
    const url = await storage()
      .ref(picImage.assets[0].fileName)
      .getDownloadURL();
    setImageUrl(url);
    console.log('url:', url);
  };

  //send messages
  const onSend = (messageArray = [], text = null) => {
    let mymsg;
    if (imageUrl !== '') {
      const msg = messageArray[0];
      mymsg = {
        ...msg,
        SendBy: user.uid,
        SendTo: UserID,
        image: imageUrl,
        createdAt: new Date(),
      };
    } else {
      const msg = messageArray[0];
      mymsg = {
        ...msg,
        SendBy: user.uid,
        SendTo: UserID,
        createdAt: new Date(),
      };
    }
    console.log('mymesaage->', mymsg);
    setMessages(previousMessages => GiftedChat.append(previousMessages, mymsg));
    firestore()
      .collection('UsersChat')
      .doc(docid)
      .collection('Messages')
      .add({...mymsg, createdAt: firestore.FieldValue.serverTimestamp()});
    setImageUrl('');
    setPicImage(null);
  };

  //longpress function for message delete or copy
  function onLongPress(context, message) {
    const id = message._id;
    console.log('id->', id);

    Alert.alert(
      'options',
      'Choose an action',
      [
        {
          text: 'Copy',
          onPress: () => Clipboard.setString(message.text),
        },
        {
          text: 'Delete',
          onPress: () =>
            firestore()
              .collection('UsersChat')
              .doc(docid)
              .collection('Messages')
              .get()
              .then(querySnap => {
                querySnap.forEach(doc => {
                  const data = doc.data();
                  console.log('docid:', doc.id, data);
                  if (data._id === id) {
                    console.log('delete message');
                    doc.ref.delete();
                  }
                });
              })
              .catch(error => {
                console.log('error:', error);
              }),
          style: 'destructive',
        },
        {
          text: 'Edit',
          onPress: () =>
            firestore()
              .collection('chatrooms')
              .doc('docid')
              .collection('messages')
              .get()
              .then(querySnap => {
                querySnap.forEach(doc => {
                  const data = doc.data();
                  setUpdateMessage(doc.data());
                });
              })
              .catch(error => {
                console.log('error:', error);
              }),
          style: 'Edit',
        },
      ],
      {cancelable: true},
    );
  }

  // const renderSend = props => {
  //   return (
  //     <View
  //       style={{
  //         flexDirection: 'row',
  //         alignItems: 'center',
  //         justifyContent: 'center',
  //         height: 50,
  //       }}>
  //       <Modal
  //         animationOut="zoomOut"
  //         animationIn="zoomIn"
  //         style={{width: '100%', marginBottom: 0, marginLeft: 0}}
  //         isVisible={isVisible}
  //         onTouchEnd={() => setisVisible(false)}>
  //         <View
  //           style={{
  //             position: 'absolute',
  //             left: 0,
  //             right: 0,
  //             bottom: 0,
  //             height: 80,
  //             width: '100%',
  //             backgroundColor: COLORS.grey,
  //             flexDirection: 'row',
  //             alignItems: 'center',
  //             justifyContent: 'space-evenly',
  //             borderTopStartRadius: 20,
  //             borderTopEndRadius: 20,
  //           }}>
  //           <Pressable
  //             style={{
  //               height: 50,
  //               width: 50,
  //               borderRadius: 25,
  //               backgroundColor: COLORS.light,
  //               alignItems: 'center',
  //               justifyContent: 'center',
  //             }}
  //             onPress={() => {
  //               handlecamera();
  //             }}>
  //             <Icon name="camera" size={25} color={COLORS.darkBlue} />
  //           </Pressable>
  //           <Pressable
  //             style={{
  //               height: 50,
  //               width: 50,
  //               borderRadius: 25,
  //               backgroundColor: COLORS.light,
  //               alignItems: 'center',
  //               justifyContent: 'center',
  //             }}
  //             onPress={() => {
  //               handlelibrary();
  //             }}>
  //             <Icon name="image" size={25} color={COLORS.darkBlue} />
  //           </Pressable>
  //         </View>
  //       </Modal>
  //       <TouchableOpacity
  //         style={{
  //           marginRight: 20,
  //           alignItems: 'flex-start',
  //           justifyContent: 'center',
  //         }}
  //         onPress={() => setisVisible(true)}>
  //         <FontAwesomeIcon name="paperclip" size={25} color={COLORS.black} />
  //       </TouchableOpacity>
  //       <Send
  //         {...props}
  //         containerStyle={{justifyContent: 'center'}}
  //         sendButtonProps={props => {
  //           if (props.currentMessage.image) {
  //             return (
  //               <View style={{backgroundColor: 'white', borderRadius: 10}}>
  //                 <Image
  //                   source={{uri: props.currentMessage.image}}
  //                   style={{width: 200, height: 200, borderRadius: 10}}
  //                 />
  //                 <Text style={{color: 'black'}}>
  //                   {props.currentMessage.text}
  //                 </Text>
  //               </View>
  //             );
  //           } else if (!props.currentMessage.image) {
  //             return (
  //               <View style={{backgroundColor: 'white', borderRadius: 10}}>
  //                 <Image
  //                   source={{uri: props.currentMessage.image}}
  //                   style={{width: 200, height: 200, borderRadius: 10}}
  //                 />
  //               </View>
  //             );
  //           }
  //         }}>
  //         <View style={{marginRight: 10}}>
  //           <MaterialCommunityIcons
  //             name="send"
  //             size={25}
  //             color={COLORS.black}
  //           />
  //         </View>
  //       </Send>
  //     </View>
  //   );
  // };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'black',
      }}>
      {/* chat ui */}
      <GiftedChat
        showAvatarForEveryMessage={true}
        showUserAvatar={true}
        messages={messages}
        isTyping={true}
        isKeyboardInternallyHandled={true}
        infiniteScroll={true}
        render={true}
        onSend={text => onSend(text)}
        user={{
          _id: user.uid,
        }}
        loadEarlier={true}
        renderSend={props => {
          return (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                height: 50,
              }}>
              <Modal
                animationOut="zoomOut"
                animationIn="zoomIn"
                style={{width: '100%', marginBottom: 0, marginLeft: 0}}
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
              <TouchableOpacity
                style={{
                  marginRight: 20,
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                }}
                onPress={() => setisVisible(true)}>
                <FontAwesomeIcon
                  name="paperclip"
                  size={25}
                  color={COLORS.black}
                />
              </TouchableOpacity>
              <Send
                {...props}
                containerStyle={{justifyContent: 'center'}}
                sendButtonProps={props => {
                  if (props.currentMessage.image) {
                    return (
                      <View
                        style={{backgroundColor: 'white', borderRadius: 10}}>
                        <Image
                          source={{uri: props.currentMessage.image}}
                          style={{width: 200, height: 200, borderRadius: 10}}
                        />
                        <Text style={{color: 'black'}}>
                          {props.currentMessage.text}
                        </Text>
                      </View>
                    );
                  } else if (!props.currentMessage.image) {
                    return (
                      <View
                        style={{backgroundColor: 'white', borderRadius: 10}}>
                        <Image
                          source={{uri: props.currentMessage.image}}
                          style={{width: 200, height: 200, borderRadius: 10}}
                        />
                      </View>
                    );
                  }
                }}>
                <View style={{marginRight: 10}}>
                  <MaterialCommunityIcons
                    name="send"
                    size={25}
                    color={COLORS.black}
                  />
                </View>
              </Send>
            </View>
          );
        }}
        timeTextStyle={{
          left: {color: 'black'},
          right: {color: 'black'},
        }}
        textInputProps={{color: 'black'}}
        onLongPress={onLongPress}
        renderUsernameOnMessage={true}
        imageStyle={{
          display: 'flex',
          height: 200,
          width: 200,
          resizeMode: 'cover',
          // alignItems: 'center',
          // justifyContent: 'center',
          // borderRadius: 10,
          // backgroundColor: 'white',
        }}
        renderBubble={props => {
          return (
            <Bubble
              {...props}
              wrapperStyle={{
                right: {
                  backgroundColor: '#f5f5f5',
                  marginVertical: 10,
                },
                left: {
                  backgroundColor: '#f5f5f5',
                  marginVertical: 10,
                },
              }}
              textStyle={{
                left: {color: 'black'},
                right: {color: 'black'},
              }}
              containerStyle={{backgroundColor: 'transparent'}}
            />
          );
        }}
        renderInputToolbar={props => {
          return (
            <InputToolbar
              {...props}
              containerStyle={{
                backgroundColor: '#f5f5f5',
                marginHorizontal: 10,
                marginVertical: 5,
                borderRadius: 15,
                alignSelf: 'center',
                justifyContent: 'center',
                display: 'flex',
              }}
            />
          );
        }}
      />
    </View>
  );
}
