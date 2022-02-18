import { Text, FormControl, View, Modal, Button, Input, Select, CheckIcon } from "native-base";
import React, { useState, useCallback } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useMutation, useQuery } from '@apollo/client';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Header, Toast, ButtonCustom } from '../../components';
import { SCREEN } from "../../constants";
import { QUERY, MUTATION } from '../../graphql';
import { moneyUtils, timeUtils } from '../../utils';
import { PROVINCE } from '../../constants';
import DateTimePicker from '@react-native-community/datetimepicker';

const GENDERS = [{
  label: 'Male'
}, {
  label: 'Female'
}]

export default function Store(props) {

  const route = useRoute();

  const [showDate, setShowDate] = useState(false);

  const [gender, setGender] = React.useState(route.params?.user?.gender || '');
  const [address, setAddress] = React.useState(route.params?.user?.address);
  const [birthday, setBirthday] = React.useState(route.params?.user?.birthday || '');
  const [identityNumber, setIdentityNumber] = React.useState(route.params?.user?.identityCard?.number || '');
  const [identityDate, setIdentityDate] = React.useState(route.params?.user?.identityCard?.date || '');
  const [identityPlace, setIdentityPlace] = React.useState(route.params?.user?.identityCard?.place || '');

  const onChangeAddress = (address) => setAddress(address);
  const onChangeIdentityNumber = (identityNumber) => setIdentityNumber(identityNumber);
  const onChangeIdentityDate = (identityDate) => setIdentityDate(identityDate);

  const showPickerDate = useCallback((value) => setShowDate(value), []);

  const onChangeDate = useCallback((event, selectedDate) => {
    const currentDate = selectedDate || birthday;
    setShowDate(false);
    if (event.type === 'set') {
      setBirthday(currentDate);
    }
  }, [birthday, showPickerDate]);

  const navigation = useNavigation();
  return (
    <View style={styles.mainContainer}>
      <Header title={"Cập nhật thông tin"} />
      <ScrollView style={styles.scrollContainer}>
        <Text bold fontSize="md" >Thông tin chung</Text>

        <Text mb="2" mt="2">Họ tên</Text>
        <Input borderColor="#D7D9DB" fontSize="md" isDisabled={true} backgroundColor="#3322" value={route.params?.user.name} />

        <Text mb="2" mt="2">Số điện thoại</Text>
        <Input borderColor="#D7D9DB" fontSize="md" isDisabled={true} backgroundColor="#3322" value={route.params?.user.phoneNumber} />

        <Text mb="2" mt="2">Địa chỉ</Text>
        <Input borderColor="#D7D9DB" fontSize="md" value={address} onChangeText={onChangeAddress} />

        <Text mb="2" mt="2">Ngày sinh</Text>
        <TouchableOpacity onPress={() => showPickerDate(true)} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <FontAwesome5 name="calendar-alt" size={40} color="#D7D9DB" />
          <Input ml="4" minW={"60%"} borderColor="#D7D9DB" fontSize="md" isDisabled={true} backgroundColor="#3322" value={timeUtils.convertDate(birthday)} />
        </TouchableOpacity>
        <Text mb="2" mt="2">Giới tính</Text>
        <Select selectedValue={gender}
          borderColor="#B2B6BB"
          height="50"
          minWidth="200"
          mb="4"
          fontSize="md"
          accessibilityLabel="Choose Service"
          placeholder="Chọn giới tính" _selectedItem={{
            bg: "teal.600",
            endIcon: <CheckIcon size="5" />
          }} mt={1} onValueChange={itemValue => setGender(itemValue)}>

          {
            GENDERS.map((item, index) => {
              return (<Select.Item key={index} label={`${item.label}`}
                value={`${item.label}`} />)
            })
          }
        </Select>

        <Text bold fontSize="md" mt="2">Chứng minh nhân dân/ CCCD</Text>

        <Text mb="2" mt="2">Số CMND/ CCCD</Text>
        <Input borderColor="#D7D9DB" fontSize="md" onChangeText={onChangeIdentityNumber} value={identityNumber} />

        <Text mb="2" mt="2">Ngày cấp</Text>
        <Input borderColor="#D7D9DB" fontSize="md" onChangeText={onChangeIdentityDate} value={identityDate} />

        <Text mb="2" mt="2">Nơi cấp</Text>
        <Select selectedValue={identityPlace}
          borderColor="#B2B6BB"
          height="50"
          minWidth="200"
          mb="4"
          fontSize="md"
          accessibilityLabel="Choose Service"
          placeholder="Chọn nơi cấp" _selectedItem={{
            bg: "teal.600",
            endIcon: <CheckIcon size="5" />
          }} mt={1} onValueChange={itemValue => setIdentityPlace(itemValue)}>

          {
            PROVINCE.map((item, index) => {
              return (<Select.Item key={index} label={`${item.name_with_type}`}
                value={`${item.name_with_type}`} />)
            })
          }
        </Select>
        {showDate && (
          <DateTimePicker
            testID="dateTimePicker"
            value={birthday || new Date()}
            mode={'date'}
            display="default"
            onChange={onChangeDate}
          />
        )}

        <ButtonCustom title="Lưu thông tin" width="90%" height="6%" />
        <View mb="4"></View>
      </ScrollView>
    </View >
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: wp('5%'),
    marginBottom: hp('6%'),
  }

});