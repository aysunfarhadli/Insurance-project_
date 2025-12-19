import { useState } from 'react';
import { CalendarDays, User, Phone, Mail, MapPin, ArrowLeft, ArrowRight, Check, Plane } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { toast } from 'sonner';

interface TravelInsuranceFormProps {
  provider: any;
  onClose: () => void;
  onBack?: () => void;
}

export function TravelInsuranceForm({ provider, onClose, onBack }: TravelInsuranceFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Sigorta olunanın məlumatları
    personalInfo: {
      firstName: '',
      lastName: '',
      fatherName: '',
      passportNumber: '',
      finCode: '',
      birthDate: null
    },
    // Step 2: Əlaqə məlumatları
    contactInfo: {
      mobileNumber: '',
      email: '',
      city: '',
      country: ''
    }
  });

  const steps = [
    { id: 1, title: 'Sigorta olunanın məlumatları', icon: User },
    { id: 2, title: 'Əlaqə məlumatları', icon: Phone },
    { id: 3, title: 'Nəticə və təsdiq', icon: Check }
  ];

  const cities = [
    'Bakı',
    'Gəncə',
    'Sumqayıt',
    'Mingəçevir',
    'Naxçıvan',
    'Şəki',
    'Quba',
    'Lənkəran',
    'Şamaxı',
    'Qax',
    'Şuşa',
    'Digər'
  ];

  const countries = [
    'Azərbaycan',
    'Türkiyə',
    'Rusiya',
    'Gürcüstan',
    'İran',
    'Almaniya',
    'Fransa',
    'İtaliya',
    'İspaniya',
    'İngiltərə',
    'ABŞ',
    'Kanada',
    'Digər'
  ];

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('az-AZ');
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    toast.success('Səyahət sığortası müraciətiniz uğurla göndərildi!');
    onClose();
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return formData.personalInfo.firstName && 
               formData.personalInfo.lastName && 
               formData.personalInfo.fatherName &&
               formData.personalInfo.passportNumber &&
               formData.personalInfo.finCode &&
               formData.personalInfo.birthDate;
      case 2:
        return formData.contactInfo.mobileNumber && 
               formData.contactInfo.email && 
               formData.contactInfo.city &&
               formData.contactInfo.country;
      default:
        return true;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="firstName">Ad *</Label>
              <Input
                id="firstName"
                placeholder="Adınızı daxil edin"
                value={formData.personalInfo.firstName}
                onChange={(e) => handleInputChange('personalInfo', 'firstName', e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="lastName">Soyad *</Label>
              <Input
                id="lastName"
                placeholder="Soyadınızı daxil edin"
                value={formData.personalInfo.lastName}
                onChange={(e) => handleInputChange('personalInfo', 'lastName', e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="fatherName">Ata adı *</Label>
              <Input
                id="fatherName"
                placeholder="Ata adınızı daxil edin"
                value={formData.personalInfo.fatherName}
                onChange={(e) => handleInputChange('personalInfo', 'fatherName', e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="passportNumber">Passport nömrəsi *</Label>
              <Input
                id="passportNumber"
                placeholder="P1234567"
                value={formData.personalInfo.passportNumber}
                onChange={(e) => handleInputChange('personalInfo', 'passportNumber', e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="finCode">FIN kod *</Label>
              <Input
                id="finCode"
                placeholder="1ABCDEF"
                value={formData.personalInfo.finCode}
                onChange={(e) => handleInputChange('personalInfo', 'finCode', e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label>Doğum tarixi *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start mt-1">
                    <CalendarDays className="h-4 w-4 mr-2" />
                    {formData.personalInfo.birthDate ? formatDate(formData.personalInfo.birthDate) : 'Tarix seçin'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Calendar
                    mode="single"
                    selected={formData.personalInfo.birthDate}
                    onSelect={(date) => handleInputChange('personalInfo', 'birthDate', date)}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="mobileNumber">Mobil nömrə *</Label>
              <Input
                id="mobileNumber"
                type="tel"
                placeholder="+994 XX XXX XX XX"
                value={formData.contactInfo.mobileNumber}
                onChange={(e) => handleInputChange('contactInfo', 'mobileNumber', e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={formData.contactInfo.email}
                onChange={(e) => handleInputChange('contactInfo', 'email', e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="city">Şəhər *</Label>
              <Select onValueChange={(value) => handleInputChange('contactInfo', 'city', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Şəhər seçin" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="country">Ölkə *</Label>
              <Select onValueChange={(value) => handleInputChange('contactInfo', 'country', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Ölkə seçin" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-4">Yekun icmal</h3>
              <div className="space-y-4">
                {/* Personal Information Summary */}
                <Card className="p-4">
                  <h4 className="font-medium mb-3 flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Sigorta olunanın məlumatları
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ad:</span>
                      <span className="font-medium">{formData.personalInfo.firstName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Soyad:</span>
                      <span className="font-medium">{formData.personalInfo.lastName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ata adı:</span>
                      <span className="font-medium">{formData.personalInfo.fatherName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Passport nömrəsi:</span>
                      <span className="font-medium">{formData.personalInfo.passportNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">FIN kod:</span>
                      <span className="font-medium">{formData.personalInfo.finCode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Doğum tarixi:</span>
                      <span className="font-medium">
                        {formData.personalInfo.birthDate ? formatDate(formData.personalInfo.birthDate) : '-'}
                      </span>
                    </div>
                  </div>
                </Card>

                {/* Contact Information Summary */}
                <Card className="p-4">
                  <h4 className="font-medium mb-3 flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    Əlaqə məlumatları
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mobil nömrə:</span>
                      <span className="font-medium">{formData.contactInfo.mobileNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{formData.contactInfo.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Şəhər:</span>
                      <span className="font-medium">{formData.contactInfo.city}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ölkə:</span>
                      <span className="font-medium">{formData.contactInfo.country}</span>
                    </div>
                  </div>
                </Card>

                {/* Insurance Provider Summary */}
                <Card className="p-4 bg-blue-50 border-blue-200">
                  <h4 className="font-medium mb-3 flex items-center text-blue-900">
                    <Plane className="h-4 w-4 mr-2" />
                    Sığorta məlumatları
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-blue-800">
                    <div className="flex justify-between">
                      <span>Sığorta şirkəti:</span>
                      <span className="font-medium">{provider?.name || 'Seçilən provider'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sığorta növü:</span>
                      <span className="font-medium">Səyahət Sığortası</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Aylıq ödəniş:</span>
                      <span className="font-medium">{provider?.price || 'Məbləğ'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Əhatə:</span>
                      <span className="font-medium">{provider?.coverage || 'Əhatə məbləği'}</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                <strong>Qeyd:</strong> Təsdiq etdikdən sonra müraciətiniz işləmə üçün göndəriləcək. 
                Sığorta şirkətinin nümayəndəsi 24 saat ərzində sizinlə əlaqə saxlayacaq.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <div>
            <h1 className="text-2xl">Səyahət Sığortası Müraciəti</h1>
            <p className="text-gray-600">{provider?.name || 'Sığorta şirkəti'}</p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-8">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          
          return (
            <div key={step.id} className="flex items-center space-x-2">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center transition-colors
                ${isActive ? 'bg-blue-600 text-white' : 
                  isCompleted ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'}
              `}>
                {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
              </div>
              <div className="hidden md:block">
                <p className={`font-medium ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-600'}`}>
                  {step.title}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className={`hidden md:block w-16 h-0.5 mx-4 ${isCompleted ? 'bg-green-600' : 'bg-gray-200'}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Form Content */}
      <Card className="p-6">
        {/* Radio Button - özüm üçün */}
        {currentStep === 1 && (
          <div className="mt-2 mb-4">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="ozum-ucun-travel"
                name="ozum-ucun-travel"
                className="w-4 h-4 text-blue-600"
                defaultChecked
              />
              <label htmlFor="ozum-ucun-travel" className="text-sm font-normal cursor-pointer">
                özüm üçün
              </label>
            </div>
          </div>
        )}
        
        {renderStepContent()}
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={currentStep === 1 ? onClose : prevStep}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{currentStep === 1 ? 'Ləğv et' : 'Əvvəlki'}</span>
        </Button>
        
        <Button
          onClick={currentStep === 3 ? handleSubmit : nextStep}
          disabled={!validateCurrentStep()}
          className="flex items-center space-x-2"
        >
          <span>{currentStep === 3 ? 'Təsdiq et' : 'Növbəti'}</span>
          {currentStep !== 3 && <ArrowRight className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}