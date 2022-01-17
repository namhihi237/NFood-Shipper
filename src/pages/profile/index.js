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
import { moneyUtils } from '../../utils';

const noImage = "https://res.cloudinary.com/do-an-cnpm/image/upload/v1637807216/user_ilxv1x.png";
const noUpdate = 'Chưa cập nhật';

export default function Store(props) {

  const { data } = useQuery(QUERY.GET_USER_INFO, {
    variables: {
      role: "shipper"
    },
    fetchPolicy: 'cache-and-network',
  });
  const navigation = useNavigation();
  return (
    <View style={styles.mainContainer}>
      <Header title={"NFood Shipper"} />
      <ScrollView style={{ marginBottom: hp('6%') }}>
        <View style={styles.infoContainer}>
          {data ? (<Image source={{ uri: data?.getUser?.image }} style={styles.image} />) : null}
          <View>
            <Text fontSize="xl">{data?.getUser?.name}</Text>
            <View style={styles.phoneContainer}>
              <Text fontSize="md">{data?.getUser?.phoneNumber}</Text>
              <TouchableOpacity>
                <Text color="#0369a1">Đổi mật khẩu</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.logOut}>
              <Text color="#0369a1">
                Đăng xuất
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.shipping}>
          <Text fontSize="md" mr="4">Giá ship hiện tại:</Text>
          <Text fontSize="md" color="#be123c" bold>{moneyUtils.convertVNDToString(4000)} đ/km</Text>
        </View>

        <TouchableOpacity style={styles.buttonContainer}>
          <Text fontSize="md" mr="4">Xem đánh giá</Text>
          <FontAwesome5 name="angle-right" size={20} color="#0369a1" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonContainerDown}>
          <Text fontSize="md" mr="4">Khai báo vaccine</Text>
          <FontAwesome5 name="angle-right" size={20} color="#0369a1" />
        </TouchableOpacity>

        <View style={styles.info}>
          <Text bold fontSize="md">Ngày sinh:</Text>
          <Text fontSize="md" color="#a8a29e" mb="2">{data?.getUser?.birthday || noUpdate}</Text>

          <Text bold fontSize="md">Số CMND/ CCCD:</Text>
          <Text fontSize="md" color="#a8a29e" mb="2">{data?.getUser?.identityCard?.number || noUpdate}</Text>

          <Text bold fontSize="md">Nơi cấp:</Text>
          <Text fontSize="md" color="#a8a29e" mb="2">{data?.getUser?.identityCard?.place || noUpdate}</Text>

          <Text bold fontSize="md">Ngày cấp:</Text>
          <Text fontSize="md" color="#a8a29e" mb="2">{data?.getUser?.identityCard?.date || noUpdate}</Text>

          <Text bold fontSize="md">Ảnh chụp CMND/CCCD:</Text>
          <Text fontSize="md" color="#a8a29e" mb="2">{noUpdate}</Text>

          <TouchableOpacity style={styles.updateButton}>
            <Text color="#0369a1" fontSize="xl" mr="4">Chỉnh sửa thông tin</Text>
            <FontAwesome5 name="angle-right" size={20} color="#0369a1" />
          </TouchableOpacity>
        </View>

        <View style={styles.creditCard}>
          <Text fontSize="md" mr="4" bold>Thẻ tín dụng:</Text>
          <View style={styles.card}>
            <Text fontSize="md" color="#a8a29e" mb="2">{data?.getUser?.creditCard?.number || noUpdate}</Text>
            {
              !data?.getUser?.creditCard?.number ? (<TouchableOpacity>
                <Text color="#0369a1" fontSize="md">Thêm thẻ tín dụng</Text>
              </TouchableOpacity>) : null
            }
          </View>
        </View>
      </ScrollView>
    </View >
  );
}

const styles = StyleSheet.create({
  image: {
    height: 100,
    width: 100,
    borderRadius: 50,
    marginRight: 20,
  },
  infoContainer: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('2%'),
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    justifyContent: 'space-between',
    width: wp('60%'),
  },
  logOut: {
    marginTop: 20,
  },
  shipping: {
    flexDirection: 'row',
    paddingHorizontal: wp('5%'),
    backgroundColor: '#fff',
    marginTop: 3,
    paddingVertical: hp('2%'),
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: wp('5%'),
    backgroundColor: '#fff',
    marginTop: 10,
    paddingVertical: hp('2%'),
    justifyContent: 'space-between',
  },
  buttonContainerDown: {
    flexDirection: 'row',
    paddingHorizontal: wp('5%'),
    backgroundColor: '#fff',
    marginTop: 3,
    paddingVertical: hp('2%'),
    justifyContent: 'space-between',
  },
  info: {
    backgroundColor: '#fff',
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('2%'),
    marginTop: 10,
  },
  updateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  creditCard: {
    backgroundColor: '#fff',
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('2%'),
    marginTop: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  }
});