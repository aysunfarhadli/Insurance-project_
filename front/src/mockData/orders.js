// Mock orders data
export const mockOrders = [
  {
    _id: "order1",
    orderId: "ORD1234567890",
    userId: "mock_user_123",
    category_id: {
      _id: "cat1",
      code: "passenger_accident",
      name: "Səyahət Sığortası"
    },
    status: "approved",
    total_amount: 540,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    start_date: new Date().toISOString(),
    end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    currency: "AZN"
  },
  {
    _id: "order2",
    orderId: "ORD1234567891",
    userId: "mock_user_123",
    category_id: {
      _id: "cat2",
      code: "property_insurance",
      name: "İcbari Əmlak Sığortası"
    },
    status: "paid",
    total_amount: 456,
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    start_date: new Date().toISOString(),
    end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    currency: "AZN"
  },
  {
    _id: "order3",
    orderId: "ORD1234567892",
    userId: "mock_user_123",
    category_id: {
      _id: "cat3",
      code: "vehicle_liability",
      name: "Avtomobil Məsuliyyət Sığortası"
    },
    status: "pending",
    total_amount: 540,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    start_date: new Date().toISOString(),
    end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    currency: "AZN"
  },
  {
    _id: "order4",
    orderId: "ORD1234567893",
    userId: "mock_user_123",
    category_id: {
      _id: "cat4",
      code: "employer_liability",
      name: "İşəgötürənin Məsuliyyəti"
    },
    status: "priced",
    total_amount: 660,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    start_date: new Date().toISOString(),
    end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    currency: "AZN"
  }
];

// Get orders by user ID
export const getMockOrdersByUserId = (userId) => {
  return mockOrders.filter(order => order.userId === userId);
};

