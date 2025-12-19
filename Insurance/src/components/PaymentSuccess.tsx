import React from 'react';
import { Check, Download, Home, Shield } from 'lucide-react';

interface PaymentSuccessProps {
  policyName?: string;
  policyNumber?: string;
  paidAmount?: string;
  paymentDate?: string;
  email?: string;
  onDownloadPolicy?: () => void;
  onBackToHome?: () => void;
}

export default function PaymentSuccess({
  policyName = "Əmlakın Sığortası",
  policyNumber = "POL-2024-001234",
  paidAmount = "150.00 AZN",
  paymentDate = "28 Noyabr 2024",
  email = "example@email.com",
  onDownloadPolicy = () => alert('Sığorta faylı yüklənir...'),
  onBackToHome = () => window.location.href = '/',
}: PaymentSuccessProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Success Icon and Messages */}
        <div className="text-center mb-8">
          {/* Success Icon */}
          <div className="mb-6 flex justify-center">
            <div className="relative">
              {/* Shield Background */}
              <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center">
                <Shield className="w-12 h-12 text-[#2F80ED]" strokeWidth={1.5} />
              </div>
              {/* Check Mark */}
              <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                <Check className="w-6 h-6 text-white" strokeWidth={3} />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-gray-900 mb-2">
            Ödəniş uğurla tamamlandı
          </h1>

          {/* Subtitle */}
          <p className="text-gray-600">
            Sığorta müraciətiniz qeydə alındı
          </p>
        </div>

        {/* Summary Card */}
        <div className="bg-white rounded-2xl shadow-sm mb-6 overflow-hidden">
          {/* Policy Name */}
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="text-gray-500 text-sm mb-1">Sığorta növü</div>
            <div className="text-gray-900">{policyName}</div>
          </div>

          {/* Policy Number */}
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="text-gray-500 text-sm mb-1">Sığorta nömrəsi</div>
            <div className="text-gray-900">{policyNumber}</div>
          </div>

          {/* Paid Amount */}
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="text-gray-500 text-sm mb-1">Ödənilən məbləğ</div>
            <div className="text-[#2F80ED]">{paidAmount}</div>
          </div>

          {/* Payment Date */}
          <div className="px-6 py-4">
            <div className="text-gray-500 text-sm mb-1">Ödəniş tarixi</div>
            <div className="text-gray-900">{paymentDate}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mb-6">
          {/* Primary Button - Download Policy */}
          <button
            onClick={onDownloadPolicy}
            className="w-full bg-[#2F80ED] text-white py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#2870D8] transition-colors shadow-sm"
          >
            <Download className="w-5 h-5" />
            <span>Sığorta faylını yüklə</span>
          </button>

          {/* Secondary Button - Back to Home */}
          <button
            onClick={onBackToHome}
            className="w-full bg-white text-gray-700 py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors border border-gray-200"
          >
            <Home className="w-5 h-5" />
            <span>Əsas səhifəyə qayıt</span>
          </button>
        </div>

        {/* Additional Info */}
        <div className="bg-blue-50 rounded-xl px-6 py-4">
          <div className="text-sm text-gray-700 mb-1">Əlavə məlumat</div>
          <p className="text-sm text-gray-600">
            Sənədiniz <span className="text-[#2F80ED]">{email}</span> e-poçt ünvanınıza da göndərildi.
          </p>
        </div>
      </div>
    </div>
  );
}
