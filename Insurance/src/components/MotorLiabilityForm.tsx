import { useState } from 'react';
import { ArrowLeft, Car, User, Phone, Mail, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Card } from './ui/card';
import { toast } from 'sonner';
import { Textarea } from './ui/textarea';

interface MotorLiabilityFormProps {
  provider: any;
  onBack: () => void;
  onClose: () => void;
  onPaymentSuccess?: (data: any) => void;
}

export function MotorLiabilityForm({ provider, onBack, onClose, onPaymentSuccess }: MotorLiabilityFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    ownerName: '',
    finId: '',
    tin: '',
    contactNumber: '',
    email: '',
    registrationAddress: '',
    licensePlate: '',
    vin: '',
    makeModel: '',
    yearOfManufacture: '',
    engineVolume: '',
    fuelType: '',
    usageType: '',
    ownershipType: '',
    previousPolicyNumber: '',
    startDate: null,
    duration: '1 il',
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('az-AZ');
  };

  const handleSubmit = () => {
    toast.success('Avtomobil məsuliyyət sığortası sifarişiniz uğurla göndərildi!');
    
    // Trigger payment success if handler is provided
    if (onPaymentSuccess) {
      const paymentData = {
        policyName: 'Avtomobil Məsuliyyət Sığortası',
        policyNumber: `POL-${Date.now()}`,
        paidAmount: '150.00 AZN',
        paymentDate: new Date().toLocaleDateString('az-AZ', { day: 'numeric', month: 'long', year: 'numeric' }),
        email: 'example@email.com'
      };
      onPaymentSuccess(paymentData);
    } else {
      onClose();
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="font-medium flex items-center">
              <User className="h-4 w-4 mr-2" />
              Sahibkar məlumatları
            </h3>

            {/* Radio Button - özüm üçün */}
            <div style={{ marginTop: '8px', marginBottom: '12px' }}>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="ozum-ucun-motor"
                  name="ozum-ucun-motor"
                  className="w-4 h-4 text-blue-600"
                  defaultChecked
                />
                <label htmlFor="ozum-ucun-motor" className="text-sm font-normal cursor-pointer">
                  özüm üçün
                </label>
              </div>
            </div>

            <div>
              <Label htmlFor="ownerName">Sahibkarın tam adı *</Label>
              <Input
                id="ownerName"
                placeholder="Ad və soyadınızı daxil edin"
                value={formData.ownerName}
                onChange={(e) => handleInputChange('ownerName', e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="finId">FİN / Şəxsiyyət vəsiqəsi nömrəsi *</Label>
                <Input
                  id="finId"
                  placeholder="AZE1234567"
                  value={formData.finId}
                  onChange={(e) => handleInputChange('finId', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="tin">VÖEN (hüquqi şəxs üçün)</Label>
                <Input
                  id="tin"
                  placeholder="1234567890"
                  value={formData.tin}
                  onChange={(e) => handleInputChange('tin', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contactNumber">Əlaqə nömrəsi *</Label>
                <Input
                  id="contactNumber"
                  placeholder="+994 XX XXX XX XX"
                  value={formData.contactNumber}
                  onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="registrationAddress">Qeydiyyat ünvanı</Label>
              <Textarea
                id="registrationAddress"
                placeholder="Tam ünvanınızı daxil edin"
                value={formData.registrationAddress}
                onChange={(e) => handleInputChange('registrationAddress', e.target.value)}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="font-medium flex items-center">
              <Car className="h-4 w-4 mr-2" />
              Nəqliyyat vasitəsi məlumatları
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="licensePlate">Dövlət nömrə nişanı *</Label>
                <Input
                  id="licensePlate"
                  placeholder="10-AA-123"
                  value={formData.licensePlate}
                  onChange={(e) => handleInputChange('licensePlate', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="vin">VIN (şassi nömrəsi) *</Label>
                <Input
                  id="vin"
                  placeholder="1HGBH41JXMN109186"
                  value={formData.vin}
                  onChange={(e) => handleInputChange('vin', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="makeModel">Marka/Model *</Label>
                <Input
                  id="makeModel"
                  placeholder="Toyota Camry"
                  value={formData.makeModel}
                  onChange={(e) => handleInputChange('makeModel', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="yearOfManufacture">İstehsal ili *</Label>
                <Input
                  id="yearOfManufacture"
                  placeholder="2020"
                  value={formData.yearOfManufacture}
                  onChange={(e) => handleInputChange('yearOfManufacture', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="engineVolume">Mühərrik həcmi</Label>
                <Input
                  id="engineVolume"
                  placeholder="2.5L"
                  value={formData.engineVolume}
                  onChange={(e) => handleInputChange('engineVolume', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="fuelType">Yanacaq növü</Label>
                <Select onValueChange={(value) => handleInputChange('fuelType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Yanacaq növünü seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="benzin">Benzin</SelectItem>
                    <SelectItem value="dizel">Dizel</SelectItem>
                    <SelectItem value="elektrik">Elektrik</SelectItem>
                    <SelectItem value="hibrid">Hibrid</SelectItem>
                    <SelectItem value="qaz">Qaz</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="usageType">İstifadə növü *</Label>
                <Select onValueChange={(value) => handleInputChange('usageType', value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="İstifadə növünü seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="shexsi">Şəxsi</SelectItem>
                    <SelectItem value="taksi">Taksi</SelectItem>
                    <SelectItem value="kommersiya">Kommersiya</SelectItem>
                    <SelectItem value="ictimai">İctimai nəqliyyat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="ownershipType">Mülkiyyət növü</Label>
                <Select onValueChange={(value) => handleInputChange('ownershipType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Mülkiyyət növünü seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fiziki">Fiziki şəxs</SelectItem>
                    <SelectItem value="huquqi">Hüquqi şəxs</SelectItem>
                    <SelectItem value="lizinq">Lizinq</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="previousPolicyNumber">Əvvəlki sığorta polisi nömrəsi (bonus-malus üçün)</Label>
              <Input
                id="previousPolicyNumber"
                placeholder="Əgər varsa"
                value={formData.previousPolicyNumber}
                onChange={(e) => handleInputChange('previousPolicyNumber', e.target.value)}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="font-medium flex items-center">
              <CalendarIcon className="h-4 w-4 mr-2" />
              Sığorta müddəti
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Başlama tarixi *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      {formData.startDate ? formatDate(formData.startDate) : 'Tarix seçin'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Calendar
                      mode="single"
                      selected={formData.startDate}
                      onSelect={(date) => handleInputChange('startDate', date)}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="duration">Müddət *</Label>
                <Select 
                  onValueChange={(value) => handleInputChange('duration', value)}
                  defaultValue="1 il"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Müddət seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6 ay">6 ay</SelectItem>
                    <SelectItem value="1 il">1 il</SelectItem>
                    <SelectItem value="2 il">2 il</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Summary */}
            <Card className="p-4 bg-blue-50 border-blue-200 mt-6">
              <h4 className="font-medium mb-3 text-blue-900">Sifariş xülasəsi</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sahibkar:</span>
                  <span className="font-medium">{formData.ownerName || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Nəqliyyat vasitəsi:</span>
                  <span className="font-medium">{formData.makeModel || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Dövlət nömrəsi:</span>
                  <span className="font-medium">{formData.licensePlate || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Müddət:</span>
                  <span className="font-medium">{formData.duration}</span>
                </div>
                {provider && (
                  <div className="flex justify-between pt-2 border-t border-blue-200">
                    <span className="text-gray-600">Sığorta şirkəti:</span>
                    <span className="font-medium">{provider.name}</span>
                  </div>
                )}
              </div>
            </Card>
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
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2>Avtomobil Məsuliyyət Sığortası</h2>
            <p className="text-gray-600 text-sm">Üçüncü şəxslərə dəymiş zərərlər üçün məsuliyyət sığortası</p>
          </div>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center space-x-4">
        {[1, 2, 3].map((stepNumber) => (
          <div key={stepNumber} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= stepNumber
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {stepNumber}
            </div>
            {stepNumber < 3 && (
              <div className={`w-12 h-1 mx-2 ${step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Form Content */}
      <Card className="p-6">
        <div className="min-h-[400px]">
          {renderStepContent()}
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => {
            if (step === 1) {
              onBack();
            } else {
              setStep(step - 1);
            }
          }}
        >
          {step === 1 ? 'Geri' : 'Əvvəlki'}
        </Button>

        <Button
          onClick={() => {
            if (step === 3) {
              handleSubmit();
            } else {
              setStep(step + 1);
            }
          }}
        >
          {step === 3 ? 'Sifarişi təsdiqlə' : 'Növbəti'}
        </Button>
      </div>
    </div>
  );
}
