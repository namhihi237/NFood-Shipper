import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, ScrollView, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useMutation, useLazyQuery, useQuery } from '@apollo/client';
import { MUTATION, QUERY } from '../../graphql';
import { SCREEN } from "../../constants";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { timeUtils, GPSUtils, moneyUtils } from "../../utils";
import { InputField, ButtonCustom, Toast, Loading, Header } from '../../components';


import { Text, Button, Switch, View, Modal, HStack, Spinner, Center, AlertDialog } from "native-base";
const buttonTitle = {
  RECEIVED_ORDER: {
    title: 'Đã lấy hàng',
    value: 'RECEIVED_ORDER',
    text: 'Bạn đã chắc chắn nhận đủ món ăn chưa?'

  }
  , DELIVERED_ORDER: {
    title: 'Đã giao hàng',
    value: 'DELIVERED_ORDER',
    text: 'Xác nhận giao hàng thành công?'
  }
};

export default function OrderShipping(props) {

  const [titleButton, setTitleButton] = useState(buttonTitle.RECEIVED_ORDER);
  const route = useRoute();
  const [isOpen, setIsOpen] = useState(false);
  const cancelRef = React.useRef(null)
  const navigation = useNavigation();


  const renderItem = () => {
    const orders = route.params?.order?.orderItems || [];
    return orders.map((item, index) => {
      return (
        <HStack mt="2" mb="2" alignItems="center" justifyContent="space-between" >
          <View flex="4"><Text>{item?.name}</Text></View>
          <Center flex="1"><Text >{item?.quantity}</Text></Center>
          <View flex="2" justifyContent='space-between' flexDirection='row'>
            <Text></Text><Text >{moneyUtils.convertVNDToString(item?.quantity * item?.price)} đ</Text>
          </View>
        </HStack>
      );
    });
  }

  const [pickUpOrder, { loading }] = useMutation(MUTATION.PICK_UP_SHIPPER_ORDER, {
    onCompleted: (data) => {
      setTitleButton(buttonTitle.DELIVERED_ORDER);
    },
    onError: (error) => {
      Toast(error.message, 'danger', 'top-right');
    }
  });


  const [completeShippingOrder] = useMutation(MUTATION.COMPLETE_SHIPPER_ORDER, {
    onCompleted: (data) => {
      navigation.navigate(SCREEN.TAB);
    },
    onError: (error) => {
      Toast(error.message, 'danger', 'top-right');
    }
  });

  const changeStatusOrder = () => {
    if (titleButton.value === buttonTitle.RECEIVED_ORDER.value) {
      pickUpOrder({
        variables: {
          orderId: route.params.order._id
        }
      });
    } else {
      completeShippingOrder({
        variables: {
          orderId: route.params.order._id
        }
      })
    }
    setIsOpen(false);
  }

  const renderNumberOfItems = () => {
    const orders = route.params?.order?.orderItems || [];
    return orders.reduce((sum, item) => sum + item.quantity, 0);
  }


  return (
    <View style={styles.mainContainer}>
      <Header title={"Chi tiết đơn giao"} />
      <ScrollView style={styles.content}>
        <View style={{ minHeight: hp('80%') }}>
          <Center><Text bold fontSize="lg" mt="2">{route.params.order.invoiceNumber}</Text></Center>
          <View style={{ marginHorizontal: wp('4%') }}>
            <Text fontSize="md">Quán: {route.params.order?.vendor?.name}</Text>
            <Text fontSize="md">Địa chỉ: {route.params.order?.vendor?.address}</Text>
          </View>

          <View mt="2" style={{ marginHorizontal: wp('4%') }}>
            <Text fontSize="md">Người nhận: {'Anh Nam'}</Text>
            <Text fontSize="md">Địa chỉ: {route.params.order.address}</Text>
            <Text fontSize="md">SĐT: {route.params.order.phoneNumber}</Text>
          </View>

          <View bg="#fff" style={{ paddingHorizontal: wp('4%') }}>
            <Text fontSize="md" bold mt="2">Thông tin đơn hàng</Text>
            <Text fontSize="md" bold mt="1">Số lượng: {renderNumberOfItems()}</Text>

            <HStack mt="2" alignItems="center" justifyContent="space-between" >
              <View flex="4" bg="orange.100"><Text fontSize="md" bold ># Tên món</Text></View>
              <Center flex="1" bg="orange.100"><Text bold fontSize="md">SL</Text></Center>
              <View flex="2" bg="orange.100" justifyContent='space-between' flexDirection='row'><Text></Text><Text bold fontSize="md" >Thành tiền</Text></View>
            </HStack>

            {renderItem()}
            <Text isTruncated={true}>..........................................................................................................................................</Text>
            <View style={{ paddingBottom: 10 }}>
              <HStack mt="2" alignItems="center" justifyContent="space-between" >
                <Text fontSize="md" bold >Tổng phụ</Text>
                <Text fontSize="md" bold >{moneyUtils.convertVNDToString(route.params.order.subTotal)} đ</Text>
              </HStack>

              <HStack mt="2" alignItems="center" justifyContent="space-between" >
                <Text fontSize="md" bold >Phí vận chuyển</Text>
                <Text fontSize="md" bold >{moneyUtils.convertVNDToString(route.params.order.shipping)} đ</Text>
              </HStack>

              <HStack mt="2" alignItems="center" justifyContent="space-between" >
                <Text fontSize="md" bold >Giảm giá</Text>
                <Text fontSize="md" bold >- {moneyUtils.convertVNDToString(route.params.order.discount)} đ</Text>
              </HStack>

              <HStack mt="2" alignItems="center" justifyContent="space-between" >
                <Text fontSize="md" bold >Tổng tiền</Text>
                <Text fontSize="md" bold >{moneyUtils.convertVNDToString(route.params.order.total)} đ</Text>
              </HStack>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={{ backgroundColor: '#fff', paddingTop: 10 }}>
        <TouchableWithoutFeedback onPress={() => setIsOpen(true)}>
          <View style={styles.button}>
            {loading ? <Spinner size="sm" /> : null}
            <Text style={styles.titleButton}>{titleButton.title}</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <AlertDialog.Content>
          <AlertDialog.Body>
            <Text>{titleButton.text}</Text>
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button
                variant="unstyled"
                colorScheme="coolGray"
                ref={cancelRef}
                onPress={() => setIsOpen(false)}
              >
                Hủy
              </Button>
              <Button colorScheme="danger" onPress={() => changeStatusOrder()}>
                Xác nhận
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </View >
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    display: 'flex',
  },
  content: {
  },
  button: {
    height: hp('7%'),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#F24F04',
    marginHorizontal: wp('4%'),
    marginBottom: 20,
    width: wp('92%'),
    flexDirection: 'row'
  },
  titleButton: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff'
  }

});