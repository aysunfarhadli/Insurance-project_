import { useState } from 'react';
import { CalendarDays, User, Phone, Mail, MapPin, CreditCard, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Checkbox } from './ui/checkbox';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { toast } from 'sonner';

interface InsuranceOrderFormProps {
  provider: any;
  category: any;
  onClose: () => void;
}

export function InsuranceOrderForm({ provider, category, onClose }: InsuranceOrderFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: '',
      lastName: '',
      idNumber: '',
      birthDate: null,
      phone: '',
      email: '',
      address: ''
    },
    insuranceDetails: {
      startDate: null,
      endDate: null,
      coverage: '',
      beneficiary: '',
      additionalOptions: []
    },
    payment: {
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardHolder: ''
    }
  });

  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSubmit = () => {
    // Simulate order submission
    toast.success('Sığorta sifarişiniz uğurla göndərildi!');
    onClose();
  };

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('az-AZ');
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="font-medium flex items-center">
              <User className="h-4 w-4 mr-2" />
              Şəxsi məlumatlar
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">Ad</Label>
                <Input
                  id="firstName"
                  placeholder="Adınızı daxil edin"
                  value={formData.personalInfo.firstName}
                  onChange={(e) => handleInputChange('personalInfo', 'firstName', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Soyad</Label>
                <Input
                  id="lastName"
                  placeholder="Soyadınızı daxil edin"
                  value={formData.personalInfo.lastName}
                  onChange={(e) => handleInputChange('personalInfo', 'lastName', e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="idNumber">Şəxsiyyət vəsiqəsi nömrəsi</Label>
                <Input
                  id="idNumber"
                  placeholder="AZE1234567"
                  value={formData.personalInfo.idNumber}
                  onChange={(e) => handleInputChange('personalInfo', 'idNumber', e.target.value)}
                />
              </div>
              <div>
                <Label>Doğum tarixi</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Telefon nömrəsi</Label>
                <Input
                  id="phone"
                  placeholder="+994 XX XXX XX XX"
                  value={formData.personalInfo.phone}
                  onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="email">Email ünvanı</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={formData.personalInfo.email}
                  onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Ünvan</Label>
              <Textarea
                id="address"
                placeholder="Tam ünvanınızı daxil edin"
                value={formData.personalInfo.address}
                onChange={(e) => handleInputChange('personalInfo', 'address', e.target.value)}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="font-medium flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Sığorta məlumatları
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Başlama tarixi</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarDays className="h-4 w-4 mr-2" />
                      {formData.insuranceDetails.startDate ? formatDate(formData.insuranceDetails.startDate) : 'Tarix seçin'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Calendar
                      mode="single"
                      selected={formData.insuranceDetails.startDate}
                      onSelect={(date) => handleInputChange('insuranceDetails', 'startDate', date)}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label>Bitmə tarixi</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarDays className="h-4 w-4 mr-2" />
                      {formData.insuranceDetails.endDate ? formatDate(formData.insuranceDetails.endDate) : 'Tarix seçin'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Calendar
                      mode="single"
                      selected={formData.insuranceDetails.endDate}
                      onSelect={(date) => handleInputChange('insuranceDetails', 'endDate', date)}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div>
              <Label htmlFor="coverage">Əhatə məbləği</Label>
              <Select onValueChange={(value) => handleInputChange('insuranceDetails', 'coverage', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Əhatə məbləği seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30000">30,000 AZN</SelectItem>
                  <SelectItem value="50000">50,000 AZN</SelectItem>
                  <SelectItem value="75000">75,000 AZN</SelectItem>
                  <SelectItem value="100000">100,000 AZN</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="beneficiary">Benefisiar (varisi)</Label>
              <Input
                id="beneficiary"
                placeholder="Varislərinin adları"
                value={formData.insuranceDetails.beneficiary}
                onChange={(e) => handleInputChange('insuranceDetails', 'beneficiary', e.target.value)}
              />
            </div>

            <div>
              <Label>Əlavə xidmətlər</Label>
              <div className="space-y-2 mt-2">
                {provider.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox id={`feature-${index}`} />
                    <Label htmlFor={`feature-${index}`} className="text-sm">{feature}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="font-medium flex items-center">
              <CreditCard className="h-4 w-4 mr-2" />
              Ödəniş məlumatları
            </h3>
            
            <div>
              <Label htmlFor="cardNumber">Kart nömrəsi</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={formData.payment.cardNumber}
                onChange={(e) => handleInputChange('payment', 'cardNumber', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiryDate">Son istifadə tarixi</Label>
                <Input
                  id="expiryDate"
                  placeholder="MM/YY"
                  value={formData.payment.expiryDate}
                  onChange={(e) => handleInputChange('payment', 'expiryDate', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={formData.payment.cvv}
                  onChange={(e) => handleInputChange('payment', 'cvv', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="cardHolder">Kart sahibinin adı</Label>
              <Input
                id="cardHolder"
                placeholder="Ad Soyad"
                value={formData.payment.cardHolder}
                onChange={(e) => handleInputChange('payment', 'cardHolder', e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="terms" 
                checked={agreedToTerms}
                onCheckedChange={setAgreedToTerms}
              />
              <Label htmlFor="terms" className="text-sm">
                Şərtlər və qaydalarla razıyam
              </Label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Order Summary */}
      <Card className="p-4 bg-gray-50">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-medium">{provider.name}</h4>
            <p className="text-sm text-gray-600">{category.name} Sığortası</p>
          </div>
          <div className="text-right">
            <p className="font-medium text-blue-600">{provider.price}</p>
            <Badge variant="secondary" className="text-xs">{provider.badge}</Badge>
          </div>
        </div>
      </Card>

      {/* Step Indicator */}
      <div className="flex items-center justify-center space-x-4">
        {[1, 2, 3].map((stepNumber) => (
          <div
            key={stepNumber}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= stepNumber
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {stepNumber}
          </div>
        ))}
      </div>

      {/* Form Content */}
      <div className="min-h-[400px]">
        {/* Radio Button - özüm üçün */}
        <div className="mt-2 mb-3">
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="ozum-ucun-order"
              name="ozum-ucun-order"
              className="w-4 h-4 text-blue-600"
              defaultChecked
            />
            <label htmlFor="ozum-ucun-order" className="text-sm font-normal cursor-pointer">
              özüm üçün
            </label>
          </div>
        </div>
        
        {renderStepContent()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => {
            if (step === 1) {
              onClose();
            } else {
              setStep(step - 1);
            }
          }}
        >
          {step === 1 ? 'Ləğv et' : 'Geri'}
        </Button>
        
        <Button
          onClick={() => {
            if (step === 3) {
              handleSubmit();
            } else {
              setStep(step + 1);
            }
          }}
          disabled={step === 3 && !agreedToTerms}
        >
          {step === 3 ? 'Sifarişi tamamla' : 'Növbəti'}
        </Button>
      </div>
    </div>
  );
}