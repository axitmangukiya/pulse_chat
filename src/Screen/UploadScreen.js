import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';

const UploadScreen = () => {
  const [picImage, setPicImage] = useState(null);

  let Options = {
    Storageoption: {},
    saveToPhotos: true,
    mediaType: 'mixed',
    quality: 1,
  };

  const image = async () => {
    const result = await launchImageLibrary(Options);
    if (result.didCancel && result.didCancel == true) {
    } else {
      setPicImage(result);
      uploadimage(result);
      console.log(result);
    }
  };

  const uploadimage = async () => {
    if (picImage && picImage.assets) {
      const refrences = storage().ref(picImage.assets[0].fileName);
      const pathTofile = picImage.assets[0].uri;
      await refrences
        .putFile(pathTofile)
        .then(res => console.log('res', res))
        .catch(e => console.log('e', e));
      console.log(picImage.assets[0].fileName, pathTofile);
    }
    const url = await storage()
      .ref(picImage.assets[0].fileName)
      .getDownloadURL();
    console.log(url);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent backgroundColor={(rgba = (0, 0, 0, 0))} />
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {picImage !== null ? (
          <Image
            source={{uri: picImage.assets[0].uri}}
            style={{height: 400, width: '100%', margin: 10}}
            resizeMode={'cover'}
          />
        ) : null}
        <TouchableOpacity style={styles.Button} onPress={image}>
          <Text style={{color: 'white', fontSize: 20, fontWeight: '500'}}>
            PicImage
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.Button, {marginTop: 5}]}
          onPress={uploadimage}>
          <Text style={{color: 'white', fontSize: 20, fontWeight: '500'}}>
            UploadImage
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default UploadScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  Button: {
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    height: 50,
    width: '50%',
  },
});
