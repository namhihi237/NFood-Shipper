import { Text, View, Select, CheckIcon } from "native-base";
import React from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation, useRoute } from '@react-navigation/native';
import { BANKS } from "../../constants";
import { Header, ButtonCustom, Toast } from '../../components';
import {  MUTATION } from '../../graphql';
import { useMutation } from '@apollo/client';

export default function AddBank(props) {
  const navigation = useNavigation();
  const route = useRoute();

  const [bankName, setBankName] = React.useState(route.params?.bank?.bankName || '');
  const [accountNumber, setAccountNumber] = React.useState(route.params?.bank?.accountNumber || '');
  const [accountName, setAccountName] = React.useState(route.params?.bank?.accountName || '');

  const onChangeAccountName = (value) => {
    setAccountName(value);
  }
  const onChangeAccountNumber = (value) => setAccountNumber(value);

  const [addBank] = useMutation(MUTATION.ADD_BANK, {
    variables: {
      bankName,
      accountNumber,
      accountName: accountName.toUpperCase(),
      type: 'shipper'
    },
    onCompleted: () => {
      Toast('Thêm thành công', 'success', 'top-right');
      navigation.goBack();
    },
    onError: (error) => {
      Toast(error.message, 'danger', 'top-right');
    },
  })

  const addBankAccount = () => {
    if (!bankName || !accountName || !accountNumber) {
      Toast('Vui lòng nhập đầy đủ thông tin', 'danger', 'top-right');
      return;
    }
    addBank();
  }

  return (
    <View style={styles.infoStore}>
      <Header title={"Thêm tài khoản ngân hàng"} icon="arrow-left" onPress={() => navigation.goBack()} />
      <View style={styles.container}>

        <View>
          <Text mb="2" style={styles.title}>Tên ngân hàng</Text>
          <View >
            <Select selectedValue={bankName}
              borderColor="#B2B6BB"
              height="50"
              minWidth="200"
              accessibilityLabel="Choose Service"
              placeholder="Chọn ngân hàng" _selectedItem={{
                bg: "teal.600",
                endIcon: <CheckIcon size="5" />
              }} mt={1} onValueChange={itemValue => setBankName(itemValue)}>

              {
                BANKS.map((item, index) => {
                  return (<Select.Item key={index} label={`${item.vn_name} - ${item.shortName}`}
                    value={`${item.vn_name} - ${item.shortName}`} />)
                })
              }
            </Select>
          </View>

          <Text mt="4" mb="2">Số tài khoản</Text>
          <TextInput
            style={styles.TextInput}
            keyboardType="numeric"
            placeholder="Số tài khoản"
            onChangeText={onChangeAccountNumber}
            value={accountNumber}
            placeholderTextColor="#959BA4" />

          <Text mt="4" mb="2">Tên chủ tài khoản</Text>
          <TextInput
            style={styles.TextInput}
            onChangeText={onChangeAccountName}
            value={accountName}
            placeholder="Tên chủ tài khoản, không dấu"
            placeholderTextColor="#959BA4" />

        </View>

        <ButtonCustom title="Lưu thông tin" width="90%" height="6%"
          onPress={addBankAccount} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  infoStore: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: wp('5%'),
    justifyContent: 'space-between',
    paddingVertical: hp('2%'),

  },
  TextInput: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#B2B6BB',
    height: 50,
    color: '#000',
    paddingHorizontal: 10,
  },
  textBank: {
    borderColor: '#B2B6BB',
  },
  bankNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: '#B2B6BB',
    borderWidth: 1,
    borderRadius: 5,
    height: 50,
    paddingHorizontal: 10,
  }
});