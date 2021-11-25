import { Text, Image, Box, View } from "native-base";
import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SCREEN } from "../../constants";
import { ButtonCustom, InputAuth, Toast, Loading } from '../../components';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useMutation } from '@apollo/client';
import { MUTATION } from '../../graphql';
import { storageUtils } from '../../utils';

const delay = 120;

export default function AuthPhone(props) {
  const navigation = useNavigation();
  const route = useRoute();

  const [number1, setNumber1] = useState('');
  const [number2, setNumber2] = useState('');
  const [number3, setNumber3] = useState('');
  const [number4, setNumber4] = useState('');

  const ref_input2 = useRef();
  const ref_input3 = useRef();
  const ref_input4 = useRef();

  const [timerLeft, setTimerLeft] = useState(delay);

  useEffect(() => {
    if (!timerLeft) {
      return;
    }
    const interval = setInterval(() => {
      setTimerLeft(timerLeft - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timerLeft]);

  const onChangeNumber1 = (number) => {
    setNumber1(number);
    if (number != '') {
      ref_input2.current.focus();
    }
  }
  const onChangeNumber2 = (number) => {
    setNumber2(number)
    if (number != '') {
      ref_input3.current.focus();
    }
  }

  const onChangeNumber3 = (number) => {
    setNumber3(number);
    if (number != '') {
      ref_input4.current.focus();
    }
  }
  const onChangeNumber4 = (number) => setNumber4(number);

  // resendCode mutation
  const [resendCode] = useMutation(MUTATION.RESEND_CODE, {
    variables: {
      phoneNumber: route.params?.phoneNumber || ""
    },
    onCompleted: (data) => {
      setTimerLeft(delay);
    },
    onError: (error) => {
      Toast(error.message, "warning");
    }
  });

  // active account mutation
  const [activePhoneNumber, { loading }] = useMutation(MUTATION.ACTIVE_PHONE_NUMBER, {
    variables: {
      phoneNumber: route.params?.phoneNumber || "",
      code: number1 + number2 + number3 + number4
    },
    onCompleted: async (data) => {
      Toast("Tài khoản đã được kích hoạt", "success");
      // navigation.navigate(SCREEN.REGISTER_BUYER);
      await storageUtils.setString("token", data.activePhoneNumber.token);
      await storageUtils.setObject("user", data.activePhoneNumber.user);
    },
    onError: (error) => {
      Toast(error.message, "warning");
    }
  });

  const sendCode = () => {
    if (number1 == '' || number2 == '' || number3 == '' || number4 == '') {
      Toast("Vui lòng nhập mã", "warning");
      return;
    }
    activePhoneNumber();
  }

  return (
    <ScrollView style={styles.container} contentInsetAdjustmentBehavior="automatic" showsVerticalScrollIndicator={false}>
      <Loading status={loading} message={'Đang xác thực'} />
      <Box style={styles.box}>
        <Image
          source={require("../../../assets/images/logo.png")}
          style={styles.logo}
          alt="Alternate Text"
        ></Image>
        <View style={styles.form}>
          <Text fontSize="xl" bold >NFoodFast</Text>
          <Text fontSize="md" style={styles.textDetail} >Dịch vụ giao đồ ăn nhanh</Text>
        </View>
      </Box>

      <Text fontSize="2xl" bold>Nhập mã của bạn</Text>
      <Text fontSize="lg" style={styles.textDetail} >Nhập mã chúng tôi vừa gửi</Text>
      {
        timerLeft ? (<Text fontSize="lg" style={styles.textDetail} >
          Mã sẽ hết hạn sau <Text fontSize="lg" style={{ color: "red", fontSize: 14 }}>{timerLeft}</Text> giây
        </Text>) : null
      }
      <InputAuth
        ref2={ref_input2}
        ref3={ref_input3}
        ref4={ref_input4}
        onChangeText1={onChangeNumber1}
        onChangeText2={onChangeNumber2}
        onChangeText3={onChangeNumber3}
        onChangeText4={onChangeNumber4}
      />
      <TouchableOpacity style={styles.resendCode} onPress={resendCode} >
        <Text fontSize="lg" style={{ color: '#F24F04' }} underline bold>Gửi lại code</Text>
      </TouchableOpacity>
      <ButtonCustom title={"Tiếp Tục"} width={"92%"} height={"7%"} onPress={sendCode} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    paddingLeft: wp("4%"),
    paddingRight: wp("4%"),
  },
  box: {
    alignItems: "center",
    marginBottom: hp('5%'),
  },
  logo: {
    width: 120,
    height: 120,
    marginTop: hp('10%'),
  },
  form: {
    marginTop: hp('2%'),
    justifyContent: "center",
    alignItems: "center",
  },
  textDetail: {
    color: '#B2B6BB',
    fontSize: 16
  },

  resendCode: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    marginBottom: hp("15%"),
  }

});