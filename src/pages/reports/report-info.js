import { Text, Box, View, Switch } from "native-base";
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, Image, TouchableWithoutFeedback } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useQuery } from '@apollo/client';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { InputField, ButtonCustom, Toast, Loading, Header } from '../../components';
import { SCREEN } from "../../constants";
import { QUERY, client } from '../../graphql';
import { display, flexDirection } from "styled-system";


export default function ReportInfo(props) {

  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={{ alignItems: 'center' }}>
        <Text bold fontSize="md">Ngày 22/12/2022</Text>
        <Text bold fontSize="md" mb="4">Tổng tiền thu nhập của bạn</Text>
        <Text color="#f33" bold fontSize="2xl" mb="2">10000 đ</Text>
      </View>
      <View style={styles.reportLine}>
        <Text fontSize="md">Tiền giao hàng</Text>
        <Text bold fontSize="md">0 đ</Text>
      </View>
      <View style={styles.line}></View>
      <View style={styles.reportLine}>
        <Text fontSize="md">Tiền thưởng</Text>
        <Text bold fontSize="md">0 đ</Text>
      </View>
      <View style={styles.line}></View>
      <View style={styles.reportLine}>
        <Text fontSize="md">Tông điểm</Text>
        <Text bold fontSize="md">0</Text>
      </View>
      <View style={styles.line}></View>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginHorizontal: wp('5%'),
    marginVertical: hp('3%'),
    borderRadius: 10,
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('2%'),

  },
  reportLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  line: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginVertical: hp('2%'),
  }
});