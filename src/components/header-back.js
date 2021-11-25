import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
// import { Text } from 'native-base';
import { storageUtils } from '../utils'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SCREEN } from '../constants';
const HeaderBack = (props) => {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <View style={styles.buttonTitle}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FontAwesome5 name="chevron-left" size={24} color="#444251" />
        </TouchableOpacity>
        <Text style={styles.text}>{props.title}</Text>
      </View>
      <View style={styles.right}>
        {props.button ? (<TouchableOpacity>
          <Text fontSize="xl" bold>{props.button}</Text>
        </TouchableOpacity>) : null}
      </View>
    </View>
  );
};

export default HeaderBack;

const styles = StyleSheet.create({
  header: {
    height: hp('6%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    display: 'flex',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
    backgroundColor: '#fff',
  },
  buttonTitle: {
    flexDirection: 'row',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    marginLeft: 18,
    color: '#444251',
    fontFamily: 'SF-UI-Text-Semibold',
    fontWeight: "bold",
    fontSize: hp('2%'),
  },
  backButton: {
    height: hp('4%'),
    width: hp('4%'),
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#B2B6BB'
  },
  right: {
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: wp('18%'),
  },

});