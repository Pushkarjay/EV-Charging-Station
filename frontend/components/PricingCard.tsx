'use client';

import { FiCheck, FiArrowRight } from 'react-icons/fi';
import Link from 'next/link';
import { useState } from 'react';

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
  isSelected?: boolean;
  onSelect?: () => void;
}

export default function PricingCard({ plan, isSelected = false, onSelect }: PricingCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleCardClick = () => {
    setIsClicked(true);
    if (onSelect) {
      onSelect();
    }
    setTimeout(() => setIsClicked(false), 300);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
      className={`rounded-2xl transition-all duration-300 flex flex-col cursor-pointer group overflow-hidden ${
        plan.highlighted || isSelected
          ? isHovered
            ? 'ring-2 ring-primary-600 shadow-2xl scale-105 bg-gradient-to-b from-primary-50 to-white transform -translate-y-2'
            : 'ring-2 ring-primary-500 shadow-lg scale-105 bg-gradient-to-b from-primary-50 to-white'
          : isHovered
          ? 'shadow-xl ring-1 ring-primary-300 transform scale-102 -translate-y-1 bg-gradient-to-b from-white to-accent-50'
          : 'card shadow-md hover:shadow-lg'
      } ${isClicked ? 'scale-95' : ''}`}
    >
      {/* Highlighted Badge with animated background */}
      {plan.highlighted && (
        <div className={`bg-gradient-ev text-white px-4 py-3 text-center font-bold transition-all duration-300 ${
          isHovered ? 'shadow-lg' : ''
        }`}>
          <span className={`inline-block transition-transform duration-300 ${isHovered ? 'scale-110 rotate-6' : ''}`}>
            ⭐ Most Popular
          </span>
        </div>
      )}

      {/* Card Content */}
      <div className={`px-6 py-8 flex flex-col flex-1 transition-all duration-300 ${isHovered ? 'px-7 py-9' : ''}`}>
        {/* Header */}
        <h3 className={`font-bold mb-2 transition-all duration-300 ${
          plan.highlighted || isSelected
            ? 'text-3xl text-primary-700'
            : isHovered
            ? 'text-2xl text-primary-600'
            : 'text-2xl text-accent-900'
        }`}>
          {plan.name}
        </h3>
        <p className={`text-sm mb-6 transition-all duration-300 ${
          isHovered ? 'text-accent-700 font-medium' : 'text-accent-600'
        }`}>
          {plan.description}
        </p>

        {/* Price Section */}
        <div className={`mb-6 transition-all duration-300 ${isHovered ? 'transform scale-105' : ''}`}>
          <div className="flex items-baseline gap-2">
            <span className={`font-bold transition-all duration-300 ${
              plan.highlighted || isSelected
                ? 'text-4xl text-primary-600'
                : isHovered
                ? 'text-5xl text-primary-600'
                : 'text-4xl text-gradient'
            }`}>
              ${plan.price.toFixed(2)}
            </span>
            <span className={`transition-all duration-300 ${
              plan.highlighted || isSelected
                ? 'text-primary-600'
                : isHovered
                ? 'text-primary-600 font-semibold'
                : 'text-accent-600'
            }`}>
              {plan.period === 'monthly' ? '/month' : '/year'}
            </span>
          </div>
          {plan.period === 'yearly' && (
            <p className={`text-sm mt-2 font-semibold transition-all duration-300 ${
              isHovered ? 'text-secondary-600 scale-105 origin-left' : 'text-secondary-600'
            }`}>
              💰 Save 20% vs monthly!
            </p>
          )}
        </div>

        {/* Divider */}
        <div className={`border-t transition-all duration-300 mb-6 pt-6 ${
          isHovered ? 'border-primary-300' : 'border-accent-100'
        }`} />

        {/* Features List */}
        <ul className="space-y-4 mb-8 flex-1">
          {plan.features.map((feature, index) => (
            <li 
              key={index} 
              className={`flex items-start gap-3 transition-all duration-300 ${
                isHovered ? 'transform translate-x-1' : ''
              }`}
              style={{
                transitionDelay: isHovered ? `${index * 30}ms` : '0ms'
              }}
            >
              <FiCheck className={`flex-shrink-0 mt-1 transition-all duration-300 ${
                plan.highlighted || isSelected
                  ? 'text-primary-600'
                  : isHovered
                  ? 'text-primary-600 scale-125'
                  : 'text-secondary-600'
              }`} size={20} />
              <span className={`transition-all duration-300 ${
                isHovered ? 'text-accent-800 font-medium' : 'text-accent-700'
              }`}>
                {feature}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <button
          className={`btn w-full font-bold transition-all duration-300 flex items-center justify-center gap-2 group/btn ${
            plan.highlighted || isSelected
              ? isHovered
                ? 'btn-primary shadow-lg transform scale-105'
                : 'btn-primary'
              : isHovered
              ? 'btn-outline ring-2 ring-primary-600 text-primary-600 transform scale-105'
              : 'btn-outline'
          }`}
        >
          {plan.cta}
          <FiArrowRight className={`transition-all duration-300 ${
            isHovered ? 'translate-x-1 opacity-100' : 'opacity-0 -translate-x-2'
          }`} size={18} />
        </button>
      </div>
    </div>
  );
}
