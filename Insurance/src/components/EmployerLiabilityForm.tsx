import { useState } from 'react';
import { ArrowLeft, Briefcase, User, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Card } from './ui/card';
import { toast } from 'sonner';
import { Textarea } from './ui/textarea';

interface EmployerLiabilityFormProps {
  provider: any;
  onBack: () => void;
  onClose: () => void;
}

export function EmployerLiabilityForm({ provider, onBack, onClose }: EmployerLiabilityFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: '',
    tin: '',
    businessActivity: '',
    legalAddress: '',
    contactNumber: '',
    email: '',
    numberOfEmployees: '',
    averageMonthlySalary: '',
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
    toast.success('İşəgötürənin məsuliyyət sığortası sifarişiniz uğurla göndərildi!');
    onClose();
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="font-medium flex items-center">
              <User className="h-4 w-4 mr-2" />
              Şirkət məlumatları
            </h3>

            {/* Radio Button - özüm üçün */}
            <div style={{ marginTop: '8px', marginBottom: '12px' }}>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="ozum-ucun-employer"
                  name="ozum-ucun-employer"
                  className="w-4 h-4 text-blue-600"
                  defaultChecked
                />
                <label htmlFor="ozum-ucun-employer" className="text-sm font-normal cursor-pointer">
                  özüm üçün
                </label>
              </div>
            </div>

            <div>
              <Label htmlFor="companyName">Şirkət adı *</Label>
              <Input
                id="companyName"
                placeholder="Şirkət və ya təşkilat adı"
                value={formData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="tin">VÖEN *</Label>
              <Input
                id="tin"
                placeholder="1234567890"
                value={formData.tin}
                onChange={(e) => handleInputChange('tin', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="businessActivity">Sahibkarlıq fəaliyyəti (NACE/OKED kodu və ya təsviri) *</Label>
              <Textarea
                id="businessActivity"
                placeholder="Fəaliyyət növü və ya təsnifat kodu"
                value={formData.businessActivity}
                onChange={(e) => handleInputChange('businessActivity', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="legalAddress">Hüquqi ünvan *</Label>
              <Textarea
                id="legalAddress"
                placeholder="Tam hüquqi ünvan"
                value={formData.legalAddress}
                onChange={(e) => handleInputChange('legalAddress', e.target.value)}
                required
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
              <Briefcase className="h-4 w-4 mr-2" />
              İşçi məlumatları
            </h3>

            <div>
              <Label htmlFor="numberOfEmployees">İşçilərin sayı *</Label>
              <Input
                id="numberOfEmployees"
                type="number"
                placeholder="50"
                value={formData.numberOfEmployees}
                onChange={(e) => handleInputChange('numberOfEmployees', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="averageMonthlySalary">Orta aylıq əmək haqqı fondu</Label>
              <Input
                id="averageMonthlySalary"
                type="number"
                placeholder="25000 AZN"
                value={formData.averageMonthlySalary}
                onChange={(e) => handleInputChange('averageMonthlySalary', e.target.value)}
              />
            </div>

            <Card className="p-4 bg-yellow-50 border-yellow-200">
              <p className="text-sm text-yellow-800">
                <strong>Qeyd:</strong> Bu sığorta işçilərin iş zamanı alacağı zədələr və ya zərərlər üçün işəgötürənin məsuliyyətini əhatə edir.
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
                  <span className="text-gray-600">Şirkət:</span>
                  <span className="font-medium">{formData.companyName || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">VÖEN:</span>
                  <span className="font-medium">{formData.tin || '-'}</span>
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
            <h2>İşəgötürənin Məsuliyyət Sığortası</h2>
            <p className="text-gray-600 text-sm">İş zamanı işçilərə dəyən zərər və zədələr üçün işəgötürənin məsuliyyəti</p>
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
