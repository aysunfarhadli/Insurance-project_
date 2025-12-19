import { useState } from 'react';
import { Star, Clock, Shield, Plane, Globe, MapPin, Award, Info, Users, Heart } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

interface TravelInsuranceProvidersProps {
  onSelectProvider: (provider: any) => void;
}

export function TravelInsuranceProviders({ onSelectProvider }: TravelInsuranceProvidersProps) {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const travelInsuranceProviders = [
    {
      id: 1,
      name: 'Mega Travel Sığorta',
      rating: 4.9,
      reviews: 4521,
      dailyPremium: {
        min: 3,
        max: 15
      },
      coverageRange: {
        min: 30000,
        max: 150000
      },
      features: [
        'Beynəlxalq əhatə',
        'COVID-19 əhatəsi',
        'Sürətli ödəniş',
        '24/7 Dəstək'
      ],
      processingTime: '2-3 saat',
      color: 'bg-blue-100',
      badge: 'Ən Populyar',
      regions: ['Avropa', 'Asiya', 'Amerika', 'Afrika'],
      medicalEmergency: true,
      tripCancellation: true,
      luggageLoss: true,
      flightDelay: true,
      sportsActivities: false,
      score: 95,
      countries: 180
    },
    {
      id: 2,
      name: 'Paşa Travel Plus',
      rating: 4.7,
      reviews: 3892,
      dailyPremium: {
        min: 2,
        max: 12
      },
      coverageRange: {
        min: 25000,
        max: 100000
      },
      features: [
        'Sürətli rəsmiləşdirmə',
        'Online idarəetmə',
        'Çevik şərtlər',
        'Məşqul vaxtda dəstək'
      ],
      processingTime: '1 saat',
      color: 'bg-teal-100',
      badge: 'Ən Sürətli',
      regions: ['Avropa', 'Asiya', 'GCC'],
      medicalEmergency: true,
      tripCancellation: false,
      luggageLoss: true,
      flightDelay: true,
      sportsActivities: false,
      score: 88,
      countries: 150
    },
    {
      id: 3,
      name: 'ASCO Global Travel',
      rating: 4.8,
      reviews: 2456,
      dailyPremium: {
        min: 5,
        max: 25
      },
      coverageRange: {
        min: 50000,
        max: 300000
      },
      features: [
        'Premium xidmət',
        'Ekstrem idmanlar',
        'İş səyahətləri',
        'VIP dəstək'
      ],
      processingTime: '3-5 saat',
      color: 'bg-purple-100',
      badge: 'Premium',
      regions: ['Dünya üzrə'],
      medicalEmergency: true,
      tripCancellation: true,
      luggageLoss: true,
      flightDelay: true,
      sportsActivities: true,
      score: 92,
      countries: 195
    },
    {
      id: 4,
      name: 'Atəşgah Budget Travel',
      rating: 4.4,
      reviews: 1876,
      dailyPremium: {
        min: 1,
        max: 8
      },
      coverageRange: {
        min: 15000,
        max: 50000
      },
      features: [
        'Əsas əhatə',
        'Sərfəli qiymət',
        'Sadə prosedur',
        'Yaxın ölkələr'
      ],
      processingTime: '30 dəqiqə',
      color: 'bg-green-100',
      badge: 'Ən Ucuz',
      regions: ['Avropa', 'Asiya'],
      medicalEmergency: true,
      tripCancellation: false,
      luggageLoss: false,
      flightDelay: false,
      sportsActivities: false,
      score: 78,
      countries: 80
    }
  ];

  const filters = [
    { id: 'all', name: 'Hamısı' },
    { id: 'budget', name: 'Sərfəli' },
    { id: 'premium', name: 'Premium' },
    { id: 'fast', name: 'Sürətli' },
    { id: 'worldwide', name: 'Dünyageniş' }
  ];

  const getFilteredProviders = () => {
    switch (selectedFilter) {
      case 'budget':
        return travelInsuranceProviders.filter(p => p.dailyPremium.min <= 2);
      case 'premium':
        return travelInsuranceProviders.filter(p => p.badge === 'Premium' || p.dailyPremium.max > 20);
      case 'fast':
        return travelInsuranceProviders.filter(p => p.processingTime.includes('saat') && parseInt(p.processingTime) <= 3);
      case 'worldwide':
        return travelInsuranceProviders.filter(p => p.countries >= 180);
      default:
        return travelInsuranceProviders;
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {filters.map((filter) => (
          <Button
            key={filter.id}
            variant={selectedFilter === filter.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedFilter(filter.id)}
            className="whitespace-nowrap"
          >
            {filter.name}
          </Button>
        ))}
      </div>

      {/* Providers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {getFilteredProviders().map((provider) => (
          <Card key={provider.id} className="p-6 hover:shadow-lg transition-shadow">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div className={`${provider.color} p-3 rounded-lg`}>
                  <Plane className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-medium">{provider.name}</h3>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">
                      {provider.rating} ({provider.reviews} rəy)
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                {provider.badge && (
                  <Badge variant="secondary" className="mb-2">
                    {provider.badge}
                  </Badge>
                )}
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-gray-600">Reytinq:</span>
                  <Progress value={provider.score} className="w-12 h-2" />
                  <span className="text-xs font-medium">{provider.score}</span>
                </div>
              </div>
            </div>

            {/* Key Info */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Günlük:</span>
                  <span className="font-medium text-blue-600">
                    {provider.dailyPremium.min}-{provider.dailyPremium.max} AZN
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Əhatə məbləği:</span>
                  <span className="font-medium">
                    {(provider.coverageRange.min / 1000)}K-{(provider.coverageRange.max / 1000)}K EUR
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Ölkələr:</span>
                  <span className="font-medium flex items-center">
                    <Globe className="h-3 w-3 mr-1" />
                    {provider.countries}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Rəsmiləşdirmə:</span>
                  <span className="font-medium flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {provider.processingTime}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Regionlar:</span>
                  <span className="font-medium text-xs">
                    {provider.regions.slice(0, 2).join(', ')}
                    {provider.regions.length > 2 && '...'}
                  </span>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Xüsusiyyətlər:</p>
              <div className="flex flex-wrap gap-1">
                {provider.features.map((feature, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Coverage Benefits */}
            <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
              <div className={`flex items-center space-x-1 ${provider.medicalEmergency ? 'text-green-600' : 'text-gray-400'}`}>
                <Heart className="h-3 w-3" />
                <span>Tibbi təcili</span>
              </div>
              <div className={`flex items-center space-x-1 ${provider.tripCancellation ? 'text-green-600' : 'text-gray-400'}`}>
                <Shield className="h-3 w-3" />
                <span>Səyahət ləğvi</span>
              </div>
              <div className={`flex items-center space-x-1 ${provider.luggageLoss ? 'text-green-600' : 'text-gray-400'}`}>
                <Users className="h-3 w-3" />
                <span>Baqaj itkisi</span>
              </div>
              <div className={`flex items-center space-x-1 ${provider.flightDelay ? 'text-green-600' : 'text-gray-400'}`}>
                <Clock className="h-3 w-3" />
                <span>Uçuş gecikmə</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <Button variant="outline" className="flex-1" size="sm">
                <Info className="h-4 w-4 mr-1" />
                Ətraflı
              </Button>
              <Button 
                className="flex-1" 
                size="sm"
                onClick={() => onSelectProvider(provider)}
              >
                Müraciət et
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Info Section */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="font-medium mb-3 text-blue-900 flex items-center">
          <Plane className="h-5 w-5 mr-2" />
          Səyahət Sığortası haqqında
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-blue-800">
          <div>
            <h4 className="font-medium mb-2">Nə əhatə edir:</h4>
            <ul className="space-y-1 text-blue-700">
              <li>• Tibbi təcili yardım</li>
              <li>• Tibbi evakuasiya</li>
              <li>• Səyahət ləğvi və kəsilməsi</li>
              <li>• Baqaj itkisi və gecikmə</li>
              <li>• Uçuş gecikmə və ləğvi</li>
              <li>• Şəxsi məsuliyyət</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Səyahət növləri:</h4>
            <ul className="space-y-1 text-blue-700">
              <li>• Turizm səyahətləri</li>
              <li>• İş səyahətləri</li>
              <li>• Təhsil səyahətləri</li>
              <li>• Çoxlu səyahətlər</li>
              <li>• Ailə səyahətləri</li>
              <li>• Ekstrem idman</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Vacib qeydlər:</h4>
            <ul className="space-y-1 text-blue-700">
              <li>• Səyahətdən əvvəl al</li>
              <li>• Pasport və viza tələbləri</li>
              <li>• Mövcud xəstəliklər barədə məlumat</li>
              <li>• Fəaliyyət məhdudiyyətləri</li>
              <li>• Təcili əlaqə nömrələri</li>
              <li>• Mobil tətbiqdən istifadə</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}