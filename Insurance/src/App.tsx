import { useState } from 'react';
import { ArrowLeft, Search, User, Bell, Menu } from 'lucide-react';
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';
import { Dashboard } from './components/Dashboard';
import { CategoryView } from './components/CategoryView';
import { OrdersView } from './components/OrdersView';
import { NewActionsView } from './components/NewActionsView';
import { ProfileView } from './components/ProfileView';
import PaymentSuccess from './components/PaymentSuccess';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentData, setPaymentData] = useState(null);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCurrentView('category');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedCategory(null);
  };

  const handlePaymentSuccess = (data) => {
    setPaymentData(data);
    setCurrentView('payment-success');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'category':
        return <CategoryView category={selectedCategory} onBack={handleBackToDashboard} onPaymentSuccess={handlePaymentSuccess} />;
      case 'orders':
        return <OrdersView onBack={handleBackToDashboard} />;
      case 'new-actions':
        return <NewActionsView onBack={handleBackToDashboard} />;
      case 'profile':
        return <ProfileView onBack={handleBackToDashboard} />;
      case 'payment-success':
        return (
          <PaymentSuccess
            policyName={paymentData?.policyName}
            policyNumber={paymentData?.policyNumber}
            paidAmount={paymentData?.paidAmount}
            paymentDate={paymentData?.paymentDate}
            email={paymentData?.email}
            onDownloadPolicy={() => alert('Sığorta faylı yüklənir...')}
            onBackToHome={handleBackToDashboard}
          />
        );
      default:
        return (
          <Dashboard 
            onCategorySelect={handleCategorySelect}
            onViewOrders={() => setCurrentView('orders')}
            onViewNewActions={() => setCurrentView('new-actions')}
            searchQuery={searchQuery}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Hide on payment success screen */}
      {currentView !== 'payment-success' && (
        <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10">
          <div className="max-w-[1440px] mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {currentView !== 'dashboard' && (
                <Button variant="ghost" size="icon" onClick={handleBackToDashboard}>
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              )}
              <h1 className="text-xl">CİB sığorta</h1>
            </div>
            
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  placeholder="Sığorta axtarın..." 
                  className="pl-10" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Demo Button for Payment Success */}
              {currentView === 'dashboard' && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handlePaymentSuccess({
                    policyName: 'Avtomobil Məsuliyyət Sığortası',
                    policyNumber: 'POL-2024-001234',
                    paidAmount: '150.00 AZN',
                    paymentDate: '28 Noyabr 2024',
                    email: 'example@email.com'
                  })}
                  className="text-xs"
                >
                  Demo: Ödəniş Səhifəsi
                </Button>
              )}
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setCurrentView('profile')}>
                <User className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className={currentView === 'payment-success' ? '' : 'max-w-[1440px] mx-auto px-8 py-8'}>
        {renderCurrentView()}
      </main>
    </div>
  );
}