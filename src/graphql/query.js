import { gql } from '@apollo/client';
export default {
  GET_SIGNATURE: gql`query getSignatureImage {
    getSignatureImage
  }`,

  GET_USER_INFO: gql`query getUser($role: roleEnum!) {
    getUser(role: $role) {
      _id
      phoneNumber
      address
      image
      isShipper
      coordinates
      name
      isShippingOrder
    }
  }`,

  GET_ORDERS_PENDING: gql`query GetOrderByDistances {
    getOrderByDistances {
      _id
      name
      invoiceNumber
      subTotal
      shipping
      discount
      total
      orderItems {
        _id
        price
        quantity
        name
        image
        buyerName
        note
      }
      address
      phoneNumber
      paymentStatus
      orderStatus
      vendor {
        name
        location {
          coordinates
        }
        address
      }
      estimatedDeliveryTime
      vendorId
      createdAt
    }
  }`,

  GET_ORDER_BY_SHIPPER: gql`query GetOrderByShipper {
    getOrderByShipper {
      _id
      invoiceNumber
      subTotal
      shipping
      discount
      total
      orderItems {
        _id
        price
        quantity
        name
        image
        note
        buyerName
      }
      address
      phoneNumber
      name
      deliveredAt
      acceptedShippingAt
      estimatedDeliveryTime
      paymentStatus
      orderStatus
      createdAt
      vendor {
        name
        address
      }
    }
  }`
};