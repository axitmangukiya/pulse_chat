import {View, Text, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Bubble, GiftedChat, InputToolbar, Send} from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import {useRoute} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';

const NewMessage = () => {
  const [messages, setMessages] = useState([]);
  const route = useRoute();
  useEffect(() => {
    if (route.params && route.params.data) {
      getData();
      const querySnapshot = firestore()
        .collection('chats')
        .doc(route.params.data.chatId)
        .collection('messages')
        .orderBy('createdAt', 'desc');
      querySnapshot.onSnapshot(querySnapshot => {
        const allmessages = querySnapshot.docs.map(docSnap => {
          return {
            ...docSnap.data(),
            createdAt: new Date(),
          };
        });
        setMessages(allmessages);
      });
    }
  }, [route.params]);

  const getData = async () => {
    userId = await AsyncStorage.getItem('USERID');
  };

  const onSend = msgArray => {
    const msg = msgArray[0];
    const mymsg = {
      ...msg,
      //sendBy: route.params.data.userId,
      //sendTo: route.params.data.userId,
    };
    setMessages(previousMessages => GiftedChat.append(previousMessages, mymsg));
    sendMessage(mymsg);
  };

  const sendMessage = mymsg => {
    firestore()
      .collection('chats')
      //.doc(route.params.data.chatId)
      .collection('messages')
      .add({...mymsg, createdAt: firestore.FieldValue.serverTimestamp()})
      .then(res => {
        console.log(res);
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <GiftedChat
      textInputProps={{color: "black"}}
        messages={messages}
        onSend={messages => onSend(messages)}
        user={
          {
            //_id: route.params.data.userId,
          }
        }
        timeTextStyle={{
          left: {color: 'black'},
          right: {color: 'black'},
        }}

        renderBubble={props => {
          return (
            <Bubble
              {...props}
              textStyle={{
                left: {
                  color: 'black',
                },
                right: {
                  color: 'black',
                },
              }}
              wrapperStyle={{
                right: {
                  backgroundColor: 'orange',
                },
              }}
            />
          );
        }}
      />
    </View>
  );
};

export default NewMessage;
