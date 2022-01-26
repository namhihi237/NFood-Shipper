import { Text, View } from "native-base";
import React, { useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useMutation } from '@apollo/client';
import { SCREEN } from '../../constants'
import { InputField, ButtonCustom, Toast, Loading } from '../../components';
import { MUTATION } from "../../graphql";
export default function UpdatePassword(props) {

  const navigation = useNavigation();
  const route = useRoute();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const onChangePassword = (value) => setPassword(value);
  const onChangeConfirmPassword = (value) => setConfirmPassword(value);

  const [updatePassword] = useMutation(MUTATION.UPDATE_PASSWORD, {
    variables: {
      password,
      code: route.params.code,
    },
    onCompleted: (data) => {
      Toast('Cập nhật mật khẩu thành công', 'success', 'top-right');
      navigation.navigate(SCREEN.LOGIN);
    }
  });

  const updatePasswordHandler = async () => {

    if (!password) {
      Toast.show('Nhập mật khẩu của bạn');
      return;
    }

    if (password !== confirmPassword) {
      Toast.show('Mật khẩu không khớp');
      return;
    }
    await updatePassword();
  }

  return (
    <ScrollView style={styles.container}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
    >
      <Loading status={loading} message={'Đăng ký'} />
      < View style={styles.mainContainer} >
        <Text fontSize="3xl" bold style={styles.title}>Đăng Ký tài khoản</Text>
        <InputField
          iconName={"mobile-alt"}
          placeholder="09xxxxxxx9"
          onChangeText={onChangePhoneNumber}
        />
        <InputField
          iconName={"lock"}
          secureTextEntry={true}
          placeholder="************"
          onChangeText={onChangePassword}
        />
        <InputField
          iconName={"lock"}
          secureTextEntry={true}
          placeholder="************"
          onChangeText={onChangeConfirmPassword}
        />
        <View style={{ marginBottom: hp('4%') }}></View>

        <ButtonCustom title={"Cập nhật mật khẩu"} onPress={updatePasswordHandler} />
      </View >

    </ScrollView >
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    paddingLeft: wp("5%"),
    paddingRight: wp("5%"),
    display: 'flex',
  },
  mainContainer: {
    justifyContent: 'center',
    height: hp('95%'),
    alignItems: 'center',
  },
  title: {
    marginBottom: hp('5%'),
  },
  form: {
    justifyContent: "center",
    alignItems: "center",
  },
  textDetail: {
    color: '#B2B6BB',
    marginBottom: hp('2%'),
    marginTop: hp('10%'),
  },

  buttonContainer: {
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'space-between',
    width: wp('90%'),
    marginTop: hp('5%'),
  },
  haveAccount: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: hp('3%'),

  },
  textLink: {
    color: '#F24F04',
    marginLeft: wp('2%'),
  }

});