// services/iapService.android.ts
import * as RNIap from 'react-native-iap';
import type {
  Subscription,
  ProductPurchase,
  PurchaseError,
  SubscriptionPurchase,
} from 'react-native-iap';
import { verifySubscription } from './horoscopeSubService';
import { getUid } from './uidService';
import { Alert } from 'react-native';

const SUBS_PRODUCT_ID = 'subscriptions';

// Cache the last selected offer
let lastSelectedOffer:
  | { productId: string; basePlanId?: string; offerToken?: string }
  | null = null;

export async function initIAP(): Promise<void> {
  try {
    await RNIap.initConnection();

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

export async function getSubscriptions(): Promise<
  {
    productId: string;
    basePlanId: string;
    offerToken: string;
    price: string;
    title: string;
    description: string;
  }[]
> {
  try {
    const subs: Subscription[] = await RNIap.getSubscriptions({
      skus: [SUBS_PRODUCT_ID],
    });

    const offers: {
      productId: string;
      basePlanId: string;
      offerToken: string;
      price: string;
      title: string;
      description: string;
    }[] = [];

    subs.forEach((sub) => {
      const subscriptionOfferDetails = (sub as any).subscriptionOfferDetails as
        | any[]
        | undefined;

      subscriptionOfferDetails?.forEach((offer) => {
        const pricingPhase = offer?.pricingPhases?.pricingPhaseList?.[0];
        if (
          !pricingPhase?.formattedPrice ||
          !offer?.offerToken ||
          !offer?.basePlanId
        )
          return;

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

    return offers;
  } catch (err: any) {
    console.warn('getSubscriptions error:', err);
    Alert.alert('Subscriptions Error', JSON.stringify(err, null, 2));
    return [];
  }
}

export async function buySubscription(
  productId: string,
  offerToken: string,
  basePlanId?: string,
): Promise<SubscriptionPurchase | null> {
  try {
    lastSelectedOffer = { productId, basePlanId, offerToken };

    await RNIap.requestSubscription({
      sku: productId,
      subscriptionOffers: [{ sku: productId, offerToken }],
    });

    return null;
  } catch (err: any) {
    console.warn('buySubscription error:', err);
    Alert.alert('Purchase Error', JSON.stringify(err, null, 2));
    return null;
  }
}

export async function restoreSubscriptions(): Promise<ProductPurchase[]> {
  try {
    const purchases = await RNIap.getAvailablePurchases();
    return purchases ?? [];
  } catch (err: any) {
    console.warn('restoreSubscriptions error:', err);
    Alert.alert('Restore Error', JSON.stringify(err, null, 2));
    return [];
  }
}

export async function hasActiveSubscription(): Promise<boolean> {
  try {
    const purchases = await RNIap.getAvailablePurchases();
    const hasAnySubs =
      purchases?.some((p) => p.productId === SUBS_PRODUCT_ID) ?? false;

    return hasAnySubs;
  } catch (err: any) {
    console.warn('hasActiveSubscription error:', err);
    Alert.alert('Check Error', JSON.stringify(err, null, 2));
    return false;
  }
}

export function setupPurchaseListeners(
  onSuccess?: (purchase: ProductPurchase) => void,
  onError?: (error: PurchaseError) => void,
): () => void {
  const updateListener = RNIap.purchaseUpdatedListener(
    async (purchase: ProductPurchase) => {
      if (!purchase.transactionReceipt) return;

      try {
        const uid = await getUid();

        const basePlanId =
          lastSelectedOffer?.basePlanId ??
          (purchase as any).subscriptionOfferDetails?.[0]?.basePlanId ??
          null;

        const payload = {
          uid,
          packageName: 'com.buzly.horoscope2',
          productId: purchase.productId,
          basePlanId,
          offerToken: lastSelectedOffer?.offerToken,
          purchaseToken: (purchase as any).purchaseToken,
          orderId: purchase.transactionId ?? null,
          autoRenewing: (purchase as any).autoRenewingAndroid ?? true,
          expiryTime: (purchase as any).expiryTimeAndroid
            ? new Date(
                Number((purchase as any).expiryTimeAndroid) + 5 * 60 * 1000,
              ).toISOString()
            : null,
          status: 'active' as const,
        };

        await verifySubscription(payload as any);

        if (!(purchase as any).acknowledgedAndroid) {
          try {
            await RNIap.finishTransaction({ purchase, isConsumable: false });
          } catch (err: any) {
            if (err?.code === 'E_SERVICE_ERROR') {
              setTimeout(async () => {
                try {
                  await RNIap.finishTransaction({
                    purchase,
                    isConsumable: false,
                  });
                } catch (finalErr) {
                  console.warn('Final finishTransaction failure:', finalErr);
                }
              }, 2000);
            } else {
              throw err;
            }
          }
        }

        onSuccess?.(purchase);
      } catch (err: any) {
        console.warn('purchaseUpdated flow error:', err);
        Alert.alert('Purchase Flow Error', JSON.stringify(err, null, 2));
      } finally {
        lastSelectedOffer = null;
      }
    },
  );

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

export async function restorePurchasesForUid(
  uid?: string,
): Promise<ProductPurchase[]> {
  try {
    const resolvedUid = uid ?? (await getUid());
    const purchases = await RNIap.getAvailablePurchases();

    for (const p of purchases ?? []) {
      try {
        const basePlanId =
          (p as any).subscriptionOfferDetails?.[0]?.basePlanId ?? null;

        const payload = {
          uid: resolvedUid,
          packageName: 'com.buzly.horoscope2',
          productId: p.productId,
          basePlanId,
          purchaseToken: (p as any).purchaseToken,
          orderId: p.transactionId ?? null,
          autoRenewing: (p as any).autoRenewingAndroid ?? true,
          expiryTime: (p as any).expiryTimeAndroid
            ? new Date(Number((p as any).expiryTimeAndroid) + 5 * 60 * 1000).toISOString()
            : null,
          status: 'active' as const,
        };

        await verifySubscription(payload as any);
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
