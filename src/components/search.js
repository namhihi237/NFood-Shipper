import React from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const Search = (props) => {

  return (
    <View style={styles.header}>
      <View style={styles.container}>
        <TextInput style={styles.inputText}></TextInput>
        <TouchableOpacity style={styles.button} onPress={props.onPress}>
          <FontAwesome5 name="search" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    height: 58,
    width: wp('90%'),
    marginLeft: wp('5%'),
    backgroundColor: '#D7D9DB',
    borderRadius: 18,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  button: {
    height: 58,
    width: 58,
    borderRadius: 18,
    backgroundColor: '#F24F04',
    justifyContent: 'center',
    alignItems: 'center'
  },
  inputText: {
    height: 58,
    width: '80%',
    fontSize: 18,
  }

});