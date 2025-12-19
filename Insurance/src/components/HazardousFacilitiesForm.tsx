import { useState } from 'react';
import { ArrowLeft, AlertTriangle, User, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Card } from './ui/card';
import { toast } from 'sonner';
import { Textarea } from './ui/textarea';

interface HazardousFacilitiesFormProps {
  provider: any;
  onBack: () => void;
  onClose: () => void;
}

export function HazardousFacilitiesForm({ provider, onBack, onClose }: HazardousFacilitiesFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    entityName: '',
    tin: '',
    facilityType: '',
    facilityAddress: '',
    hazardClass: '',
    licenses: '',
    numberOfEmployees: '',
    operationScale: '',
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
    toast.success('Təhlükəli obyektlərin istismarı üzrə məsuliyyət sığortası sifarişiniz uğurla göndərildi!');
    onClose();
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="font-medium flex items-center">
              <User className="h-4 w-4 mr-2" />
              Təşkilat məlumatları
            </h3>

            {/* Radio Button - özüm üçün */}
            <div style={{ marginTop: '8px', marginBottom: '12px' }}>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="ozum-ucun-hazardous"
                  name="ozum-ucun-hazardous"
                  className="w-4 h-4 text-blue-600"
                  defaultChecked
                />
                <label htmlFor="ozum-ucun-hazardous" className="text-sm font-normal cursor-pointer">
                  özüm üçün
                </label>
              </div>
            </div>

            <div>
              <Label htmlFor="entityName">Təşkilat adı *</Label>
              <Input
                id="entityName"
                placeholder="Müəssisə və ya şirkət adı"
                value={formData.entityName}
                onChange={(e) => handleInputChange('entityName', e.target.value)}
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

            <div>
              <Label htmlFor="facilityType">Obyektin növü və ünvanı *</Label>
              <Textarea
                id="facilityType"
                placeholder="Obyektin növü və tam ünvanı"
                value={formData.facilityType}
                onChange={(e) => handleInputChange('facilityType', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="facilityAddress">Obyektin ünvanı *</Label>
              <Textarea
                id="facilityAddress"
                placeholder="Tam ünvan"
                value={formData.facilityAddress}
                onChange={(e) => handleInputChange('facilityAddress', e.target.value)}
                required
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="font-medium flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Təhlükə sinfi və lisenziyalar
            </h3>

            <div>
              <Label htmlFor="hazardClass">Təhlükə sinfi *</Label>
              <Select onValueChange={(value) => handleInputChange('hazardClass', value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Təhlükə sinfini seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="partlayici">Partlayıcı maddələr</SelectItem>
                  <SelectItem value="yangin">Yanğın təhlükəsi</SelectItem>
                  <SelectItem value="kimyevi">Kimyəvi təhlükə</SelectItem>
                  <SelectItem value="radiyasiya">Radiyasiya təhlükəsi</SelectItem>
                  <SelectItem value="bioloji">Bioloji təhlükə</SelectItem>
                  <SelectItem value="qarma">Qarma təhlükələr</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="licenses">Lisenziyalar / Uyğunluq sənədləri</Label>
              <Textarea
                id="licenses"
                placeholder="Lisenziya nömrələri və uyğunluq sənədləri haqqında məlumat"
                value={formData.licenses}
                onChange={(e) => handleInputChange('licenses', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="numberOfEmployees">İşçilərin sayı</Label>
                <Input
                  id="numberOfEmployees"
                  type="number"
                  placeholder="25"
                  value={formData.numberOfEmployees}
                  onChange={(e) => handleInputChange('numberOfEmployees', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="operationScale">Əməliyyat miqyası</Label>
                <Select onValueChange={(value) => handleInputChange('operationScale', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Miqyası seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kicik">Kiçik</SelectItem>
                    <SelectItem value="orta">Orta</SelectItem>
                    <SelectItem value="boyuk">Böyük</SelectItem>
                    <SelectItem value="cox_boyuk">Çox böyük</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Card className="p-4 bg-yellow-50 border-yellow-200">
              <p className="text-sm text-yellow-800">
                <strong>Diqqət:</strong> Bu sığorta partlayış, yanğın və ya kimyəvi təhlükələrlə bağlı obyektlərin operatorları üçündür.
              </p>
            </Card>
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
                  <span className="text-gray-600">Təşkilat:</span>
                  <span className="font-medium">{formData.entityName || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Təhlükə sinfi:</span>
                  <span className="font-medium">{formData.hazardClass || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">İşçi sayı:</span>
                  <span className="font-medium">{formData.numberOfEmployees || '-'}</span>
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
            <h2>Təhlükəli Obyektlərin İstismarı üzrə Məsuliyyət Sığortası</h2>
            <p className="text-gray-600 text-sm">Partlayış, yanğın və ya kimyəvi təhlükələri əhatə edən obyektlərin operatorları üçün</p>
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
