class Order {
  orderStatus(status) {
    switch (status) {
      case 'Pending':
        return 'Đang chờ';
      case 'Processing':
        return 'Đang xử lý';
      case 'Shipping':
        return 'Đang giao hàng';
      case 'Delivered':
        return 'Đã giao hàng';
      case 'Cancelled':
        return 'Đã hủy';
      default:
        return 'Không xác định';
    }
  }

  orderStatusColor(status) {
    switch (status) {
      case 'Pending':
        return 'orange.600';
      case 'Processing':
        return 'warning.600';
      case 'Shipping':
        return 'info.600';
      case 'Delivered':
        return 'success.600';
      case 'Cancelled':
        return 'muted.600';
      default:
        return 'tertiary.600';
    }
  }
}

export default new Order();