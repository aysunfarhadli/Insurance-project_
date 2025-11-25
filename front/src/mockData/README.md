# Mock Data Documentation

Bu folder-də backend olmadan dizaynı görmək üçün mock data faylları var.

## 📁 Fayllar

- **categories.js** - Sığorta kateqoriyaları və planlar üçün mock data
- **user.js** - İstifadəçi profili üçün mock data
- **orders.js** - Sifarişlər üçün mock data
- **index.js** - Bütün mock data-ların export-u

## 🚀 İstifadə

Mock data avtomatik olaraq istifadə olunur:
1. Backend əlçatan deyilsə
2. Development mode-da (`VITE_USE_MOCK_DATA=true`)
3. API çağırışı uğursuz olduqda

## ⚙️ Konfiqurasiya

`.env` faylında:
```env
VITE_USE_MOCK_DATA=true  # Mock data-nı məcburi istifadə et
VITE_API_BASE_URL=http://localhost:5000
```

## 📝 Mock Data Strukturu

### Categories
```javascript
{
  _id: "mock1",
  code: "passenger_accident",
  name: "Səyahət Sığortası",
  monthlyPrice: "45 AZN/ay",
  processingTime: "2 saat",
  coverage: "50,000 AZN",
  features: ["24/7 Dəstək", "Tez Ödəniş"],
  badge: "Ən Populyar",
  rating: 4.8,
  reviews: 2341
}
```

### User Profile
```javascript
{
  _id: "mock_user_123",
  name: "Kənan",
  surname: "Qədirov",
  email: "kanan.gadirov@example.com",
  phone: "+994501234567",
  // ...
}
```

### Orders
```javascript
{
  _id: "order1",
  orderId: "ORD1234567890",
  userId: "mock_user_123",
  category_id: { code: "passenger_accident", name: "Səyahət Sığortası" },
  status: "approved",
  total_amount: 540,
  // ...
}
```

## 🔧 Mock Data-nı Yeniləmək

Mock data fayllarını redaktə edərək test məlumatlarını dəyişə bilərsiniz.

