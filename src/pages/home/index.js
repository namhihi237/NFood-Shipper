import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';
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

import { Text, Button, Switch, View, Modal, Center, Input } from "native-base";
export default function Home(props) {

  const [isShippingOrder, setIsShippingOrder] = useState(false);
  const [showModal, setShowModal] = React.useState(false)
  const [showOrderModal, setShowOrderModal] = React.useState(false)
  const [location, setLocation] = useRecoilState(locationGPS);
  const [maxDistance, setMaxDistance] = React.useState(0);
  const [tempMaxDistance, setTempMaxDistance] = React.useState(0);
  const [order, setOrder] = React.useState(null);

  const { data } = useQuery(QUERY.GET_USER_INFO, {
    variables: { role: 'shipper' },
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      if (data.getUser) {
        setIsShippingOrder(data.getUser.isShippingOrder);
        setMaxDistance(data.getMaxDistanceFindOrder);
        setTempMaxDistance(data.getMaxDistanceFindOrder);
      }
    },
  });

  const [activeReceiveOrder] = useMutation(MUTATION.ACTIVE_SHIPPER_ORDER, {
    onCompleted: (data) => {
      setIsShippingOrder(data.activeShippingOrder);
    }
  });

  const { data: orders } = useQuery(QUERY.GET_ORDERS_PENDING, {
    pollInterval: 5000,
    fetchPolicy: 'network-only'
  });

  const [updateMaxDistanceReceiveOrder] = useMutation(MUTATION.UPDATE_MAX_DISTANCE, {
    variables: { maxDistance: tempMaxDistance - 0 },
    onCompleted: (data) => {
      setShowModal(false);
      setMaxDistance(tempMaxDistance);
    },
    onError: (error) => {
      Toast(error.message, 'danger', 'top-right');
    }
  });

  const [acceptReceiveShipperOrder] = useMutation(MUTATION.ACCEPT_RECEIVE_SHIPPER_ORDER, {
    onCompleted: (data) => {
      navigation.navigate(SCREEN.ORDER_SHIPPING, {
        order: data.acceptShippingOrder,
        orderId: data.acceptShippingOrder._id,
      });
    },
    onError: (error) => {
      Toast(error.message, 'danger', 'top-right');
    }
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
            setShowOrderModal(true);
          }}
        >
          <Image source={require('../../../assets/images/struck.png')} style={{ height: 35, width: 35 }} />
        </Marker>)
      });
    }
  }
  const reduceMaxDistance = () => {
    if (tempMaxDistance > 0.1) {
      setTempMaxDistance((tempMaxDistance - 0.1)?.toFixed(1));
    }
  }

  const increaseMaxDistance = () => {
    if (tempMaxDistance < 10) {
      setTempMaxDistance((tempMaxDistance + 0.1)?.toFixed(1));
    }
  }

  const renderModalUpdateDistance = () => {
    return (
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} closeOnOverlayClick={false}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Khoảng cách tối đa nhận đơn</Modal.Header>
          <Modal.Body>
            <Center>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: wp('25%') }}>
                <TouchableOpacity onPress={reduceMaxDistance} style={{ borderWidth: 1, justifyContent: 'center', alignItems: 'center', display: 'flex', width: 27, borderColor: '#F24F04' }}>
                  <Text bold fontSize="xl">-</Text>
                </TouchableOpacity>
                <Text bold fontSize="xl">{tempMaxDistance}</Text>
                <TouchableOpacity onPress={increaseMaxDistance} style={{ borderWidth: 1, justifyContent: 'center', alignItems: 'center', display: 'flex', width: 27, borderColor: '#F24F04' }}>
                  <Text bold fontSize="xl">+</Text>
                </TouchableOpacity>
              </View>
            </Center>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => {
                  setShowModal(false);
                  setTempMaxDistance(maxDistance);
                }}
              >
                Hủy
              </Button>
              <Button
                onPress={() => {
                  updateMaxDistanceReceiveOrder();
                }}
              >
                Cập nhật
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    )
  }

  const renderModalOrder = () => {
    return (
      <Modal isOpen={showOrderModal} onClose={() => setShowOrderModal(false)} closeOnOverlayClick={false}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Đơn hàng cần giao</Modal.Header>
          <Modal.Body>
            <Center>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: wp('25%') }}>

              </View>
            </Center>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => {
                  setShowOrderModal(false);
                }}
              >
                Hủy
              </Button>
              <Button
                onPress={() => {
                  acceptReceiveShipperOrder({ variables: { orderId: order?._id } });
                  setShowOrderModal(false);
                }}
              >
                Nhận đơn
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    )
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
              activeReceiveOrder()
            }}
          />
          <TouchableOpacity style={styles.maxDistance} onPress={() => setShowModal(true)}>
            <Text bold>Khoảng cách tối đa: {maxDistance} km</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ height: hp("65%") }}>
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
          {location.latitude && location.longitude ? <Circle center={location} radius={maxDistance * 1000} /> : null}
        </MapView>
      </View>
      {renderModalUpdateDistance()}
      {renderModalOrder()}
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
  },
  maxDistance: {
    backgroundColor: '#d7d9db',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    borderRadius: 10,
    marginTop: 10,
    paddingVertical: 5
  }

});