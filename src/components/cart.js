import React from 'react';
import { StyleSheet, View, Modal, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Badge } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { SCREEN } from '../constants';
const Cart = (props) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity style={styles.cartContainer} onPress={() => navigation.navigate(SCREEN.CART)}>
      <FontAwesome5 name="shopping-cart" size={wp('6%')} color="#f24f04" />
      <Badge
        value={`${props.number || 0}`}
        status="error"
        containerStyle={{ position: 'absolute', bottom: 26, right: 0, zIndex: 1 }}
      />
    </TouchableOpacity>
  );
};
export default Cart;

const styles = StyleSheet.create({
  cartContainer: {
    height: 55,
    width: 55,
    backgroundColor: '#fff',
    borderRadius: 10,
    position: 'absolute',
    bottom: hp('4%'),
    right: 30,
    justifyContent: 'center',
    alignItems: 'center',
    // float button
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    // zIndex: 100
  }
});
