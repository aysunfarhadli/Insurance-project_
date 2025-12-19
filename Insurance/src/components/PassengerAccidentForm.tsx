import { useState } from 'react';
import { ArrowLeft, Bus, User, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Card } from './ui/card';
import { toast } from 'sonner';
import { Textarea } from './ui/textarea';

interface PassengerAccidentFormProps {
  provider: any;
  onBack: () => void;
  onClose: () => void;
}

export function PassengerAccidentForm({ provider, onBack, onClose }: PassengerAccidentFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    carrierName: '',
    tin: '',
    routeAndActivity: '',
    numberOfVehicles: '',
    seatCount: '',
    maxPassengers: '',
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
    toast.success('Sərnişin qəza sığortası sifarişiniz uğurla göndərildi!');
    onClose();
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="font-medium flex items-center">
              <User className="h-4 w-4 mr-2" />
              Daşıyıcı məlumatları
            </h3>

            {/* Radio Button - özüm üçün */}
            <div style={{ marginTop: '8px', marginBottom: '12px' }}>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="ozum-ucun-passenger"
                  name="ozum-ucun-passenger"
                  className="w-4 h-4 text-blue-600"
                  defaultChecked
                />
                <label htmlFor="ozum-ucun-passenger" className="text-sm font-normal cursor-pointer">
                  özüm üçün
                </label>
              </div>
            </div>

            <div>
              <Label htmlFor="carrierName">Daşıyıcının adı *</Label>
              <Input
                id="carrierName"
                placeholder="Şirkət və ya şəxs adı"
                value={formData.carrierName}
                onChange={(e) => handleInputChange('carrierName', e.target.value)}
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
              <Label htmlFor="routeAndActivity">Marşrut və fəaliyyət növü *</Label>
              <Select onValueChange={(value) => handleInputChange('routeAndActivity', value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Fəaliyyət növünü seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="seher_ici">Şəhərdaxili nəqliyyat</SelectItem>
                  <SelectItem value="seherlerarasi">Şəhərlərarası avtobus</SelectItem>
                  <SelectItem value="deniz">Dəniz nəqliyyatı</SelectItem>
                  <SelectItem value="hava">Hava nəqliyyatı</SelectItem>
                  <SelectItem value="qatar">Dəmiryol nəqliyyatı</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="font-medium flex items-center">
              <Bus className="h-4 w-4 mr-2" />
              Nəqliyyat məlumatları
            </h3>

            <div>
              <Label htmlFor="numberOfVehicles">Nəqliyyat vasitələrinin sayı</Label>
              <Input
                id="numberOfVehicles"
                type="number"
                placeholder="10"
                value={formData.numberOfVehicles}
                onChange={(e) => handleInputChange('numberOfVehicles', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="seatCount">Oturacaq sayı</Label>
                <Input
                  id="seatCount"
                  type="number"
                  placeholder="45"
                  value={formData.seatCount}
                  onChange={(e) => handleInputChange('seatCount', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="maxPassengers">Maksimum sərnişin sayı</Label>
                <Input
                  id="maxPassengers"
                  type="number"
                  placeholder="50"
                  value={formData.maxPassengers}
                  onChange={(e) => handleInputChange('maxPassengers', e.target.value)}
                />
              </div>
            </div>

            <Card className="p-4 bg-blue-50 border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Qeyd:</strong> Bu sığorta sərnişinlərin daşınma zamanı baş verə biləcək qəzalarda məruz qaldığı zədələri əhatə edir.
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
                  <span className="text-gray-600">Daşıyıcı:</span>
                  <span className="font-medium">{formData.carrierName || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fəaliyyət növü:</span>
                  <span className="font-medium">{formData.routeAndActivity || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Nəqliyyat sayı:</span>
                  <span className="font-medium">{formData.numberOfVehicles || '-'}</span>
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
            <h2>Sərnişin Qəza Sığortası</h2>
            <p className="text-gray-600 text-sm">Sərnişinləri daşıyan qurumlar üçün icbari sığorta (quru, dəniz, hava)</p>
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
