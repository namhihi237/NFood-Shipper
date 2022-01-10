import { Text, Image, Box, View, Switch } from "native-base";
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@apollo/client';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { InputField, ButtonCustom, Toast, Loading, Header } from '../../components';
import { SCREEN } from "../../constants"
export default function Wallet(props) {

  const navigation = useNavigation();
  return (
    <View style={styles.mainContainer}>
      <Header title={"NFood Shipper"} />
      <View >
        <TouchableOpacity style={styles.incomeContainer} onPress={() => navigation.navigate(SCREEN.REPORT)}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <FontAwesome5 name="chart-line" size={hp("3.2%")} color="green" />
            <Text ml="4" fontSize="lg">Thống kê thu nhập của bạn</Text>
          </View>
          <FontAwesome5 name="angle-right" size={hp("3.2%")} color="#444251" />
        </TouchableOpacity>

        <View style={styles.reportContainer}>
          <View style={styles.lineReport}>
            <Text fontSize="md">Tiền giao hàng</Text>
            <Text color="#F24F04" fontSize="md">0 đ</Text>
          </View>
          <View style={styles.line}></View>
          <View style={styles.lineReport}>
            <Text fontSize="md">Tổng mua hàng</Text>
            <Text color="#F24F04" fontSize="md">0 đ</Text>
          </View>
          <View style={styles.line}></View>
          <View style={styles.lineReport}>
            <Text fontSize="md">Tiền thưởng</Text>
            <Text color="#F24F04" fontSize="md">0 đ</Text>
          </View>
          <View style={styles.line}></View>
          <View style={styles.lineReport}>
            <Text fontSize="md">Số dư trong ví</Text>
            <Text color="#F24F04" fontSize="md">0 đ</Text>
          </View>
          <View style={styles.line}></View>
          <View style={styles.lineReport}>
            <Text fontSize="md" bold>Tổng cộng</Text>
            <Text color="#F24F04" fontSize="md" bold>0 đ</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.button}>
          <FontAwesome5 name="wallet" size={hp("3.2%")} color="#444251" />
          <Text ml="4" color="#fff" bold fontSize="md">Rút tiền khỏi ví</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <FontAwesome5 name="wallet" size={hp("3.2%")} color="#444251" />
          <Text ml="4" color="#fff" bold fontSize="md">Nạp tiền vào ví</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    display: 'flex',
  },
  incomeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp("3%"),
    paddingVertical: hp("2.5%"),
    borderRadius: 10,
    marginHorizontal: wp('4%'),
    backgroundColor: '#fff',
    marginTop: hp('2'),
  },
  reportContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: wp("3%"),
    paddingVertical: hp("2.5%"),
    borderRadius: 10,
    marginHorizontal: wp('4%'),
    marginTop: hp('3.5%'),
  },
  lineReport: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  line: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginTop: hp('2%'),
    marginBottom: hp('2%'),
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
    marginHorizontal: wp('10%'),
    paddingHorizontal: wp("7%"),
    borderRadius: 10,
    paddingVertical: hp("1%"),
    marginTop: hp('3%'),
  }

});