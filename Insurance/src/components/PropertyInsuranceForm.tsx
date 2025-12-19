import { useState } from 'react';
import { ArrowLeft, Home, User, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Card } from './ui/card';
import { toast } from 'sonner';
import { Textarea } from './ui/textarea';

interface PropertyInsuranceFormProps {
  provider: any;
  onBack: () => void;
  onClose: () => void;
}

export function PropertyInsuranceForm({ provider, onBack, onClose }: PropertyInsuranceFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    ownerName: '',
    finId: '',
    tin: '',
    contactNumber: '',
    email: '',
    propertyAddress: '',
    propertyType: '',
    area: '',
    floorCount: '',
    locatedFloor: '',
    wallMaterial: '',
    constructionYear: '',
    propertyDocumentNumber: '',
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
    toast.success('İcbari əmlak sığortası sifarişiniz uğurla göndərildi!');
    onClose();
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="font-medium flex items-center">
              <User className="h-4 w-4 mr-2" />
              Mülkiyyətçi məlumatları
            </h3>

            {/* Radio Button - özüm üçün */}
            <div style={{ marginTop: '8px', marginBottom: '12px' }}>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="ozum-ucun-property"
                  name="ozum-ucun-property"
                  className="w-4 h-4 text-blue-600"
                  defaultChecked
                />
                <label htmlFor="ozum-ucun-property" className="text-sm font-normal cursor-pointer">
                  özüm üçün
                </label>
              </div>
            </div>

            <div>
              <Label htmlFor="ownerName">Mülkiyyətçinin tam adı *</Label>
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
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="font-medium flex items-center">
              <Home className="h-4 w-4 mr-2" />
              Əmlak məlumatları
            </h3>

            <div>
              <Label htmlFor="propertyAddress">Əmlakın ünvanı (küçə, bina/mənzil, şəhər/rayon) *</Label>
              <Textarea
                id="propertyAddress"
                placeholder="Tam ünvanı daxil edin"
                value={formData.propertyAddress}
                onChange={(e) => handleInputChange('propertyAddress', e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="propertyType">Əmlak növü *</Label>
                <Select onValueChange={(value) => handleInputChange('propertyType', value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Əmlak növünü seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="menzil">Mənzil</SelectItem>
                    <SelectItem value="ev">Ev</SelectItem>
                    <SelectItem value="ofis">Ofis</SelectItem>
                    <SelectItem value="anbar">Anbar</SelectItem>
                    <SelectItem value="kommersiya">Kommersiya sahəsi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="area">Sahə (m²) *</Label>
                <Input
                  id="area"
                  type="number"
                  placeholder="120"
                  value={formData.area}
                  onChange={(e) => handleInputChange('area', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="floorCount">Mərtəbə sayı</Label>
                <Input
                  id="floorCount"
                  type="number"
                  placeholder="9"
                  value={formData.floorCount}
                  onChange={(e) => handleInputChange('floorCount', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="locatedFloor">Yerləşdiyi mərtəbə</Label>
                <Input
                  id="locatedFloor"
                  type="number"
                  placeholder="5"
                  value={formData.locatedFloor}
                  onChange={(e) => handleInputChange('locatedFloor', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="wallMaterial">Divar materialı</Label>
                <Select onValueChange={(value) => handleInputChange('wallMaterial', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Material seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beton">Beton</SelectItem>
                    <SelectItem value="kerpic">Kərpic</SelectItem>
                    <SelectItem value="panel">Panel</SelectItem>
                    <SelectItem value="agac">Ağac</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="constructionYear">Tikinti ili</Label>
                <Input
                  id="constructionYear"
                  placeholder="2015"
                  value={formData.constructionYear}
                  onChange={(e) => handleInputChange('constructionYear', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="propertyDocumentNumber">Əmlak sənədi nömrəsi (kupça)</Label>
              <Input
                id="propertyDocumentNumber"
                placeholder="Əmlak sənədi nömrəsi"
                value={formData.propertyDocumentNumber}
                onChange={(e) => handleInputChange('propertyDocumentNumber', e.target.value)}
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
                  <span className="text-gray-600">Mülkiyyətçi:</span>
                  <span className="font-medium">{formData.ownerName || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Əmlak növü:</span>
                  <span className="font-medium">{formData.propertyType || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sahə:</span>
                  <span className="font-medium">{formData.area ? `${formData.area} m²` : '-'}</span>
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
            <h2>İcbari Əmlak Sığortası</h2>
            <p className="text-gray-600 text-sm">Yaşayış və qeyri-yaşayış binaları, mənzillər və tikililər üçün sığorta</p>
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
