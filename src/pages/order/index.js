import { Text, HStack, Box, View, Pressable, Center } from "native-base";
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableWithoutFeedback, Dimensions, StatusBar, Image, FlatList } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useQuery } from '@apollo/client';
import { TabView, SceneMap } from 'react-native-tab-view';
import { Header } from '../../components';
import { SCREEN } from "../../constants";
import { QUERY } from "../../graphql";
import { moneyUtils, orderUtils } from "../../utils";

const FirstRoute = () => <Center flex={1}><Image source={require('../../../assets/images/no-order.png')} style={{ width: wp('50%'), height: wp('55%') }} /></Center>
const SecondRoute = () => <Center flex={1}><Image source={require('../../../assets/images/no-order.png')} style={{ width: wp('50%'), height: wp('55%') }} /></Center>

const initialLayout = { width: Dimensions.get('window').width };

export default function Order(props) {

  const navigation = useNavigation();
  const { data, refetch } = useQuery(QUERY.GET_ORDER_BY_SHIPPER);

  useEffect(() => {
    navigation.addListener('focus', () => {
      refetch();
    });
  }, []);

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'Đang giao' },
    { key: 'second', title: 'Đã giao' },
  ]);

  const countNumberOfItems = (orderItems) => {
    let count = 0;
    orderItems.forEach(item => {
      count += item.quantity;
    });
    return count;
  }

  const renderItems = (order) => {
    return (
      <TouchableWithoutFeedback onPress={() => {
        if (order.orderStatus !== 'Processing' && order.orderStatus !== 'Shipping') {
          // navigation.navigate(SCREEN.ORDER_DETAIL, { orderId: order.id });
        } else {
          navigation.navigate(SCREEN.ORDER_SHIPPING, { orderId: order._id });
        }
      }}>
        <View>
          <View style={{ paddingHorizontal: wp('5%'), backgroundColor: '#fff', paddingVertical: 10 }} flexDirection='row'>
            <Image source={{ uri: order.orderItems[0].image }} style={{ width: wp('23%'), height: wp('23%') }} />
            <View ml='2'>
              <Text mt='2' bold fontSize='md'>#{order.invoiceNumber}</Text>
              <View mt='1' style={{ flexDirection: 'row', justifyContent: 'space-between', width: wp('63%') }} >
                <Text>x {countNumberOfItems(order.orderItems)} (món)</Text>
                <Text style={{ color: 'red' }}>{moneyUtils.convertVNDToString(order.total)} đ</Text>
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }} mt='2'>
                <Text color={orderUtils.orderStatusColor(order.orderStatus)}>
                  {orderUtils.orderStatus(order.orderStatus)}
                </Text>
                <Text>{order.deliveredAt}</Text>
              </View>
            </View>
          </View>
          <View style={{ height: 1 }}></View>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  const renderOrderDelivered = () => {
    if (data) {
      const deliveredOrders = data.getOrderByShipper.filter(order => order.orderStatus !== 'Processing' && order.orderStatus !== 'Shipping');
      if (deliveredOrders.length === 0) {
        return (
          <View style={{ flex: 1 }}>
            <Center flex={1}>
              <Image source={require('../../../assets/images/no-order.png')} style={{ width: wp('50%'), height: wp('55%') }} />
            </Center>
          </View>
        )
      } else {
        return (
          <FlatList
            data={deliveredOrders}
            renderItem={({ item }) => renderItems(item)}
            keyExtractor={item => item._id}
          />
        )
      }
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Center flex={1}>
            <Image source={require('../../../assets/images/no-order.png')} style={{ width: wp('50%'), height: hp('55%') }} />
          </Center>;
        </View>
      )
    }
  }

  const renderDelivering = () => {
    if (data) {
      const deliveringOrders = data.getOrderByShipper.filter(order => order.orderStatus === 'Processing' || order.orderStatus === 'Shipping');
      if (deliveringOrders.length === 0) {
        return (
          <View style={{ flex: 1 }}>
            <Center flex={1}>
              <Image source={require('../../../assets/images/no-order.png')} style={{ width: wp('50%'), height: wp('55%') }} />
            </Center>
          </View>
        )
      } else {
        return (
          <FlatList
            data={deliveringOrders}
            renderItem={({ item }) => renderItems(item)}
            keyExtractor={item => item._id}
          />
        )
      }
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Center flex={1}>
            <Image source={require('../../../assets/images/no-order.png')} style={{ width: wp('50%'), height: hp('55%') }} />
          </Center>;
        </View>
      )
    }
  }

  const renderSceneNo = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  const renderScene = SceneMap({
    first: renderDelivering,
    second: renderOrderDelivered,
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
      <Header title={"Quản lý đơn hàng"} />
      <TabView
        navigationState={{ index, routes }}
        renderScene={data ? renderScene : renderSceneNo}
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

});