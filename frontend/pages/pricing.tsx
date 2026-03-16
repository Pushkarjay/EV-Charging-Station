import Head from 'next/head';
import { useState } from 'react';
import PricingCard from '@components/PricingCard';
import PricingComparison from '@components/PricingComparison';

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = [
    {
      id: 1,
      name: 'Basic',
      description: 'Perfect for occasional charging',
      price: billingCycle === 'monthly' ? 9.99 : 99.99,
      period: billingCycle,
      features: [
        'Limited to 10 charging sessions/month',
        'Standard charging (up to 7kW)',
        'Email support',
        'Mobile app access',
        'Basic analytics',
      ],
      cta: 'Get Started',
    },
    {
      id: 2,
      name: 'Pro',
      description: 'For regular commuters',
      price: billingCycle === 'monthly' ? 24.99 : 249.99,
      period: billingCycle,
      features: [
        'Unlimited charging sessions',
        'Fast charging (up to 22kW)',
        'Priority support',
        'Advanced analytics',
        'Loyalty rewards',
        'Family account sharing',
      ],
      cta: 'Choose Plan',
      highlighted: true,
    },
    {
      id: 3,
      name: 'Enterprise',
      description: 'For businesses and fleets',
      price: billingCycle === 'monthly' ? 99.99 : 999.99,
      period: billingCycle,
      features: [
        'Unlimited everything',
        'Rapid charging (up to 150kW)',
        '24/7 dedicated support',
        'Custom integrations',
        'Advanced fleet management',
        'Priority charging access',
        'White-label options',
      ],
      cta: 'Contact Sales',
    },
  ];

  return (
    <>
      <Head>
        <title>Pricing - EV Charging Station</title>
      </Head>
      <div className="container-fluid py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
            Simple, Transparent Pricing
          </h1>
          <p className="text-accent-600 text-lg mb-8 max-w-2xl mx-auto">
            Choose the plan that works best for your charging needs. All plans include our premium features.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="flex justify-center items-center gap-4 mb-12">
            <span className={`text-lg font-semibold ${billingCycle === 'monthly' ? 'text-primary-600' : 'text-accent-600'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="bg-primary-100 px-6 py-2 rounded-full font-semibold text-primary-600 hover:bg-primary-200 transition"
            >
              {billingCycle === 'monthly' ? 'Switch to Yearly' : 'Switch to Monthly'}
            </button>
            <span className={`text-lg font-semibold ${billingCycle === 'yearly' ? 'text-primary-600' : 'text-accent-600'}`}>
              Yearly
              <span className="ml-2 text-sm bg-secondary-100 text-secondary-700 px-2 py-1 rounded-full">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </div>

        <PricingComparison />

        <div className="mt-16 bg-gradient-ev rounded-lg p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Still not sure?</h2>
          <p className="text-lg mb-6 opacity-90">
            Try our Basic plan for free for 30 days. No credit card required.
          </p>
          <button className="btn btn-large bg-white text-primary-600 hover:bg-accent-50 font-semibold">
            Start Free Trial
          </button>
        </div>
      </div>
    </>
  );
}
