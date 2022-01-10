import { Text, HStack, Box, View, Pressable, Center } from "native-base";
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, Dimensions, StatusBar, Image, FlatList } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useQuery } from '@apollo/client';
import { TabView, SceneMap } from 'react-native-tab-view';
import { Header, HeaderBack } from '../../components';
import { SCREEN } from "../../constants";
import { QUERY } from "../../graphql";
import { moneyUtils, orderUtils } from "../../utils";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import ReportInfo from "./report-info";

const initialLayout = { width: Dimensions.get('window').width };

export default function Report(props) {

  const navigation = useNavigation();

  useEffect(() => {
    navigation.addListener('focus', () => {
      // refetch();
    });
  }, []);

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'Ngày' },
    { key: 'second', title: 'Tháng' },
  ]);

  const renderReportByDay = () => {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.pickTime}>
          <TouchableOpacity style={styles.pickbutton}>
            <Text mr="4" bold fontSize="lg">Chọn ngày 12/11/2022</Text>
            <FontAwesome5 name="calendar-alt" size={21} color="#0ea5e9" />
          </TouchableOpacity>
        </View>
        <ReportInfo data={{}} />
      </View>
    )
  }

  const renderReportByMonth = () => {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.pickTime}>
          <TouchableOpacity style={styles.pickbutton}>
            <Text mr="4" bold fontSize="lg">Chọn tháng 11/2022</Text>
            <FontAwesome5 name="calendar-alt" size={21} color="#0ea5e9" />
          </TouchableOpacity>
        </View>
        <ReportInfo data={{}} />
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

  }

});