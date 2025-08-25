import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { initIAP, getSubscriptions, buySubscription, setupPurchaseListeners } from '../services/iapService';

const plans = [
  {
    title: '1 Month',
    price: '9,99 BGN',
    subtitle: 'billed monthly',
    trial: '3 DAYS TRIAL',
    popular: false,
    productId: 'subscriptions:monthly-plan',
  },
  {
    title: '1 Year',
    price: '69,99 BGN',
    subtitle: 'billed yearly',
    trial: '7 DAYS TRIAL',
    popular: true,
    productId: 'subscriptions:yearly-plan-trial',
  },
  {
    title: '1 Year',
    price: '49,99 BGN',
    subtitle: 'billed yearly',
    trial: 'NO TRIAL',
    popular: false,
    productId: 'subscriptions:yearly-plan-discount',
  },
];

const features = [
  'No advertisements',
  'Dreambook',
  'Chinese Daily',
  'Chinese Yearly',
  'Chinese Full',
  'Love & Friendship Matcher',
];

const testimonials = [
  {
    name: 'Kathrine',
    text: 'Fantastic app! Since I read my horoscope daily my life has turned in totally different direction.',
    avatar: null, // Replace with image if available
  },
  {
    name: 'John',
    text: 'Very accurate and insightful! Highly recommend.',
    avatar: null,
  },
];

const faqs = [
  {
    q: 'Will this subscription renew automatically?',
    a: 'Yes, subscriptions renew automatically unless cancelled.',
  },
  {
    q: 'How do I cancel my subscription?',
    a: 'You can cancel anytime from your account settings or app store.',
  },
  {
    q: 'Can I get a refund if I change my mind?',
    a: 'Refunds are subject to store policies.',
  },
];

export default function SubscriptionPaywall({ onClose, onSubscribe }) {
  const [selectedPlan, setSelectedPlan] = useState(1);
  const [openFaq, setOpenFaq] = useState(null);
  const [iapProducts, setIapProducts] = useState([]);
  const [iapReady, setIapReady] = useState(false);

  useEffect(() => {
    let removeListeners;
    (async () => {
      await initIAP();
      setIapReady(true);
      const subs = await getSubscriptions();
      setIapProducts(subs || []);
      removeListeners = setupPurchaseListeners(
        (purchase) => {
          // Notify parent with the successful purchase
          onSubscribe?.(purchase);
        },
        (error) => {
          console.warn('IAP purchase error:', error);
        }
      );
    })();

    return () => {
      removeListeners && removeListeners();
    };
  }, [onSubscribe]);

  const getPriceForPlan = (plan) => {
    const [productIdOnly, basePlanKey] = plan.productId.split(':');
    const match = iapProducts.find((p) => p.productId === productIdOnly);
    const offerDetails = match?.subscriptionOfferDetails || [];
    const offer = offerDetails.find((o) => o.basePlanId === basePlanKey) || offerDetails[0];
    const firstPhase = offer?.pricingPhases?.pricingPhaseList?.[0];
    const localizedPrice = firstPhase?.formattedPrice;
    return localizedPrice || match?.localizedPrice || match?.price || plan.price;
  };

  const handleSubscribe = async () => {
    const plan = plans[selectedPlan];
    if (!iapReady) return;
    const [productIdOnly, basePlanKey] = plan.productId.split(':');
    const product = iapProducts.find((p) => p.productId === productIdOnly);
    const offerDetails = product?.subscriptionOfferDetails || [];
    const offer = offerDetails.find((o) => o.basePlanId === basePlanKey) || offerDetails[0];
    const offerToken = offer?.offerToken;
    if (!offerToken) {
      Alert.alert('Store unavailable', 'No subscription offers found. Please try again later.');
      return;
    }
    await buySubscription(productIdOnly, offerToken);
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.light.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Header */}
        <View style={{ alignItems: 'center', paddingHorizontal: 24, paddingTop: 48, paddingBottom: 24 }}>
          {/* Close button */}
          <TouchableOpacity onPress={onClose} style={{ position: 'absolute', right: 16, top: 16, zIndex: 10 }}>
            <Text style={{ fontSize: 28, color: Colors.light.text, opacity: 0.4 }}>×</Text>
          </TouchableOpacity>
          {/* Illustration (placeholder) */}
          <View style={{ marginBottom: 16 }}>
            <Image source={require('../assets/images/onboarding/Onboarding1.png')} style={{ width: 120, height: 120 }} />
          </View>
          <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 4, color: Colors.light.text }}>
            Get started today
          </Text>
          <Text style={{ fontSize: 18, textAlign: 'center', color: Colors.light.text, opacity: 0.7, marginBottom: 16 }}>Horoscopes Light</Text>
        </View>

        {/* Plan Cards */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 24, paddingHorizontal: 16 }}>
          {plans.map((plan, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => setSelectedPlan(idx)}
              style={{
                flex: 1,
                marginHorizontal: 4,
                borderRadius: 16,
                padding: 16,
                borderWidth: selectedPlan === idx ? 2 : 1,
                borderColor: selectedPlan === idx ? Colors.light.priceText : '#e5e7eb',
                backgroundColor: selectedPlan === idx ? '#fff8e1' : Colors.light.background,
                alignItems: 'center',
                ...(plan.popular ? { borderColor: Colors.light.priceText } : {}),
              }}
            >
              {plan.popular && (
                <Text style={{ fontSize: 12, color: Colors.light.priceText, fontWeight: 'bold', marginBottom: 4, textAlign: 'center' }}>MOST POPULAR</Text>
              )}
              <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 4, color: Colors.light.text }}>{plan.title}</Text>
              <Text style={{ fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 4, color: Colors.light.priceText }}>{getPriceForPlan(plan)}</Text>
              <Text style={{ fontSize: 12, textAlign: 'center', color: Colors.light.text, opacity: 0.6, marginBottom: 8 }}>{plan.subtitle}</Text>
              <Text style={{ fontSize: 12, textAlign: 'center', color: Colors.light.priceText, fontWeight: '600' }}>{plan.trial}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Features */}
        <View style={{ backgroundColor: Colors.light.text, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 24, paddingVertical: 24, marginBottom: 24 }}>
          <Text style={{ color: Colors.light.background, fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>Unlock what the future holds for you</Text>
          <Text style={{ color: Colors.light.background, fontSize: 16, fontWeight: '600', marginBottom: 8 }}>Our plans included:</Text>
          {features.map((feature, idx) => (
            <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <FontAwesome name="check" size={20} color={Colors.light.priceText} />
              <Text style={{ color: Colors.light.background, marginLeft: 8 }}>{feature}</Text>
            </View>
          ))}
        </View>

        {/* Testimonials */}
        <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8, textAlign: 'center', color: Colors.light.text }}>What our users share:</Text>
          {testimonials.map((t, idx) => (
            <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f3f4f6', borderRadius: 16, padding: 12, marginBottom: 8 }}>
              <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#e5e7eb', marginRight: 12 }} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: 'bold', marginBottom: 2, color: Colors.light.text }}>{t.name}</Text>
                <Text style={{ color: Colors.light.text, opacity: 0.7, fontSize: 14 }}>{t.text}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* FAQ */}
        <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8, color: Colors.light.text }}>Frequently Asked Questions</Text>
          {faqs.map((faq, idx) => (
            <View key={idx} style={{ marginBottom: 8 }}>
              <TouchableOpacity onPress={() => setOpenFaq(openFaq === idx ? null : idx)} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' }}>
                <Text style={{ fontWeight: '600', color: Colors.light.text }}>{faq.q}</Text>
                <Text style={{ fontSize: 24, color: Colors.light.text, opacity: 0.4 }}>{openFaq === idx ? '-' : '+'}</Text>
              </TouchableOpacity>
              {openFaq === idx && (
                <Text style={{ color: Colors.light.text, opacity: 0.7, paddingVertical: 8, paddingLeft: 8 }}>{faq.a}</Text>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
      {/* Main Action Button */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 24, paddingBottom: 24 }}>
        <TouchableOpacity
          style={{ backgroundColor: Colors.light.buttonBg, borderRadius: 16, paddingVertical: 16, opacity: iapReady ? 1 : 0.6 }}
          disabled={!iapReady}
          onPress={handleSubscribe}
        >
          <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold', color: Colors.light.buttonText }}>
            {iapReady ? 'Start Free Trial' : 'Loading Store...'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
} 