import { useState } from 'react';
import { Filter, Search, Download, Eye, MoreHorizontal, Shield, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

interface OrdersViewProps {
  onBack: () => void;
}

export function OrdersView({ onBack }: OrdersViewProps) {
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');

  const orders = [
    {
      id: 'INS-001',
      provider: 'Mega Sığorta',
      type: 'Səyahət sığortası',
      price: '980 AZN',
      status: 'completed',
      date: '2024-12-15',
      time: '13:50',
      coverage: '50,000 AZN',
      startDate: '2024-12-20',
      endDate: '2024-12-27',
      color: 'bg-purple-100'
    },
    {
      id: 'INS-002',
      provider: 'Paşa Sığorta',
      type: 'Səyahət sığortası',
      price: '5,129 AZN',
      status: 'active',
      date: '2024-12-15',
      time: '13:50',
      coverage: '40,000 AZN',
      startDate: '2024-12-16',
      endDate: '2025-12-16',
      color: 'bg-teal-100'
    },
    {
      id: 'INS-003',
      provider: 'ASCO Sığorta',
      type: 'Avtomobil sığortası',
      price: '450 AZN',
      status: 'pending',
      date: '2024-12-14',
      time: '09:30',
      coverage: '75,000 AZN',
      startDate: '2024-12-20',
      endDate: '2025-12-20',
      color: 'bg-blue-100'
    },
    {
      id: 'INS-004',
      provider: 'Atəşgah Sığorta',
      type: 'Tibbi sığorta',
      price: '1,200 AZN',
      status: 'cancelled',
      date: '2024-12-13',
      time: '16:15',
      coverage: '30,000 AZN',
      startDate: '2024-12-15',
      endDate: '2025-12-15',
      color: 'bg-green-100'
    },
    {
      id: 'INS-005',
      provider: 'Mega Sığorta',
      type: 'Həyat sığortası',
      price: '2,400 AZN',
      status: 'active',
      date: '2024-12-10',
      time: '11:20',
      coverage: '100,000 AZN',
      startDate: '2024-12-11',
      endDate: '2034-12-11',
      color: 'bg-purple-100'
    }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { text: 'Tamamlandı', variant: 'default', icon: CheckCircle, color: 'text-green-600' },
      active: { text: 'Aktiv', variant: 'secondary', icon: Shield, color: 'text-blue-600' },
      pending: { text: 'Gözləyir', variant: 'outline', icon: Clock, color: 'text-orange-600' },
      cancelled: { text: 'Ləğv edildi', variant: 'destructive', icon: XCircle, color: 'text-red-600' }
    };
    
    const config = statusConfig[status];
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center space-x-1">
        <Icon className="h-3 w-3" />
        <span>{config.text}</span>
      </Badge>
    );
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesSearch = order.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    switch (sortBy) {
      case 'date-desc':
        return new Date(b.date) - new Date(a.date);
      case 'date-asc':
        return new Date(a.date) - new Date(b.date);
      case 'price-desc':
        return parseInt(b.price.replace(/[^\d]/g, '')) - parseInt(a.price.replace(/[^\d]/g, ''));
      case 'price-asc':
        return parseInt(a.price.replace(/[^\d]/g, '')) - parseInt(b.price.replace(/[^\d]/g, ''));
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl">Sığorta sifarişləri</h1>
          <p className="text-gray-600">Bütün sığorta sifarişlərinizi idarə edin</p>
        </div>
        <Button className="flex items-center space-x-2">
          <Download className="h-4 w-4" />
          <span>İxrac</span>
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Sifariş axtarın..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Hamısı</SelectItem>
              <SelectItem value="active">Aktiv</SelectItem>
              <SelectItem value="completed">Tamamlandı</SelectItem>
              <SelectItem value="pending">Gözləyir</SelectItem>
              <SelectItem value="cancelled">Ləğv edildi</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sıralama" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">Tarixi (Yeni)</SelectItem>
              <SelectItem value="date-asc">Tarixi (Köhnə)</SelectItem>
              <SelectItem value="price-desc">Qiymət (Yüksək)</SelectItem>
              <SelectItem value="price-asc">Qiymət (Aşağı)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        {sortedOrders.map((order) => (
          <Card key={order.id} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`${order.color} p-3 rounded-lg`}>
                  <Shield className="h-5 w-5 text-gray-600" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium">{order.provider}</h3>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-600">{order.id}</span>
                  </div>
                  <p className="text-gray-600">{order.type}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Əhatə: {order.coverage}</span>
                    <span>•</span>
                    <span>{order.startDate} - {order.endDate}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-blue-600">{order.price}</span>
                    {getStatusBadge(order.status)}
                  </div>
                  <p className="text-sm text-gray-500">
                    {order.date} {order.time}
                  </p>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="flex items-center space-x-2">
                      <Eye className="h-4 w-4" />
                      <span>Ətraflı bax</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center space-x-2">
                      <Download className="h-4 w-4" />
                      <span>Sənədi yüklə</span>
                    </DropdownMenuItem>
                    {order.status === 'active' && (
                      <DropdownMenuItem className="flex items-center space-x-2 text-red-600">
                        <XCircle className="h-4 w-4" />
                        <span>Ləğv et</span>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
        <Card className="p-4 text-center">
          <h3 className="text-2xl font-medium text-blue-600">
            {orders.filter(o => o.status === 'active').length}
          </h3>
          <p className="text-gray-600">Aktiv sığortalar</p>
        </Card>
        <Card className="p-4 text-center">
          <h3 className="text-2xl font-medium text-green-600">
            {orders.filter(o => o.status === 'completed').length}
          </h3>
          <p className="text-gray-600">Tamamlanmış</p>
        </Card>
        <Card className="p-4 text-center">
          <h3 className="text-2xl font-medium text-orange-600">
            {orders.filter(o => o.status === 'pending').length}
          </h3>
          <p className="text-gray-600">Gözləyən</p>
        </Card>
        <Card className="p-4 text-center">
          <h3 className="text-2xl font-medium text-gray-600">
            {orders.reduce((sum, order) => sum + parseInt(order.price.replace(/[^\d]/g, '')), 0).toLocaleString()} AZN
          </h3>
          <p className="text-gray-600">Ümumi məbləğ</p>
        </Card>
      </div>
    </div>
  );
}