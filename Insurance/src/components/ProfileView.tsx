import { useState } from 'react';
import { User, Settings, Bell, CreditCard, Shield, FileText, LogOut, Edit, Check, X } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { toast } from 'sonner';

interface ProfileViewProps {
  onBack: () => void;
}

export function ProfileView({ onBack }: ProfileViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    firstName: 'Əli',
    lastName: 'Məmmədov',
    email: 'ali.memmedov@email.com',
    phone: '+994 55 123 45 67',
    address: 'Bakı şəhəri, Nəsimi rayonu',
    birthDate: '1985-03-15'
  });

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    marketing: false
  });

  const handleSave = () => {
    setIsEditing(false);
    toast.success('Məlumatlar yeniləndi!');
  };

  const handleNotificationChange = (type, value) => {
    setNotifications(prev => ({
      ...prev,
      [type]: value
    }));
    toast.success('Bildiriş ayarları yeniləndi!');
  };

  const accountStats = [
    { label: 'Aktiv sığortalar', value: '5', color: 'text-blue-600' },
    { label: 'Tamamlanmış', value: '12', color: 'text-green-600' },
    { label: 'Ümumi xərc', value: '8,450 AZN', color: 'text-purple-600' },
    { label: 'Qənaət', value: '1,200 AZN', color: 'text-orange-600' }
  ];

  const recentActivity = [
    { id: 1, action: 'Səyahət sığortası yeniləndi', date: '15 Dekabr 2024', type: 'insurance' },
    { id: 2, action: 'Ödəniş kartı əlavə edildi', date: '14 Dekabr 2024', type: 'payment' },
    { id: 3, action: 'Profil məlumatları yeniləndi', date: '13 Dekabr 2024', type: 'profile' },
    { id: 4, action: 'Avtomobil sığortası sifariş edildi', date: '12 Dekabr 2024', type: 'insurance' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl">Profil</h1>
          <p className="text-gray-600">Hesab məlumatlarınızı idarə edin</p>
        </div>
        <Button variant="outline" className="flex items-center space-x-2">
          <LogOut className="h-4 w-4" />
          <span>Çıxış</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium">Şəxsi məlumatlar</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className="flex items-center space-x-2"
              >
                {isEditing ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Yadda saxla</span>
                  </>
                ) : (
                  <>
                    <Edit className="h-4 w-4" />
                    <span>Düzəliş et</span>
                  </>
                )}
              </Button>
            </div>

            {/* Radio Button - özüm üçün */}
            <div className="mt-2 mb-3">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="ozum-ucun-profile"
                  name="ozum-ucun-profile"
                  className="w-4 h-4 text-blue-600"
                  defaultChecked
                />
                <label htmlFor="ozum-ucun-profile" className="text-sm font-normal cursor-pointer">
                  özüm üçün
                </label>
              </div>
            </div>

            <div className="flex items-center space-x-6 mb-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src="/placeholder-avatar.jpg" />
                <AvatarFallback className="text-lg">
                  {userInfo.firstName[0]}{userInfo.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-medium">{userInfo.firstName} {userInfo.lastName}</h3>
                <p className="text-gray-600">{userInfo.email}</p>
                <Badge variant="secondary" className="mt-1">Təsdiqlənmiş hesab</Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">Ad</Label>
                <Input
                  id="firstName"
                  value={userInfo.firstName}
                  disabled={!isEditing}
                  onChange={(e) => setUserInfo(prev => ({ ...prev, firstName: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Soyad</Label>
                <Input
                  id="lastName"
                  value={userInfo.lastName}
                  disabled={!isEditing}
                  onChange={(e) => setUserInfo(prev => ({ ...prev, lastName: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={userInfo.email}
                  disabled={!isEditing}
                  onChange={(e) => setUserInfo(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="phone">Telefon</Label>
                <Input
                  id="phone"
                  value={userInfo.phone}
                  disabled={!isEditing}
                  onChange={(e) => setUserInfo(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="address">Ünvan</Label>
                <Input
                  id="address"
                  value={userInfo.address}
                  disabled={!isEditing}
                  onChange={(e) => setUserInfo(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>
            </div>
          </Card>

          {/* Notification Settings */}
          <Card className="p-6">
            <h2 className="text-lg font-medium mb-4">Bildiriş ayarları</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications" className="text-base">Email bildirişləri</Label>
                  <p className="text-sm text-gray-600">Sığorta yeniləmələri və ödəniş xatırlatmaları</p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={notifications.email}
                  onCheckedChange={(value) => handleNotificationChange('email', value)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sms-notifications" className="text-base">SMS bildirişləri</Label>
                  <p className="text-sm text-gray-600">Təcili bildirişlər və təhlükəsizlik kodları</p>
                </div>
                <Switch
                  id="sms-notifications"
                  checked={notifications.sms}
                  onCheckedChange={(value) => handleNotificationChange('sms', value)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="push-notifications" className="text-base">Push bildirişləri</Label>
                  <p className="text-sm text-gray-600">Mobil tətbiq bildirişləri</p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={notifications.push}
                  onCheckedChange={(value) => handleNotificationChange('push', value)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="marketing-notifications" className="text-base">Marketing bildirişləri</Label>
                  <p className="text-sm text-gray-600">Yeni məhsullar və kampanyalar</p>
                </div>
                <Switch
                  id="marketing-notifications"
                  checked={notifications.marketing}
                  onCheckedChange={(value) => handleNotificationChange('marketing', value)}
                />
              </div>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="p-6">
            <h2 className="text-lg font-medium mb-4">Son fəaliyyətlər</h2>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`p-2 rounded-full ${
                    activity.type === 'insurance' ? 'bg-blue-100' :
                    activity.type === 'payment' ? 'bg-green-100' : 'bg-purple-100'
                  }`}>
                    {activity.type === 'insurance' ? <Shield className="h-4 w-4 text-blue-600" /> :
                     activity.type === 'payment' ? <CreditCard className="h-4 w-4 text-green-600" /> :
                     <User className="h-4 w-4 text-purple-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account Stats */}
          <Card className="p-6">
            <h3 className="font-medium mb-4">Hesab statistikası</h3>
            <div className="space-y-4">
              {accountStats.map((stat, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{stat.label}</span>
                  <span className={`font-medium ${stat.color}`}>{stat.value}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="font-medium mb-4">Tez əməliyyatlar</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <CreditCard className="h-4 w-4 mr-2" />
                Ödəniş kartları
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Sənədlər
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-2" />
                Ayarlar
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Shield className="h-4 w-4 mr-2" />
                Təhlükəsizlik
              </Button>
            </div>
          </Card>

          {/* Support */}
          <Card className="p-6 bg-blue-50 border-blue-200">
            <h3 className="font-medium mb-2 text-blue-900">Dəstəyə ehtiyacınız var?</h3>
            <p className="text-sm text-blue-700 mb-4">Komandamız sizə kömək etməyə hazırdır.</p>
            <Button size="sm" className="w-full">
              Əlaqə saxla
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}