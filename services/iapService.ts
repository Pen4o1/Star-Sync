import * as RNIap from 'react-native-iap';
import type { Subscription, ProductPurchase, PurchaseError, SubscriptionPurchase } from 'react-native-iap';
import { verifySubscription } from './horoscopeSubService';
import { getUid } from './uidService';
import { Alert, Platform } from 'react-native';

const subscriptionProductId = 'subscriptions';

// Initialize Google Play Billing connection
export async function initIAP(): Promise<void> {
  try {
    await RNIap.initConnection();
    console.log('IAP connected');

    if (RNIap.flushFailedPurchasesCachedAsPendingAndroid) {
      try {
        await RNIap.flushFailedPurchasesCachedAsPendingAndroid();
      } catch {}
    }
  } catch (err: any) {
    console.warn('IAP init error:', err);
    Alert.alert('Init Error', JSON.stringify(err, null, 2));
  }
}

// Get available subscription offers
export async function getSubscriptions(): Promise<{
  productId: string;
  basePlanId: string;
  offerToken: string;
  price: string;
  title: string;
  description: string;
}[]> {
  try {
    const subs: Subscription[] = await RNIap.getSubscriptions({ skus: [subscriptionProductId] });
    const offers: {
      productId: string;
      basePlanId: string;
      offerToken: string;
      price: string;
      title: string;
      description: string;
    }[] = [];

    subs.forEach((sub) => {
      const subscriptionOfferDetails = (sub as any).subscriptionOfferDetails as any[] | undefined;
      subscriptionOfferDetails?.forEach((offer) => {
        const pricingPhase = offer.pricingPhases.pricingPhaseList[0]; // first phase
        offers.push({
          productId: sub.productId,
          basePlanId: offer.basePlanId,
          offerToken: offer.offerToken,
          price: pricingPhase.formattedPrice,
          title: sub.title,
          description: sub.description,
        });
      });
    });

    console.log('Available subscription offers:', offers);
    return offers;
  } catch (err: any) {
    console.warn('getSubscriptions error:', err);
    Alert.alert('Subscriptions Error', JSON.stringify(err, null, 2));
    return [];
  }
}

// Request a subscription purchase
export async function buySubscription(
  productId: string,
  offerToken: string,
): Promise<SubscriptionPurchase | null> {
  try {
    const purchase = await RNIap.requestSubscription({
      sku: productId,
      subscriptionOffers: [{ sku: productId, offerToken }],
    });

    if (!purchase) return null;

    const purchaseData = Array.isArray(purchase) ? purchase[0] : purchase;

    // Send purchase to backend
    try {
      const uid = await getUid();
      const response = await verifySubscription({
        uid,
        packageName: 'com.buzly.horoscope2',
        productId: purchaseData.productId,
        purchaseToken: purchaseData.purchaseToken as string,
        orderId: purchaseData.transactionId ?? null,
        autoRenewing: true,
        status: 'active',
      });

      Alert.alert('Purchase Success 🎉', JSON.stringify(response, null, 2));
    } catch (err: any) {
      console.warn('Failed to verify subscription with backend:', err);
      Alert.alert('Verification Error', JSON.stringify(err, null, 2));
    }

    return purchaseData as SubscriptionPurchase;
  } catch (err: any) {
    console.warn('buySubscription error:', err);
    Alert.alert('Purchase Error', JSON.stringify(err, null, 2));
    return null;
  }
}

// Restore all available purchases
export async function restoreSubscriptions(): Promise<ProductPurchase[]> {
  try {
    const purchases = await RNIap.getAvailablePurchases();
    Alert.alert('Restore Purchases', JSON.stringify(purchases, null, 2));
    return purchases ?? [];
  } catch (err: any) {
    console.warn('restoreSubscriptions error:', err);
    Alert.alert('Restore Error', JSON.stringify(err, null, 2));
    return [];
  }
}

// Check if user currently has an active subscription
export async function hasActiveSubscription(expectedProductIds?: string[]): Promise<boolean> {
  try {
    const purchases = await RNIap.getAvailablePurchases();
    const hasActive = purchases?.some((p) => {
      const matchesProduct =
        !expectedProductIds ||
        expectedProductIds.length === 0 ||
        expectedProductIds.includes(p.productId);
      return matchesProduct;
    }) ?? false;

    Alert.alert('Active Subscription Check', JSON.stringify({ hasActive, purchases }, null, 2));
    return hasActive;
  } catch (err: any) {
    console.warn('hasActiveSubscription error:', err);
    Alert.alert('Check Error', JSON.stringify(err, null, 2));
    return false;
  }
}

// Setup listeners for purchase updates and errors
export function setupPurchaseListeners(
  onSuccess?: (purchase: ProductPurchase) => void,
  onError?: (error: PurchaseError) => void
): () => void {
  const updateListener = RNIap.purchaseUpdatedListener(async (purchase: ProductPurchase) => {
    if (purchase.transactionReceipt) {
      try {
        // ✅ Fixed: pass object with 'purchase' and 'isConsumable'
        await RNIap.finishTransaction({
          purchase,
          isConsumable: false, // subscriptions are not consumable
        });

        try {
          const uid = await getUid();
          const response = await verifySubscription({
            uid,
            packageName: 'com.buzly.horoscope2',
            productId: purchase.productId,
            purchaseToken: (purchase as any).purchaseToken,
            orderId: purchase.transactionId ?? null,
            autoRenewing: true,
            status: 'active',
          });

          Alert.alert('Purchase Restored ✅', JSON.stringify(response, null, 2));
        } catch (err: any) {
          console.warn('Failed to verify restored purchase with backend:', err);
          Alert.alert('Restore Verification Error', JSON.stringify(err, null, 2));
        }

        onSuccess?.(purchase);
      } catch (err: any) {
        console.warn('finishTransaction error:', err);
        Alert.alert('Finish Transaction Error', JSON.stringify(err, null, 2));
      }
    }
  });

  const errorListener = RNIap.purchaseErrorListener((error: PurchaseError) => {
    console.warn('Purchase error:', error);
    Alert.alert('Purchase Failed', JSON.stringify(error, null, 2));
    onError?.(error);
  });

  return () => {
    updateListener.remove();
    errorListener.remove();
  };
}

// Restore purchases and send to backend for a UID
export async function restorePurchasesForUid(uid?: string): Promise<ProductPurchase[]> {
  try {
    if (!uid) uid = await getUid();
    const purchases = await RNIap.getAvailablePurchases();

    for (const p of purchases) {
      try {
        const response = await verifySubscription({
          uid,
          packageName: 'com.buzly.horoscope2',
          productId: p.productId,
          purchaseToken: (p as any).purchaseToken,
          orderId: p.transactionId ?? null,
          autoRenewing: true,
          status: 'active',
        });

        Alert.alert('Restored ✅', JSON.stringify(response, null, 2));
      } catch (err: any) {
        console.warn('Failed to verify restored purchase:', err);
        Alert.alert('Restore Error', JSON.stringify(err, null, 2));
      }
    }

    return purchases ?? [];
  } catch (err: any) {
    console.warn('restorePurchasesForUid error:', err);
    Alert.alert('Restore Error', JSON.stringify(err, null, 2));
    return [];
  }
}
