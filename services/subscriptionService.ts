import Purchases from 'react-native-purchases';

const API_KEY = 'YOUR_REVENUECAT_API_KEY';

export interface SubscriptionPackage {
  identifier: string;
  price: number;
  currency: string;
  period: string;
}

export async function initializePurchases() {
  try {
    await Purchases.configure({ apiKey: API_KEY });
  } catch (error) {
    console.error('Error initializing purchases:', error);
  }
}

export async function getSubscriptionPackages(): Promise<SubscriptionPackage[]> {
  try {
    const offerings = await Purchases.getOfferings();
    const current = offerings.current;
    
    if (!current) {
      return [];
    }

    return current.availablePackages.map(package => ({
      identifier: package.identifier,
      price: package.product.price,
      currency: package.product.currency,
      period: package.product.subscriptionPeriod,
    }));
  } catch (error) {
    console.error('Error getting subscription packages:', error);
    return [];
  }
}

export async function purchaseSubscription(packageIdentifier: string) {
  try {
    const offerings = await Purchases.getOfferings();
    const current = offerings.current;
    
    if (!current) {
      throw new Error('No offerings available');
    }

    const packageToPurchase = current.availablePackages.find(
      pkg => pkg.identifier === packageIdentifier
    );

    if (!packageToPurchase) {
      throw new Error('Package not found');
    }

    const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);
    return customerInfo;
  } catch (error) {
    console.error('Error purchasing subscription:', error);
    throw error;
  }
}

export async function restorePurchases() {
  try {
    const customerInfo = await Purchases.restorePurchases();
    return customerInfo;
  } catch (error) {
    console.error('Error restoring purchases:', error);
    throw error;
  }
}

export async function checkSubscriptionStatus() {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo.entitlements.active;
  } catch (error) {
    console.error('Error checking subscription status:', error);
    return false;
  }
} 