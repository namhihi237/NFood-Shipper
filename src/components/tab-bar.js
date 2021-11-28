import * as React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Badge } from 'react-native-elements';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useMutation } from '@apollo/client';

import { Text, Button, Box, View, Modal } from "native-base";
import { GPSUtils } from "../utils";
import { InputField, ButtonCustom, Toast, Loading, Search, Cart } from './index';
import { MUTATION } from "../graphql";
const TabBar = ({ state, descriptors, navigation }) => {

  const [count, setCount] = React.useState(0);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [isGPS, setIsGPS] = React.useState(false);

  const [updateLocationShipper] = useMutation(MUTATION.UPDATE_LOCATION, {
    onError: (error) => {
      console.log(error);
    },
  });

  const getLocation = async () => {
    try {

      const status = await GPSUtils.requestPermission();
      if (status === 'already-enabled') {
        setModalVisible(false);
        const location = await GPSUtils.getCurrentPosition();
        setIsGPS(true);
        updateLocationShipper({
          variables: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
          }
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
    getLocation();
  }, []);

  React.useEffect(() => {
    setInterval(async () => {
      const location = await GPSUtils.getCurrentPosition();
      if (location) {
        updateLocationShipper({
          variables: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
          }
        });
      } else {
        setModalVisible(true);
        setIsGPS(false);
      }
    }, 10000);

    // clear setTimeout
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