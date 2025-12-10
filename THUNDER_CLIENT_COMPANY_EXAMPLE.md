# Thunder Client - Şirkət Yaratmaq Nümunəsi

## Endpoint
```
POST http://localhost:5000/api/companies
```

## Headers
```
Content-Type: application/json
```

## Request Body (JSON)

### Nümunə 1: Mega Sığorta
```json
{
  "code": "MEGA",
  "name": "Mega Sığorta",
  "active": true,
  "logo_url": "https://via.placeholder.com/100/FF5733/FFFFFF?text=MEGA",
  "contact_info": {
    "email": "info@mega.az",
    "phone": "+994 12 123 45 67",
    "address": "Bakı şəhəri, Nizami rayonu, Nizami küçəsi 123"
  }
}
```

### Nümunə 2: Paşa Sığorta
```json
{
  "code": "PASHA",
  "name": "Paşa Sığorta",
  "active": true,
  "logo_url": "https://via.placeholder.com/100/33FF57/FFFFFF?text=PASHA",
  "contact_info": {
    "email": "info@pasha.az",
    "phone": "+994 12 234 56 78",
    "address": "Bakı şəhəri, Yasamal rayonu, İstiqlaliyyət prospekti 45"
  }
}
```

### Nümunə 3: ASCO Sığorta
```json
{
  "code": "ASCO",
  "name": "ASCO Sığorta",
  "active": true,
  "logo_url": "https://via.placeholder.com/100/3357FF/FFFFFF?text=ASCO",
  "contact_info": {
    "email": "info@asco.az",
    "phone": "+994 12 345 67 89",
    "address": "Bakı şəhəri, Səbail rayonu, Xətai prospekti 78"
  }
}
```

### Nümunə 4: Atəşgah Sığorta
```json
{
  "code": "ATESHGAH",
  "name": "Atəşgah Sığorta",
  "active": true,
  "logo_url": "https://via.placeholder.com/100/FF33F5/FFFFFF?text=ATS",
  "contact_info": {
    "email": "info@ateshgah.az",
    "phone": "+994 12 456 78 90",
    "address": "Bakı şəhəri, Nəsimi rayonu, Rəsul Rza küçəsi 12"
  }
}
```

### Minimal Nümunə (yalnız tələb olunan fieldlər)
```json
{
  "code": "TEST",
  "name": "Test Sığorta Şirkəti"
}
```

## Gözlənilən Response (Success - 201)
```json
{
  "_id": "65a1b2c3d4e5f6789abcdef0",
  "code": "MEGA",
  "name": "Mega Sığorta",
  "active": true,
  "logo_url": "https://via.placeholder.com/100/FF5733/FFFFFF?text=MEGA",
  "contact_info": {
    "email": "info@mega.az",
    "phone": "+994 12 123 45 67",
    "address": "Bakı şəhəri, Nizami rayonu, Nizami küçəsi 123"
  },
  "created_at": "2025-01-15T10:30:00.000Z",
  "updated_at": "2025-01-15T10:30:00.000Z"
}
```

## Xəta Response-ları

### Code artıq mövcuddur (400)
```json
{
  "message": "Bu code artıq mövcuddur"
}
```

### Validation xətası (500)
```json
{
  "message": "Validation error message"
}
```

## Qeydlər
- `code` field-i **unique** olmalıdır və **required**-dur
- `name` field-i **required**-dur
- `active` default olaraq `true`-dur
- `logo_url` və `contact_info` optional-dır
- `contact_info` object-dir və `email`, `phone`, `address` field-ləri var

