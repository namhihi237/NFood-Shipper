import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useLazyQuery, useQuery } from '@apollo/client';
import { MUTATION, QUERY } from '../../graphql';
import { locationGPS } from "../../recoil";
import { useRecoilState, useRecoilValue } from "recoil";
import { InputField, ButtonCustom, Toast, Loading, Header } from '../../components';
import { SCREEN } from "../../constants";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { timeUtils, GPSUtils, moneyUtils } from "../../utils";
import MapView, { PROVIDER_GOOGLE, Marker, Circle } from 'react-native-maps';

import { Text, Button, Switch, View, Modal, HStack, VStack } from "native-base";
export default function Home(props) {

  const [isShippingOrder, setIsShippingOrder] = useState(false);
  const [showModal, setShowModal] = React.useState(false)
  const [order, setOrder] = React.useState(null);
  const [location, setLocation] = useRecoilState(locationGPS);


  const { data } = useQuery(QUERY.GET_USER_INFO, {
    variables: { role: 'shipper' },
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      if (data.getUser) {
        setIsShippingOrder(data.getUser.isShippingOrder);
      }
    }
  });

  const { data: orders } = useQuery(QUERY.GET_ORDERS_PENDING, {
    pollInterval: 5000,
    fetchPolicy: 'network-only'
  });

  const renderOrderOnMap = () => {
    if (orders.getOrderByDistances) {
      return orders.getOrderByDistances.map((order, index) => {
        // convert location coords to object
        const location = {
          latitude: order.vendor.location.coordinates[1],
          longitude: order.vendor.location.coordinates[0]
        }
        return (<Marker
          key={index}
          centerOffset={{ x: 25, y: 25 }}
          anchor={{ x: 0.5, y: 0.5 }}
          coordinate={location}
          title={order.vendor.name}
          onPress={() => {
            setOrder(order);
            setShowModal(true);
          }}
        >
          <Image source={require('../../../assets/images/struck.png')} style={{ height: 35, width: 35 }} />
        </Marker>)
      });
    }
  }

  const renderModalShippingOrder = () => {
    return (<Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg" closeOnOverlayClick={false}>
      <Modal.Content maxWidth="350">
        <Modal.Header>Order</Modal.Header>
        <Modal.Body>
          <VStack space={4}>
            <HStack alignItems="center" justifyContent="space-between">
              <Text fontWeight="medium">Tổng phụ</Text>
              <Text color="blueGray.400">{moneyUtils.convertVNDToString(order?.subTotal)} đ</Text>
            </HStack>
            <HStack alignItems="center" justifyContent="space-between">
              <Text fontWeight="medium">Phí giao hàng</Text>
              <Text color="blueGray.400">{moneyUtils.convertVNDToString(order?.shipping)} đ</Text>
            </HStack>
            <HStack alignItems="center" justifyContent="space-between">
              <Text fontWeight="medium">Giảm giá</Text>
              <Text color="blueGray.400">{moneyUtils.convertVNDToString(order?.discount)} đ</Text>
            </HStack>
            <HStack alignItems="center" justifyContent="space-between">
              <Text fontWeight="medium">Tổng cộng</Text>
              <Text color="green.500">{moneyUtils.convertVNDToString(order?.total)} đ</Text>
            </HStack>
          </VStack>
        </Modal.Body>
        <Modal.Footer>
          <Button.Group space={2}>
            <Button
              variant="ghost"
              colorScheme="blueGray"
              onPress={() => {
                setShowModal(false)
              }}
            >
              Hủy
            </Button>
            <Button
              onPress={() => {
                setShowModal(false)
              }}
            >
              Nhận
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>)
  }

  const navigation = useNavigation();
  return (
    <View style={styles.mainContainer}>
      <Header title={"NFood Shipper"} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', height: hp("20%") }}>
        <View style={{ backgroundColor: '#fff', padding: 10, alignItems: 'center', flex: 1, paddingTop: 30 }}  >
          <Text bold fontSize="lg">Tổng điểm thưởng</Text>
          <Text fontSize="md">{timeUtils.convertDate(new Date())}</Text>
          <View style={styles.pointContainer}>
            <Text fontSize="md" bold style={{ color: "red", marginRight: 15 }}>100 điểm</Text>
            <FontAwesome5 name="award" size={20} color="#FFF" />
          </View>
        </View>
        <View style={{ height: hp("18%"), width: 2 }}></View>

        <View style={{ backgroundColor: '#fff', padding: 10, alignItems: 'center', flex: 1, paddingTop: 30 }} >
          <Text bold fontSize="lg">Nhận đơn</Text>
          <Text fontSize="md">{isShippingOrder ? 'Đang bật' : 'Đã tắt'}</Text>
          <Switch
            offTrackColor="orange.100"
            onTrackColor="orange.200"
            onThumbColor="orange.500"
            offThumbColor="orange.50"
            size="lg"
            isChecked={isShippingOrder}
            onToggle={() => {
              setIsShippingOrder(!isShippingOrder);
            }}
          />
        </View>
      </View>
      <View style={{ backgroundColor: 'red', height: hp("65%") }}>
        <MapView
          initialRegion={{
            latitude: 16.076,
            longitude: 108.14894,
            latitudeDelta: 0.1022,
            longitudeDelta: 0.0721,
          }}
          provider={PROVIDER_GOOGLE}
          style={{ flex: 1 }}
          showsTraffic={false}
          showsBuildings={false}
          showsUserLocation={true}
          minZoomLevel={5}
          showsPointsOfInterest={false}
          showsCompass={false}
        >
          {orders ? renderOrderOnMap() : null}
          {location ? <Circle center={location} radius={1000} /> : null}
        </MapView>
      </View>
      {order ? renderModalShippingOrder() : null}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    display: 'flex',
  },
  pointContainer: {
    height: 50,
    marginTop: 10,
    backgroundColor: '#d7d9db', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30, borderRadius: 10
  }

});