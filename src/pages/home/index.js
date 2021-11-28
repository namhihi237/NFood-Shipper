import { Text, Image, Button, View, Switch } from "native-base";
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useLazyQuery, useQuery } from '@apollo/client';
import { MUTATION, QUERY } from '../../graphql';

import { InputField, ButtonCustom, Toast, Loading, Header } from '../../components';
import { SCREEN } from "../../constants";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { timeUtils } from "../../utils";

export default function Home(props) {

  const [isShippingOrder, setIsShippingOrder] = useState(false);

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
    backgroundColor: '#7f7f7f', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30, borderRadius: 10
  }

});