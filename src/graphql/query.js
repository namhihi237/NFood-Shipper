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
      bank {
        accountNumber
        accountName
        bankName
      }
      identityCard {
        beforeImage
        afterImage
        number
        place
        date
      }
    }

    getMaxDistanceFindOrder {
      maxDistance
      numberOfOrdersToDay
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
      location {
        coordinates
      }
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
  }`,

  GET_ORDER_BY_ID: gql`query GetOrderById($id: ID!) {
    getOrderById(id: $id) {
      _id
      invoiceNumber
      subTotal
      shipping
      discount
      total
      orderItems {
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
      estimatedDeliveryTime
      paymentStatus
      orderStatus
      vendor {
        name
        location {
          coordinates
        }
        address
      }
    }
  }`,

  GET_NUMBER_OF_NOTIFICATIONS: gql`query Query($userType: roleEnum!) {
    getNumberOfNotifications(userType: $userType)
  }`,

  GET_NOTIFICATIONS: gql`query GetNotifications($userType: roleEnum!, $limit: Int, $skip: Int) {
    getNotifications(userType: $userType, limit: $limit, skip: $skip) {
      items {
        _id
        content
        image
        createdAt
      }
      total
    }
  }`,

  GET_REPORT: gql`query GetReportsByShipper {
    getReportsByShipper {
      deliveryMoney
      buyOrderMoney
      balanceWallet
      rewardMoney,
      totalOrder 
    }
  }`,

  GET_INCOME: gql`query GetIncomesByShipper($type: reportType!, $time: String!) {
    getIncomesByShipper(type: $type, time: $time) {
      totalIncome
      totalShipping
      rewardPoint
      totalOrder
    }
  }`,


  GET_REVIEWS: gql`query GetReviews($type: reviewEnum!) {
    getReviews(type: $type) {
      reviews {
        buyerId
        _id
        rating
        comment
        image
        buyer {
          _id
          name
          image
          phoneNumber
        }
        reviewedId
        type
        createdAt
      }
      badReviews
      goodReviews
      normalReviews
    }
  }`,

  GET_TRANSACTIONS: gql`query GetTransactions($type: String!) {
    getTransactions(type: $type) {
      _id
      userId
      amount
      type
      currency
      createdAt
    }
  }`,

  GET_WITHDRAW: gql`query GetWithdrawal($type: roleEnum!) {
    getWithdrawal(type: $type) {
      money
      maxWithdrawal
      minWithdrawal
      fee
      bank {
        accountNumber
        accountName
        bankName
      }
    }
  }`,

};