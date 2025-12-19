import { useState } from 'react';
import { ArrowLeft, Filter, Star, Clock, MapPin, Shield } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { InsuranceOrderForm } from './InsuranceOrderForm';
import { LifeInsuranceForm } from './LifeInsuranceForm';
import { LifeInsuranceProviders } from './LifeInsuranceProviders';
import { TravelInsuranceForm } from './TravelInsuranceForm';
import { TravelInsuranceProviders } from './TravelInsuranceProviders';
import { MotorLiabilityForm } from './MotorLiabilityForm';
import { PropertyInsuranceForm } from './PropertyInsuranceForm';
import { PropertyOperationForm } from './PropertyOperationForm';
import { EmployerLiabilityForm } from './EmployerLiabilityForm';
import { PassengerAccidentForm } from './PassengerAccidentForm';
import { HazardousFacilitiesForm } from './HazardousFacilitiesForm';

interface CategoryViewProps {
  category: any;
  onBack: () => void;
  onPaymentSuccess?: (data: any) => void;
}

export function CategoryView({ category, onBack, onPaymentSuccess }: CategoryViewProps) {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [showLifeInsuranceForm, setShowLifeInsuranceForm] = useState(false);
  const [showTravelInsuranceForm, setShowTravelInsuranceForm] = useState(false);
  const [showMotorLiabilityForm, setShowMotorLiabilityForm] = useState(false);
  const [showPropertyInsuranceForm, setShowPropertyInsuranceForm] = useState(false);
  const [showPropertyOperationForm, setShowPropertyOperationForm] = useState(false);
  const [showEmployerLiabilityForm, setShowEmployerLiabilityForm] = useState(false);
  const [showPassengerAccidentForm, setShowPassengerAccidentForm] = useState(false);
  const [showHazardousFacilitiesForm, setShowHazardousFacilitiesForm] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);

  const insuranceProviders = [
    {
      id: 1,
      name: 'Mega Sığorta',
      rating: 4.8,
      reviews: 2341,
      price: '45 AZN/ay',
      coverage: '50,000 AZN',
      features: ['24/7 Dəstək', 'Tez Ödəniş', 'Beynəlxalq Əhatə'],
      processingTime: '2 saat',
      color: 'bg-purple-100',
      badge: 'Ən Populyar'
    },
    {
      id: 2,
      name: 'Paşa Sığorta',
      rating: 4.6,
      reviews: 1876,
      price: '38 AZN/ay',
      coverage: '40,000 AZN',
      features: ['Online Xidmət', 'Sürətli Qeydiyyat', 'Mobil Tətbiq'],
      processingTime: '1 saat',
      color: 'bg-teal-100',
      badge: 'Ən Sürətli'
    },
    {
      id: 3,
      name: 'ASCO Sığorta',
      rating: 4.7,
      reviews: 1234,
      price: '52 AZN/ay',
      coverage: '75,000 AZN',
      features: ['Premium Xidmət', 'VIP Dəstək', 'Genişləndirilmiş Əhatə'],
      processingTime: '3 saat',
      color: 'bg-blue-100',
      badge: 'Premium'
    },
    {
      id: 4,
      name: 'Atəşgah Sığorta',
      rating: 4.5,
      reviews: 987,
      price: '32 AZN/ay',
      coverage: '30,000 AZN',
      features: ['Əsas Əhatə', 'Standart Dəstək', 'Sənədləşmə'],
      processingTime: '4 saat',
      color: 'bg-green-100',
      badge: 'Budget'
    }
  ];

  const filters = [
    { id: 'all', name: 'Hamısı' },
    { id: 'popular', name: 'Populyar' },
    { id: 'cheapest', name: 'Ən Ucuz' },
    { id: 'fastest', name: 'Ən Sürətli' },
    { id: 'premium', name: 'Premium' }
  ];

  const getFilteredProviders = () => {
    switch (selectedFilter) {
      case 'popular':
        return insuranceProviders.filter(p => p.badge === 'Ən Populyar');
      case 'cheapest':
        return [...insuranceProviders].sort((a, b) => 
          parseInt(a.price.split(' ')[0]) - parseInt(b.price.split(' ')[0])
        );
      case 'fastest':
        return [...insuranceProviders].sort((a, b) => 
          parseInt(a.processingTime.split(' ')[0]) - parseInt(b.processingTime.split(' ')[0])
        );
      case 'premium':
        return insuranceProviders.filter(p => p.badge === 'Premium');
      default:
        return insuranceProviders;
    }
  };

  // Show life insurance form if selected
  if (showLifeInsuranceForm && category.name === 'Həyat') {
    return (
      <LifeInsuranceForm 
        provider={selectedProvider}
        onBack={() => setShowLifeInsuranceForm(false)}
        onClose={() => {
          setShowLifeInsuranceForm(false);
          onBack();
        }}
      />
    );
  }

  // Show travel insurance form if selected
  if (showTravelInsuranceForm && category.name === 'Səyahət') {
    return (
      <TravelInsuranceForm 
        provider={selectedProvider}
        onBack={() => setShowTravelInsuranceForm(false)}
        onClose={() => {
          setShowTravelInsuranceForm(false);
          onBack();
        }}
      />
    );
  }

  // Show motor liability form if selected
  if (showMotorLiabilityForm && category.name === 'Avtomobil Məsuliyyət') {
    return (
      <MotorLiabilityForm 
        provider={selectedProvider}
        onBack={() => setShowMotorLiabilityForm(false)}
        onClose={() => {
          setShowMotorLiabilityForm(false);
          onBack();
        }}
        onPaymentSuccess={onPaymentSuccess}
      />
    );
  }

  // Show property insurance form if selected
  if (showPropertyInsuranceForm && category.name === 'İcbari Əmlak') {
    return (
      <PropertyInsuranceForm 
        provider={selectedProvider}
        onBack={() => setShowPropertyInsuranceForm(false)}
        onClose={() => {
          setShowPropertyInsuranceForm(false);
          onBack();
        }}
      />
    );
  }

  // Show property operation form if selected
  if (showPropertyOperationForm && category.name === 'Əmlak Əməliyyatları') {
    return (
      <PropertyOperationForm 
        provider={selectedProvider}
        onBack={() => setShowPropertyOperationForm(false)}
        onClose={() => {
          setShowPropertyOperationForm(false);
          onBack();
        }}
      />
    );
  }

  // Show employer liability form if selected
  if (showEmployerLiabilityForm && category.name === 'İşəgötürən Məsuliyyəti') {
    return (
      <EmployerLiabilityForm 
        provider={selectedProvider}
        onBack={() => setShowEmployerLiabilityForm(false)}
        onClose={() => {
          setShowEmployerLiabilityForm(false);
          onBack();
        }}
      />
    );
  }

  // Show passenger accident form if selected
  if (showPassengerAccidentForm && category.name === 'Sərnişin Qəzası') {
    return (
      <PassengerAccidentForm 
        provider={selectedProvider}
        onBack={() => setShowPassengerAccidentForm(false)}
        onClose={() => {
          setShowPassengerAccidentForm(false);
          onBack();
        }}
      />
    );
  }

  // Show hazardous facilities form if selected
  if (showHazardousFacilitiesForm && category.name === 'Təhlükəli Obyektlər') {
    return (
      <HazardousFacilitiesForm 
        provider={selectedProvider}
        onBack={() => setShowHazardousFacilitiesForm(false)}
        onClose={() => {
          setShowHazardousFacilitiesForm(false);
          onBack();
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`${category.color} p-3 rounded-lg`}>
            <category.icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl">{category.name} Sığortası</h1>
            <p className="text-gray-600">{category.description}</p>
          </div>
        </div>
        <Button variant="outline" className="flex items-center space-x-2">
          <Filter className="h-4 w-4" />
          <span>Filtr</span>
        </Button>
      </div>

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

      {/* Insurance Providers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {getFilteredProviders().map((provider) => (
            <Card key={provider.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`${provider.color} p-2 rounded-lg`}>
                    <Shield className="h-5 w-5 text-gray-600" />
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
                {provider.badge && (
                  <Badge variant="secondary" className="text-xs">
                    {provider.badge}
                  </Badge>
                )}
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">Aylıq ödəniş:</span>
                  <span className="font-medium text-blue-600">{provider.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">Əhatə məbləği:</span>
                  <span className="font-medium">{provider.coverage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">İcra müddəti:</span>
                  <span className="font-medium flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {provider.processingTime}
                  </span>
                </div>
              </div>

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

              <div className="flex space-x-2">
                <Button variant="outline" className="flex-1" size="sm">
                  Ətraflı
                </Button>
                <Button 
                  className="flex-1" 
                  size="sm"
                  onClick={() => {
                    setSelectedProvider(provider);
                    if (category.name === 'Səyahət') {
                      setShowTravelInsuranceForm(true);
                    } else if (category.name === 'Həyat') {
                      setShowLifeInsuranceForm(true);
                    } else if (category.name === 'Avtomobil Məsuliyyət') {
                      setShowMotorLiabilityForm(true);
                    } else if (category.name === 'İcbari Əmlak') {
                      setShowPropertyInsuranceForm(true);
                    } else if (category.name === 'Əmlak Əməliyyatları') {
                      setShowPropertyOperationForm(true);
                    } else if (category.name === 'İşəgötürən Məsuliyyəti') {
                      setShowEmployerLiabilityForm(true);
                    } else if (category.name === 'Sərnişin Qəzası') {
                      setShowPassengerAccidentForm(true);
                    } else if (category.name === 'Təhlükəli Obyektlər') {
                      setShowHazardousFacilitiesForm(true);
                    }
                  }}
                >
                  Sifariş et
                </Button>
              </div>
            </Card>
          ))}
        </div>

      {/* Info Section */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="font-medium mb-3 text-blue-900">
          {category.name} Sığortası haqqında
        </h3>
        <p className="text-sm text-blue-800">
          {category.description}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800 mt-4">
          <div>
            <h4 className="font-medium mb-2">Əsas xüsusiyyətlər:</h4>
            <ul className="space-y-1 text-blue-700">
              <li>• İcbari sığorta növü</li>
              <li>• Qanunvericiliyə uyğun əhatə</li>
              <li>• Sürətli rəsmiləşdirmə</li>
              <li>• Beynəlxalq standartlara uyğun</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Lazım olan sənədlər:</h4>
            <ul className="space-y-1 text-blue-700">
              <li>• Şəxsiyyət vəsiqəsi / FİN</li>
              <li>• VÖEN (hüquqi şəxslər üçün)</li>
              <li>• Əlaqə məlumatları</li>
              <li>• Kateqoriyaya aid xüsusi sənədlər</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}