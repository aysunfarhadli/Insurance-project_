import { useState, useEffect } from "react";
import { ArrowLeft, Phone, CheckCircle, User, Car, Home, Building, Briefcase, Bus, AlertTriangle, Plane, Activity, Heart } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import LoadingSpinner from "../../components/LoadingSpinner";
import styles from "./index.module.scss";

axios.defaults.withCredentials = true;

// 🔹 Hər kateqoriya üçün konfiqurasiya 
const categoryConfig = {
  vehicle_liability: {
    name: "Avtomobil Məsuliyyət Sığortası",
    icon: Car,
    subtitle: "Üçüncü şəxslərə dəymiş zərərlər üçün məsuliyyət sığortası",
    fields: {
      // Şəxsi məlumatlar (ümumi bütün kateqoriyalar üçün) 
      personal: [
        { name: "fullName", label: "Sahibkarın tam adı", placeholder: "Ad və soyadınızı daxil edin", required: true },
        { name: "finCode", label: "FİN / Şəxsiyyət vəsiqəsi nömrəsi", placeholder: "AZE1234567", required: true },
        { name: "voen", label: "VÖEN", placeholder: "1234567890", required: true },
        { name: "phone", label: "Əlaqə nömrəsi", placeholder: "+994 XX XXX XX XX", required: true },
        { name: "email", label: "Email", placeholder: "email@example.com", required: true },
        { name: "address", label: "Qeydiyyat ünvanı", placeholder: "Tam ünvanınızı daxil edin", required: false },
      ],
      // Kateqoriyaya xüsusi fieldlər 
      specific: [
        { name: "stateNumber", label: "Dövlət nömrə nişanı", placeholder: "10-AA-123", required: true },
        { name: "vin", label: "VIN (şassi nömrəsi)", placeholder: "VIN nömrəsini daxil edin", required: true },
        { name: "brandModel", label: "Marka/Model", placeholder: "Toyota Camry", required: true },
        { name: "manufactureYear", label: "Buraxılış ili", type: "number", placeholder: "2020", required: true },
        { name: "engineVolume", label: "Mühərrik həcmi", type: "number", placeholder: "2.5", required: true },
        { name: "fuelType", label: "Yanacaq növü", required: true, options: ["benzin", "dizel", "qaz", "elektrik", "hibrid"] },
        { name: "usagePurpose", label: "İstifadə təyinatı", placeholder: "Təyinatı seçin", required: true, options: ["şəxsi", "taksi", "kommersiya", "korporativ"] },
        { name: "ownershipType", label: "Sahiblik növü", required: true, options: ["fərdi", "hüquqi", "lizinq"] },
        { name: "previousPolicy", label: "Keçmiş polis nömrəsi (bonus-malus üçün)", placeholder: "POL-123456", required: true },
        { name: "startDate", label: "Başlama tarixi", type: "date", required: true },
        { name: "duration", label: "Müddət (il)", type: "number", placeholder: "1", required: true },
      ]
    }
  },
  property_insurance: {
    name: "İcbari Əmlak Sığortası",
    icon: Home,
    subtitle: "Yaşayış və qeyri-yaşayış binalar, mənzillər və tikililər üçün icbari sığorta",
    fields: {
      personal: [
        { name: "fullName", label: "Sahibi tam adı", placeholder: "Ad və soyadınızı daxil edin", required: true },
        { name: "finCode", label: "FİN / Şəxsiyyət vəsiqəsi nömrəsi", placeholder: "AZE1234567", required: true },
        { name: "voen", label: "VÖEN", placeholder: "1234567890", required: true },
        { name: "phone", label: "Əlaqə nömrəsi", placeholder: "+994 XX XXX XX XX", required: true },
        { name: "email", label: "Email", placeholder: "email@example.com", required: true },
        { name: "address", label: "Qeydiyyat ünvanı", placeholder: "Tam ünvanınızı daxil edin", required: true },
      ],
      specific: [
        { name: "propertyAddress", label: "Əmlakın ünvanı (küçə, bina/mənzil, şəhər/rayon)", placeholder: "Tam ünvanı daxil edin", required: true },
        { name: "propertyType", label: "Əmlak tipi", placeholder: "Əmlak tipini seçin", required: true, options: ["mənzil", "ev", "ofis", "ticarət", "anbar"] },
        { name: "area", label: "Sahə (m²)", type: "number", placeholder: "120", required: true },
        { name: "totalFloors", label: "Mərtəbə sayı", type: "number", placeholder: "9", required: true },
        { name: "floorLocation", label: "Yerləşdiyi mərtəbə", type: "number", placeholder: "5", required: true },
        { name: "wallMaterial", label: "Divar materialı", placeholder: "Material seçin", required: true, options: ["kərpic", "beton", "ağac", "digər"] },
        { name: "constructionYear", label: "Tikinti ili", type: "number", placeholder: "2015", required: true },
        { name: "propertyDocument", label: "Mülkiyyət sənədi nömrəsi (çıxarış/kupça)", placeholder: "Sənəd nömrəsi", required: true },
        { name: "startDate", label: "Başlama tarixi", type: "date", required: true },
        { name: "duration", label: "Müddət (il)", type: "number", placeholder: "1", required: true },
      ]
    }
  },
  property_liability: {
    name: "Əmlakın İstismarı üzrə Məsuliyyət",
    icon: Building,
    subtitle: "İstismarçı kimi üçüncü şəxslərə dəyə biləcək zərərlərə görə icbari məsuliyyət",
    fields: {
      personal: [
        { name: "fullName", label: "İstismarçının adı", placeholder: "Ad və soyadınızı daxil edin", required: true },
        { name: "finCode", label: "FİN / Şəxsiyyət vəsiqəsi nömrəsi", placeholder: "AZE1234567", required: true },
        { name: "voen", label: "VÖEN", placeholder: "1234567890", required: true },
        { name: "phone", label: "Əlaqə nömrəsi", placeholder: "+994 XX XXX XX XX", required: true },
        { name: "email", label: "Email", placeholder: "email@example.com", required: true },
      ],
      specific: [
        { name: "objectAddress", label: "Obyektin ünvanı", placeholder: "Tam ünvanı daxil edin", required: true },
        { name: "objectPurpose", label: "Obyektin təyinatı", placeholder: "Təyinatı seçin", required: true, options: ["ticarət mərkəzi", "ofis", "yaşayış", "sənaye", "ictimai"] },
        { name: "totalArea", label: "Ümumi sahə (m²)", type: "number", placeholder: "500", required: true },
        { name: "visitorFlow", label: "Təxmini gündəlik insan axını", type: "number", placeholder: "100", required: true },
        { name: "fireSafety", label: "Yanğın təhlükəsizliyi sertifikatı var", type: "checkbox" },
        { name: "startDate", label: "Başlama tarixi", type: "date", required: true },
        { name: "duration", label: "Müddət (il)", type: "number", placeholder: "1", required: true },
      ]
    }
  },
  employer_liability: {
    name: "İşəgötürənin Məsuliyyəti",
    icon: Briefcase,
    subtitle: "İş zamanı əməkdaşlara dəyən zərərlərə görə işəgötürənin məsuliyyəti",
    fields: {
      personal: [
        { name: "fullName", label: "Şirkətin adı", placeholder: "Şirkətin tam adını daxil edin", required: true },
        { name: "finCode", label: "FİN / Şəxsiyyət vəsiqəsi nömrəsi", placeholder: "AZE1234567", required: true },
        { name: "voen", label: "VÖEN", placeholder: "1234567890", required: true },
        { name: "phone", label: "Əlaqə nömrəsi", placeholder: "+994 XX XXX XX XX", required: true },
        { name: "email", label: "Email", placeholder: "email@example.com", required: true },
        { name: "address", label: "Hüquqi ünvan", placeholder: "Tam ünvanı daxil edin", required: true },
      ],
      specific: [
        { name: "activityField", label: "Fəaliyyət sahəsi (NACE/OKED kodu və ya təsvir)", placeholder: "Fəaliyyət sahəsini daxil edin", required: true },
        { name: "employeeCount", label: "İşçi sayı", type: "number", placeholder: "50", required: true },
        { name: "averageSalary", label: "Orta aylıq əməkhaqqı fondu", type: "number", placeholder: "5000", required: true },
        { name: "startDate", label: "Başlama tarixi", type: "date", required: true },
        { name: "duration", label: "Müddət (il)", type: "number", placeholder: "1", required: true },
      ]
    }
  },
  passenger_accident: {
    name: "Sərnişinlərin Qəza Sığortası",
    icon: Bus,
    subtitle: "Sərnişin daşıyan subyektlər üçün qanunla nəzərdə tutulmuş icbari sığorta",
    fields: {
      personal: [
        { name: "fullName", label: "Daşıyıcının adı", placeholder: "Daşıyıcının tam adını daxil edin", required: true },
        { name: "finCode", label: "FİN / Şəxsiyyət vəsiqəsi nömrəsi", placeholder: "AZE1234567", required: true },
        { name: "voen", label: "VÖEN (hüquqi şəxs üçün)", placeholder: "1234567890", required: true },
        { name: "phone", label: "Əlaqə nömrəsi", placeholder: "+994 XX XXX XX XX", required: true },
        { name: "email", label: "Email", placeholder: "email@example.com", required: true },
      ],
      specific: [
        { name: "routeType", label: "Marşrut və fəaliyyət növü", placeholder: "Fəaliyyət növünü seçin", required: true, options: ["şəhəriçi", "şəhərlərarası", "daxili rayon", "beynəlxalq", "dəniz", "hava"] },
        { name: "vehicleCount", label: "Nəqliyyat vasitələrinin sayı", type: "number", placeholder: "5", required: true },
        { name: "seatCount", label: "Oturacaq sayı", type: "number", placeholder: "50", required: true },
        { name: "maxPassengers", label: "Maksimal sərnişin sayı", type: "number", placeholder: "50", required: true },
        { name: "startDate", label: "Başlama tarixi", type: "date", required: true },
        { name: "duration", label: "Müddət (il)", type: "number", placeholder: "1", required: true },
      ]
    }
  },
  hazardous_liability: {
    name: "Təhlükəli Obyektlərin Məsuliyyəti",
    icon: AlertTriangle,
    subtitle: "Partlayış, kimyəvi, yanğın və s. təhlükə yaradan obyektləri istismar edənlər üçün icbari sığorta",
    fields: {
      personal: [
        { name: "fullName", label: "Subyektin adı", placeholder: "Subyektin tam adını daxil edin", required: true },
        { name: "finCode", label: "FİN / Şəxsiyyət vəsiqəsi nömrəsi", placeholder: "AZE1234567", required: true },
        { name: "voen", label: "VÖEN", placeholder: "1234567890", required: true },
        { name: "phone", label: "Əlaqə nömrəsi", placeholder: "+994 XX XXX XX XX", required: true },
        { name: "email", label: "Email", placeholder: "email@example.com", required: true },
      ],
      specific: [
        { name: "objectType", label: "Obyektin tipi", placeholder: "Obyekt tipini seçin", required: true, options: ["kimyəvi", "partlayış", "yanğın", "radioaktiv", "digər"] },
        { name: "objectAddress", label: "Obyektin tipi və ünvanı", placeholder: "Tam ünvanı daxil edin", required: true },
        { name: "dangerClass", label: "Təhlükə sinfi / Lisenziyalar (uyğunluq sənədləri)", placeholder: "Təhlükə sinfini daxil edin", required: true },
        { name: "employeeCount", label: "İşçi sayı", type: "number", placeholder: "20", required: true },
        { name: "operationVolume", label: "Əməliyyat həcmi", placeholder: "Əməliyyat həcmini daxil edin", required: true },
        { name: "startDate", label: "Başlama tarixi", type: "date", required: true },
        { name: "duration", label: "Müddət (il)", type: "number", placeholder: "1", required: true },
      ]
    }
  },
  // Könüllü Sığorta Kateqoriyaları
  travel: {
    name: "Səyahət Sığortası",
    icon: Plane,
    subtitle: "Beynəlxalq və daxili səyahət sığortası",
    fields: {
      personal: [
        { name: "fullName", label: "Səyahətçinin tam adı", placeholder: "Ad və soyadınızı daxil edin", required: true },
        { name: "finCode", label: "FİN / Şəxsiyyət vəsiqəsi nömrəsi", placeholder: "AZE1234567", required: true },
        { name: "phone", label: "Əlaqə nömrəsi", placeholder: "+994 XX XXX XX XX", required: true },
        { name: "email", label: "Email", placeholder: "email@example.com", required: true },
        { name: "address", label: "Qeydiyyat ünvanı", placeholder: "Tam ünvanınızı daxil edin", required: true },
      ],
      specific: [
        { name: "destination", label: "Təyinat ölkəsi/şəhər", placeholder: "Təyinatı daxil edin", required: true },
        { name: "travelType", label: "Səyahət növü", placeholder: "Səyahət növünü seçin", required: true, options: ["beynəlxalq", "daxili", "hər ikisi"] },
        { name: "travelPurpose", label: "Səyahət məqsədi", placeholder: "Məqsədi seçin", required: true, options: ["turizm", "iş", "təhsil", "sağlamlıq", "digər"] },
        { name: "startDate", label: "Səyahət başlama tarixi", type: "date", required: true },
        { name: "endDate", label: "Səyahət bitmə tarixi", type: "date", required: true },
        { name: "travelerCount", label: "Səyahətçi sayı", type: "number", placeholder: "1", required: true },
        { name: "coverageAmount", label: "Təminat məbləği (USD)", type: "number", placeholder: "50000", required: true },
      ]
    }
  },
  life: {
    name: "Hayat Sığortası",
    icon: Activity,
    subtitle: "Hayat və təqaüd sığortası",
    fields: {
      personal: [
        { name: "fullName", label: "Sığorta olunan şəxsin tam adı", placeholder: "Ad və soyadınızı daxil edin", required: true },
        { name: "finCode", label: "FİN / Şəxsiyyət vəsiqəsi nömrəsi", placeholder: "AZE1234567", required: true },
        { name: "birthDate", label: "Doğum tarixi", type: "date", required: true },
        { name: "phone", label: "Əlaqə nömrəsi", placeholder: "+994 XX XXX XX XX", required: true },
        { name: "email", label: "Email", placeholder: "email@example.com", required: true },
        { name: "address", label: "Qeydiyyat ünvanı", placeholder: "Tam ünvanınızı daxil edin", required: false },
      ],
      specific: [
        { name: "coverageType", label: "Təminat növü", placeholder: "Təminat növünü seçin", required: true, options: ["hayat", "təqaüd", "hər ikisi"] },
        { name: "coverageAmount", label: "Təminat məbləği (AZN)", type: "number", placeholder: "100000", required: true },
        { name: "paymentFrequency", label: "Ödəniş tezliyi", placeholder: "Tezliyi seçin", options: ["aylıq", "rüblük", "illik"] },
        { name: "startDate", label: "Başlama tarixi", type: "date", required: true },
        { name: "duration", label: "Müddət (il)", type: "number", placeholder: "10", required: true },
      ]
    }
  },
  medical: {
    name: "Tibbi Sığortası",
    icon: Heart,
    subtitle: "Tibbi xərclərin ödənilməsi",
    fields: {
      personal: [
        { name: "fullName", label: "Sığorta olunan şəxsin tam adı", placeholder: "Ad və soyadınızı daxil edin", required: true },
        { name: "finCode", label: "FİN / Şəxsiyyət vəsiqəsi nömrəsi", placeholder: "AZE1234567", required: true },
        { name: "birthDate", label: "Doğum tarixi", type: "date", required: true },
        { name: "phone", label: "Əlaqə nömrəsi", placeholder: "+994 XX XXX XX XX", required: true },
        { name: "email", label: "Email", placeholder: "email@example.com", required: true },
        { name: "address", label: "Qeydiyyat ünvanı", placeholder: "Tam ünvanınızı daxil edin", required: false },
      ],
      specific: [
        { name: "coverageType", label: "Təminat növü", placeholder: "Təminat növünü seçin", required: true, options: ["ambulator", "stasionar", "stomatologiya", "tam"] },
        { name: "coverageAmount", label: "Təminat məbləği (AZN)", type: "number", placeholder: "50000", required: true },
        { name: "familyMembers", label: "Ailə üzvlərinin sayı", type: "number", placeholder: "0" },
        { name: "startDate", label: "Başlama tarixi", type: "date", required: true },
        { name: "duration", label: "Müddət (il)", type: "number", placeholder: "1", required: true },
      ]
    }
  },
  property_voluntary: {
    name: "Əmlak Sığortası (Könüllü)",
    icon: Home,
    subtitle: "Ev və digər əmlak sığortası",
    fields: {
      personal: [
        { name: "fullName", label: "Sahibkarın tam adı", placeholder: "Ad və soyadınızı daxil edin", required: true },
        { name: "finCode", label: "FİN / Şəxsiyyət vəsiqəsi nömrəsi", placeholder: "AZE1234567", required: true },
        { name: "voen", label: "VÖEN", placeholder: "1234567890", required: true },
        { name: "phone", label: "Əlaqə nömrəsi", placeholder: "+994 XX XXX XX XX", required: true },
        { name: "email", label: "Email", placeholder: "email@example.com", required: true },
        { name: "address", label: "Qeydiyyat ünvanı", placeholder: "Tam ünvanınızı daxil edin", required: false },
      ],
      specific: [
        { name: "propertyAddress", label: "Əmlakın ünvanı", placeholder: "Tam ünvanı daxil edin", required: true },
        { name: "propertyType", label: "Əmlak tipi", placeholder: "Əmlak tipini seçin", required: true, options: ["mənzil", "ev", "ofis", "ticarət", "anbar", "villa"] },
        { name: "area", label: "Sahə (m²)", type: "number", placeholder: "120", required: true },
        { name: "propertyValue", label: "Əmlakın dəyəri (AZN)", type: "number", placeholder: "150000", required: true },
        { name: "coverageAmount", label: "Təminat məbləği (AZN)", type: "number", placeholder: "150000", required: true },
        { name: "startDate", label: "Başlama tarixi", type: "date", required: true },
        { name: "duration", label: "Müddət (il)", type: "number", placeholder: "1", required: true },
      ]
    }
  },
  transport: {
    name: "Nəqliyyat Sığortası",
    icon: Car,
    subtitle: "Avtomobil və nəqliyyat sığortası",
    fields: {
      personal: [
        { name: "fullName", label: "Sahibkarın tam adı", placeholder: "Ad və soyadınızı daxil edin", required: true },
        { name: "finCode", label: "FİN / Şəxsiyyət vəsiqəsi nömrəsi", placeholder: "AZE1234567", required: true },
        { name: "voen", label: "VÖEN", placeholder: "1234567890", required: true },
        { name: "phone", label: "Əlaqə nömrəsi", placeholder: "+994 XX XXX XX XX", required: true },
        { name: "email", label: "Email", placeholder: "email@example.com", required: true },
        { name: "address", label: "Qeydiyyat ünvanı", placeholder: "Tam ünvanınızı daxil edin", required: false },
      ],
      specific: [
        { name: "stateNumber", label: "Dövlət nömrə nişanı", placeholder: "10-AA-123", required: true },
        { name: "vin", label: "VIN (şassi nömrəsi)", placeholder: "VIN nömrəsini daxil edin", required: true },
        { name: "brandModel", label: "Marka/Model", placeholder: "Toyota Camry", required: true },
        { name: "manufactureYear", label: "Buraxılış ili", type: "number", placeholder: "2020", required: true },
        { name: "vehicleValue", label: "Nəqliyyat vasitəsinin dəyəri (AZN)", type: "number", placeholder: "30000", required: true },
        { name: "coverageType", label: "Təminat növü", placeholder: "Təminat növünü seçin", options: ["tam", "qismi", "CASCO"] },
        { name: "startDate", label: "Başlama tarixi", type: "date", required: true },
        { name: "duration", label: "Müddət (il)", type: "number", placeholder: "1", required: true },
      ]
    }
  }
};

function Order() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSelf, setIsSelf] = useState(true);

  // Helper function to translate field labels and placeholders
  const translateField = (field) => {
    const translationKey = `order.${field.name}`;
    const placeholderKey = `order.${field.name}Placeholder`;

    // Try to get translation, fallback to original if not found
    let translatedLabel = t(translationKey);
    let translatedPlaceholder = t(placeholderKey);

    // If translation returns the key itself (meaning not found), use original
    if (translatedLabel === translationKey) {
      translatedLabel = field.label;
    }
    if (translatedPlaceholder === placeholderKey) {
      translatedPlaceholder = field.placeholder;
    }

    return {
      ...field,
      label: translatedLabel,
      placeholder: translatedPlaceholder
    };
  };
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({}); // Track which fields have errors
  const [category, setCategory] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  // 🔹 Check authentication and get user profile
  // COMMENTED OUT FOR TESTING - Uncomment to enable authentication
  useEffect(() => {
    const checkAuthAndGetProfile = async () => {
      try {
        setLoading(true);
        // Mock user data for testing
        setIsAuthenticated(true);
        setUserId("test_user_id");
        setUserProfile({
          name: "Test",
          surname: "User",
          email: "test@example.com",
          phone: "+994501234567",
          finCode: "1234567"
        });
        setLoading(false);
        return;

        /* UNCOMMENT BELOW TO ENABLE AUTHENTICATION
        const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://insurance-project-e1xh.onrender.com';
        const res = await axios.get(`${API_BASE}/authUser/profile`, { withCredentials: true });
        const user = res.data.user || res.data;
        if (user) {
          setIsAuthenticated(true);
          setUserId(user._id);
          setUserProfile(user);
          console.log("User authenticated:", user);
        } else {
          // Birbaşa login-ə yönləndir
          navigate("/login");
          return;
        }
        */
      } catch (err) {
        console.error("Authentication check failed:", err);
        // Birbaşa login-ə yönləndir
        // navigate("/login"); // COMMENTED OUT FOR TESTING
        setLoading(false);
        setIsAuthenticated(true); // Mock authentication for testing
        setUserId("test_user_id");
      }
    };

    checkAuthAndGetProfile();
  }, [navigate]);

  // 🔹 Cari kateqoriyanın konfiqurasiyası 
  useEffect(() => {
    if (!id) return;
    const fetchCategory = async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://insurance-project-e1xh.onrender.com';
        const res = await axios.get(`${API_BASE}/api/categories/${id}`);
        const data = res.data;
        console.log("Gətirilən kateqoriya:", data);
        const categoryCode = data.code || data.category_code || 'property_insurance';
        setCategory(categoryCode);
        console.log("Kateqoriya kodu:", categoryCode);
      } catch (err) {
        console.error("Kateqoriya alınmadı:", err);
        // Don't use mock data - handle error properly
        setError("Kateqoriya məlumatları yüklənə bilmədi.");
      }
    };
    fetchCategory();
  }, [id]);


  console.log("cat2 ", category);

  // Default to property_insurance if category not found (for design purposes)
  const currentCategory = categoryConfig[category] || categoryConfig.property_insurance;
  const CategoryIcon = currentCategory.icon;

  // console.log("cate ", currentCategory); 

  // 🔹 Dinamik form data strukturu 
  const [formData, setFormData] = useState({});

  // 🔹 Form data-nı initialize et və öz məlumatlarını avtomatik doldur 
  useEffect(() => {
    if (!currentCategory || !currentCategory.fields) return;

    if (isSelf && userProfile) {
      const user = userProfile;
      const userData = {
        fullName: `${user.name || ""} ${user.surname || ""}`.trim(),
        firstName: user.name || "",
        lastName: user.surname || "",
        fatherName: user.fatherName || "",
        passportNumber: user.passportNumber || "",
        finCode: user.finCode || "",
        voen: user.voen || "",
        birthDate: user.birthDate || "",
        gender: user.gender || "MALE",
        phone: user.phone || "",
        email: user.email || "",
        address: user.address || "",
      };

      // Kateqoriya xüsusi fieldləri sıfırlamaq 
      const categorySpecificFields = Object.fromEntries(
        currentCategory.fields.specific.map(field => [field.name, ""])
      );

      setFormData({
        ...categorySpecificFields,
        ...userData
      });
    } else {
      // Başqası üçün bütün fieldləri sıfırla 
      const allFields = [
        ...currentCategory.fields.personal,
        ...currentCategory.fields.specific
      ];
      const emptyForm = Object.fromEntries(
        allFields.map(field => [field.name, field.type === 'checkbox' ? false : ""])
      );
      setFormData({
        ...emptyForm,
        gender: "MALE"
      });
    }
  }, [isSelf, id, userProfile, currentCategory]);

  // 🔹 Rəqəmsal inputlar üçün klaviatura məhdudiyyəti (menfi, elmi notation və s. bloklamaq)
  const handleNumberKeyDown = (e) => {
    if (["e", "E", "+", "-"].includes(e.key)) {
      e.preventDefault();
    }
  };

  // 🔹 Field-specific value processing
  const processFieldValue = (fieldName, value, fieldType) => {
    if (fieldType === 'number') {
      if (value === '' || value === '-') return '';

      const numValue = parseFloat(value);
      if (isNaN(numValue)) return '';

      // Field-specific processing
      switch (fieldName) {
        case 'manufactureYear':
        case 'constructionYear':
          // No processing - allow free typing and validation on submit
          return value;

        case 'duration':
        case 'employeeCount':
        case 'vehicleCount':
        case 'travelerCount':
          // Minimum 1
          if (numValue < 1) return '';
          return Math.floor(numValue).toString();

        case 'area':
        case 'totalArea':
        case 'engineVolume':
        case 'totalFloors':
        case 'floorLocation':
        case 'seatCount':
        case 'maxPassengers':
        case 'visitorFlow':
        case 'averageSalary':
        case 'coverageAmount':
        case 'propertyValue':
        case 'vehicleValue':
          // Müsbət rəqəm
          if (numValue <= 0) return '';
          return numValue.toString();

        case 'familyMembers':
          // 0 və ya müsbət
          if (numValue < 0) return '';
          return Math.floor(numValue).toString();

        default:
          // Ümumi: mənfi ola bilməz
          return numValue < 0 ? '' : numValue.toString();
      }
    }

    if (fieldType === 'date') {
      if (!value) return '';
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      switch (fieldName) {
        case 'endDate':
          // Bitmə tarixi başlama tarixindən sonra olmalıdır
          if (formData.startDate) {
            const startDate = new Date(formData.startDate);
            if (selectedDate <= startDate) return '';
          }
          break;

        case 'birthDate':
          // Doğum tarixi keçmişdə olmalıdır və 120 ildən çox keçmiş ola bilməz
          const maxAge = new Date();
          maxAge.setFullYear(maxAge.getFullYear() - 120);
          if (selectedDate > today || selectedDate < maxAge) return '';
          break;
      }
    }

    return value;
  };

  // 🔹 Dəyişiklikləri idarə edir 
  const handleChange = (e) => {
    const { name, value, type } = e.target;

    let processedValue = value;

    if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: e.target.checked
      });
      return;
    }

    // Field konfiqurasiyasını tap
    const field = [...(currentCategory?.fields?.personal || []), ...(currentCategory?.fields?.specific || [])]
      .find(f => f.name === name);

    // Field type-ə görə value-ni emal et
    if (field?.type === 'number' || type === 'number') {
      processedValue = processFieldValue(name, value, 'number');
    } else if (field?.type === 'date' || type === 'date') {
      processedValue = processFieldValue(name, value, 'date');
    }

    setFormData({
      ...formData,
      [name]: processedValue
    });

    // Clear error for this field when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
      // Clear general error message when user fixes fields
      setError("");
    }
  };

  // 🔹 Field-specific validation rules
  const validateFieldValue = (fieldName, value, fieldType) => {
    if (!value && value !== 0) return false;

    if (fieldType === 'number') {
      const numValue = parseFloat(value);
      if (isNaN(numValue)) return false;

      // Field-specific validations
      switch (fieldName) {
        case 'manufactureYear':
        case 'constructionYear':
          return numValue >= 1900 && numValue <= new Date().getFullYear();

        case 'duration':
        case 'employeeCount':
        case 'vehicleCount':
        case 'travelerCount':
          return numValue >= 1;

        case 'area':
        case 'totalArea':
        case 'engineVolume':
        case 'totalFloors':
        case 'floorLocation':
        case 'seatCount':
        case 'maxPassengers':
        case 'visitorFlow':
        case 'averageSalary':
        case 'coverageAmount':
        case 'propertyValue':
        case 'vehicleValue':
          return numValue > 0;

        case 'familyMembers':
          return numValue >= 0;

        default:
          return numValue >= 0;
      }
    }

    if (fieldType === 'date') {
      const dateValue = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      switch (fieldName) {
        case 'startDate':
          return true; // Keçmiş və ya gələcək ola bilər
        case 'endDate':
          if (formData.startDate) {
            const startDate = new Date(formData.startDate);
            return dateValue > startDate;
          }
          return true;
        case 'birthDate':
          const maxAge = new Date();
          maxAge.setFullYear(maxAge.getFullYear() - 120);
          return dateValue <= today && dateValue >= maxAge;
        default:
          return true;
      }
    }

    // String validation
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }

    return true;
  };

  // 🔹 Cross-field validations
  const validateCrossFields = () => {
    // maxPassengers should not exceed seatCount
    if (formData.maxPassengers && formData.seatCount) {
      if (parseFloat(formData.maxPassengers) > parseFloat(formData.seatCount)) {
        setError("Maksimal sərnişin sayı oturacaq sayından çox ola bilməz.");
        return false;
      }
    }

    // floorLocation should not exceed totalFloors
    if (formData.floorLocation && formData.totalFloors) {
      if (parseFloat(formData.floorLocation) > parseFloat(formData.totalFloors)) {
        setError("Yerləşdiyi mərtəbə mərtəbə sayından çox ola bilməz.");
        return false;
      }
    }

    // coverageAmount should not exceed propertyValue
    if (formData.coverageAmount && formData.propertyValue) {
      if (parseFloat(formData.coverageAmount) > parseFloat(formData.propertyValue)) {
        setError("Təminat məbləği əmlakın dəyərindən çox ola bilməz.");
        return false;
      }
    }

    return true;
  };

  // 🔹 Field validation with specific error messages
  const validateFieldWithMessage = (fieldName, value, fieldType, fieldLabel) => {
    if (!value && value !== 0) {
      return `${fieldLabel} sahəsi boş ola bilməz.`;
    }

    if (fieldType === 'number') {
      const numValue = parseFloat(value);
      if (isNaN(numValue)) {
        return `${fieldLabel} sahəsində düzgün rəqəm daxil edin.`;
      }

      // Field-specific validations
      switch (fieldName) {
        case 'manufactureYear':
        case 'constructionYear':
          if (numValue < 1900) {
            return `${fieldLabel} 1900-ci ildən böyük olmalıdır.`;
          }
          if (numValue > new Date().getFullYear()) {
            return `${fieldLabel} gələcək il ola bilməz.`;
          }
          break;

        case 'duration':
          if (numValue < 1) {
            return `${fieldLabel} minimum 1 il olmalıdır.`;
          }
          break;

        case 'employeeCount':
          if (numValue < 1) {
            return `${fieldLabel} minimum 1 işçi olmalıdır.`;
          }
          break;

        case 'vehicleCount':
        case 'travelerCount':
          if (numValue < 1) {
            return `${fieldLabel} minimum 1 ədəd olmalıdır.`;
          }
          break;

        case 'area':
        case 'totalArea':
          if (numValue <= 0) {
            return `${fieldLabel} müsbət rəqəm olmalıdır.`;
          }
          break;

        case 'engineVolume':
        case 'totalFloors':
        case 'floorLocation':
        case 'seatCount':
        case 'maxPassengers':
        case 'visitorFlow':
        case 'averageSalary':
        case 'coverageAmount':
        case 'propertyValue':
        case 'vehicleValue':
          if (numValue <= 0) {
            return `${fieldLabel} müsbət rəqəm olmalıdır.`;
          }
          break;

        case 'familyMembers':
          if (numValue < 0) {
            return `${fieldLabel} 0 və ya müsbət rəqəm olmalıdır.`;
          }
          break;
      }
    }

    if (fieldType === 'date') {
      const dateValue = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      switch (fieldName) {
        case 'birthDate':
          const maxAge = new Date();
          maxAge.setFullYear(maxAge.getFullYear() - 120);
          if (dateValue > today) {
            return `${fieldLabel} gələcək tarix ola bilməz.`;
          }
          if (dateValue < maxAge) {
            return `${fieldLabel} çox qədim tarix ola bilməz.`;
          }
          break;

        case 'endDate':
          if (formData.startDate) {
            const startDate = new Date(formData.startDate);
            if (dateValue <= startDate) {
              return `${fieldLabel} başlama tarixindən sonra olmalıdır.`;
            }
          }
          break;
      }
    }

    // String validation
    if (typeof value === 'string') {
      if (!value.trim()) {
        return `${fieldLabel} sahəsi boş ola bilməz.`;
      }
    }

    return null; // No error
  };

  // 🔹 Addım yoxlanışı
  const validateStep = () => {
    const newFieldErrors = {}; // Track field-specific errors

    if (step === 1) {
      if (!currentCategory || !currentCategory.fields || !currentCategory.fields.personal) {
        setError("Kateqoriya məlumatları yüklənmədi.");
        setFieldErrors({});
        return false;
      }
      const requiredFields = currentCategory.fields.personal
        .filter(field => field.required && field.name !== "finCode")
        .map(field => field.name);

      let hasError = false;
      for (const fieldName of requiredFields) {
        const field = currentCategory.fields.personal.find(f => f.name === fieldName);
        const value = formData[fieldName];
        const fieldLabel = field?.label || fieldName;

        const errorMessage = validateFieldWithMessage(fieldName, value, field?.type, fieldLabel);
        if (errorMessage) {
          newFieldErrors[fieldName] = errorMessage;
          hasError = true;
        }
      }

      // Email format validation for step 1
      if (formData.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email.trim())) {
          newFieldErrors.email = "Email ünvanı düzgün formatda deyil.";
          hasError = true;
        }
      }

      if (hasError) {
        setFieldErrors(newFieldErrors);
        setError("Boş sahələri doldurun.");
        return false;
      }
    }

    if (step === 2) {
      if (!currentCategory || !currentCategory.fields || !currentCategory.fields.specific) {
        setError("Kateqoriya məlumatları yüklənmədi.");
        setFieldErrors({});
        return false;
      }
      const requiredSpecificFields = currentCategory.fields.specific
        .filter(field => field.required)
        .map(field => field.name);

      let hasError = false;
      for (const fieldName of requiredSpecificFields) {
        const field = currentCategory.fields.specific.find(f => f.name === fieldName);
        const value = formData[fieldName];
        const fieldLabel = field?.label || fieldName;

        const errorMessage = validateFieldWithMessage(fieldName, value, field?.type, fieldLabel);
        if (errorMessage) {
          newFieldErrors[fieldName] = errorMessage;
          hasError = true;
        }
      }

      // Cross-field validations
      if (!validateCrossFields()) {
        hasError = true;
      }

      if (hasError) {
        setFieldErrors(newFieldErrors);
        setError("Boş sahələri doldurun.");
        return false;
      }
    }

    if (step === 3) {
      let hasError = false;

      if (!formData.phone?.trim()) {
        newFieldErrors.phone = "Əlaqə nömrəsi sahəsi boş ola bilməz.";
        hasError = true;
      }

      if (!formData.email?.trim()) {
        newFieldErrors.email = "Email sahəsi boş ola bilməz.";
        hasError = true;
      }

      // Email format validation
      if (formData.email && !(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).test(formData.email.trim())) {
        newFieldErrors.email = "Email ünvanı düzgün formatda deyil.";
        hasError = true;
      }

      // Phone validation (basic)
      if (formData.phone && !(/[\d\s\+\-\(\)]+/).test(formData.phone.trim())) {
        newFieldErrors.phone = "Əlaqə nömrəsi düzgün formatda deyil.";
        hasError = true;
      }

      if (hasError) {
        setFieldErrors(newFieldErrors);
        setError("Boş sahələri doldurun.");
        return false;
      }
    }

    setFieldErrors({});
    setError("");
    return true;
  };

  // 🔹 Field komponenti
  const renderField = (field) => {
    if (field.options) {
      const isEmpty = !formData[field.name] || formData[field.name] === "";
      const hasError = fieldErrors[field.name];
      return (
        <select
          name={field.name}
          value={formData[field.name] || ""}
          onChange={handleChange}
          className={`${styles.input} ${isEmpty ? styles.emptySelect : ''} ${hasError ? styles.errorField : ''}`}
        >
          <option value="">{field.placeholder || "Seçin"}</option>
          {field.options.map(option => (
            <option key={option} value={option}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </option>
          ))}
        </select>
      );
    }

    if (field.type === 'checkbox') {
      return (
        <input
          type="checkbox"
          name={field.name}
          checked={formData[field.name] || false}
          onChange={handleChange}
          className={styles.checkbox}
        />
      );
    }

    // Number input with validation
    if (field.type === 'number') {
      let min = 0;
      let step = 1;
      const isEmpty = !formData[field.name] || formData[field.name] === "";
      const hasError = fieldErrors[field.name];

      // Field-specific min values
      if (['duration', 'employeeCount', 'vehicleCount', 'travelerCount'].includes(field.name)) {
        min = 1;
      }

      // Step for decimal fields
      if (field.name.includes('Volume')) {
        step = 0.1;
      }

      // For year fields, don't set min/max attributes to allow typing freely
      // Validation will happen only on form submission
      let max;
      // All year validations happen only on form submission

      return (
        <input
          type="number"
          name={field.name}
          value={formData[field.name] || ""}
          onChange={handleChange}
          onKeyDown={handleNumberKeyDown}
          className={`${styles.input} ${isEmpty ? styles.emptyInput : ''} ${hasError ? styles.errorField : ''}`}
          placeholder={field.placeholder || ""}
          min={min}
          max={max}
          step={step}
        />
      );
    }

    // Date input with validation
    if (field.type === 'date') {
      let maxDate, minDate;
      const isEmpty = !formData[field.name] || formData[field.name] === "";
      const hasError = fieldErrors[field.name];

      if (field.name === 'birthDate') {
        maxDate = new Date().toISOString().split('T')[0];
        const maxAge = new Date();
        maxAge.setFullYear(maxAge.getFullYear() - 120);
        minDate = maxAge.toISOString().split('T')[0];
      } else if (field.name === 'endDate') {
        // endDate startDate-dən sonra olmalıdır
        if (formData.startDate) {
          const startDate = new Date(formData.startDate);
          startDate.setDate(startDate.getDate() + 1);
          minDate = startDate.toISOString().split('T')[0];
        }
      }

      return (
        <input
          type="date"
          name={field.name}
          value={formData[field.name] || ""}
          onChange={handleChange}
          className={`${styles.input} ${isEmpty ? styles.emptyInput : ''} ${hasError ? styles.errorField : ''}`}
          placeholder={field.placeholder || ""}
          max={maxDate}
          min={minDate}
        />
      );
    }

    const isEmpty = !formData[field.name] || formData[field.name] === "";
    const hasError = fieldErrors[field.name];
    return (
      <input
        type={field.type || "text"}
        name={field.name}
        value={formData[field.name] || ""}
        onChange={handleChange}
        className={`${styles.input} ${isEmpty ? styles.emptyInput : ''} ${hasError ? styles.errorField : ''}`}
        placeholder={field.placeholder || ""}
      />
    );
  };

  // 🔹 Növbəti addım və ya göndəriş 
  const handleNext = async () => {
    if (!validateStep()) return;

    if (step < 3) return setStep(step + 1);

    // Step 3 is last - redirect to company selection page
    if (step === 3) {
      // Save form data to sessionStorage
      const formDataToSave = {
        ...formData,
        category,
        categoryId: id,
        isSelf
      };
      sessionStorage.setItem('orderFormData', JSON.stringify(formDataToSave));
      navigate(`/companies/${id}`);
      return;
    }
  };

  // console.log("salammmmmmmmmmmmm", userId);


  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  // Show loading spinner while checking authentication
  if (loading && !isAuthenticated) {
    return (
      <div className={styles.container}>
        <LoadingSpinner fullScreen={true} size="large" />
      </div>
    );
  }

  return (
    <section className={styles.orderPage}>
      <div className={styles.container}>
        {/* 🔹 Page Header */}
        <div className={styles.pageHeader}>
          <button className={styles.backButton} onClick={() => navigate(-1)}>
            <ArrowLeft />
          </button>
          <div className={styles.headerContent}>
            <h1 className={styles.pageTitle}>{currentCategory.name}</h1>
            <p className={styles.pageSubtitle}>
              {currentCategory.subtitle ||
                (category === 'property_insurance'
                  ? 'Yaşayış və qeyri-yaşayış binaları, mənzillər və tikililər üçün sığorta'
                  : 'Sığorta məlumatlarını doldurun')}
            </p>
          </div>
        </div>

        {/* 🔹 Progress Indicator */}
        <div className={styles.progressContainer}>
          <div className={styles.progressSteps}>
            <div className={`${styles.step} ${step >= 1 ? styles.completed : ''} ${step === 1 ? styles.active : ''}`}>
              <div className={styles.stepCircle}>
                {step > 1 ? <CheckCircle size={20} /> : '1'}
              </div>
              <div className={styles.stepLine}></div>
            </div>
            <div className={`${styles.step} ${step >= 2 ? styles.completed : ''} ${step === 2 ? styles.active : ''}`}>
              <div className={styles.stepCircle}>
                {step > 2 ? <CheckCircle size={20} /> : '2'}
              </div>
              <div className={styles.stepLine}></div>
            </div>
            <div className={`${styles.step} ${step >= 3 ? styles.completed : ''} ${step === 3 ? styles.active : ''}`}>
              <div className={styles.stepCircle}>
                {step > 3 ? <CheckCircle size={20} /> : '3'}
              </div>
            </div>
          </div>
        </div>

        {/* 🔹 Əsas forma hissəsi */}
        <main className={styles.main}>
          <div className={styles.formCard}>
            {error && <p className={styles.error}>{error}</p>}

            {/* 🔹 Addım 1: Şəxsi məlumatlar */}
            {step === 1 && (
              <>
                <div className={styles.sectionHeader}>
                  <User className={styles.sectionIcon} />
                  <h3 className={styles.sectionTitle}>{t('common.ownerInfo')}</h3>
                </div>

                {/* <div className={styles.radioGroup}>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="userType"
                      checked={isSelf}
                      onChange={() => setIsSelf(true)}
                    />
                    <span>{t('common.forSelf')}</span>
                  </label>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="userType"
                      checked={!isSelf}
                      onChange={() => setIsSelf(false)}
                    />
                    <span>{t('common.forOther')}</span>
                  </label>
                </div> */}

                {loading ? (
                  <p>{t('common.loading')}</p>
                ) : (
                  <div className={styles.formFields}>
                    {/* Full Name - Full Width */}
                    {currentCategory.fields.personal.find(f => f.name === 'fullName') && (
                      <div className={styles.formGroup}>
                        {(() => {
                          const field = currentCategory.fields.personal.find(f => f.name === 'fullName');
                          return (
                            <>
                              <label className={styles.label}>
                                {translateField(field).label}
                                {field.required && <span className={styles.required}>*</span>}
                              </label>
                              {renderField(translateField(field))}
                            </>
                          );
                        })()}
                      </div>
                    )}

                    {/* FIN/VOEN - Two Columns (if both exist) */}
                    {currentCategory.fields.personal.find(f => f.name === 'finCode') && currentCategory.fields.personal.find(f => f.name === 'voen') && (
                      <div className={styles.twoColumnLayout}>
                        {(() => {
                          const finField = currentCategory.fields.personal.find(f => f.name === 'finCode');
                          const voenField = currentCategory.fields.personal.find(f => f.name === 'voen');
                          return (
                            <>
                              <div className={styles.formGroup}>
                                <label className={styles.label}>
                                  {translateField(finField).label}
                                  {finField.required && <span className={styles.required}>*</span>}
                                </label>
                                {renderField(translateField(finField))}
                              </div>
                              <div className={styles.formGroup}>
                                <label className={styles.label}>
                                  {translateField(voenField).label}
                                  {voenField.required && <span className={styles.required}>*</span>}
                                </label>
                                {renderField(translateField(voenField))}
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    )}

                    {/* Single FIN field if VOEN doesn't exist */}
                    {/* {currentCategory.fields.personal.find(f => f.name === 'finCode') && !currentCategory.fields.personal.find(f => f.name === 'voen') && (
                      <div className={styles.formGroup}>
                        {(() => {
                          const field = currentCategory.fields.personal.find(f => f.name === 'finCode');
                          return (
                            <>
                              <label className={styles.label}>
                                {translateField(field).label}
                                {field.required && <span className={styles.required}>*</span>}
                              </label>
                              {renderField(translateField(field))}
                            </>
                          );
                        })()}
                      </div>
                    )} */}

                    {/* Phone and Email - Two Columns */}
                    {currentCategory.fields.personal.find(f => f.name === 'phone') && currentCategory.fields.personal.find(f => f.name === 'email') && (
                      <div className={styles.twoColumnLayout}>
                        {(() => {
                          const phoneField = currentCategory.fields.personal.find(f => f.name === 'phone');
                          const emailField = currentCategory.fields.personal.find(f => f.name === 'email');
                          return (
                            <>
                              <div className={styles.formGroup}>
                                <label className={styles.label}>
                                  {translateField(phoneField).label}
                                  {phoneField.required && <span className={styles.required}>*</span>}
                                </label>
                                {renderField(translateField(phoneField))}
                              </div>
                              <div className={styles.formGroup}>
                                <label className={styles.label}>
                                  {translateField(emailField).label}
                                  {emailField.required && <span className={styles.required}>*</span>}
                                </label>
                                {renderField(translateField(emailField))}
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    )}

                    {/* Birth Date - Full Width (if exists, for life and medical categories) */}
                    {currentCategory.fields.personal.find(f => f.name === 'birthDate') && (
                      <div className={styles.formGroup}>
                        {(() => {
                          const field = currentCategory.fields.personal.find(f => f.name === 'birthDate');
                          return (
                            <>
                              <label className={styles.label}>
                                {translateField(field).label}
                                {field.required && <span className={styles.required}>*</span>}
                              </label>
                              {renderField(translateField(field))}
                            </>
                          );
                        })()}
                      </div>
                    )}

                    {/* Address - Full Width (if exists) */}
                    {currentCategory.fields.personal.find(f => f.name === 'address') && (
                      <div className={styles.formGroup}>
                        {(() => {
                          const field = currentCategory.fields.personal.find(f => f.name === 'address');
                          return (
                            <>
                              <label className={styles.label}>
                                {translateField(field).label}
                                {field.required && <span className={styles.required}>*</span>}
                              </label>
                              {renderField(translateField(field))}
                            </>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* 🔹 Addım 2: Sığorta məlumatları */}
            {step === 2 && (
              <div className={styles.formFields}>
                <div className={styles.sectionHeader}>
                  <CategoryIcon className={styles.sectionIcon} />
                  <h3 className={styles.sectionTitle}>
                    {t('order.specificInfo')}
                  </h3>
                </div>
                <div className={styles.twoColumnLayout}>
                  {currentCategory.fields.specific.map((field, i) => {
                    const translatedField = translateField(field);
                    return (
                      <div key={i} className={styles.formGroup}>
                        <label className={styles.label}>
                          {translatedField.label}
                          {field.required && <span className={styles.required}>*</span>}
                        </label>
                        {renderField(translatedField)}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 🔹 Addım 3: Əlaqə məlumatları */}
            {step === 3 && (
              <div className={styles.formFields}>
                <h3 className={styles.sectionTitle}>{t('order.contactInfo')}</h3>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    {t('order.phone')} <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={t('order.phonePlaceholder')}
                    className={styles.input}
                  // Remove disabled={isSelf}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    {t('order.email')} <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@mail.com"
                    className={styles.input}
                  // Remove disabled={isSelf}
                  />
                </div>
              </div>
            )}

          </div>
        </main>

        {/* 🔹 Addım idarə düymələri */}
        {step <= 3 && (
          <div className={styles.formActions}>
            <button
              className={styles.prevButton}
              onClick={handleBack}
              disabled={step === 1}
            >
              {t('common.previous')}
            </button>
            <button
              className={styles.nextButton}
              onClick={handleNext}
              disabled={loading}
            >
              {t('common.next')}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default Order;