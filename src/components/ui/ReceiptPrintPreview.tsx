import React from 'react';
import { PrinterReceipt } from './PrinterReceipt';
import { ReceiptItem } from '../../types';

interface ReceiptPrintPreviewProps {
  receipt: ReceiptItem;
  onPrintComplete?: () => void;
}

export const ReceiptPrintPreview: React.FC<ReceiptPrintPreviewProps> = ({ receipt, onPrintComplete }) => {
  const mockItems = [
    { name: receipt.merchant, quantity: 1, price: receipt.amount }
  ];

  const receiptData = {
    shopName: receipt.merchant,
    address: 'Adres Bilgisi',
    city: 'Şehir, Türkiye',
    zipCode: '34000',
    orderNumber: receipt.id.slice(0, 6),
    date: new Date(receipt.date).toLocaleString('tr-TR'),
    items: mockItems,
    subtotal: receipt.amount,
    taxRate: 0.18,
    tax: receipt.amount * 0.18,
    total: receipt.amount * 1.18,
    logo: receipt.merchantLogo,
    currency: receipt.currency
  };

  return (
    <div className="flex justify-center py-8">
      <PrinterReceipt data={receiptData} onPrintComplete={onPrintComplete} />
    </div>
  );
};
