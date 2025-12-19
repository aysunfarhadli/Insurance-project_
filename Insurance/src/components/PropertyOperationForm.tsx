import { useState } from 'react';
import { ArrowLeft, Building, User, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Card } from './ui/card';
import { toast } from 'sonner';
import { Textarea } from './ui/textarea';

interface PropertyOperationFormProps {
  provider: any;
  onBack: () => void;
  onClose: () => void;
}

export function PropertyOperationForm({ provider, onBack, onClose }: PropertyOperationFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    operatorName: '',
    tin: '',
    contactNumber: '',
    email: '',
    objectAddress: '',
    objectType: '',
    totalArea: '',
    humanTraffic: '',
    safetyDocuments: '',
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
    toast.success('Əmlak əməliyyatları üzrə məsuliyyət sığortası sifarişiniz uğurla göndərildi!');
    onClose();
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="font-medium flex items-center">
              <User className="h-4 w-4 mr-2" />
              Operator məlumatları
            </h3>

            {/* Radio Button - özüm üçün */}
            <div style={{ marginTop: '8px', marginBottom: '12px' }}>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="ozum-ucun-operation"
                  name="ozum-ucun-operation"
                  className="w-4 h-4 text-blue-600"
                  defaultChecked
                />
                <label htmlFor="ozum-ucun-operation" className="text-sm font-normal cursor-pointer">
                  özüm üçün
                </label>
              </div>
            </div>

            <div>
              <Label htmlFor="operatorName">Operatorun adı *</Label>
              <Input
                id="operatorName"
                placeholder="Şəxs və ya şirkət adı"
                value={formData.operatorName}
                onChange={(e) => handleInputChange('operatorName', e.target.value)}
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contactNumber">Telefon nömrəsi *</Label>
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
              <Building className="h-4 w-4 mr-2" />
              Obyekt məlumatları
            </h3>

            <div>
              <Label htmlFor="objectAddress">Obyektin ünvanı *</Label>
              <Textarea
                id="objectAddress"
                placeholder="Tam ünvanı daxil edin"
                value={formData.objectAddress}
                onChange={(e) => handleInputChange('objectAddress', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="objectType">Obyekt növü *</Label>
              <Select onValueChange={(value) => handleInputChange('objectType', value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Obyekt növünü seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ticarət_mərkəzi">Ticarət mərkəzi</SelectItem>
                  <SelectItem value="ofis">Ofis binası</SelectItem>
                  <SelectItem value="yasayis">Yaşayış kompleksi</SelectItem>
                  <SelectItem value="mehmanxana">Mehmanxana</SelectItem>
                  <SelectItem value="restoran">Restoran/Kafe</SelectItem>
                  <SelectItem value="istehsal">İstehsal müəssisəsi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="totalArea">Ümumi sahə (m²)</Label>
                <Input
                  id="totalArea"
                  type="number"
                  placeholder="5000"
                  value={formData.totalArea}
                  onChange={(e) => handleInputChange('totalArea', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="humanTraffic">İnsan axını</Label>
                <Select onValueChange={(value) => handleInputChange('humanTraffic', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Orta gündəlik" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="az">Az (0-100 nəfər)</SelectItem>
                    <SelectItem value="orta">Orta (100-500 nəfər)</SelectItem>
                    <SelectItem value="cox">Çox (500+ nəfər)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="safetyDocuments">Təhlükəsizlik/Yanğın uyğunluq sənədləri</Label>
              <Textarea
                id="safetyDocuments"
                placeholder="Sənəd nömrələri və ya mövcudluq haqqında qeydlər (varsa)"
                value={formData.safetyDocuments}
                onChange={(e) => handleInputChange('safetyDocuments', e.target.value)}
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
                  <span className="text-gray-600">Operator:</span>
                  <span className="font-medium">{formData.operatorName || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Obyekt növü:</span>
                  <span className="font-medium">{formData.objectType || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sahə:</span>
                  <span className="font-medium">{formData.totalArea ? `${formData.totalArea} m²` : '-'}</span>
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
            <h2>Əmlak Əməliyyatları üzrə Məsuliyyət Sığortası</h2>
            <p className="text-gray-600 text-sm">Əmlak istismarı zamanı üçüncü şəxslərə dəyən zərərə görə məsuliyyət</p>
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
