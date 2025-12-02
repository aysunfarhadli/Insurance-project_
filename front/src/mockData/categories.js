// Mock data for insurance categories
export const mockCategories = [
  {
    _id: "mock1",
    code: "passenger_accident",
    name: "Sərnişin Qəzası Sığortası",
    description: "Sərnişinləri daşıyan qurumlar üçün sığorta",
    monthlyPrice: "45 AZN/ay",
    processingTime: "2 saat",
    coverage: "50,000 AZN",
    features: ["24/7 Dəstək", "Tez Ödəniş", "Beynəlxalq əhatə"],
    badge: "Ən Populyar",
    rating: 4.8,
    reviews: 2341
  },
  {
    _id: "mock2",
    code: "passenger_accident",
    name: "Premium Səyahət Sığortası",
    description: "Genişləndirilmiş əhatə ilə premium səyahət sığortası",
    monthlyPrice: "52 AZN/ay",
    processingTime: "1 saat",
    coverage: "75,000 AZN",
    features: ["Premium Xidmət", "VIP Dəstək", "Genişləndirilmiş əhatə"],
    badge: "Premium",
    rating: 4.7,
    reviews: 3124
  },
  {
    _id: "mock3",
    code: "property_insurance",
    name: "İcbari Əmlak Sığortası",
    description: "Yaşayış və qeyri-yaşayış binaları üçün",
    monthlyPrice: "38 AZN/ay",
    processingTime: "3 saat",
    coverage: "40,000 AZN",
    features: ["Online Xidmət", "Sürətli Qeydiyyat", "Mobil Tətbiq"],
    badge: "Ən Sürətli",
    rating: 4.6,
    reviews: 1892
  },
  {
    _id: "mock4",
    code: "hazardous_liability",
    name: "Təhlükəli Obyektlərin Məsuliyyəti",
    description: "Partlayış, yanğın və kimyəvi təhlükələr",
    monthlyPrice: "42 AZN/ay",
    processingTime: "3 saat",
    coverage: "45,000 AZN",
    features: ["Xüsusi Təhlükəsizlik", "Tez Xidmət", "Geniş əhatə"],
    badge: "Ən Sürətli",
    rating: 4.6,
    reviews: 1892
  },
  {
    _id: "mock5",
    code: "vehicle_liability",
    name: "Avtomobil Məsuliyyət Sığortası",
    description: "Üçüncü şəxslərə dəymiş zərərlər üçün məsuliyyət",
    monthlyPrice: "45 AZN/ay",
    processingTime: "2 saat",
    coverage: "50,000 AZN",
    features: ["24/7 Dəstək", "Tez Ödəniş", "Online Xidmət"],
    badge: "Ən Populyar",
    rating: 4.8,
    reviews: 2341
  },
  {
    _id: "mock6",
    code: "employer_liability",
    name: "İşəgötürənin Məsuliyyəti",
    description: "İşçilərə dəyən zərərlərə görə məsuliyyət",
    monthlyPrice: "55 AZN/ay",
    processingTime: "2 saat",
    coverage: "60,000 AZN",
    features: ["24/7 Dəstək", "Tez Ödəniş", "Beynəlxalq əhatə"],
    badge: "Premium",
    rating: 4.7,
    reviews: 1892
  },
  {
    _id: "mock7",
    code: "property_liability",
    name: "Əmlak Əməliyyatları Məsuliyyəti",
    description: "Əmlak istismarı zamanı məsuliyyət",
    monthlyPrice: "40 AZN/ay",
    processingTime: "2 saat",
    coverage: "45,000 AZN",
    features: ["Əmlak Qoruma", "Tez Xidmət", "Geniş əhatə"],
    badge: "Ən Sürətli",
    rating: 4.6,
    reviews: 1892
  }
];

// Get categories by type
export const getMockCategoriesByType = (type) => {
  return mockCategories.filter(cat => cat.code === type);
};

// Get category by ID
export const getMockCategoryById = (id) => {
  return mockCategories.find(cat => cat._id === id) || mockCategories[0];
};

