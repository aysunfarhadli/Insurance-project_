import { useState } from 'react';
import { CalendarDays, User, Phone, Mail, MapPin, CreditCard, FileText, Users, Heart, ArrowLeft, ArrowRight, Check } from 'lucide-react';
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
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { toast } from 'sonner';

interface LifeInsuranceFormProps {
  provider: any;
  onClose: () => void;
  onBack?: () => void;
}

export function LifeInsuranceForm({ provider, onClose, onBack }: LifeInsuranceFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Şəxsi məlumatlar
    personalInfo: {
      firstName: '',
      lastName: '',
      fatherName: '',
      idNumber: '',
      birthDate: null,
      birthPlace: '',
      nationality: 'Azərbaycan',
      maritalStatus: '',
      phone: '',
      email: '',
      homeAddress: '',
      workAddress: '',
      occupation: '',
      monthlyIncome: '',
      education: ''
    },
    // Step 2: Sığorta məlumatları
    insuranceDetails: {
      coverageAmount: '',
      insurancePeriod: '',
      paymentPeriod: '',
      paymentFrequency: 'monthly',
      startDate: null,
      medicalExam: false,
      healthDeclaration: {
        hasChronicDiseases: false,
        takingMedication: false,
        hadSurgeries: false,
        familyMedicalHistory: false,
        smokingStatus: 'never',
        alcoholConsumption: 'never',
        height: '',
        weight: ''
      },
      additionalCoverage: []
    },
    // Step 3: Benefisiarlar və ödəniş
    beneficiariesAndPayment: {
      beneficiaries: [
        {
          name: '',
          relationship: '',
          birthDate: null,
          idNumber: '',
          percentage: 100
        }
      ],
      paymentMethod: '',
      bankAccount: {
        bankName: '',
        accountNumber: '',
        iban: ''
      },
      cardDetails: {
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardHolder: ''
      }
    }
  });

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToMedical, setAgreedToMedical] = useState(false);

  const steps = [
    { id: 1, title: 'Şəxsi məlumatlar', icon: User },
    { id: 2, title: 'Sığorta məlumatları', icon: Heart },
    { id: 3, title: 'Benefisiarlar və ödəniş', icon: Users }
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

  const handleNestedInputChange = (section, subsection, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [field]: value
        }
      }
    }));
  };

  const addBeneficiary = () => {
    setFormData(prev => ({
      ...prev,
      beneficiariesAndPayment: {
        ...prev.beneficiariesAndPayment,
        beneficiaries: [
          ...prev.beneficiariesAndPayment.beneficiaries,
          {
            name: '',
            relationship: '',
            birthDate: null,
            idNumber: '',
            percentage: 0
          }
        ]
      }
    }));
  };

  const updateBeneficiary = (index, field, value) => {
    const newBeneficiaries = [...formData.beneficiariesAndPayment.beneficiaries];
    newBeneficiaries[index][field] = value;
    setFormData(prev => ({
      ...prev,
      beneficiariesAndPayment: {
        ...prev.beneficiariesAndPayment,
        beneficiaries: newBeneficiaries
      }
    }));
  };

  const removeBeneficiary = (index) => {
    const newBeneficiaries = formData.beneficiariesAndPayment.beneficiaries.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      beneficiariesAndPayment: {
        ...prev.beneficiariesAndPayment,
        beneficiaries: newBeneficiaries
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
    toast.success('Həyat sığortası müraciətiniz uğurla göndərildi!');
    onClose();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="firstName">Ad *</Label>
                <Input
                  id="firstName"
                  placeholder="Adınız"
                  value={formData.personalInfo.firstName}
                  onChange={(e) => handleInputChange('personalInfo', 'firstName', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Soyad *</Label>
                <Input
                  id="lastName"
                  placeholder="Soyadınız"
                  value={formData.personalInfo.lastName}
                  onChange={(e) => handleInputChange('personalInfo', 'lastName', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="fatherName">Ata adı *</Label>
                <Input
                  id="fatherName"
                  placeholder="Ata adınız"
                  value={formData.personalInfo.fatherName}
                  onChange={(e) => handleInputChange('personalInfo', 'fatherName', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="idNumber">Şəxsiyyət vəsiqəsi nömrəsi *</Label>
                <Input
                  id="idNumber"
                  placeholder="AZE1234567"
                  value={formData.personalInfo.idNumber}
                  onChange={(e) => handleInputChange('personalInfo', 'idNumber', e.target.value)}
                />
              </div>
              <div>
                <Label>Doğum tarixi *</Label>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="birthPlace">Doğum yeri *</Label>
                <Input
                  id="birthPlace"
                  placeholder="Doğum yeriniz"
                  value={formData.personalInfo.birthPlace}
                  onChange={(e) => handleInputChange('personalInfo', 'birthPlace', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="nationality">Vətəndaşlıq *</Label>
                <Select onValueChange={(value) => handleInputChange('personalInfo', 'nationality', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Vətəndaşlıq seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Azərbaycan">Azərbaycan</SelectItem>
                    <SelectItem value="Türkiyə">Türkiyə</SelectItem>
                    <SelectItem value="Rusiya">Rusiya</SelectItem>
                    <SelectItem value="Digər">Digər</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="maritalStatus">Ailə vəziyyəti *</Label>
                <Select onValueChange={(value) => handleInputChange('personalInfo', 'maritalStatus', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="subay">Subay</SelectItem>
                    <SelectItem value="evli">Evli</SelectItem>
                    <SelectItem value="boşanmış">Boşanmış</SelectItem>
                    <SelectItem value="dul">Dul</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="education">Təhsil *</Label>
                <Select onValueChange={(value) => handleInputChange('personalInfo', 'education', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Təhsil səviyyəsi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="orta">Orta təhsil</SelectItem>
                    <SelectItem value="ali">Ali təhsil</SelectItem>
                    <SelectItem value="magistr">Magistratura</SelectItem>
                    <SelectItem value="doktorantura">Doktorantura</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Telefon nömrəsi *</Label>
                <Input
                  id="phone"
                  placeholder="+994 XX XXX XX XX"
                  value={formData.personalInfo.phone}
                  onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="email">Email ünvanı *</Label>
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
              <Label htmlFor="homeAddress">Yaşayış ünvanı *</Label>
              <Textarea
                id="homeAddress"
                placeholder="Tam yaşayış ünvanınızı daxil edin"
                value={formData.personalInfo.homeAddress}
                onChange={(e) => handleInputChange('personalInfo', 'homeAddress', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="occupation">Peşə/Vəzifə *</Label>
                <Input
                  id="occupation"
                  placeholder="Peşəniz və ya vəzifəniz"
                  value={formData.personalInfo.occupation}
                  onChange={(e) => handleInputChange('personalInfo', 'occupation', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="monthlyIncome">Aylıq gəlir (AZN) *</Label>
                <Input
                  id="monthlyIncome"
                  placeholder="0"
                  type="number"
                  value={formData.personalInfo.monthlyIncome}
                  onChange={(e) => handleInputChange('personalInfo', 'monthlyIncome', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="workAddress">İş ünvanı</Label>
              <Textarea
                id="workAddress"
                placeholder="İş yerinin ünvanı (məcburi deyil)"
                value={formData.personalInfo.workAddress}
                onChange={(e) => handleInputChange('personalInfo', 'workAddress', e.target.value)}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="coverageAmount">Sığorta məbləği (AZN) *</Label>
                <Select onValueChange={(value) => handleInputChange('insuranceDetails', 'coverageAmount', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Məbləğ seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="50000">50,000 AZN</SelectItem>
                    <SelectItem value="100000">100,000 AZN</SelectItem>
                    <SelectItem value="200000">200,000 AZN</SelectItem>
                    <SelectItem value="500000">500,000 AZN</SelectItem>
                    <SelectItem value="1000000">1,000,000 AZN</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="insurancePeriod">Sığorta müddəti *</Label>
                <Select onValueChange={(value) => handleInputChange('insuranceDetails', 'insurancePeriod', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Müddət seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 il</SelectItem>
                    <SelectItem value="15">15 il</SelectItem>
                    <SelectItem value="20">20 il</SelectItem>
                    <SelectItem value="25">25 il</SelectItem>
                    <SelectItem value="30">30 il</SelectItem>
                    <SelectItem value="lifetime">Ömürlük</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="paymentPeriod">Ödəniş müddəti *</Label>
                <Select onValueChange={(value) => handleInputChange('insuranceDetails', 'paymentPeriod', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Ödəniş müddəti" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 il</SelectItem>
                    <SelectItem value="10">10 il</SelectItem>
                    <SelectItem value="15">15 il</SelectItem>
                    <SelectItem value="20">20 il</SelectItem>
                    <SelectItem value="single">Birdəfəlik ödəniş</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Ödəniş tezliyi *</Label>
                <RadioGroup 
                  value={formData.insuranceDetails.paymentFrequency}
                  onValueChange={(value) => handleInputChange('insuranceDetails', 'paymentFrequency', value)}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="monthly" id="monthly" />
                    <Label htmlFor="monthly">Aylıq</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="quarterly" id="quarterly" />
                    <Label htmlFor="quarterly">Rüblük</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yearly" id="yearly" />
                    <Label htmlFor="yearly">İllik</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div>
              <Label>Sığorta başlama tarixi *</Label>
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

            {/* Health Declaration */}
            <Card className="p-4 bg-blue-50 border-blue-200">
              <h3 className="font-medium mb-4 text-blue-900">Sağlamlıq bəyannaməsi</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="height">Boy (sm) *</Label>
                    <Input
                      id="height"
                      placeholder="170"
                      type="number"
                      value={formData.insuranceDetails.healthDeclaration.height}
                      onChange={(e) => handleNestedInputChange('insuranceDetails', 'healthDeclaration', 'height', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="weight">Çəki (kq) *</Label>
                    <Input
                      id="weight"
                      placeholder="70"
                      type="number"
                      value={formData.insuranceDetails.healthDeclaration.weight}
                      onChange={(e) => handleNestedInputChange('insuranceDetails', 'healthDeclaration', 'weight', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="chronicDiseases"
                      checked={formData.insuranceDetails.healthDeclaration.hasChronicDiseases}
                      onCheckedChange={(checked) => handleNestedInputChange('insuranceDetails', 'healthDeclaration', 'hasChronicDiseases', checked)}
                    />
                    <Label htmlFor="chronicDiseases">Xroniki xəstəliklərim var</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="takingMedication"
                      checked={formData.insuranceDetails.healthDeclaration.takingMedication}
                      onCheckedChange={(checked) => handleNestedInputChange('insuranceDetails', 'healthDeclaration', 'takingMedication', checked)}
                    />
                    <Label htmlFor="takingMedication">Daimi dərman qəbul edirəm</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="hadSurgeries"
                      checked={formData.insuranceDetails.healthDeclaration.hadSurgeries}
                      onCheckedChange={(checked) => handleNestedInputChange('insuranceDetails', 'healthDeclaration', 'hadSurgeries', checked)}
                    />
                    <Label htmlFor="hadSurgeries">Əməliyyat olunmuşam</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="familyHistory"
                      checked={formData.insuranceDetails.healthDeclaration.familyMedicalHistory}
                      onCheckedChange={(checked) => handleNestedInputChange('insuranceDetails', 'healthDeclaration', 'familyMedicalHistory', checked)}
                    />
                    <Label htmlFor="familyHistory">Ailədə ciddi xəstəlik tarixi var</Label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Siqaret çəkmə vəziyyəti *</Label>
                    <Select onValueChange={(value) => handleNestedInputChange('insuranceDetails', 'healthDeclaration', 'smokingStatus', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="never">Heç vaxt çəkməmişəm</SelectItem>
                        <SelectItem value="former">Əvvəllər çəkirdim</SelectItem>
                        <SelectItem value="current">Hazırda çəkirəm</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Alkoqol istifadəsi *</Label>
                    <Select onValueChange={(value) => handleNestedInputChange('insuranceDetails', 'healthDeclaration', 'alcoholConsumption', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="never">Heç vaxt</SelectItem>
                        <SelectItem value="rarely">Nadir hallarda</SelectItem>
                        <SelectItem value="moderate">Mülayim</SelectItem>
                        <SelectItem value="regular">Müntəzəm</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </Card>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="medicalExam"
                checked={formData.insuranceDetails.medicalExam}
                onCheckedChange={(checked) => handleInputChange('insuranceDetails', 'medicalExam', checked)}
              />
              <Label htmlFor="medicalExam">Tibbi müayinə keçməyə razıyam</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="agreedToMedical"
                checked={agreedToMedical}
                onCheckedChange={setAgreedToMedical}
              />
              <Label htmlFor="agreedToMedical">Sağlamlıq bəyannaməsinin düzgünlüyünü təsdiq edirəm</Label>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {/* Beneficiaries */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Benefisiarlar (Varislər)</h3>
                <Button type="button" variant="outline" onClick={addBeneficiary}>
                  Benefisiar əlavə et
                </Button>
              </div>
              
              {formData.beneficiariesAndPayment.beneficiaries.map((beneficiary, index) => (
                <Card key={index} className="p-4 mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Benefisiar {index + 1}</h4>
                    {formData.beneficiariesAndPayment.beneficiaries.length > 1 && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => removeBeneficiary(index)}
                      >
                        Sil
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Ad və Soyad *</Label>
                      <Input
                        placeholder="Benefisiarın adı və soyadı"
                        value={beneficiary.name}
                        onChange={(e) => updateBeneficiary(index, 'name', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Qohumluq əlaqəsi *</Label>
                      <Select onValueChange={(value) => updateBeneficiary(index, 'relationship', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="həyat_yoldaşı">Həyat yoldaşı</SelectItem>
                          <SelectItem value="uşaq">Uşaq</SelectItem>
                          <SelectItem value="valideyn">Valideyn</SelectItem>
                          <SelectItem value="qardaş_bacı">Qardaş/Bacı</SelectItem>
                          <SelectItem value="digər">Digər</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Şəxsiyyət vəsiqəsi *</Label>
                      <Input
                        placeholder="AZE1234567"
                        value={beneficiary.idNumber}
                        onChange={(e) => updateBeneficiary(index, 'idNumber', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Pay (%) *</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        min="0"
                        max="100"
                        value={beneficiary.percentage}
                        onChange={(e) => updateBeneficiary(index, 'percentage', parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Payment Method */}
            <div>
              <Label>Ödəniş üsulu *</Label>
              <RadioGroup 
                value={formData.beneficiariesAndPayment.paymentMethod}
                onValueChange={(value) => handleInputChange('beneficiariesAndPayment', 'paymentMethod', value)}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bank" id="bank" />
                  <Label htmlFor="bank">Bank hesabından avtomatik çıxarılma</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card">Kart ilə ödəniş</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Bank Account Details */}
            {formData.beneficiariesAndPayment.paymentMethod === 'bank' && (
              <Card className="p-4">
                <h4 className="font-medium mb-4">Bank hesabı məlumatları</h4>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="bankName">Bank adı *</Label>
                    <Select onValueChange={(value) => handleNestedInputChange('beneficiariesAndPayment', 'bankAccount', 'bankName', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Bank seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kapital">Kapital Bank</SelectItem>
                        <SelectItem value="paşa">Paşa Bank</SelectItem>
                        <SelectItem value="rabitə">Rabitəbank</SelectItem>
                        <SelectItem value="accessbank">AccessBank</SelectItem>
                        <SelectItem value="digər">Digər</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="accountNumber">Hesab nömrəsi *</Label>
                    <Input
                      id="accountNumber"
                      placeholder="AZ21NABZ00000000137010001944"
                      value={formData.beneficiariesAndPayment.bankAccount.accountNumber}
                      onChange={(e) => handleNestedInputChange('beneficiariesAndPayment', 'bankAccount', 'accountNumber', e.target.value)}
                    />
                  </div>
                </div>
              </Card>
            )}

            {/* Card Details */}
            {formData.beneficiariesAndPayment.paymentMethod === 'card' && (
              <Card className="p-4">
                <h4 className="font-medium mb-4">Kart məlumatları</h4>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Kart nömrəsi *</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={formData.beneficiariesAndPayment.cardDetails.cardNumber}
                      onChange={(e) => handleNestedInputChange('beneficiariesAndPayment', 'cardDetails', 'cardNumber', e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Son istifadə tarixi *</Label>
                      <Input
                        id="expiryDate"
                        placeholder="MM/YY"
                        value={formData.beneficiariesAndPayment.cardDetails.expiryDate}
                        onChange={(e) => handleNestedInputChange('beneficiariesAndPayment', 'cardDetails', 'expiryDate', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV *</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={formData.beneficiariesAndPayment.cardDetails.cvv}
                        onChange={(e) => handleNestedInputChange('beneficiariesAndPayment', 'cardDetails', 'cvv', e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="cardHolder">Kart sahibinin adı *</Label>
                    <Input
                      id="cardHolder"
                      placeholder="Ad Soyad"
                      value={formData.beneficiariesAndPayment.cardDetails.cardHolder}
                      onChange={(e) => handleNestedInputChange('beneficiariesAndPayment', 'cardDetails', 'cardHolder', e.target.value)}
                    />
                  </div>
                </div>
              </Card>
            )}

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="agreedToTerms"
                  checked={agreedToTerms}
                  onCheckedChange={setAgreedToTerms}
                />
                <Label htmlFor="agreedToTerms">Şərtlər və qaydalarla razıyam</Label>
              </div>
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
            <h1 className="text-2xl">Həyat Sığortası Müraciəti</h1>
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
        <div className="mt-2 mb-3">
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="ozum-ucun"
              name="ozum-ucun"
              className="w-4 h-4 text-blue-600"
              defaultChecked
            />
            <label htmlFor="ozum-ucun" className="text-sm font-normal cursor-pointer">
              özüm üçün
            </label>
          </div>
        </div>
        
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
          <span>{currentStep === 1 ? 'Ləğv et' : 'Geri'}</span>
        </Button>
        
        <Button
          onClick={currentStep === 3 ? handleSubmit : nextStep}
          disabled={currentStep === 3 && (!agreedToTerms || !agreedToMedical)}
          className="flex items-center space-x-2"
        >
          <span>{currentStep === 3 ? 'Müraciəti göndər' : 'Növbəti'}</span>
          {currentStep !== 3 && <ArrowRight className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}