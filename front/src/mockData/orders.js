// Mock orders data
export const mockOrders = [
  {
    _id: "order1",
    orderId: "ORD1234567890",
    userId: "mock_user_123",
    category_id: {
      _id: "cat1",
      code: "vehicle_liability",
      name: "Avtomobil məsuliyyət sığortası"
    },
    status: "paid",
    total_amount: 540,
    created_at: new Date(Date.now() - 0 * 24 * 60 * 60 * 1000).toISOString(), // Today
    start_date: new Date().toISOString(),
    end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    currency: "AZN",
    company: "Mega Sığorta"
  },
  {
    _id: "order2",
    orderId: "ORD1234567891",
    userId: "mock_user_123",
    category_id: {
      _id: "cat2",
      code: "property_insurance",
      name: "İcbari əmlak sığortası"
    },
    status: "paid",
    total_amount: 456,
    created_at: new Date(Date.now() - 0 * 24 * 60 * 60 * 1000).toISOString(), // Today
    start_date: new Date().toISOString(),
    end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    currency: "AZN",
    company: "Paşa Sığorta"
  },
  {
    _id: "order3",
    orderId: "ORD1234567892",
    userId: "mock_user_123",
    category_id: {
      _id: "cat3",
      code: "employer_liability",
      name: "İşəgötürən məsuliyyət sığortası"
    },
    status: "paid",
    total_amount: 660,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // Yesterday
    start_date: new Date().toISOString(),
    end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    currency: "AZN",
    company: "ASCO Sığorta"
  },
  {
    _id: "order4",
    orderId: "ORD1234567893",
    userId: "mock_user_123",
    category_id: {
      _id: "cat4",
      code: "passenger_accident",
      name: "Səyahət sığortası"
    },
    status: "paid",
    total_amount: 540,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // Yesterday
    start_date: new Date().toISOString(),
    end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    currency: "AZN",
    company: "Atəşgah Sığorta"
  }
];

// Get orders by user ID
export const getMockOrdersByUserId = (userId) => {
  return mockOrders.filter(order => order.userId === userId);
};

