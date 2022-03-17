import { Text, View } from "native-base";
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useMutation } from '@apollo/client';
import { MUTATION } from "../../graphql";
import { InputField, ButtonCustom, Toast, Loading } from '../../components';
import { SCREEN } from "../../constants"
export default function Forgot(props) {

  const navigation = useNavigation();
  const route = useRoute();

  const [phoneNumber, setPhoneNumber] = useState('');

  const onChangePhoneNumber = (value) => setPhoneNumber(value);

  const [getCode] = useMutation(MUTATION.FORGOT_PASSWORD, {
    variables: {
      phoneNumber
    },
    onCompleted: (data) => {
      Toast('Gửi mã xác nhận thành công', 'success', 'top-right');
    },
    onError: (error) => {
      Toast(error.message, 'danger', 'top-right');
    }
  });

  const getCodeHandler = async () => {
    if (phoneNumber == '') {
      Toast('Vui lòng nhập số điện thoại');
      return;
    }
    await getCode();
    navigation.navigate(SCREEN.CHECK_CODE, { phoneNumber });

  }


  return (
    <ScrollView style={styles.container}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.mainContainer}>
        <Text fontSize="3xl" bold style={styles.title}>Lấy lại mật khẩu</Text>
        <InputField
          iconName={"mobile-alt"}
          placeholder="09xxxxxxx9"
          onChangeText={onChangePhoneNumber}
          value={phoneNumber}
          keyboardType="number-pad"
        />
        <ButtonCustom title={"Lấy mã"} onPress={getCodeHandler} />
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    display: 'flex',
  },
  mainContainer: {
    justifyContent: 'center',
    height: hp('100%'),
    alignItems: 'center',
  },
  title: {
    marginBottom: hp('5%'),
  },

});