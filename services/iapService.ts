import * as RNIap from 'react-native-iap';
import type { Subscription, ProductPurchase, PurchaseError, SubscriptionPurchase } from 'react-native-iap';

const subscriptionProductId = 'subscriptions';

//Initialize Google Play Billing connection

export async function initIAP(): Promise<void> {
  try {
    await RNIap.initConnection();
    console.log('IAP connected');

    if (RNIap.flushFailedPurchasesCachedAsPendingAndroid) {
      try {
        await RNIap.flushFailedPurchasesCachedAsPendingAndroid();
      } catch {}
    }
  } catch (err) {
    console.warn('IAP init error:', err);
  }
}

 //Get available subscription offers

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
  } catch (err) {
    console.warn('getSubscriptions error:', err);
    return [];
  }
}

  //Request a subscription purchase

export async function buySubscription(
  productId: string,
  offerToken: string
): Promise<SubscriptionPurchase | null> {
  try {
    const purchase = await RNIap.requestSubscription({
      sku: productId,
      subscriptionOffers: [{ sku: productId, offerToken }],
    });

    // Ensure we always return either a SubscriptionPurchase or null
    if (!purchase) return null;
    return Array.isArray(purchase) ? (purchase[0] as SubscriptionPurchase) : (purchase as SubscriptionPurchase);
  } catch (err) {
    console.warn('buySubscription error:', err);
    return null;
  }
}


  //Restore all available purchases

export async function restoreSubscriptions(): Promise<ProductPurchase[]> {
  try {
    const purchases = await RNIap.getAvailablePurchases();
    return purchases ?? [];
  } catch (err) {
    console.warn('restoreSubscriptions error:', err);
    return [];
  }
}

/**
 * Check if user currently has an active subscription on this Play account.
 * Works across reinstalls and logouts as long as the device is signed into the same Play account.
 */
export async function hasActiveSubscription(expectedProductIds?: string[]): Promise<boolean> {
  try {
    const purchases = await RNIap.getAvailablePurchases();
    if (!purchases || purchases.length === 0) return false;
    return purchases.some((p) => {
      const matchesProduct = !expectedProductIds || expectedProductIds.length === 0 || expectedProductIds.includes(p.productId);
      return matchesProduct;
    });
  } catch (err) {
    console.warn('hasActiveSubscription error:', err);
    return false;
  }
}

/**
 Extract purchase tokens to send to your backend for server-side verification (prob later)
export async function getSubscriptionTokens(): Promise<{ productId: string; purchaseToken: string }[]> {
  try {
    const purchases = await RNIap.getAvailablePurchases();
    return (purchases || [])
      .filter((p) => !!(p as any).purchaseToken)
      .map((p) => ({ productId: p.productId, purchaseToken: (p as any).purchaseToken as string }));
  } catch (err) {
    console.warn('getSubscriptionTokens error:', err);
    return [];
  }
}
**/

  //Setup listeners for purchase updates and errors

export function setupPurchaseListeners(
  onSuccess?: (purchase: ProductPurchase) => void,
  onError?: (error: PurchaseError) => void
): () => void {
  const updateListener = RNIap.purchaseUpdatedListener(async (purchase: ProductPurchase) => {
    if (purchase.transactionReceipt) {
      try {
        await RNIap.finishTransaction({ purchase, isConsumable: false });
        onSuccess?.(purchase);
      } catch (err) {
        console.warn('finishTransaction error:', err);
      }
    }
  });

  const errorListener = RNIap.purchaseErrorListener((error: PurchaseError) => {
    onError?.(error);
  });

  return () => {
    updateListener.remove();
    errorListener.remove();
  };
}
