import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ArrowLeft, Phone, Mail, MapPin } from 'lucide-react';

export const LegalPage: React.FC = () => {
  const pathname = useLocation().pathname;

  const contentMap: Record<string, { title: string; body: React.ReactNode }> = {
    '/about': {
      title: 'About TAKABATHE',
      body: (
        <div className="space-y-4">
          <p>TAKABATHE is a modern coastal fresh-fish ordering platform founded with a simple mission: delivering morning-landed ocean fish straight from Malpe & Mangalore harbors directly to home kitchens in Udupi, Manipal, Mangalore, and Kundapura.</p>
          <p>Every single fish is caught by artisanal deep-sea coastal fishermen, brought to dock at 4:30 AM, hand-cut by skilled butchers, and ice-packed to preserve 100% natural moisture without formalin or synthetic preservatives.</p>
        </div>
      )
    },
    '/contact': {
      title: 'Contact Us & Order Support',
      body: (
        <div className="space-y-4">
          <p>Have questions about your daily catch order or delivery slot? We are here to assist you!</p>
          <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-2 text-cyan-300 font-bold">
            <p className="flex items-center gap-2"><Phone className="size-4" /> Phone: +91 98765 43210</p>
            <p className="flex items-center gap-2"><Mail className="size-4" /> Email: support@takabathe.com</p>
            <p className="flex items-center gap-2"><MapPin className="size-4" /> Address: TAKABATHE Harbor Hub, Malpe Port Road, Udupi, Karnataka - 576108</p>
          </div>
        </div>
      )
    },
    '/privacy': {
      title: 'Privacy Policy',
      body: (
        <div className="space-y-4">
          <p>At TAKABATHE, we respect your personal privacy. We collect customer mobile numbers, delivery addresses, and order histories exclusively to fulfill orders, verify OTP authentication, and provide delivery status notifications.</p>
          <p>We do not sell, rent, or trade your personal information or payment records to third-party marketing companies.</p>
        </div>
      )
    },
    '/terms': {
      title: 'Terms & Conditions',
      body: (
        <div className="space-y-4">
          <p>By placing an order on TAKABATHE, you agree to our standard terms of delivery. Fish items are perishable morning harbor catches; prices per KG are locked at order placement based on morning dock rates.</p>
        </div>
      )
    },
    '/refund-policy': {
      title: 'Refund & Quality Guarantee Policy',
      body: (
        <div className="space-y-4">
          <p>We take pride in our 100% ocean-fresh quality guarantee. If your delivered fish cut does not meet freshness expectations upon doorstep inspection, notify us within 2 hours of delivery for an instant replacement or full refund to your original payment method.</p>
        </div>
      )
    },
    '/cancellation-policy': {
      title: 'Cancellation Policy',
      body: (
        <div className="space-y-4">
          <p>Orders can be cancelled free of charge up to 30 minutes before your selected delivery slot. Once our butchers begin hand-cutting the fish, cancellations may incur a nominal prep fee.</p>
        </div>
      )
    },
    '/delivery-policy': {
      title: 'Delivery Policy',
      body: (
        <div className="space-y-4">
          <p>TAKABATHE offers express delivery across Udupi, Manipal, Mangalore, Kundapura, and surrounding coastal pincodes. Orders are delivered in temperature-insulated cold boxes filled with food-grade crushed ocean ice.</p>
        </div>
      )
    }
  };

  const current = contentMap[pathname] || contentMap['/about'];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white">
        <ArrowLeft className="size-4" />
        <span>Return to Home</span>
      </Link>

      <div className="p-8 rounded-3xl bg-slate-900 border border-white/10 space-y-6">
        <h1 className="font-display text-3xl font-black text-white">{current.title}</h1>
        <div className="text-xs text-slate-300 leading-relaxed">
          {current.body}
        </div>
      </div>
    </div>
  );
};
