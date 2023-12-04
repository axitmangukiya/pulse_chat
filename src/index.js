// import React from 'react';
// import {
//   View,
//   SafeAreaView,
//   TouchableOpacity,
//   Text,
//   StatusBar,
// } from 'react-native';
// import {Provider, useDispatch, useSelector} from 'react-redux';
// // import {
// //   SafeAreaProvider,
// //   initialWindowMetrics,
// // } from 'react-native-safe-area-context';
// import {ChangeTheme} from '../src/action/Action';
// import {myStore} from './store/store';
// import Api from './api';

// const MyApp = () => {
//   const dispatch = useDispatch();
//   const Theme = useSelector(state => state);
//   const theme = Theme.Reducer
//   console.log(theme);
//   const api=()=>{
//     return(
//       <Api/>
//     )
//   }
//   return (
//     // <SafeAreaProvider initialMetrics={initialWindowMetrics}>
//     <View style={{flex: 1}}>
//       {/* <Provider store={myStore}> */}
//         <SafeAreaView
//           style={{
//             flex: 1,
//             backgroundColor: theme == true ? 'white' : 'black',
//             justifyContent: 'center',
//             alignItems: 'center',
//           }}>
//           <StatusBar translucent backgroundColor={(rgba = (0, 0, 0, 0))} />
//           <TouchableOpacity
//             onPress={() => {
//               if (theme == true) {
//                 dispatch(ChangeTheme(false));
//               } else {
//                 dispatch(ChangeTheme(true));
//               }
//             }}
//             // onPress={api}
//             // style={{
//             //   height: 50,
//             //   width: '50%',
//             //   alignItems: 'center',
//             //   justifyContent: 'center',
//             //   backgroundColor: theme == true ? 'black' : 'white',
//             // }}
//             >
//             <Text
//               style={{
//                 color: theme === true ? 'white' : 'black',
//                 fontSize: 15,
//                 fontWeight: 'bold',
//               }}>
//               Change Theme
//             </Text>
//           </TouchableOpacity>
//         </SafeAreaView>
//       {/* </Provider> */}
//     </View>
//     // </SafeAreaProvider>
//   );
// };
// export default MyApp;

import {View, Text, StyleSheet} from 'react-native';
import React, {useState, useEffect} from 'react';
import NetInfo from '@react-native-community/netinfo';

const MyApp = () => {
  const [isConnected, setIsConnected] = useState(false);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      console.log('Connection type', state.type);
      console.log('Is Connected', state.isConnected);
      setIsConnected(state.isConnected);
    });
    return () => {
      unsubscribe();
    };
  }, []);
  return (
    <View style={styles.main}>
      <View
        style={[
          styles.container,
          {backgroundColor: isConnected ? 'green' : 'black'},
        ]}>
        <Text style={{color: 'white'}}>
          {isConnected ? 'Back Online' : 'no Internet Connection'}
        </Text>
      </View>
    </View>
  );
};

export default MyApp;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    position: 'absolute',
    bottom: 0,
    height: 50,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
