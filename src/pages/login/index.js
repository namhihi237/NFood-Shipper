import { Text, Image, Box, View, Switch } from "native-base";
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@apollo/client';
import { MUTATION } from "../../graphql";
import { InputField, ButtonCustom, Toast, Loading } from '../../components';
import { SCREEN } from "../../constants"
import { storageUtils } from "../../utils"
export default function Login(props) {

  const navigation = useNavigation();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');

  const onChangePhoneNumber = (value) => setPhoneNumber(value);
  const onChangePassword = (value) => setPassword(value);
  const [check, setCheck] = useState(false);

  const getCheck = async () => {
    let check;
    if (await storageUtils.getString('check')) {
      check = true;
      let phoneNumber = await storageUtils.getString('phoneNumber');
      let password = await storageUtils.getString('password');

      setPhoneNumber(phoneNumber);
      setPassword(password);
    } else {
      check = false;
    }
    setCheck(check);
  };

  const saveInfo = () => {
    setCheck(!check);
    if (check) {
      storageUtils.setString('check', '');
      storageUtils.setString('email', '');
      storageUtils.setString('password', '');
    } else {
      storageUtils.setString('check', '1');
    }
  };

  useEffect(() => {
    getCheck();
  }, []);


  const [loginMutation, { loading }] = useMutation(MUTATION.LOGIN, {
    variables: {
      phoneNumber,
      password
    },
    onCompleted: async (data) => {
      Toast('Đăng nhập thành công', 'success', 'top-right');
      await storageUtils.setString('token', data.login.token);
      if (data.login.user.isBuyer) {
        navigation.navigate(SCREEN.TAB);
      } else {
        navigation.navigate(SCREEN.REGISTER_BUYER);
      }
    },
    onError: (error) => {
      Toast(error.message, 'danger');
      if (error.message.includes("active")) {
        navigation.navigate(SCREEN.AUTH_PHONE, { phoneNumber });
      }
    }
  })
  const login = () => {
    // check required fields
    if (!phoneNumber || !password) {
      Toast('Vui lòng nhập đầy đủ thông tin', 'danger');
      return;
    }
    storageUtils.setString('phoneNumber', phoneNumber);
    storageUtils.setString('password', password);
    loginMutation();
  }

  return (
    <ScrollView style={styles.container}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
    >
      <Loading status={loading} message={'Đăng nhập'} />
      <View style={styles.mainContainer}>
        <Text fontSize="3xl" bold style={styles.title}>Đăng nhập</Text>
        <InputField
          iconName={"mobile-alt"}
          placeholder="09xxxxxxx9"
          onChangeText={onChangePhoneNumber}
          value={phoneNumber}
        />
        <InputField
          iconName={"lock"}
          secureTextEntry={true}
          placeholder="************"
          value={password}
          onChangeText={onChangePassword}
        />
        <View style={styles.saveMeContainer}>
          <View style={styles.saveMe}>
            <Switch
              offTrackColor="#FCC342"
              onTrackColor="#FCC342"
              onThumbColor="#FCC342"
              offThumbColor="#FCC342"
              size="md"
              onToggle={saveInfo}
              isChecked={check}
            />
            <Text fontSize="md" style={styles.textColor} bold>Lưu mật khẩu</Text>
          </View>
          <TouchableOpacity>
            <Text fontSize="md" style={styles.textColor} bold>Quên mật khẩu?</Text>
          </TouchableOpacity>
        </View>


        <ButtonCustom title={"Đăng nhập"} onPress={login} />
        <View style={styles.haveAccount}>
          <Text fontSize="lg" >Chưa có tài khoản?</Text>
          <TouchableOpacity onPress={() => navigation.navigate(SCREEN.REGISTER)}>
            <Text bold fontSize="lg" style={styles.textLink}>Đăng ký</Text>
          </TouchableOpacity>
        </View>
      </View>

    </ScrollView>
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
    paddingTop: hp('15%'),
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
    marginTop: hp('25%'),

  },
  textLink: {
    color: '#F24F04',
    marginLeft: wp('2%'),
  },
  textColor: {
    color: "#444251"
  },
  saveMe: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveMeContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('5%'),
    width: wp('80%'),
  }
});