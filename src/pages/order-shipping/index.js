import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, ScrollView, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useMutation, useQuery } from '@apollo/client';
import { MUTATION, QUERY } from '../../graphql';
import { SCREEN } from "../../constants";
import { moneyUtils } from "../../utils";
import { Toast, Header } from '../../components';


import { Text, Button, View, HStack, Spinner, Center, AlertDialog } from "native-base";
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
    const orderItems = data.getOrderById.orderItems || [];
    return orderItems.map((item, index) => {
      return (
        <HStack mt="2" mb="2" alignItems="center" justifyContent="space-between" key={index}>
          <View flex="4"><Text>{item?.name}</Text></View>
          <Center flex="1"><Text >{item?.quantity}</Text></Center>
          <View flex="2" justifyContent='space-between' flexDirection='row'>
            <Text></Text><Text >{moneyUtils.convertVNDToString(item?.quantity * item?.price)} đ</Text>
          </View>
        </HStack>
      );
    });
  }

  const { data } = useQuery(QUERY.GET_ORDER_BY_ID, {
    variables: {
      id: route.params.orderId
    },
    fetchPolicy: 'cache-and-network',
    onCompleted: (data) => {
      if (data.getOrderById.orderStatus === 'Processing') {
        setTitleButton(buttonTitle.RECEIVED_ORDER);
      } else {
        setTitleButton(buttonTitle.DELIVERED_ORDER);
      }
    },
  })

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
          orderId: route.params.orderId
        }
      });
    } else {
      completeShippingOrder({
        variables: {
          orderId: route.params.orderId
        }
      })
    }
    setIsOpen(false);
  }

  const renderNumberOfItems = () => {
    const orderItems = data.getOrderById?.orderItems || [];
    return orderItems.reduce((sum, item) => sum + item.quantity, 0);
  }


  return (
    <View style={styles.mainContainer}>
      <Header title={"Chi tiết đơn giao"} onPress={() => navigation.goBack()} icon={"arrow-left"} />
      {data ? (<ScrollView style={styles.content}>
        <View style={{ minHeight: hp('80%'), backgroundColor: '#fff', }}>
          <Center><Text bold fontSize="lg" mt="2">#{data.getOrderById.invoiceNumber}</Text></Center>
          <View style={{ marginHorizontal: wp('4%'), }}>
            <Text fontSize="md">Quán: {data.getOrderById?.vendor?.name}</Text>
            <Text fontSize="md">Địa chỉ: {data.getOrderById?.vendor?.address}</Text>
          </View>

          <View mt="2" mb="2" style={{ marginHorizontal: wp('4%') }}>
            <Text fontSize="md">Người nhận: {data.getOrderById.name}</Text>
            <Text fontSize="md">Địa chỉ: {data.getOrderById.address}</Text>
            <Text fontSize="md">SĐT: {data.getOrderById.phoneNumber}</Text>
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
                <Text fontSize="md" bold >{moneyUtils.convertVNDToString(data.getOrderById.subTotal)} đ</Text>
              </HStack>

              <HStack mt="2" alignItems="center" justifyContent="space-between" >
                <Text fontSize="md" bold >Phí vận chuyển</Text>
                <Text fontSize="md" bold >{moneyUtils.convertVNDToString(data.getOrderById.shipping)} đ</Text>
              </HStack>

              <HStack mt="2" alignItems="center" justifyContent="space-between" >
                <Text fontSize="md" bold >Giảm giá</Text>
                <Text fontSize="md" bold >- {moneyUtils.convertVNDToString(data.getOrderById.discount)} đ</Text>
              </HStack>

              <HStack mt="2" alignItems="center" justifyContent="space-between" >
                <Text fontSize="md" bold >Tổng tiền</Text>
                <Text fontSize="md" bold >{moneyUtils.convertVNDToString(data.getOrderById.total)} đ</Text>
              </HStack>
            </View>
          </View>
        </View>
      </ScrollView>) : null}
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