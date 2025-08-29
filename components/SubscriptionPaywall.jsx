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
    productId: 'monthly-plan',
  },
  {
    title: '1 Year Trial',
    price: '69,99 BGN',
    subtitle: 'billed yearly',
    trial: '7 DAYS TRIAL',
    popular: true,
    productId: 'yearly-plan-trial',
  },
  {
    title: '1 Year Discount',
    price: '49,99 BGN',
    subtitle: 'billed yearly',
    trial: 'NO TRIAL',
    popular: false,
    productId: 'yearly-plan-discount',
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

export default function SubscriptionPaywall({ onClose, onSubscribe }) {
  const [selectedPlan, setSelectedPlan] = useState(0);
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
        (purchase) => onSubscribe?.(purchase),
        (error) => console.warn('IAP purchase error:', error)
      );
    })();

    return () => removeListeners?.();
  }, [onSubscribe]);

  const getPriceForPlan = (plan) => {
    const match = iapProducts.find((p) => p.basePlanId === plan.productId);
    return match?.price || plan.price;
  };

  const handleSubscribe = async () => {
    const plan = plans[selectedPlan];
    const offer = iapProducts.find((p) => p.basePlanId === plan.productId);
    if (!offer?.offerToken) {
      Alert.alert('Store unavailable', 'No subscription offers found.');
      return;
    }
    await buySubscription(offer.productId, offer.offerToken, offer.basePlanId);
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.light.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Header */}
        <View style={{ alignItems: 'center', paddingHorizontal: 24, paddingTop: 48, paddingBottom: 24 }}>
          <TouchableOpacity onPress={onClose} style={{ position: 'absolute', right: 16, top: 16, zIndex: 10 }}>
            <Text style={{ fontSize: 28, color: Colors.light.text, opacity: 0.4 }}>×</Text>
          </TouchableOpacity>
          <Image source={require('../assets/images/onboarding/Onboarding1.png')} style={{ width: 120, height: 120, marginBottom: 16 }} />
          <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 4, color: Colors.light.text }}>Get started today</Text>
          <Text style={{ fontSize: 18, textAlign: 'center', color: Colors.light.text, opacity: 0.7 }}>Horoscopes Light</Text>
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
              }}
            >
              {plan.popular && <Text style={{ fontSize: 12, color: Colors.light.priceText, fontWeight: 'bold', marginBottom: 4 }}>MOST POPULAR</Text>}
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 4, color: Colors.light.text }}>{plan.title}</Text>
              <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 4, color: Colors.light.priceText }}>{getPriceForPlan(plan)}</Text>
              <Text style={{ fontSize: 12, textAlign: 'center', color: Colors.light.text, opacity: 0.6, marginBottom: 8 }}>{plan.subtitle}</Text>
              <Text style={{ fontSize: 12, textAlign: 'center', color: Colors.light.priceText, fontWeight: '600' }}>{plan.trial}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Features */}
        <View style={{ backgroundColor: Colors.light.text, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 24, paddingVertical: 24, marginBottom: 24 }}>
          <Text style={{ color: Colors.light.background, fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>Unlock what the future holds for you</Text>
          {features.map((feature, idx) => (
            <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <FontAwesome name="check" size={20} color={Colors.light.priceText} />
              <Text style={{ color: Colors.light.background, marginLeft: 8 }}>{feature}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Subscribe Button */}
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
