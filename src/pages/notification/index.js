import { Text, Pressable, View, Box, Center } from "native-base";
import React from "react";
import { StyleSheet, StatusBar, Image, TouchableOpacity, FlatList } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SCREEN } from "../../constants";
import { Header, ButtonCustom, Toast } from "../../components";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useQuery, useMutation } from '@apollo/client';
import { QUERY, MUTATION } from "../../graphql";
import { timeUtils } from '../../utils';

export default function Notification(props) {

  const navigation = useNavigation();
  const route = useRoute();

  const { data, refetch } = useQuery(QUERY.GET_NOTIFICATIONS, {
    variables: {
      userType: "shipper",
      skip: 0,
      limit: 100
    },
  });

  React.useEffect(() => {
    navigation.addListener('focus', () => {
      refetch();
    });
  }, []);


  const renderItem = (item) => {
    return (
      <TouchableOpacity >
        <View style={{ flexDirection: 'row', backgroundColor: '#fff', paddingTop: 10 }}>
          <Image source={require('../../../assets/images/no-order.png')} style={{ width: wp('20%'), height: wp('20%'), marginLeft: wp('4%') }} />
          <View style={{ marginRight: 10, paddingRight: wp('24%') }}>
            <Text style={{ fontSize: wp('3.4%'), marginTop: hp('1%') }}>{item.content}</Text>
            <View style={{ justifyContent: 'flex-end', flexDirection: 'row', marginTop: 5 }}>
              <Text style={{ color: '#B2B6BB', fontSize: wp('3%') }} italic>{timeUtils.convertFullTime(new Date(item.createdAt - 0))}</Text>
            </View>
          </View>
        </View>
        <View style={{ height: 2 }} />
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container} >
      <Header title="Thông báo" onPress={() => navigation.navigate(SCREEN.HOME)} />
      {
        data && data.getNotifications && data.getNotifications.length > 0 ? (<FlatList
          style={{}}
          data={data ? data.getNotifications.items : []}
          renderItem={({ item }) => renderItem(item)}
          keyExtractor={item => item._id}

        />) : (
          <View style={{ justifyContent: 'center', display: 'flex', alignItems: 'center', flex: 1 }}>
            <Image source={require('../../../assets/images/notification.png')} style={{ width: wp('40%'), height: wp('40%') }} />
            <Text bold italic style={{ fontSize: wp('5%'), marginTop: hp('2%'), color: '#959BA4' }}>Không có thông báo nào</Text>
          </View>
        )
      }
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
  },

});