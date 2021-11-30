import { gql } from '@apollo/client';
export default {
  GET_ORDER_SHIPPING: gql`subscription OrderShipping {
    orderShipping {
      _id
      invoiceNumber
      subTotal
      shipping
      discount
      total
      orderItems {
        _id
        price
        name
        quantity
      }
      address
      phoneNumber
      name
      paymentStatus
      orderStatus
      deliveryDate
      estimatedDeliveryTime
    }
  }`,
};