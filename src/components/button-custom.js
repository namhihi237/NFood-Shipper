import React from 'react';
import { Text } from 'native-base';
import { StyleSheet, TouchableOpacity } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const ButtonCustom = (props) => {
  const width = props.width ? wp(props.width) : wp('80%');
  const height = props.height ? hp(props.height) : hp('8%');
  return (
    <TouchableOpacity style={{ ...styles.btn, ...props.style, width, height }} onPress={props.onPress} >
      <Text fontSize="xl" bold style={styles.text}>{props.title}</Text>
    </TouchableOpacity>
  );
};
export default ButtonCustom;

const styles = StyleSheet.create({
  btn: {
    backgroundColor: '#F24F04',
    height: hp('8%'),
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.9,
    elevation: 7,
    shadowOffset: { width: 1, height: 13 },
  },
  text: {
    color: '#fff',
  },
});
