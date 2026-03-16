import { FiCheck } from 'react-icons/fi';
import Link from 'next/link';

interface Plan {
  id: number;
  name: string;
  description: string;
  price: number;
  period: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
}

interface PricingCardProps {
  plan: Plan;
}

export default function PricingCard({ plan }: PricingCardProps) {
  return (
    <div
      className={`rounded-lg transition-all duration-300 flex flex-col ${
        plan.highlighted
          ? 'ring-2 ring-primary-500 shadow-lg scale-105 bg-gradient-to-b from-primary-50 to-white'
          : 'card'
      }`}
    >
      {/* Highlighted Badge */}
      {plan.highlighted && (
        <div className="bg-gradient-ev text-white px-4 py-2 rounded-t-lg mx-0 mb-6 text-center font-semibold">
          Most Popular 🌟
        </div>
      )}

      {/* Header */}
      <h3 className="text-2xl font-bold text-accent-900 mb-2">{plan.name}</h3>
      <p className="text-accent-600 text-sm mb-6">{plan.description}</p>

      {/* Price */}
      <div className="mb-6">
        <span className="text-4xl font-bold text-gradient">${plan.price}</span>
        <span className="text-accent-600 ml-2">
          {plan.period === 'monthly' ? '/month' : '/year'}
        </span>
        {plan.period === 'yearly' && (
          <p className="text-sm text-secondary-600 mt-2 font-semibold">
            💰 Save 20% compared to monthly!
          </p>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-accent-100 mb-6 pt-6" />

      {/* Features */}
      <ul className="space-y-4 mb-8 flex-1">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <FiCheck className="flex-shrink-0 text-secondary-600 mt-1" size={20} />
            <span className="text-accent-700">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <button
        className={`btn w-full font-semibold transition-all ${
          plan.highlighted
            ? 'btn-primary'
            : 'btn-outline'
        }`}
      >
        {plan.cta}
      </button>
    </div>
  );
}
