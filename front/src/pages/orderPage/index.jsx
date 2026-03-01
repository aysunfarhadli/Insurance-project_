import { useState, useEffect } from "react";
import {
  ArrowLeft,
  CheckCircle,
  User,
  Car,
  Home,
  Building,
  Briefcase,
  Bus,
  AlertTriangle,
  Plane,
  Activity,
  Heart
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import LoadingSpinner from "../../components/LoadingSpinner";
import styles from "./index.module.scss";

axios.defaults.withCredentials = true;

/* =========================
   ✅ AZ VALIDATION UTILS
========================= */
const AZ_FIN_REGEX = /^[A-Z0-9]{7}$/i; // FİN: 7 simvol
const AZ_VOEN_REGEX = /^\d{10}$/; // VÖEN: 10 rəqəm
const AZ_PHONE_REGEX = /^\+994(10|50|51|55|70|77|99)\d{7}$/; // mobil prefikslər
const AZ_PLATE_REGEX = /^\d{2}-[A-Z]{2}-\d{3}$/; // 10-AA-123
const VIN_REGEX = /^[A-HJ-NPR-Z0-9]{17}$/i; // VIN: 17, I/O/Q yoxdur
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizeAzPhone = (raw) => {
  if (!raw) return "";
  let v = String(raw).trim().replace(/[^\d+]/g, "");

  if (v.startsWith("+994")) {
    v = v.replace(/^\+9940/, "+994");
    return v;
  }
  if (v.startsWith("994")) return `+${v}`;
  if (v.startsWith("0")) return `+994${v.slice(1)}`;
  if (/^(10|50|51|55|70|77|99)\d{7}$/.test(v)) return `+994${v}`;

  return String(raw).trim();
};

const normalizePlate = (raw) => {
  if (!raw) return "";
  let v = String(raw).toUpperCase().replace(/\s/g, "");

  const m = v.match(/^(\d{2})([A-Z]{2})(\d{3})$/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;

  return v;
};

/* =========================
   🔹 Hər kateqoriya üçün konfiqurasiya
========================= */
const categoryConfig = {
  vehicle_liability: {
    name: "Avtomobil Məsuliyyət Sığortası",
    icon: Car,
    subtitle: "Üçüncü şəxslərə dəymiş zərərlər üçün məsuliyyət sığortası",
    fields: {
      personal: [
        { name: "fullName", label: "Sahibkarın tam adı", placeholder: "Ad və soyadınızı daxil edin", required: true },
        { name: "finCode", label: "FİN / Şəxsiyyət vəsiqəsi nömrəsi", placeholder: "AZE1234", required: true },
        { name: "voen", label: "VÖEN", placeholder: "1234567890", required: true },
        { name: "phone", label: "Əlaqə nömrəsi", placeholder: "+994501234567", required: true },
        { name: "email", label: "Email", placeholder: "email@example.com", required: true },
        { name: "address", label: "Qeydiyyat ünvanı", placeholder: "Tam ünvanınızı daxil edin", required: false }
      ],
      specific: [
        { name: "stateNumber", label: "Dövlət nömrə nişanı", placeholder: "10-AA-123", required: true },
        { name: "vin", label: "VIN (şassi nömrəsi)", placeholder: "17 simvol", required: true },
        { name: "brandModel", label: "Marka/Model", placeholder: "Toyota Camry", required: true },
        { name: "manufactureYear", label: "Buraxılış ili", type: "number", placeholder: "2020", required: true },
        { name: "engineVolume", label: "Mühərrik həcmi", type: "number", placeholder: "2.5", required: true },
        { name: "fuelType", label: "Yanacaq növü", required: true, options: ["benzin", "dizel", "qaz", "elektrik", "hibrid"] },
        { name: "usagePurpose", label: "İstifadə təyinatı", placeholder: "Təyinatı seçin", required: true, options: ["şəxsi", "taksi", "kommersiya", "korporativ"] },
        { name: "ownershipType", label: "Sahiblik növü", required: true, options: ["fərdi", "hüquqi", "lizinq"] },
        { name: "previousPolicy", label: "Keçmiş polis nömrəsi (bonus-malus üçün)", placeholder: "POL-123456", required: true },
        { name: "startDate", label: "Başlama tarixi", type: "date", required: true },
        { name: "duration", label: "Müddət (il)", type: "number", placeholder: "1", required: true }
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
        { name: "finCode", label: "FİN / Şəxsiyyət vəsiqəsi nömrəsi", placeholder: "AZE1234", required: true },
        { name: "voen", label: "VÖEN", placeholder: "1234567890", required: true },
        { name: "phone", label: "Əlaqə nömrəsi", placeholder: "+994501234567", required: true },
        { name: "email", label: "Email", placeholder: "email@example.com", required: true },
        { name: "address", label: "Qeydiyyat ünvanı", placeholder: "Tam ünvanınızı daxil edin", required: true }
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
        { name: "duration", label: "Müddət (il)", type: "number", placeholder: "1", required: true }
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
        { name: "finCode", label: "FİN / Şəxsiyyət vəsiqəsi nömrəsi", placeholder: "AZE1234", required: true },
        { name: "voen", label: "VÖEN", placeholder: "1234567890", required: true },
        { name: "phone", label: "Əlaqə nömrəsi", placeholder: "+994501234567", required: true },
        { name: "email", label: "Email", placeholder: "email@example.com", required: true }
      ],
      specific: [
        { name: "objectAddress", label: "Obyektin ünvanı", placeholder: "Tam ünvanı daxil edin", required: true },
        { name: "objectPurpose", label: "Obyektin təyinatı", placeholder: "Təyinatı seçin", required: true, options: ["ticarət mərkəzi", "ofis", "yaşayış", "sənaye", "ictimai"] },
        { name: "totalArea", label: "Ümumi sahə (m²)", type: "number", placeholder: "500", required: true },
        { name: "visitorFlow", label: "Təxmini gündəlik insan axını", type: "number", placeholder: "100", required: true },
        { name: "fireSafety", label: "Yanğın təhlükəsizliyi sertifikatı var", type: "checkbox" },
        { name: "startDate", label: "Başlama tarixi", type: "date", required: true },
        { name: "duration", label: "Müddət (il)", type: "number", placeholder: "1", required: true }
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
        { name: "finCode", label: "FİN / Şəxsiyyət vəsiqəsi nömrəsi", placeholder: "AZE1234", required: true },
        { name: "voen", label: "VÖEN", placeholder: "1234567890", required: true },
        { name: "phone", label: "Əlaqə nömrəsi", placeholder: "+994501234567", required: true },
        { name: "email", label: "Email", placeholder: "email@example.com", required: true },
        { name: "address", label: "Hüquqi ünvan", placeholder: "Tam ünvanı daxil edin", required: true }
      ],
      specific: [
        { name: "activityField", label: "Fəaliyyət sahəsi (NACE/OKED kodu və ya təsvir)", placeholder: "Fəaliyyət sahəsini daxil edin", required: true },
        { name: "employeeCount", label: "İşçi sayı", type: "number", placeholder: "50", required: true },
        { name: "averageSalary", label: "Orta aylıq əməkhaqqı fondu", type: "number", placeholder: "5000", required: true },
        { name: "startDate", label: "Başlama tarixi", type: "date", required: true },
        { name: "duration", label: "Müddət (il)", type: "number", placeholder: "1", required: true }
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
        { name: "finCode", label: "FİN / Şəxsiyyət vəsiqəsi nömrəsi", placeholder: "AZE1234", required: true },
        { name: "voen", label: "VÖEN (hüquqi şəxs üçün)", placeholder: "1234567890", required: true },
        { name: "phone", label: "Əlaqə nömrəsi", placeholder: "+994501234567", required: true },
        { name: "email", label: "Email", placeholder: "email@example.com", required: true }
      ],
      specific: [
        { name: "routeType", label: "Marşrut və fəaliyyət növü", placeholder: "Fəaliyyət növünü seçin", required: true, options: ["şəhəriçi", "şəhərlərarası", "daxili rayon", "beynəlxalq", "dəniz", "hava"] },
        { name: "vehicleCount", label: "Nəqliyyat vasitələrinin sayı", type: "number", placeholder: "5", required: true },
        { name: "seatCount", label: "Oturacaq sayı", type: "number", placeholder: "50", required: true },
        { name: "maxPassengers", label: "Maksimal sərnişin sayı", type: "number", placeholder: "50", required: true },
        { name: "startDate", label: "Başlama tarixi", type: "date", required: true },
        { name: "duration", label: "Müddət (il)", type: "number", placeholder: "1", required: true }
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
        { name: "finCode", label: "FİN / Şəxsiyyət vəsiqəsi nömrəsi", placeholder: "AZE1234", required: true },
        { name: "voen", label: "VÖEN", placeholder: "1234567890", required: true },
        { name: "phone", label: "Əlaqə nömrəsi", placeholder: "+994501234567", required: true },
        { name: "email", label: "Email", placeholder: "email@example.com", required: true }
      ],
      specific: [
        { name: "objectType", label: "Obyektin tipi", placeholder: "Obyekt tipini seçin", required: true, options: ["kimyəvi", "partlayış", "yanğın", "radioaktiv", "digər"] },
        { name: "objectAddress", label: "Obyektin tipi və ünvanı", placeholder: "Tam ünvanı daxil edin", required: true },
        { name: "dangerClass", label: "Təhlükə sinfi / Lisenziyalar (uyğunluq sənədləri)", placeholder: "Təhlükə sinfini daxil edin", required: true },
        { name: "employeeCount", label: "İşçi sayı", type: "number", placeholder: "20", required: true },
        { name: "operationVolume", label: "Əməliyyat həcmi", placeholder: "Əməliyyat həcmini daxil edin", required: true },
        { name: "startDate", label: "Başlama tarixi", type: "date", required: true },
        { name: "duration", label: "Müddət (il)", type: "number", placeholder: "1", required: true }
      ]
    }
  },
  travel: {
    name: "Səyahət Sığortası",
    icon: Plane,
    subtitle: "Beynəlxalq və daxili səyahət sığortası",
    fields: {
      personal: [
        { name: "fullName", label: "Səyahətçinin tam adı", placeholder: "Ad və soyadınızı daxil edin", required: true },
        { name: "finCode", label: "FİN / Şəxsiyyət vəsiqəsi nömrəsi", placeholder: "AZE1234", required: true },
        { name: "phone", label: "Əlaqə nömrəsi", placeholder: "+994501234567", required: true },
        { name: "email", label: "Email", placeholder: "email@example.com", required: true },
        { name: "address", label: "Qeydiyyat ünvanı", placeholder: "Tam ünvanınızı daxil edin", required: true }
      ],
      specific: [
        { name: "destination", label: "Təyinat ölkəsi/şəhər", placeholder: "Təyinatı daxil edin", required: true },
        { name: "travelType", label: "Səyahət növü", placeholder: "Səyahət növünü seçin", required: true, options: ["beynəlxalq", "daxili", "hər ikisi"] },
        { name: "travelPurpose", label: "Səyahət məqsədi", placeholder: "Məqsədi seçin", required: true, options: ["turizm", "iş", "təhsil", "sağlamlıq", "digər"] },
        { name: "startDate", label: "Səyahət başlama tarixi", type: "date", required: true },
        { name: "endDate", label: "Səyahət bitmə tarixi", type: "date", required: true },
        { name: "travelerCount", label: "Səyahətçi sayı", type: "number", placeholder: "1", required: true },
        { name: "coverageAmount", label: "Təminat məbləği (USD)", type: "number", placeholder: "50000", required: true }
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
        { name: "finCode", label: "FİN / Şəxsiyyət vəsiqəsi nömrəsi", placeholder: "AZE1234", required: true },
        { name: "birthDate", label: "Doğum tarixi", type: "date", required: true },
        { name: "phone", label: "Əlaqə nömrəsi", placeholder: "+994501234567", required: true },
        { name: "email", label: "Email", placeholder: "email@example.com", required: true },
        { name: "address", label: "Qeydiyyat ünvanı", placeholder: "Tam ünvanınızı daxil edin", required: false }
      ],
      specific: [
        { name: "coverageType", label: "Təminat növü", placeholder: "Təminat növünü seçin", required: true, options: ["hayat", "təqaüd", "hər ikisi"] },
        { name: "coverageAmount", label: "Təminat məbləği (AZN)", type: "number", placeholder: "100000", required: true },
        { name: "paymentFrequency", label: "Ödəniş tezliyi", placeholder: "Tezliyi seçin", options: ["aylıq", "rüblük", "illik"] },
        { name: "startDate", label: "Başlama tarixi", type: "date", required: true },
        { name: "duration", label: "Müddət (il)", type: "number", placeholder: "10", required: true }
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
        { name: "finCode", label: "FİN / Şəxsiyyət vəsiqəsi nömrəsi", placeholder: "AZE1234", required: true },
        { name: "birthDate", label: "Doğum tarixi", type: "date", required: true },
        { name: "phone", label: "Əlaqə nömrəsi", placeholder: "+994501234567", required: true },
        { name: "email", label: "Email", placeholder: "email@example.com", required: true },
        { name: "address", label: "Qeydiyyat ünvanı", placeholder: "Tam ünvanınızı daxil edin", required: false }
      ],
      specific: [
        { name: "coverageType", label: "Təminat növü", placeholder: "Təminat növünü seçin", required: true, options: ["ambulator", "stasionar", "stomatologiya", "tam"] },
        { name: "coverageAmount", label: "Təminat məbləği (AZN)", type: "number", placeholder: "50000", required: true },
        { name: "familyMembers", label: "Ailə üzvlərinin sayı", type: "number", placeholder: "0" },
        { name: "startDate", label: "Başlama tarixi", type: "date", required: true },
        { name: "duration", label: "Müddət (il)", type: "number", placeholder: "1", required: true }
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
        { name: "finCode", label: "FİN / Şəxsiyyət vəsiqəsi nömrəsi", placeholder: "AZE1234", required: true },
        { name: "voen", label: "VÖEN", placeholder: "1234567890", required: true },
        { name: "phone", label: "Əlaqə nömrəsi", placeholder: "+994501234567", required: true },
        { name: "email", label: "Email", placeholder: "email@example.com", required: true },
        { name: "address", label: "Qeydiyyat ünvanı", placeholder: "Tam ünvanınızı daxil edin", required: false }
      ],
      specific: [
        { name: "propertyAddress", label: "Əmlakın ünvanı", placeholder: "Tam ünvanı daxil edin", required: true },
        { name: "propertyType", label: "Əmlak tipi", placeholder: "Əmlak tipini seçin", required: true, options: ["mənzil", "ev", "ofis", "ticarət", "anbar", "villa"] },
        { name: "area", label: "Sahə (m²)", type: "number", placeholder: "120", required: true },
        { name: "propertyValue", label: "Əmlakın dəyəri (AZN)", type: "number", placeholder: "150000", required: true },
        { name: "coverageAmount", label: "Təminat məbləği (AZN)", type: "number", placeholder: "150000", required: true },
        { name: "startDate", label: "Başlama tarixi", type: "date", required: true },
        { name: "duration", label: "Müddət (il)", type: "number", placeholder: "1", required: true }
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
        { name: "finCode", label: "FİN / Şəxsiyyət vəsiqəsi nömrəsi", placeholder: "AZE1234", required: true },
        { name: "voen", label: "VÖEN", placeholder: "1234567890", required: true },
        { name: "phone", label: "Əlaqə nömrəsi", placeholder: "+994501234567", required: true },
        { name: "email", label: "Email", placeholder: "email@example.com", required: true },
        { name: "address", label: "Qeydiyyat ünvanı", placeholder: "Tam ünvanınızı daxil edin", required: false }
      ],
      specific: [
        { name: "stateNumber", label: "Dövlət nömrə nişanı", placeholder: "10-AA-123", required: true },
        { name: "vin", label: "VIN (şassi nömrəsi)", placeholder: "17 simvol", required: true },
        { name: "brandModel", label: "Marka/Model", placeholder: "Toyota Camry", required: true },
        { name: "manufactureYear", label: "Buraxılış ili", type: "number", placeholder: "2020", required: true },
        { name: "vehicleValue", label: "Nəqliyyat vasitəsinin dəyəri (AZN)", type: "number", placeholder: "30000", required: true },
        { name: "coverageType", label: "Təminat növü", placeholder: "Təminat növünü seçin", options: ["tam", "qismi", "CASCO"] },
        { name: "startDate", label: "Başlama tarixi", type: "date", required: true },
        { name: "duration", label: "Müddət (il)", type: "number", placeholder: "1", required: true }
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

  const translateField = (field) => {
    const translationKey = `order.${field.name}`;
    const placeholderKey = `order.${field.name}Placeholder`;

    let translatedLabel = t(translationKey);
    let translatedPlaceholder = t(placeholderKey);

    if (translatedLabel === translationKey) translatedLabel = field.label;
    if (translatedPlaceholder === placeholderKey) translatedPlaceholder = field.placeholder;

    return { ...field, label: translatedLabel, placeholder: translatedPlaceholder };
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [category, setCategory] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const checkAuthAndGetProfile = async () => {
      const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://insurance-project-e1xh.onrender.com";

      try {
        setLoading(true);
        setError("");

        const res = await axios.get(`${API_BASE}/authUser/profile`, { withCredentials: true });
        const user = res.data?.user || res.data;

        if (user && user.email) {
          setIsAuthenticated(true);
          setUserId(user._id);
          setUserProfile(user);
        } else {
          setIsAuthenticated(false);
          navigate("/login");
        }
      } catch (err) {
        console.error("Authentication check failed:", err);
        setIsAuthenticated(false);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndGetProfile();
  }, [navigate]);

  useEffect(() => {
    if (!id) return;
    const fetchCategory = async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://insurance-project-e1xh.onrender.com";
        const res = await axios.get(`${API_BASE}/api/categories/${id}`);
        const data = res.data;
        const categoryCode = data.code || data.category_code || "property_insurance";
        setCategory(categoryCode);
      } catch (err) {
        console.error("Kateqoriya alınmadı:", err);
        setError("Kateqoriya məlumatları yüklənə bilmədi.");
      }
    };
    fetchCategory();
  }, [id]);

  const currentCategory = categoryConfig[category] || categoryConfig.property_insurance;
  const CategoryIcon = currentCategory.icon;

  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (!currentCategory?.fields) return;

    if (isSelf && userProfile) {
      const user = userProfile;

      const userData = {
        fullName: `${user.name || ""} ${user.surname || ""}`.trim(),
        firstName: user.name || "",
        lastName: user.surname || "",
        fatherName: user.fatherName || "",
        passportNumber: user.passportNumber || "",
        finCode: (user.finCode || "").toUpperCase(),
        voen: user.voen || "",
        birthDate: user.birthDate || "",
        gender: user.gender || "MALE",
        phone: normalizeAzPhone(user.phone || ""),
        email: user.email || "",
        address: user.address || ""
      };

      const categorySpecificFields = Object.fromEntries(
        currentCategory.fields.specific.map((field) => [field.name, field.type === "checkbox" ? false : ""])
      );

      setFormData({ ...categorySpecificFields, ...userData });
    } else {
      const allFields = [...currentCategory.fields.personal, ...currentCategory.fields.specific];
      const emptyForm = Object.fromEntries(allFields.map((field) => [field.name, field.type === "checkbox" ? false : ""]));
      setFormData({ ...emptyForm, gender: "MALE" });
    }
  }, [isSelf, id, userProfile, currentCategory]);

  const handleNumberKeyDown = (e) => {
    if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
  };

  const processFieldValue = (fieldName, value, fieldType) => {
    if (fieldType === "number") {
      if (value === "" || value === "-") return "";
      const numValue = parseFloat(value);
      if (isNaN(numValue)) return "";

      switch (fieldName) {
        case "manufactureYear":
        case "constructionYear":
          return value;

        case "duration":
        case "employeeCount":
        case "vehicleCount":
        case "travelerCount":
          if (numValue < 1) return "";
          return Math.floor(numValue).toString();

        case "familyMembers":
          if (numValue < 0) return "";
          return Math.floor(numValue).toString();

        default:
          return numValue < 0 ? "" : numValue.toString();
      }
    }

    if (fieldType === "date") {
      if (!value) return "";
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      switch (fieldName) {
        case "endDate":
          if (formData.startDate) {
            const startDate = new Date(formData.startDate);
            if (selectedDate <= startDate) return "";
          }
          break;
        case "birthDate": {
          const maxAge = new Date();
          maxAge.setFullYear(maxAge.getFullYear() - 120);
          if (selectedDate > today || selectedDate < maxAge) return "";
          break;
        }
        default:
          break;
      }
    }

    return value;
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      setFormData({ ...formData, [name]: e.target.checked });
      return;
    }

    let processedValue = value;

    // ✅ AZ normalize-lar
    if (name === "phone") processedValue = normalizeAzPhone(value);
    if (name === "stateNumber") processedValue = normalizePlate(value);
    if (name === "finCode") processedValue = String(value).toUpperCase().trim();
    if (name === "voen") processedValue = String(value).replace(/\D/g, "");
    if (name === "vin") processedValue = String(value).toUpperCase().replace(/\s/g, "");

    const field = [...(currentCategory?.fields?.personal || []), ...(currentCategory?.fields?.specific || [])].find(
      (f) => f.name === name
    );

    if (field?.type === "number" || type === "number") {
      processedValue = processFieldValue(name, processedValue, "number");
    } else if (field?.type === "date" || type === "date") {
      processedValue = processFieldValue(name, processedValue, "date");
    }

    setFormData({ ...formData, [name]: processedValue });

    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
      setError("");
    }
  };

  const validateCrossFields = () => {
    if (formData.maxPassengers && formData.seatCount) {
      if (parseFloat(formData.maxPassengers) > parseFloat(formData.seatCount)) {
        setError("Maksimal sərnişin sayı oturacaq sayından çox ola bilməz.");
        return false;
      }
    }

    if (formData.floorLocation && formData.totalFloors) {
      if (parseFloat(formData.floorLocation) > parseFloat(formData.totalFloors)) {
        setError("Yerləşdiyi mərtəbə mərtəbə sayından çox ola bilməz.");
        return false;
      }
    }

    if (formData.coverageAmount && formData.propertyValue) {
      if (parseFloat(formData.coverageAmount) > parseFloat(formData.propertyValue)) {
        setError("Təminat məbləği əmlakın dəyərindən çox ola bilməz.");
        return false;
      }
    }

    // Travel: endDate startDate-dən sonra olmalıdır (zaten ayrı da var)
    if (formData.startDate && formData.endDate) {
      const s = new Date(formData.startDate);
      const e = new Date(formData.endDate);
      if (e <= s) {
        setError("Bitmə tarixi başlama tarixindən sonra olmalıdır.");
        return false;
      }
    }

    return true;
  };

  const validateFieldWithMessage = (fieldName, value, fieldType, fieldLabel) => {
    if ((value === "" || value === null || value === undefined) && value !== 0) {
      return `${fieldLabel} sahəsi boş ola bilməz.`;
    }

    // ✅ AZ xüsusi string validasiyalar
    switch (fieldName) {
      case "finCode":
        if (!AZ_FIN_REGEX.test(String(value).trim())) {
          return `${fieldLabel} 7 simvol olmalıdır (məs: AZE1234).`;
        }
        break;

      case "voen":
        if (!AZ_VOEN_REGEX.test(String(value).trim())) {
          return `${fieldLabel} 10 rəqəm olmalıdır.`;
        }
        break;

      case "phone": {
        const normalized = normalizeAzPhone(String(value).trim());
        if (!AZ_PHONE_REGEX.test(normalized)) {
          return `${fieldLabel} düzgün formatda deyil. Nümunə: +994501234567`;
        }
        break;
      }

      case "email":
        if (!EMAIL_REGEX.test(String(value).trim())) {
          return `${fieldLabel} düzgün formatda deyil.`;
        }
        break;

      case "stateNumber": {
        const plate = normalizePlate(String(value).trim());
        if (!AZ_PLATE_REGEX.test(plate)) {
          return `${fieldLabel} düzgün formatda deyil. Nümunə: 10-AA-123`;
        }
        break;
      }

      case "vin":
        if (!VIN_REGEX.test(String(value).trim())) {
          return `${fieldLabel} 17 simvol olmalı və I/O/Q olmamalıdır.`;
        }
        break;

      default:
        break;
    }

    if (fieldType === "number") {
      const numValue = parseFloat(value);
      if (isNaN(numValue)) return `${fieldLabel} sahəsində düzgün rəqəm daxil edin.`;

      switch (fieldName) {
        case "manufactureYear":
        case "constructionYear":
          if (numValue < 1900) return `${fieldLabel} 1900-ci ildən böyük olmalıdır.`;
          if (numValue > new Date().getFullYear()) return `${fieldLabel} gələcək il ola bilməz.`;
          break;

        case "duration":
          if (numValue < 1) return `${fieldLabel} minimum 1 il olmalıdır.`;
          break;

        case "employeeCount":
          if (numValue < 1) return `${fieldLabel} minimum 1 işçi olmalıdır.`;
          break;

        case "vehicleCount":
        case "travelerCount":
          if (numValue < 1) return `${fieldLabel} minimum 1 ədəd olmalıdır.`;
          break;

        case "familyMembers":
          if (numValue < 0) return `${fieldLabel} 0 və ya müsbət rəqəm olmalıdır.`;
          break;

        default:
          if (numValue < 0) return `${fieldLabel} mənfi ola bilməz.`;
          break;
      }
    }

    if (fieldType === "date") {
      const dateValue = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      switch (fieldName) {
        case "birthDate": {
          const maxAge = new Date();
          maxAge.setFullYear(maxAge.getFullYear() - 120);
          if (dateValue > today) return `${fieldLabel} gələcək tarix ola bilməz.`;
          if (dateValue < maxAge) return `${fieldLabel} çox qədim tarix ola bilməz.`;
          break;
        }
        case "endDate":
          if (formData.startDate) {
            const startDate = new Date(formData.startDate);
            if (dateValue <= startDate) return `${fieldLabel} başlama tarixindən sonra olmalıdır.`;
          }
          break;
        default:
          break;
      }
    }

    if (typeof value === "string" && !value.trim()) {
      return `${fieldLabel} sahəsi boş ola bilməz.`;
    }

    return null;
  };

  const validateStep = () => {
    const newFieldErrors = {};

    if (step === 1) {
      if (!currentCategory?.fields?.personal) {
        setError("Kateqoriya məlumatları yüklənmədi.");
        setFieldErrors({});
        return false;
      }

      const requiredFields = currentCategory.fields.personal.filter((f) => f.required).map((f) => f.name);

      let hasError = false;
      for (const fieldName of requiredFields) {
        const field = currentCategory.fields.personal.find((f) => f.name === fieldName);
        const value = formData[fieldName];
        const fieldLabel = field?.label || fieldName;

        const msg = validateFieldWithMessage(fieldName, value, field?.type, fieldLabel);
        if (msg) {
          newFieldErrors[fieldName] = msg;
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
      if (!currentCategory?.fields?.specific) {
        setError("Kateqoriya məlumatları yüklənmədi.");
        setFieldErrors({});
        return false;
      }

      const requiredSpecificFields = currentCategory.fields.specific.filter((f) => f.required).map((f) => f.name);

      let hasError = false;
      for (const fieldName of requiredSpecificFields) {
        const field = currentCategory.fields.specific.find((f) => f.name === fieldName);
        const value = formData[fieldName];
        const fieldLabel = field?.label || fieldName;

        const msg = validateFieldWithMessage(fieldName, value, field?.type, fieldLabel);
        if (msg) {
          newFieldErrors[fieldName] = msg;
          hasError = true;
        }
      }

      if (!validateCrossFields()) hasError = true;

      if (hasError) {
        setFieldErrors(newFieldErrors);
        setError("Boş sahələri doldurun.");
        return false;
      }
    }

    if (step === 3) {
      let hasError = false;

      const phoneMsg = validateFieldWithMessage("phone", formData.phone, undefined, t("order.phone"));
      if (phoneMsg) {
        newFieldErrors.phone = phoneMsg;
        hasError = true;
      }

      const emailMsg = validateFieldWithMessage("email", formData.email, undefined, t("order.email"));
      if (emailMsg) {
        newFieldErrors.email = emailMsg;
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

  const renderField = (field) => {
    if (field.options) {
      const isEmpty = !formData[field.name] || formData[field.name] === "";
      const hasError = fieldErrors[field.name];
      return (
        <select
          name={field.name}
          value={formData[field.name] || ""}
          onChange={handleChange}
          className={`${styles.input} ${isEmpty ? styles.emptySelect : ""} ${hasError ? styles.errorField : ""}`}
        >
          <option value="">{field.placeholder || "Seçin"}</option>
          {field.options.map((option) => (
            <option key={option} value={option}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </option>
          ))}
        </select>
      );
    }

    if (field.type === "checkbox") {
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

    if (field.type === "number") {
      let min = 0;
      let step = 1;
      const isEmpty = !formData[field.name] || formData[field.name] === "";
      const hasError = fieldErrors[field.name];

      if (["duration", "employeeCount", "vehicleCount", "travelerCount"].includes(field.name)) min = 1;
      if (field.name.includes("Volume")) step = 0.1;

      let max;

      return (
        <input
          type="number"
          name={field.name}
          value={formData[field.name] || ""}
          onChange={handleChange}
          onKeyDown={handleNumberKeyDown}
          className={`${styles.input} ${isEmpty ? styles.emptyInput : ""} ${hasError ? styles.errorField : ""}`}
          placeholder={field.placeholder || ""}
          min={min}
          max={max}
          step={step}
        />
      );
    }

    if (field.type === "date") {
      let maxDate, minDate;
      const isEmpty = !formData[field.name] || formData[field.name] === "";
      const hasError = fieldErrors[field.name];

      if (field.name === "birthDate") {
        maxDate = new Date().toISOString().split("T")[0];
        const maxAge = new Date();
        maxAge.setFullYear(maxAge.getFullYear() - 120);
        minDate = maxAge.toISOString().split("T")[0];
      } else if (field.name === "endDate") {
        if (formData.startDate) {
          const startDate = new Date(formData.startDate);
          startDate.setDate(startDate.getDate() + 1);
          minDate = startDate.toISOString().split("T")[0];
        }
      }

      return (
        <input
          type="date"
          name={field.name}
          value={formData[field.name] || ""}
          onChange={handleChange}
          className={`${styles.input} ${isEmpty ? styles.emptyInput : ""} ${hasError ? styles.errorField : ""}`}
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
        className={`${styles.input} ${isEmpty ? styles.emptyInput : ""} ${hasError ? styles.errorField : ""}`}
        placeholder={field.placeholder || ""}
      />
    );
  };

  const handleNext = async () => {
    if (!validateStep()) return;

    if (step < 3) return setStep(step + 1);

    if (step === 3) {
      const formDataToSave = { ...formData, category, categoryId: id, isSelf };
      sessionStorage.setItem("orderFormData", JSON.stringify(formDataToSave));
      navigate(`/companies/${id}`);
      return;
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

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
        <div className={styles.pageHeader}>
          <button className={styles.backButton} onClick={() => navigate(-1)}>
            <ArrowLeft />
          </button>
          <div className={styles.headerContent}>
            <h1 className={styles.pageTitle}>{currentCategory.name}</h1>
            <p className={styles.pageSubtitle}>
              {currentCategory.subtitle ||
                (category === "property_insurance"
                  ? "Yaşayış və qeyri-yaşayış binaları, mənzillər və tikililər üçün sığorta"
                  : "Sığorta məlumatlarını doldurun")}
            </p>
          </div>
        </div>

        <div className={styles.progressContainer}>
          <div className={styles.progressSteps}>
            <div className={`${styles.step} ${step >= 1 ? styles.completed : ""} ${step === 1 ? styles.active : ""}`}>
              <div className={styles.stepCircle}>{step > 1 ? <CheckCircle size={20} /> : "1"}</div>
              <div className={styles.stepLine}></div>
            </div>
            <div className={`${styles.step} ${step >= 2 ? styles.completed : ""} ${step === 2 ? styles.active : ""}`}>
              <div className={styles.stepCircle}>{step > 2 ? <CheckCircle size={20} /> : "2"}</div>
              <div className={styles.stepLine}></div>
            </div>
            <div className={`${styles.step} ${step >= 3 ? styles.completed : ""} ${step === 3 ? styles.active : ""}`}>
              <div className={styles.stepCircle}>{step > 3 ? <CheckCircle size={20} /> : "3"}</div>
            </div>
          </div>
        </div>

        <main className={styles.main}>
          <div className={styles.formCard}>
            {error && <p className={styles.error}>{error}</p>}

            {step === 1 && (
              <>
                <div className={styles.sectionHeader}>
                  <User className={styles.sectionIcon} />
                  <h3 className={styles.sectionTitle}>{t("common.ownerInfo")}</h3>
                </div>

                {loading ? (
                  <p>{t("common.loading")}</p>
                ) : (
                  <div className={styles.formFields}>
                    {currentCategory.fields.personal.find((f) => f.name === "fullName") && (
                      <div className={styles.formGroup}>
                        {(() => {
                          const field = currentCategory.fields.personal.find((f) => f.name === "fullName");
                          return (
                            <>
                              <label className={styles.label}>
                                {translateField(field).label}
                                {field.required && <span className={styles.required}>*</span>}
                              </label>
                              {renderField(translateField(field))}
                              {fieldErrors.fullName && <small className={styles.error}>{fieldErrors.fullName}</small>}
                            </>
                          );
                        })()}
                      </div>
                    )}

                    {currentCategory.fields.personal.find((f) => f.name === "finCode") &&
                      currentCategory.fields.personal.find((f) => f.name === "voen") && (
                        <div className={styles.twoColumnLayout}>
                          {(() => {
                            const finField = currentCategory.fields.personal.find((f) => f.name === "finCode");
                            const voenField = currentCategory.fields.personal.find((f) => f.name === "voen");
                            return (
                              <>
                                <div className={styles.formGroup}>
                                  <label className={styles.label}>
                                    {translateField(finField).label}
                                    {finField.required && <span className={styles.required}>*</span>}
                                  </label>
                                  {renderField(translateField(finField))}
                                  {fieldErrors.finCode && <small className={styles.error}>{fieldErrors.finCode}</small>}
                                </div>
                                <div className={styles.formGroup}>
                                  <label className={styles.label}>
                                    {translateField(voenField).label}
                                    {voenField.required && <span className={styles.required}>*</span>}
                                  </label>
                                  {renderField(translateField(voenField))}
                                  {fieldErrors.voen && <small className={styles.error}>{fieldErrors.voen}</small>}
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      )}

                    {currentCategory.fields.personal.find((f) => f.name === "phone") &&
                      currentCategory.fields.personal.find((f) => f.name === "email") && (
                        <div className={styles.twoColumnLayout}>
                          {(() => {
                            const phoneField = currentCategory.fields.personal.find((f) => f.name === "phone");
                            const emailField = currentCategory.fields.personal.find((f) => f.name === "email");
                            return (
                              <>
                                <div className={styles.formGroup}>
                                  <label className={styles.label}>
                                    {translateField(phoneField).label}
                                    {phoneField.required && <span className={styles.required}>*</span>}
                                  </label>
                                  {renderField(translateField(phoneField))}
                                  {fieldErrors.phone && <small className={styles.error}>{fieldErrors.phone}</small>}
                                </div>
                                <div className={styles.formGroup}>
                                  <label className={styles.label}>
                                    {translateField(emailField).label}
                                    {emailField.required && <span className={styles.required}>*</span>}
                                  </label>
                                  {renderField(translateField(emailField))}
                                  {fieldErrors.email && <small className={styles.error}>{fieldErrors.email}</small>}
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      )}

                    {currentCategory.fields.personal.find((f) => f.name === "birthDate") && (
                      <div className={styles.formGroup}>
                        {(() => {
                          const field = currentCategory.fields.personal.find((f) => f.name === "birthDate");
                          return (
                            <>
                              <label className={styles.label}>
                                {translateField(field).label}
                                {field.required && <span className={styles.required}>*</span>}
                              </label>
                              {renderField(translateField(field))}
                              {fieldErrors.birthDate && <small className={styles.error}>{fieldErrors.birthDate}</small>}
                            </>
                          );
                        })()}
                      </div>
                    )}

                    {currentCategory.fields.personal.find((f) => f.name === "address") && (
                      <div className={styles.formGroup}>
                        {(() => {
                          const field = currentCategory.fields.personal.find((f) => f.name === "address");
                          return (
                            <>
                              <label className={styles.label}>
                                {translateField(field).label}
                                {field.required && <span className={styles.required}>*</span>}
                              </label>
                              {renderField(translateField(field))}
                              {fieldErrors.address && <small className={styles.error}>{fieldErrors.address}</small>}
                            </>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {step === 2 && (
              <div className={styles.formFields}>
                <div className={styles.sectionHeader}>
                  <CategoryIcon className={styles.sectionIcon} />
                  <h3 className={styles.sectionTitle}>{t("order.specificInfo")}</h3>
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
                        {fieldErrors[field.name] && <small className={styles.error}>{fieldErrors[field.name]}</small>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className={styles.formFields}>
                <h3 className={styles.sectionTitle}>{t("order.contactInfo")}</h3>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    {t("order.phone")} <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone || ""}
                    onChange={handleChange}
                    placeholder={t("order.phonePlaceholder")}
                    className={`${styles.input} ${fieldErrors.phone ? styles.errorField : ""}`}
                  />
                  {fieldErrors.phone && <small className={styles.error}>{fieldErrors.phone}</small>}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    {t("order.email")} <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ""}
                    onChange={handleChange}
                    placeholder="example@mail.com"
                    className={`${styles.input} ${fieldErrors.email ? styles.errorField : ""}`}
                  />
                  {fieldErrors.email && <small className={styles.error}>{fieldErrors.email}</small>}
                </div>
              </div>
            )}
          </div>
        </main>

        {step <= 3 && (
          <div className={styles.formActions}>
            <button className={styles.prevButton} onClick={handleBack} disabled={step === 1}>
              {t("common.previous")}
            </button>
            <button className={styles.nextButton} onClick={handleNext} disabled={loading}>
              {t("common.next")}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default Order;
