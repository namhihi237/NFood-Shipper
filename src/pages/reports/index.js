import { Text, HStack, Box, View, Pressable, Center } from "native-base";
import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, TouchableOpacity, Dimensions, StatusBar, Image, FlatList } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useQuery } from '@apollo/client';
import { TabView, SceneMap } from 'react-native-tab-view';
import { Header, HeaderBack } from '../../components';
import { SCREEN } from "../../constants";
import { QUERY } from "../../graphql";
import { moneyUtils, orderUtils, timeUtils } from "../../utils";
import * as ImagePicker from 'react-native-image-picker';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import DateTimePicker from '@react-native-community/datetimepicker';
import MonthPicker from 'react-native-month-year-picker';
const initialLayout = { width: Dimensions.get('window').width };

export default function Report(props) {

  const navigation = useNavigation();
  const [type, setType] = useState('DATE');
  const [day, setDay] = useState(new Date());
  const [month, setMonth] = useState(new Date());

  const [showDate, setShowDate] = useState(false);
  const [show, setShow] = useState(false);

  const showPickerDate = useCallback((value) => setShowDate(value), []);
  const showPicker = useCallback((value) => setShow(value), []);


  const onChangeDate = useCallback((event, selectedDate) => {
    const currentDate = selectedDate || day;
    setShowDate(false);
    if (event.type === 'set') {
      setDay(currentDate);
      setType('DATE');
    }
  }, [day, showPickerDate]);

  const onValueChange = useCallback(
    (event, newDate) => {
      const selectedDate = newDate || month;

      showPicker(false);
      if (event === 'dateSetAction') {
        setType('MONTH');
        setMonth(selectedDate);
      }
    },
    [month, showPicker],
  );

  const { data, refetch } = useQuery(QUERY.GET_INCOME, {
    variables: {
      time: type === 'DATE' ? timeUtils.convertDay(day) : timeUtils.convertMonth(month),
      type: type
    },
    fetchPolicy: 'network-only'
  });

  useEffect(() => {
    navigation.addListener('focus', () => {
      refetch();
    });
  }, []);

  const renderInfo = () => {
    return (
      <View style={styles.container}>
        <View style={{ alignItems: 'center' }}>
          <Text bold fontSize="md">{type === 'DATE' ? timeUtils.convertDate(day) : timeUtils.convertMonthYear(month)}</Text>
          <Text bold fontSize="md" mb="4">Tổng tiền thu nhập của bạn</Text>
          <Text color="#f33" bold fontSize="2xl" mb="2">{moneyUtils.convertVNDToString(data?.getIncomesByShipper?.totalShipping)} đ</Text>
        </View>
        <View style={styles.reportLine}>
          <Text fontSize="md">Tiền giao hàng</Text>
          <Text bold fontSize="md">{moneyUtils.convertVNDToString(data?.getIncomesByShipper?.totalShipping)} đ</Text>
        </View>
        <View style={styles.line}></View>
        <View style={styles.reportLine}>
          <Text fontSize="md">Tiền thưởng</Text>
          <Text bold fontSize="md">0 đ</Text>
        </View>
        <View style={styles.line}></View>
        <View style={styles.reportLine}>
          <Text fontSize="md">Tông điểm</Text>
          <Text bold fontSize="md">{data?.getIncomesByShipper?.rewardPoint}</Text>
        </View>
        <View style={styles.line}></View>
      </View >
    );
  }

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'Theo Ngày' },
    { key: 'second', title: 'Theo Tháng' },
  ]);

  const renderReportByDay = () => {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.pickTime}>
          <TouchableOpacity style={styles.pickbutton} onPress={() => setShowDate(true)}>
            <Text mr="4" bold fontSize="lg">Chọn ngày {timeUtils.convertDate(day)}</Text>
            <FontAwesome5 name="calendar-alt" size={21} color="#0ea5e9" />
          </TouchableOpacity>
        </View>
        {
          renderInfo()
        }
      </View>
    )
  }

  const renderReportByMonth = () => {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.pickTime}>
          <TouchableOpacity style={styles.pickbutton} onPress={() => setShow(true)}>
            <Text mr="4" bold fontSize="lg">Chọn tháng {timeUtils.convertMonthYear(month)}</Text>
            <FontAwesome5 name="calendar-alt" size={21} color="#0ea5e9" />
          </TouchableOpacity>
        </View>
        {
          renderInfo()
        }
      </View>
    )
  }

  const renderScene = SceneMap({
    first: renderReportByDay,
    second: renderReportByMonth,
  });

  const renderTabBar = (props) => {
    return (
      <Box flexDirection="row">
        {props.navigationState.routes.map((route, i) => {
          const color = index === i ? '#1f2937' : '#a1a1aa';
          const borderColor = index === i ? 'warning.600' : 'coolGray.200';

          return (
            <Box borderBottomWidth="3" borderColor={borderColor} flex={1} alignItems="center" p="3" cursor="pointer">
              <Pressable
                onPress={() => {
                  setIndex(i);
                  if (i === 0) {
                    setType('DATE');
                    setMonth(new Date());
                  } else {
                    setType('MONTH');
                    setDay(new Date());
                  }
                }}>
                <Text style={{ color }}>{route?.title}</Text>
              </Pressable>
            </Box>
          );
        })}
      </Box>
    )
  };


  return (
    <View style={styles.mainContainer}>
      <Header title={"Thu nhập"} icon="arrow-left" onPress={() => navigation.goBack()} />
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
      />
      {showDate && (
        <DateTimePicker
          testID="dateTimePicker"
          value={day}
          mode={'date'}
          display="default"
          onChange={onChangeDate}
        />
      )}

      {show && (
        <MonthPicker
          onChange={onValueChange}
          value={month}
          maximumDate={new Date()}
          locale="vi"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    display: 'flex',
  },
  pickTime: {

    alignItems: 'center',
    backgroundColor: '#fff',
    justifyContent: 'center',
    borderRadius: 10,
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('2.5%'),
  },
  pickbutton: {
    flexDirection: 'row',
    borderWidth: 1,
    paddingHorizontal: wp('18%'),
    paddingVertical: hp('2%'),
    borderColor: '#D7D9DB',
    borderRadius: 10,
  },
  container: {
    backgroundColor: '#fff',
    marginHorizontal: wp('5%'),
    marginVertical: hp('3%'),
    borderRadius: 10,
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('2%'),

  },
  reportLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  line: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginVertical: hp('2%'),
  }

});