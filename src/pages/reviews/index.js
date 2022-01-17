import { Text, Pressable, View, Box, Center } from "native-base";
import React from "react";
import { StyleSheet, StatusBar, Image, TouchableOpacity, FlatList } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SCREEN } from "../../constants";
import { Header, Toast } from "../../components";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useQuery, useMutation } from '@apollo/client';
import { QUERY, MUTATION } from "../../graphql";
import { timeUtils } from '../../utils';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

export default function Review(props) {

  const navigation = useNavigation();
  const route = useRoute();

  const { data, refetch } = useQuery(QUERY.GET_REVIEWS, {
    variables: {
      type: "shipper",
    },
    fetchPolicy: 'network-only',
  });

  React.useEffect(() => {
    navigation.addListener('focus', () => {
      refetch();
    });
  }, []);

  const renderRatingToText = (rating) => {
    switch (rating) {
      case 1:
        return "Không hài lòng";
      case 2:
        return "Bình thường";
      case 3:
        return "Hài lòng";
      default:
        return '';
    }
  }

  const renderItem = (item) => {
    return (
      <View style={styles.itemContainer}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <Text bold fontSize="lg">{item.buyer?.name}</Text>
          </View>
          <View style={{ ...styles.ratingText, backgroundColor: item.rating === 3 ? 'red' : item.rating === 2 ? '#166534' : '#7e22ce' }}>
            <Text fontSize="sm" color="#fff" bold>
              {renderRatingToText(item.rating)}
            </Text>
          </View>
        </View>
        <Text italic fontSize="sm" color="#959BA4">{timeUtils.convertFullTime(new Date(item.createdAt - 0))}</Text>

        <Text>{item.comment}</Text>
      </View>
    )
  }

  return (
    <View style={styles.container} >
      <Header title={"Đánh giá của khách hàng"} />
      <View style={styles.summary}>
        <View style={styles.iconButton}>
          <Image source={require('../../../assets/images/bad.png')} style={styles.icon} />
          <Text fontSize="xs" style={{ color: '#7e22ce' }}>Chưa hài lòng {data?.getReviews?.badReviews || 0}</Text>
        </View>
        <View style={styles.iconButton} >
          <Image source={require('../../../assets/images/nomarl.png')} style={styles.icon} />
          <Text fontSize="xs" style={{ color: '#166534' }}>Bình thường {data?.getReviews?.normalReviews || 0}</Text>
        </View>
        <View style={styles.iconButton}>
          <Image source={require('../../../assets/images/good.png')} style={styles.icon} />
          <Text fontSize="xs" style={{ color: 'red' }}>Hài lòng: {data?.getReviews?.goodReviews || 0}</Text>
        </View>
      </View>
      {
        data && data.getReviews && data.getReviews.reviews.length > 0 ? (<FlatList
          data={data ? data.getReviews.reviews : []}
          renderItem={({ item }) => renderItem(item)}
          keyExtractor={item => item._id}

        />) : (
          <View style={{ justifyContent: 'center', display: 'flex', alignItems: 'center', flex: 1 }}>
            <FontAwesome5 name="comment-slash" size={wp('10%')} color="#959BA4" />
            <Text bold italic style={{ fontSize: wp('5%'), marginTop: hp('2%'), color: '#959BA4' }}>Chưa có đánh giá nào</Text>
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
  itemContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('2%'),
    marginBottom: 1,
  },
  ratingText: {
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  summary: {
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('2%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  icon: {
    width: wp('10%'),
    height: wp('10%'),
  },
  iconButton: {
    alignItems: 'center',
  }
});