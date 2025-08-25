import * as RNIap from 'react-native-iap';
import type {
  Subscription,
  ProductPurchase,
  PurchaseError,
  SubscriptionPurchase,
} from 'react-native-iap';

const subscriptionSkus: string[] = [
  'subscriptions:monthly-plan',
  'subscriptions:yearly-plan-trial',
  'subscriptions:yearly-plan-discount',
];


 //Initialize Google Play Billing connection
export async function initIAP(): Promise<void> {
  try {
    await RNIap.initConnection();
    console.log('IAP connected');
    if (RNIap.flushFailedPurchasesCachedAsPendingAndroid) {
      try {
        await RNIap.flushFailedPurchasesCachedAsPendingAndroid();
      } catch (e) {
        // no-op
      }
    }
  } catch (err) {
    console.warn('IAP init error:', err);
  }
}


 //Get available subscription products
export async function getSubscriptions(): Promise<Subscription[]> {
  try {
    // For Google Play's new subscription model, query by productId only (before ':')
    const productIds = Array.from(
      new Set(
        subscriptionSkus.map((id) => id.split(':')[0])
      )
    );
    return await RNIap.getSubscriptions({ skus: productIds });
  } catch (err) {
    console.warn('getSubscriptions error:', err);
    return [];
  }
}

 //Request a subscription purchase
export async function buySubscription(
  productId: string,
  offerToken?: string
): Promise<SubscriptionPurchase | null> {
  try {
    const options: any = { sku: productId };
    // On Google Play Billing v6+, we should pass an offerToken when available
    if (offerToken) {
      options.subscriptionOffers = [{ offerToken }];
    }
    const purchase = await RNIap.requestSubscription(options);
    if (!purchase) return null;
    if (Array.isArray(purchase)) return purchase[0];
    return purchase;
  } catch (err) {
    console.warn('buySubscription error:', err);
    return null;
  }
}

 //Restore all available purchases (useful on reinstall)
export async function restoreSubscriptions(): Promise<ProductPurchase[]> {
  try {
    const purchases = await RNIap.getAvailablePurchases();
    return purchases ?? [];
  } catch (err) {
    console.warn('restoreSubscriptions error:', err);
    return [];
  }
}

 //Setup listeners for purchase updates and errors
export function setupPurchaseListeners(
  onSuccess?: (purchase: ProductPurchase) => void,
  onError?: (error: PurchaseError) => void
): () => void {
  const updateListener = RNIap.purchaseUpdatedListener(
    async (purchase: ProductPurchase) => {
      if (purchase.transactionReceipt) {
        try {
          await RNIap.finishTransaction({ purchase, isConsumable: false });
          onSuccess?.(purchase);
        } catch (err) {
          console.warn('finishTransaction error:', err);
        }
      }
    }
  );

  const errorListener = RNIap.purchaseErrorListener((error: PurchaseError) => {
    onError?.(error);
  });

  return () => {
    updateListener.remove();
    errorListener.remove();
  };
}
