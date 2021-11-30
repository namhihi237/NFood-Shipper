import { Text, Button, View, Switch } from "native-base";
import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useLazyQuery, useQuery } from '@apollo/client';
import { MUTATION, QUERY } from '../../graphql';
import { locationGPS } from "../../recoil";
import { useRecoilState } from "recoil";
import { InputField, ButtonCustom, Toast, Loading, Header } from '../../components';
import { SCREEN } from "../../constants";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { timeUtils } from "../../utils";
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
export default function Home(props) {

  const [isShippingOrder, setIsShippingOrder] = useState(false);
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
      <View style={{backgroundColor: 'red', height: hp("65%")}}>
        <MapView
          initialRegion={{
            latitude: location.latitude ? location.latitude : 16.0764886,
            longitude: location.longitude ? location.longitude : 108.14978387,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          provider={PROVIDER_GOOGLE}
          style={{ flex: 1 }}
        >
          {location.latitude && location.longitude ? (<MapView.Marker
            key={1}
            centerOffset={{ x: 25, y: 25 }}
            anchor={{ x: 0.5, y: 0.5 }}
            coordinate={location}
            title={`Tôi`}
          >
            <Image source={require('../../../assets/images/struck.png')} style={{ height: 35, width: 35 }} />
          </MapView.Marker>) : null}
        </MapView>
      </View>
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