import { Text, Image, Box, View } from "native-base";
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@apollo/client';
import { SCREEN } from '../../constants'
import { InputField, ButtonCustom, Toast, Loading } from '../../components';
import { MUTATION } from "../../graphql";
export default function Register(props) {

  const navigation = useNavigation();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');

  const onChangePhoneNumber = (value) => setPhoneNumber(value);
  const onChangePassword = (value) => setPassword(value);

  const [signUp, { loading }] = useMutation(MUTATION.REGISTER, {
    variables: {
      phoneNumber,
      password,
      role: "buyer"
    },
    onCompleted: (data) => {
      navigation.navigate(SCREEN.AUTH_PHONE, { phoneNumber });
    },
    onError: (error) => {
      Toast(error.message, 'error');
    }
  });


  const register = () => {
    // check required fields
    if (!phoneNumber || !password) {
      Toast('Please fill all fields', "warning");
      return;
    }
    signUp();
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
        />
        <View style={{ marginBottom: hp('4%') }}></View>

        <ButtonCustom title={"Đăng ký"} onPress={register} />
        <View style={styles.haveAccount}>
          <Text fontSize="lg" >Đã có tài khoản?</Text>
          <TouchableOpacity onPress={() => navigation.navigate(SCREEN.LOGIN)} >
            <Text bold fontSize="lg" style={styles.textLink}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>
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