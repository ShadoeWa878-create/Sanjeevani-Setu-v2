import React, { useState } from 'react';
import { Check, ShieldCheck, Heart, Sparkles, CheckCircle2 } from 'lucide-react';
import { PricingPlan } from '../types';

const PLANS: PricingPlan[] = [
  {
    id: 'plan-seva',
    name: 'Seva (Free)',
    tagline: 'Essential elder health routines for every family.',
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      'Up to 2 daily medicine phone calls or SMS',
      'Single family caregiver sync & SOS alert',
      'Basic health record locker (up to 5 documents)',
      'Medicine clock countdown & dose checklist',
      'Free community helpline access'
    ],
    ctaLabel: 'Get Started Free'
  },
  {
    id: 'plan-family',
    name: 'Family Bridge',
    tagline: 'Complete peace of mind for elders and remote children.',
    monthlyPrice: 299,
    yearlyPrice: 2999,
    popular: true,
    features: [
      'Unlimited automated spoken voice calls & SMS',
      'Custom voice script editing in regional languages',
      'Up to 4 family members in Caregiver Loop',
      '1-tap neighborhood chemist medicine orders & delivery',
      'Unlimited medical history locker with doctor sharing',
      'Real-time dose taken confirmation & adherence reports',
      '5-second cancelable SOS emergency broadcast'
    ],
    ctaLabel: 'Choose Family Bridge'
  },
  {
    id: 'plan-concierge',
    name: 'Concierge 360',
    tagline: 'Dedicated hands-on healthcare support & coordination.',
    monthlyPrice: 899,
    yearlyPrice: 8999,
    features: [
      'Everything in Family Bridge tier',
      'Personal elder-care manager on call',
      'Quarterly doctor home visit coordination',
      'Home lab blood test sample collection assistance',
      'Pre-sorted weekly blister pill pack home delivery',
      '24/7 Rapid ambulance (108/112) dispatch escort'
    ],
    ctaLabel: 'Choose Concierge 360'
  }
];

export function PricingPlans() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

  const handleSelectPlan = (plan: PricingPlan) => {
    setSelectedPlan(plan);
    setShowConfirmation(true);
  };

  return (
    <section id="plans" className="max-w-5xl mx-auto px-6 py-24 border-b border-[#F1E8D6]/10 scroll-mt-12">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="text-xs tracking-[3px] uppercase text-[#F1E8D6]/60 mb-4 flex items-center justify-center gap-3">
          <span className="text-[#F4B183] text-[9px]">◆</span>
          <span>Transparent Care Subscriptions</span>
          <span className="text-[#F4B183] text-[9px]">◆</span>
        </div>
        <h2 className="font-heading text-3xl sm:text-5xl text-[#F1E8D6] mb-5 font-normal">
          Plans Built for <em className="italic text-[#F4B183]">Every Family</em>
        </h2>
        <p className="text-base sm:text-lg font-light text-[#F1E8D6]/80 leading-relaxed">
          Simple, honest pricing with zero hidden fees. Start free and upgrade whenever your family needs automated telephony, doctor access, or pharmacy delivery.
        </p>

        {/* Billing Cycle Switch */}
        <div className="mt-8 inline-flex items-center p-1 bg-[#163938] border border-[#F1E8D6]/20 rounded-full">
          <button
            type="button"
            onClick={() => setBillingCycle('monthly')}
            className={`px-5 py-2 text-xs uppercase tracking-wider font-bold rounded-full transition-colors ${
              billingCycle === 'monthly'
                ? 'bg-[#F4B183] text-[#12302F]'
                : 'text-[#F1E8D6]/70 hover:text-[#F1E8D6]'
            }`}
          >
            Monthly Billing
          </button>

          <button
            type="button"
            onClick={() => setBillingCycle('yearly')}
            className={`px-5 py-2 text-xs uppercase tracking-wider font-bold rounded-full transition-colors flex items-center gap-1.5 ${
              billingCycle === 'yearly'
                ? 'bg-[#F4B183] text-[#12302F]'
                : 'text-[#F1E8D6]/70 hover:text-[#F1E8D6]'
            }`}
          >
            <span>Annual (2 Months Free)</span>
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {PLANS.map((plan) => {
          const price = billingCycle === 'monthly' ? plan.monthlyPrice : Math.round(plan.yearlyPrice / 12);
          const isFree = plan.monthlyPrice === 0;

          return (
            <div
              key={plan.id}
              className={`p-8 rounded-2xl flex flex-col justify-between transition-all relative ${
                plan.popular
                  ? 'bg-[#163938] border-2 border-[#F4B183] shadow-2xl scale-[1.02]'
                  : 'bg-[#163938]/50 border border-[#F1E8D6]/15 hover:border-[#F1E8D6]/35'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#F4B183] text-[#12302F] px-4 py-1 text-[11px] font-bold tracking-widest uppercase rounded-full shadow">
                  Most Chosen by Families
                </div>
              )}

              <div>
                <h3 className="font-heading text-2xl text-[#F1E8D6] mb-1">
                  {plan.name}
                </h3>
                <p className="text-xs text-[#F1E8D6]/70 min-h-[36px] font-light leading-relaxed">
                  {plan.tagline}
                </p>

                {/* Price Display */}
                <div className="my-6 pb-6 border-b border-[#F1E8D6]/10">
                  <div className="flex items-baseline gap-1">
                    <span className="font-mono text-4xl text-[#F4B183] font-bold">
                      {isFree ? '₹0' : `₹${price}`}
                    </span>
                    <span className="text-xs text-[#F1E8D6]/60">
                      {isFree ? '/ forever' : '/ month'}
                    </span>
                  </div>
                  {!isFree && billingCycle === 'yearly' && (
                    <span className="text-[11px] text-[#F4B183] block mt-1">
                      Billed annually at ₹{plan.yearlyPrice}/year
                    </span>
                  )}
                </div>

                {/* Feature List */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-[#F1E8D6]/85 leading-snug">
                      <Check className="w-4 h-4 text-[#F4B183] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action */}
              <button
                type="button"
                onClick={() => handleSelectPlan(plan)}
                className={`w-full py-3.5 px-6 font-bold text-xs tracking-widest uppercase transition-colors rounded-lg text-center ${
                  plan.popular
                    ? 'bg-[#F4B183] text-[#12302F] hover:bg-[#f6c29d]'
                    : 'border border-[#F1E8D6]/30 text-[#F1E8D6] hover:border-[#F4B183] hover:text-[#F4B183]'
                }`}
              >
                {plan.ctaLabel}
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-12 text-center text-xs text-[#F1E8D6]/60 max-w-lg mx-auto">
        <p>
          Need assisted setup for an elderly parent living in a different city? Our support team can configure their phone line remotely at no additional charge.
        </p>
      </div>

      {/* Plan Selected Confirmation Modal */}
      {showConfirmation && selectedPlan && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[#12302F] border-2 border-[#F4B183] p-6 sm:p-8 rounded-xl max-w-md w-full space-y-5 text-[#F1E8D6] shadow-2xl text-center">
            <div className="w-14 h-14 rounded-full bg-[#163938] border-2 border-[#F4B183] mx-auto flex items-center justify-center text-[#F4B183]">
              <Sparkles className="w-7 h-7" />
            </div>

            <div>
              <span className="text-xs uppercase tracking-widest text-[#F4B183] font-semibold">
                Care Subscription Activated
              </span>
              <h3 className="font-heading text-3xl text-[#F1E8D6] mt-1">
                {selectedPlan.name}
              </h3>
              <p className="text-sm text-[#F1E8D6]/80 mt-2">
                Your elder care setup is configured. Telephony phone reminders, medicine clock, and pharmacy connection are now active.
              </p>
            </div>

            <div className="bg-[#163938]/60 p-4 border border-[#F1E8D6]/15 rounded text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span>Billing Frequency:</span>
                <strong className="uppercase text-[#F4B183]">{billingCycle}</strong>
              </div>
              <div className="flex justify-between">
                <span>Total Amount:</span>
                <strong className="text-[#F1E8D6]">
                  {selectedPlan.monthlyPrice === 0 
                    ? 'Free Forever' 
                    : billingCycle === 'yearly' ? `₹${selectedPlan.yearlyPrice}/year` : `₹${selectedPlan.monthlyPrice}/month`}
                </strong>
              </div>
              <div className="flex justify-between">
                <span>Trial / Guarantee:</span>
                <span className="text-[#F1E8D6]/70">14-day elder satisfaction guarantee</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowConfirmation(false)}
              className="w-full py-3 bg-[#F4B183] text-[#12302F] font-bold text-xs tracking-widest uppercase hover:bg-[#f6c29d] transition-colors"
            >
              Continue to Dashboard
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
