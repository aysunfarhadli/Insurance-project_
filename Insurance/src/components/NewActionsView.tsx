import { useState } from 'react';
import { CreditCard, ArrowRightLeft, Plus, Shield, QrCode, FileText, Calculator, Phone, MessageCircle, ChevronRight } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';

interface NewActionsViewProps {
  onBack: () => void;
}

export function NewActionsView({ onBack }: NewActionsViewProps) {
  const [selectedAction, setSelectedAction] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const actions = [
    {
      id: 1,
      name: 'Yeni ödəniş',
      description: 'Sığorta ödənişi və ya digər xərclər üçün',
      icon: CreditCard,
      color: 'bg-cyan-100',
      category: 'Maliyyə'
    },
    {
      id: 2,
      name: 'Yeni köçürmə',
      description: 'Pul köçürmələri və transfer əməliyyatları',
      icon: ArrowRightLeft,
      color: 'bg-pink-100',
      category: 'Maliyyə'
    },
    {
      id: 3,
      name: 'Yeni kart əlavə et',
      description: 'Ödəniş kartını hesaba əlavə edin',
      icon: CreditCard,
      color: 'bg-blue-100',
      category: 'Hesab'
    },
    {
      id: 4,
      name: 'Yeni şablon əlavə et',
      description: 'Tez-tez istifadə üçün ödəniş şablonu',
      icon: Plus,
      color: 'bg-purple-100',
      category: 'Şablonlar'
    },
    {
      id: 5,
      name: 'Yeni sığorta sifariş et',
      description: 'Müxtəlif növ sığorta məhsulları',
      icon: Shield,
      color: 'bg-blue-100',
      category: 'Sığorta'
    },
    {
      id: 6,
      name: 'Yeni QR qəbzi əlavə et',
      description: 'QR kod ilə ödəniş qəbzi',
      icon: QrCode,
      color: 'bg-green-100',
      category: 'Ödəniş'
    },
    {
      id: 7,
      name: 'Hesabat tələb et',
      description: 'Aylıq və illik hesabatlar',
      icon: FileText,
      color: 'bg-orange-100',
      category: 'Hesabat'
    },
    {
      id: 8,
      name: 'Sığorta kalkulyatoru',
      description: 'Sığorta məbləğini hesabla',
      icon: Calculator,
      color: 'bg-yellow-100',
      category: 'Alətlər'
    },
    {
      id: 9,
      name: 'Dəstək xətti',
      description: '24/7 müştəri xidmətləri',
      icon: Phone,
      color: 'bg-red-100',
      category: 'Dəstək'
    },
    {
      id: 10,
      name: 'Məsləhət al',
      description: 'Sığorta məsləhətçisi ilə əlaqə',
      icon: MessageCircle,
      color: 'bg-indigo-100',
      category: 'Məsləhət'
    }
  ];

  const categories = [...new Set(actions.map(action => action.category))];

  const handleActionClick = (action) => {
    setSelectedAction(action);
    setIsDialogOpen(true);
  };

  const renderActionForm = () => {
    if (!selectedAction) return null;

    switch (selectedAction.id) {
      case 1: // Yeni ödəniş
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="paymentType">Ödəniş növü</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="insurance">Sığorta ödənişi</SelectItem>
                  <SelectItem value="premium">Premium ödəniş</SelectItem>
                  <SelectItem value="penalty">Cərimə ödənişi</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="amount">Məbləğ (AZN)</Label>
              <Input id="amount" placeholder="0.00" type="number" />
            </div>
            <div>
              <Label htmlFor="description">Açıqlama</Label>
              <Textarea id="description" placeholder="Ödəniş haqqında qeyd" />
            </div>
            <Button className="w-full" onClick={() => {
              toast.success('Ödəniş uğurla həyata keçirildi!');
              setIsDialogOpen(false);
            }}>
              Ödənişi tamamla
            </Button>
          </div>
        );

      case 2: // Yeni köçürmə
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="recipient">Alıcı</Label>
              <Input id="recipient" placeholder="Alıcının adı və ya kart nömrəsi" />
            </div>
            <div>
              <Label htmlFor="transferAmount">Məbləğ (AZN)</Label>
              <Input id="transferAmount" placeholder="0.00" type="number" />
            </div>
            <div>
              <Label htmlFor="transferNote">Qeyd</Label>
              <Input id="transferNote" placeholder="Köçürmə qeydi" />
            </div>
            <Button className="w-full" onClick={() => {
              toast.success('Köçürmə uğurla həyata keçirildi!');
              setIsDialogOpen(false);
            }}>
              Köçürməni tamamla
            </Button>
          </div>
        );

      case 3: // Yeni kart əlavə et
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="cardNumber">Kart nömrəsi</Label>
              <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiry">Son tarix</Label>
                <Input id="expiry" placeholder="MM/YY" />
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input id="cvv" placeholder="123" />
              </div>
            </div>
            <div>
              <Label htmlFor="cardName">Kart sahibinin adı</Label>
              <Input id="cardName" placeholder="Ad Soyad" />
            </div>
            <Button className="w-full" onClick={() => {
              toast.success('Kart uğurla əlavə edildi!');
              setIsDialogOpen(false);
            }}>
              Kartı əlavə et
            </Button>
          </div>
        );

      case 8: // Sığorta kalkulyatoru
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="insuranceType">Sığorta növü</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="travel">Səyahət</SelectItem>
                  <SelectItem value="health">Tibbi</SelectItem>
                  <SelectItem value="car">Avtomobil</SelectItem>
                  <SelectItem value="life">Həyat</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="coverage">Əhatə məbləği (AZN)</Label>
              <Input id="coverage" placeholder="50,000" type="number" />
            </div>
            <div>
              <Label htmlFor="duration">Müddət (ay)</Label>
              <Input id="duration" placeholder="12" type="number" />
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">Təxmini aylıq ödəniş: <span className="font-medium">45 AZN</span></p>
            </div>
            <Button className="w-full" onClick={() => {
              toast.success('Hesablama tamamlandı!');
              setIsDialogOpen(false);
            }}>
              Təklif al
            </Button>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <p className="text-gray-600">Bu xidmət hazırda hazırlanır.</p>
            <Button className="w-full" variant="outline" onClick={() => setIsDialogOpen(false)}>
              Bağla
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl">Yeni əməliyyatlar</h1>
        <p className="text-gray-600">Müxtəlif xidmətlər və əməliyyatlar</p>
      </div>

      {/* Categories */}
      {categories.map((category) => (
        <div key={category}>
          <h2 className="mb-4 text-gray-800">{category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {actions
              .filter(action => action.category === category)
              .map((action) => {
                const Icon = action.icon;
                return (
                  <Card
                    key={action.id}
                    className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleActionClick(action)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`${action.color} p-2 rounded-lg`}>
                          <Icon className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-sm">{action.name}</h3>
                          <p className="text-gray-500 text-xs">{action.description}</p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </Card>
                );
              })}
          </div>
        </div>
      ))}

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="mb-4">Tez əməliyyatlar</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="flex flex-col space-y-2 h-auto py-4">
            <Phone className="h-6 w-6" />
            <span className="text-xs">Dəstək</span>
          </Button>
          <Button variant="outline" className="flex flex-col space-y-2 h-auto py-4">
            <Calculator className="h-6 w-6" />
            <span className="text-xs">Kalkulyator</span>
          </Button>
          <Button variant="outline" className="flex flex-col space-y-2 h-auto py-4">
            <FileText className="h-6 w-6" />
            <span className="text-xs">Hesabat</span>
          </Button>
          <Button variant="outline" className="flex flex-col space-y-2 h-auto py-4">
            <QrCode className="h-6 w-6" />
            <span className="text-xs">QR Scan</span>
          </Button>
        </div>
      </Card>

      {/* Action Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              {selectedAction && (
                <>
                  <div className={`${selectedAction.color} p-2 rounded-lg`}>
                    <selectedAction.icon className="h-4 w-4 text-gray-600" />
                  </div>
                  <span>{selectedAction.name}</span>
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          {/* Radio Button - özüm üçün */}
          <div className="mt-2 mb-3">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="ozum-ucun-action"
                name="ozum-ucun-action"
                className="w-4 h-4 text-blue-600"
                defaultChecked
              />
              <label htmlFor="ozum-ucun-action" className="text-sm font-normal cursor-pointer">
                özüm üçün
              </label>
            </div>
          </div>
          {renderActionForm()}
        </DialogContent>
      </Dialog>
    </div>
  );
}