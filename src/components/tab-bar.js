import * as React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Badge } from 'react-native-elements';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useMutation, useSubscription } from '@apollo/client';

import { Text, Button, Center, View, Modal, HStack, VStack } from "native-base";
import { GPSUtils, moneyUtils } from "../utils";
import { MUTATION, SUBSCRIPTION } from "../graphql";
import { useRecoilState } from 'recoil';
import {locationGPS} from "../recoil"
const TabBar = ({ state, descriptors, navigation }) => {

  const [count, setCount] = React.useState(0);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [isGPS, setIsGPS] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false)

  const [timeHideOrder, setTimeHideOrder] = React.useState(0);
  const [previousLocation, setPreviousLocation] = React.useState(null);
  const [locationG, setLocationG] = useRecoilState(locationGPS);

  const [updateLocationShipper] = useMutation(MUTATION.UPDATE_LOCATION, {
  });

  const { data } = useSubscription(SUBSCRIPTION.GET_ORDER_SHIPPING, {
    onSubscriptionData: ({ client, subscriptionData }) => {
      const { orderShipping } = subscriptionData.data;
      if (orderShipping) {
        console.log('orderShipping', orderShipping);
        setShowModal(true);
        setTimeHideOrder(25);
      }
    },
  });

  const getLocation = async () => {
    try {
      const status = await GPSUtils.requestPermission();
      if (status === 'already-enabled') {
        setModalVisible(false);
        const location = await GPSUtils.getCurrentPosition();
        setIsGPS(true);
        setPreviousLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        console.log("set");
        updateLocationShipper({
          variables: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
          }
        });

        setLocationG({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

      } else if (status === 'enabled') {
        setModalVisible(false);
        getLocation();
      }
    } catch (error) {
      setIsGPS(false);
      setModalVisible(true);
    }
  }

  React.useEffect(() => {
    if (!timeHideOrder) {
      return;
    }
    const interval = setInterval(() => {
      setTimeHideOrder(timeHideOrder - 1);
      if (timeHideOrder === 1) {
        setShowModal(false);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [timeHideOrder]);


  React.useEffect(() => {
    getLocation();
  }, []);

  React.useEffect(() => {
    setInterval(async () => {
      const location = await GPSUtils.getCurrentPosition();
      if (location) {
        // check has changed location
        if (previousLocation && (previousLocation?.latitude !== location.coords.latitude || previousLocation?.longitude !== location.coords.longitude)) {
          updateLocationShipper({
            variables: {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude
            }
          });
          setPreviousLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });

          setLocationG({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });

          console.log("updated");
        }
      } else {
        setModalVisible(true);
        setIsGPS(false);
      }
    }, 5000);
    return () => {
      clearTimeout();
    };
  }, []);

  const renderOpenGPS = () => {
    return (
      <Modal
        isOpen={modalVisible}
        onClose={() => setModalVisible(false)}
        closeOnOverlayClick={false}
      >
        <Modal.Content>
          <Modal.Header>Bật định vị GPS với độ chính xác cao</Modal.Header>
          <Modal.Body>
            <Text>Điều này sẽ giúp chúng tôi tính toán vị trí của bạn tốt hơn để đưa ra gợi ý và tính toán chi phí hợp lý</Text>
          </Modal.Body>
          <Modal.Footer>
            <Button
              flex="1"
              onPress={() => {
                getLocation();
              }}
            >
              Bật định vị
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    )
  }

  const renderModelShippingOrder = () => {
    return (<Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg" closeOnOverlayClick={false}>
      <Modal.Content maxWidth="350">
        <Modal.Header>{timeHideOrder > 0 ? `Đơn giao hết hạn sau ${timeHideOrder} s` : null}</Modal.Header>
        <Modal.Body>
          <VStack space={4}>
            <HStack alignItems="center" justifyContent="space-between">
              <Text fontWeight="medium">Tổng phụ</Text>
              <Text color="blueGray.400">{moneyUtils.convertVNDToString(data?.orderShipping.subTotal)} đ</Text>
            </HStack>
            <HStack alignItems="center" justifyContent="space-between">
              <Text fontWeight="medium">Phí giao hàng</Text>
              <Text color="blueGray.400">{moneyUtils.convertVNDToString(data?.orderShipping.shipping)} đ</Text>
            </HStack>
            <HStack alignItems="center" justifyContent="space-between">
              <Text fontWeight="medium">Giảm giá</Text>
              <Text color="blueGray.400">{moneyUtils.convertVNDToString(data?.orderShipping.discount)} đ</Text>
            </HStack>
            <HStack alignItems="center" justifyContent="space-between">
              <Text fontWeight="medium">Tổng cộng</Text>
              <Text color="green.500">{moneyUtils.convertVNDToString(data?.orderShipping.total)} đ</Text>
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

  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const icon = options.icon;
        const isFocused = state.index === index;

        const onPress = async () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
          if (route.name === 'Notification') {

          }
        };

        return (
          <TouchableOpacity onPress={onPress} style={styles.button} key={route.key}>
            <View style={isFocused ? styles.focus : styles.noFocus}>
              {options.icon == 'bell' && count != 0 ? (
                <Badge
                  value={`${count}`}
                  status="error"
                  containerStyle={{ position: 'absolute', top: -1, right: -1 }}
                />
              ) : null}
              <FontAwesome5
                name={icon}
                style={{
                  ...styles.icon,
                  color: isFocused ? '#E5512F' : '#fff',
                }}
              />
            </View>
          </TouchableOpacity>
        );
      })}
      {!isGPS ? renderOpenGPS() : null}
      {renderModelShippingOrder()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#1C1D26',
    height: hp('6%'),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
    width: wp('100%'),
  },
  icon: {
    fontSize: 22,
    color: '#E5512F',
  },
  button: {
    flex: 1,

    alignItems: 'center',
  },
  buttonFocus: {
    flex: 1,
    alignItems: 'center',
  },
  focus: {
    backgroundColor: '#d9d2c5',
    alignItems: 'center',
    borderRadius: 30,
    justifyContent: 'center',
    height: 40,
    width: 40,
  },
  noFocus: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    width: 40,
  },
});
export default TabBar;