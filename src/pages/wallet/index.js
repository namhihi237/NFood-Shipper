import { Text, Image, Box, View, Switch, Button, Modal, FormControl, Input } from "native-base";
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useQuery } from '@apollo/client';
import { WebView } from 'react-native-webview';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { InputField, ButtonCustom, Toast, Loading, Header } from '../../components';
import { QUERY } from "../../graphql";
import { moneyUtils, orderUtils } from "../../utils";
import { SCREEN } from "../../constants"
import axios from 'axios';
import { storageUtils } from '../../utils';
const url = 'https://nfood-api.southeastasia.cloudapp.azure.com/api/v1/payment/deposit';

export default function Wallet(props) {

  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState(0);
  const [urlPayment, setUrlPayment] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [showModal1, setShowModal1] = React.useState(false);

  const onChangeAmount = (value) => setAmount(value);

  const { data, refetch } = useQuery(QUERY.GET_REPORT, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      console.log(data);
    }
  });

  const depositMoney = async () => {

    if (amount <= 0 || !amount) {
      Toast('Vui lòng nhập số tiền cần nạp', 'danger', 'top-right');
      return;
    }

    try {
      const token = await storageUtils.getString('token');
      const { data } = await axios.post(`${url}`, {
        amount,
        type: 'shipper'
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setUrlPayment(data.url);
      setShowModal1(true);
      return
    } catch (error) {
      Toast('Có lỗi xảy ra, vui lòng thử lại sau', 'danger', 'top-right');
    }
  }


  const handleResponse = data => {
    if (data.title === "success") {
      setShowModal(false);
      setShowModal1(false);
      Toast("Nạp tiền thành công", "success", "top-right");
      refetch();
    } else if (data.title === "cancel") {
      Toast("Nạp tiền thất bại, thử lại", "danger", "top-right");
      setShowModal1(false);
      setShowModal(false);
    } else {
      return;
    }
  };


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
            <Text color="#F24F04" fontSize="md">{moneyUtils.convertVNDToString(data?.getReportsByShipper?.deliveryMoney)} đ</Text>
          </View>
          <View style={styles.line}></View>
          <View style={styles.lineReport}>
            <Text fontSize="md">Tổng mua hàng</Text>
            <Text color="#F24F04" fontSize="md">{moneyUtils.convertVNDToString(data?.getReportsByShipper?.buyOrderMoney)} đ</Text>
          </View>
          <View style={styles.line}></View>
          <View style={styles.lineReport}>
            <Text fontSize="md">Tiền thưởng</Text>
            <Text color="#F24F04" fontSize="md">{moneyUtils.convertVNDToString(data?.getReportsByShipper?.rewardMoney)} đ</Text>
          </View>
          <View style={styles.line}></View>
          <View style={styles.lineReport}>
            <Text fontSize="md">Số dư trong ví</Text>
            <Text color="#F24F04" fontSize="md">{moneyUtils.convertVNDToString(data?.getReportsByShipper?.balanceWallet)} đ</Text>
          </View>
          <View style={styles.line}></View>
          <View style={styles.lineReport}>
            <Text fontSize="md" >Tổng đơn đã giao</Text>
            <Text color="#F24F04" fontSize="md" >{data?.getReportsByShipper?.totalOrder}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.button}>
          <FontAwesome5 name="wallet" size={hp("3.2%")} color="#444251" />
          <Text ml="4" color="#fff" bold fontSize="md">Rút tiền khỏi ví</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => setShowModal(true)}>
          <FontAwesome5 name="wallet" size={hp("3.2%")} color="#444251" />
          <Text ml="4" color="#fff" bold fontSize="md">Nạp tiền vào ví</Text>
        </TouchableOpacity>
      </View>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg">
        <Modal.Content maxWidth="350">
          <Modal.CloseButton />
          <Modal.Header>Nạp tiền vào ví</Modal.Header>
          <Modal.Body>
            <FormControl>
              <FormControl.Label>Nhập số tiền cần nạp (VND)</FormControl.Label>
              <Input onChangeText={onChangeAmount} />
            </FormControl>
          </Modal.Body>
          <Modal.Footer>
            <Button
              flex="1"
              onPress={() => {
                depositMoney();
              }}
            >
              Continue
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>

      <Modal isOpen={showModal1} onClose={() => setShowModal1(false)}>
        <Modal.Content maxWidth="500px">
          <Modal.CloseButton />
          <Modal.Body minHeight="600px">
            <WebView
              source={{ uri: urlPayment }}
              style={{ marginTop: 20 }}
              onNavigationStateChange={(event) => handleResponse(event)}
            />
          </Modal.Body>
        </Modal.Content>
      </Modal>
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