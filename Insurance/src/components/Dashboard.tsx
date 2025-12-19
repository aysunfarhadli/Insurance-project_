import { useState, useEffect } from 'react';
import { Plane, Activity, Heart, Home, Car, CreditCard, ArrowRightLeft, Plus, Shield, QrCode, ChevronRight, Stethoscope, Building2 } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';

interface DashboardProps {
  onCategorySelect: (category: any) => void;
  onViewOrders: () => void;
  onViewNewActions: () => void;
  searchQuery: string;
}

type CategoryType = 'mandatory' | 'voluntary';

export function Dashboard({ onCategorySelect, onViewOrders, onViewNewActions, searchQuery }: DashboardProps) {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [categoryType, setCategoryType] = useState<CategoryType>('mandatory');

  // Auto-rotate banner carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const mandatoryCategories = [
    { id: 1, name: 'Avtomobil Məsuliyyət', description: 'Üçüncü şəxslərə dəymiş zərərlər üçün məsuliyyət', icon: Car, color: 'bg-orange-600', type: 'mandatory' },
    { id: 2, name: 'İcbari Əmlak', description: 'Yaşayış və qeyri-yaşayış binaları, mənzillər', icon: Home, color: 'bg-purple-600', type: 'mandatory' },
    { id: 3, name: 'Əmlak Əməliyyatları', description: 'Əmlak istismarı zamanı məsuliyyət', icon: Shield, color: 'bg-blue-600', type: 'mandatory' },
    { id: 4, name: 'İşəgötürən Məsuliyyəti', description: 'İşçilərə dəyən zərərlərə görə məsuliyyət', icon: Activity, color: 'bg-green-600', type: 'mandatory' },
    { id: 5, name: 'Sərnişin Qəzası', description: 'Sərnişinləri daşıyan qurumlar üçün sığorta', icon: Plane, color: 'bg-teal-600', type: 'mandatory' },
    { id: 6, name: 'Təhlükəli Obyektlər', description: 'Partlayış, yanğın və kimyəvi təhlükələr', icon: CreditCard, color: 'bg-red-600', type: 'mandatory' },
  ];

  const voluntaryCategories = [
    { id: 7, name: 'Səyahət', description: 'Beynəlxalq və daxili səyahət sığortası', icon: Plane, color: 'bg-blue-600', type: 'voluntary' },
    { id: 8, name: 'Həyat', description: 'Həyat və təqaüd sığortası', icon: Heart, color: 'bg-pink-600', type: 'voluntary' },
    { id: 9, name: 'Tibbi', description: 'Tibbi xərclərin ödənilməsi', icon: Stethoscope, color: 'bg-green-600', type: 'voluntary' },
    { id: 10, name: 'Əmlak', description: 'Ev və digər əmlak sığortası', icon: Building2, color: 'bg-purple-600', type: 'voluntary' },
    { id: 11, name: 'Nəqliyyat', description: 'Avtomobil və nəqliyyat sığortası', icon: Car, color: 'bg-orange-600', type: 'voluntary' },
  ];

  const categories = categoryType === 'mandatory' ? mandatoryCategories : voluntaryCategories;

  const completedOrders = [
    { id: 1, name: 'Mega Sığorta', type: 'Avtomobil məsuliyyət sığortası', price: '280 AZN', time: '13:50', date: '15 Dekabr 2024', icon: Shield, color: 'bg-orange-100' },
    { id: 2, name: 'Paşa Sığorta', type: 'İcbari əmlak sığortası', price: '450 AZN', time: '13:50', date: '15 Dekabr 2024', icon: Shield, color: 'bg-purple-100' },
    { id: 3, name: 'ASCO Sığorta', type: 'İşəgötürən məsuliyyət sığortası', price: '1 200 AZN', time: '09:30', date: '14 Dekabr 2024', icon: Shield, color: 'bg-green-100' },
    { id: 4, name: 'Atəşgah Sığorta', type: 'Səyahət sığortası', price: '85 AZN', time: '16:20', date: '14 Dekabr 2024', icon: Shield, color: 'bg-blue-100' },
  ];

  const banners = [
    {
      title: 'Yeni Kampaniyalar',
      description: 'Bütün icbari sığorta növlərində sürətli rəsmiləşdirmə və xüsusi endirimlər! Online müraciət edin və bonuslardan yararlanın.',
      gradient: 'bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100'
    },
    {
      title: 'Endirimli Sığorta Paketləri',
      description: 'Avtomobil və əmlak sığortası paketlərində 20%-ə qədər endirim. Mövsümi təkliflər məhdud müddətlidir!',
      gradient: 'bg-gradient-to-r from-orange-100 via-amber-100 to-yellow-100'
    },
    {
      title: 'Mövsümi Təkliflər',
      description: 'Yeni ilin xüsusi təklifləri! Səyahət və tibbi sığortada unikal şərtlər. Ailəvi paketlərdə 30% endirim!',
      gradient: 'bg-gradient-to-r from-green-100 via-teal-100 to-cyan-100'
    }
  ];

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredOrders = completedOrders.filter(order =>
    order.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Hero Banner Carousel - Full Width */}
      <Card className={`p-8 md:p-12 ${banners[currentBanner].gradient} border-none cursor-pointer shadow-sm`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <h1 className="mb-3 text-gray-800">{banners[currentBanner].title}</h1>
            <p className="text-gray-700 text-lg max-w-2xl">
              {banners[currentBanner].description}
            </p>
          </div>
          <div className="flex space-x-3">
            {banners.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentBanner ? 'bg-blue-600 w-8' : 'bg-gray-400 hover:bg-gray-500'
                }`}
                onClick={() => setCurrentBanner(index)}
              />
            ))}
          </div>
        </div>
      </Card>

      {/* Categories Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2>Kateqoriyalar</h2>
          <Button variant="link" className="text-blue-600 hover:text-blue-700" onClick={() => onViewNewActions()}>
            Hamısını gör
          </Button>
        </div>

        {/* Category Type Switcher */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-gray-100 rounded-full p-1.5 shadow-sm">
            <button
              onClick={() => setCategoryType('mandatory')}
              className={`px-10 py-3.5 rounded-full transition-all duration-300 font-medium ${
                categoryType === 'mandatory'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              İcbari Sığorta
            </button>
            <button
              onClick={() => setCategoryType('voluntary')}
              className={`px-10 py-3.5 rounded-full transition-all duration-300 font-medium ${
                categoryType === 'voluntary'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Könüllü Sığorta
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredCategories.map((category) => {
            const Icon = category.icon;
            return (
              <Card 
                key={category.id} 
                className={`${category.color} text-white p-7 border-none cursor-pointer hover:scale-105 hover:shadow-2xl transition-all duration-300 rounded-2xl`}
                onClick={() => onCategorySelect(category)}
              >
                <div className="flex flex-col space-y-4">
                  <div className="bg-white/20 p-4 rounded-2xl w-fit">
                    <Icon className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="mb-2">{category.name}</h3>
                    <p className="text-white/90 text-sm leading-relaxed">{category.description}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Completed Orders Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2>Tamamlanmış sifarişlər</h2>
          <Button variant="link" className="text-blue-600 hover:text-blue-700" onClick={onViewOrders}>
            Hamısını gör
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredOrders.map((order) => {
            const Icon = order.icon;
            return (
              <Card key={order.id} className="p-5 cursor-pointer hover:shadow-lg transition-all duration-300 rounded-xl">
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className={`${order.color} p-3 rounded-xl`}>
                      <Icon className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="mb-0.5 truncate">{order.name}</h3>
                      <p className="text-gray-400 text-xs">{order.date}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{order.type}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-blue-600 font-medium">{order.price}</p>
                      <p className="text-gray-500 text-sm">{order.time}</p>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}