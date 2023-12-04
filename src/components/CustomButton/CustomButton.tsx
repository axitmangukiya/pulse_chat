import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import COLORS from '../../utils/colors';

const CustomButton = ({title, onPress = () => {}}:any) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={styles.Button}>
      <Text style={styles.BtnText}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  Button: {
    height: 50,
    width: '100%',
    backgroundColor: COLORS.blue,
    marginVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  BtnText: {color: COLORS.white, fontWeight: 'bold', fontSize: 18},
});
