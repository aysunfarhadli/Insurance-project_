import { useState } from 'react';
import { Star, Clock, Shield, Heart, TrendingUp, Users, Award, Info } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

interface LifeInsuranceProvidersProps {
  onSelectProvider: (provider: any) => void;
}

export function LifeInsuranceProviders({ onSelectProvider }: LifeInsuranceProvidersProps) {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const lifeInsuranceProviders = [
    {
      id: 1,
      name: 'Mega Life Sığorta',
      rating: 4.9,
      reviews: 3241,
      monthlyPremium: {
        min: 65,
        max: 450
      },
      coverageRange: {
        min: 50000,
        max: 2000000
      },
      features: [
        'Ömürlük əhatə',
        'Dividendli planlar',
        'Kreditin ödənilməsi',
        'Kritik xəstəliklər'
      ],
      processingTime: '2-3 iş günü',
      color: 'bg-purple-100',
      badge: 'Ən Etibarlı',
      minAge: 18,
      maxAge: 65,
      medicalExamRequired: true,
      investmentOptions: true,
      familyDiscount: 15,
      returnOfPremium: true,
      criticalIllnessCoverage: true,
      accidentalDeath: true,
      score: 95
    },
    {
      id: 2,
      name: 'Paşa Həyat Sığorta',
      rating: 4.7,
      reviews: 2876,
      monthlyPremium: {
        min: 55,
        max: 380
      },
      coverageRange: {
        min: 40000,
        max: 1500000
      },
      features: [
        'Hibrid planlar',
        'Çevik ödəniş',
        'Pul-geri qaytarılması',
        'Uşaq təhsil planı'
      ],
      processingTime: '1-2 iş günü',
      color: 'bg-teal-100',
      badge: 'Ən Sürətli',
      minAge: 18,
      maxAge: 60,
      medicalExamRequired: false,
      investmentOptions: true,
      familyDiscount: 10,
      returnOfPremium: true,
      criticalIllnessCoverage: false,
      accidentalDeath: true,
      score: 88
    },
    {
      id: 3,
      name: 'ASCO Premium Life',
      rating: 4.8,
      reviews: 1934,
      monthlyPremium: {
        min: 85,
        max: 650
      },
      coverageRange: {
        min: 75000,
        max: 5000000
      },
      features: [
        'VIP xidmətlər',
        'Beynəlxalq əhatə',
        'Investisiya komponenti',
        'Premium məsləhətçi'
      ],
      processingTime: '3-5 iş günü',
      color: 'bg-blue-100',
      badge: 'Premium',
      minAge: 25,
      maxAge: 70,
      medicalExamRequired: true,
      investmentOptions: true,
      familyDiscount: 20,
      returnOfPremium: true,
      criticalIllnessCoverage: true,
      accidentalDeath: true,
      score: 92
    },
    {
      id: 4,
      name: 'Atəşgah Həyat Plus',
      rating: 4.5,
      reviews: 1567,
      monthlyPremium: {
        min: 35,
        max: 250
      },
      coverageRange: {
        min: 30000,
        max: 800000
      },
      features: [
        'Əsas qoruma',
        'Sadə şərtlər',
        'Sərfəli qiymət',
        'Tez aktivləşmə'
      ],
      processingTime: '1 iş günü',
      color: 'bg-green-100',
      badge: 'Ən Sərfəli',
      minAge: 18,
      maxAge: 55,
      medicalExamRequired: false,
      investmentOptions: false,
      familyDiscount: 5,
      returnOfPremium: false,
      criticalIllnessCoverage: false,
      accidentalDeath: false,
      score: 78
    }
  ];

  const filters = [
    { id: 'all', name: 'Hamısı' },
    { id: 'affordable', name: 'Sərfəli' },
    { id: 'premium', name: 'Premium' },
    { id: 'fast', name: 'Sürətli' },
    { id: 'investment', name: 'İnvestisiya' }
  ];

  const getFilteredProviders = () => {
    switch (selectedFilter) {
      case 'affordable':
        return lifeInsuranceProviders.filter(p => p.monthlyPremium.min < 60);
      case 'premium':
        return lifeInsuranceProviders.filter(p => p.badge === 'Premium' || p.monthlyPremium.max > 500);
      case 'fast':
        return lifeInsuranceProviders.filter(p => p.processingTime.includes('1'));
      case 'investment':
        return lifeInsuranceProviders.filter(p => p.investmentOptions);
      default:
        return lifeInsuranceProviders;
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
                  <Heart className="h-6 w-6 text-gray-600" />
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
                  <span className="text-sm text-gray-600">Reytinq:</span>
                  <Progress value={provider.score} className="w-16 h-2" />
                  <span className="text-sm font-medium">{provider.score}</span>
                </div>
              </div>
            </div>

            {/* Key Info */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Aylıq ödəniş:</span>
                  <span className="font-medium text-blue-600">
                    {provider.monthlyPremium.min}-{provider.monthlyPremium.max} AZN
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Əhatə məbləği:</span>
                  <span className="font-medium">
                    {(provider.coverageRange.min / 1000)}K-{(provider.coverageRange.max / 1000)}K AZN
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Yaş aralığı:</span>
                  <span className="font-medium">{provider.minAge}-{provider.maxAge} yaş</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">İcra müddəti:</span>
                  <span className="font-medium flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {provider.processingTime}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Ailə endirimi:</span>
                  <span className="font-medium text-green-600">{provider.familyDiscount}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tibbi müayinə:</span>
                  <span className="font-medium">
                    {provider.medicalExamRequired ? 'Tələb olunur' : 'Tələb olunmur'}
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

            {/* Additional Benefits */}
            <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
              <div className={`flex items-center space-x-1 ${provider.investmentOptions ? 'text-green-600' : 'text-gray-400'}`}>
                <TrendingUp className="h-3 w-3" />
                <span>İnvestisiya</span>
              </div>
              <div className={`flex items-center space-x-1 ${provider.returnOfPremium ? 'text-green-600' : 'text-gray-400'}`}>
                <Award className="h-3 w-3" />
                <span>Pul-geri</span>
              </div>
              <div className={`flex items-center space-x-1 ${provider.criticalIllnessCoverage ? 'text-green-600' : 'text-gray-400'}`}>
                <Shield className="h-3 w-3" />
                <span>Kritik xəstəlik</span>
              </div>
              <div className={`flex items-center space-x-1 ${provider.accidentalDeath ? 'text-green-600' : 'text-gray-400'}`}>
                <Users className="h-3 w-3" />
                <span>Qəza ölümü</span>
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
      <Card className="p-6 bg-purple-50 border-purple-200">
        <h3 className="font-medium mb-3 text-purple-900 flex items-center">
          <Heart className="h-5 w-5 mr-2" />
          Həyat Sığortası haqqında
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-purple-800">
          <div>
            <h4 className="font-medium mb-2">Faydaları:</h4>
            <ul className="space-y-1 text-purple-700">
              <li>• Ailənin maliyyə təhlükəsizliyi</li>
              <li>• Borcların ödənilməsi</li>
              <li>• Uşaqların təhsil xərcləri</li>
              <li>• Pensiya planlaması</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Növləri:</h4>
            <ul className="space-y-1 text-purple-700">
              <li>• Müddətli həyat sığortası</li>
              <li>• Ömürlük həyat sığortası</li>
              <li>• Universal həyat sığortası</li>
              <li>• Hibrid planlar</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Əlavə imkanlar:</h4>
            <ul className="space-y-1 text-purple-700">
              <li>• İnvestisiya komponenti</li>
              <li>• Kritik xəstəlik əhatəsi</li>
              <li>• Premiumun geri qaytarılması</li>
              <li>• Ailə üzvləri üçün endirim</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}