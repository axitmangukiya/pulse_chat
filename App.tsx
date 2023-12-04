// import { View, Text, SafeAreaView } from 'react-native'
// import React from 'react'
// import { Provider } from 'react-redux'
// import { myStore } from './src/store/store'
// import MyApp from './src'
// // import AppNavigator from './src/Navigation/AppNavigator';
// import AppNavigator from './src/Navigation/AppNavigator';

// const App = () => {
//   return (<AppNavigator />

//     // <View style={{ flex: 1, }}>
//     //   <Message />
//     // </View>

//     // <Provider store={myStore}>
//     // </Provider>
//   )
// }

// export default App

import React from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import 'react-native-gesture-handler';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import Navigation from './src/Navigation/Navigation';

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: 'mistyrose ',
  },
};

const App = () => {
  return (
    <>
      <PaperProvider theme={theme}>
        <StatusBar
          translucent
          backgroundColor={'#0000'}
        />
        <View style={styles.container}>
          <Navigation />
        </View>
      </PaperProvider>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black ',
  },
});

export default App;
