import { Text, View } from "native-base";
import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@apollo/client';

import { InputField, ButtonCustom, Toast, Loading } from '../../components';
import { SCREEN } from "../../constants";
import { MUTATION, QUERY } from '../../graphql';
import _ from 'lodash';

export default function ActiveShipper(props) {
  const navigation = useNavigation();
  let [name, setName] = React.useState("");

  const onChangeName = value => setName(value);


  const activeShipper = () => {
    if (!name) {
      Toast("Vui lòng nhập đầy đủ thông tin", "danger", "top-right");
      return;
    }
  }

  return (
    <ScrollView style={styles.container}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.mainContainer}>
        {/* <Loading loading={loading} /> */}
        <View>
          <View style={{ alignItems: 'center', marginTop: hp("5%"), marginBottom: 30 }}>
            <Text fontSize="2xl" bold>Đăng ký người giao hàng</Text>
          </View>
          <Text bold>Nhập tên đầy đủ của bạn (*)</Text>
          <InputField width="90%" onChangeText={onChangeName} />

        </View>
        <View style={{ alignItems: 'center' }}>
          <ButtonCustom title={"Giao hàng ngay"} width="90%" onPress={activeShipper} />
        </View>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#fff',
    flex: 1,
    height: hp("96%"),
    paddingLeft: wp("5%"),
    paddingRight: wp("5%"),
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: hp("5%")
  },

});