import axios from 'axios';

const BASE_URL = 'https://cms.buzlylabs.com/horoscope_api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    return Promise.reject(error);
  }
);

export interface VerifySubscriptionPayload {
  uid: string;
  packageName: string;
  productId: string;
  purchaseToken: string;
  orderId?: string | null;
  expiryTime?: string | null;
  autoRenewing: boolean;
  status: 'active' | 'pending' | 'canceled' | 'expired';
}

export interface SubscriptionStatusResponse {
  status: 'active' | 'none' | string;
  productId?: string;
  autoRenewing?: boolean;
  expiryTime?: string | null;
  entitlements?: string[];
}

export interface EntitlementsResponse {
  entitlements: string[];
  is_paid: boolean;
}

/**
 * Verify a purchase with the backend
 */
export const verifySubscription = async (payload: VerifySubscriptionPayload): Promise<SubscriptionStatusResponse> => {
  try {
    const response = await api.post('/subscriptions_verify', payload);
    return response.data;
  } catch (error) {
    console.error('Error verifying subscription:', error);
    throw error;
  }
};

/**
 * Get the latest subscription for a user
 */
export const getSubscription = async (uid: string): Promise<SubscriptionStatusResponse> => {
  try {
    const response = await api.get(`/subscriptions_me?uid=${uid}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching subscription:', error);
    throw error;
  }
};

/**
 * Get current entitlements for a user
 */
export const getEntitlements = async (uid: string): Promise<EntitlementsResponse> => {
  try {
    const response = await api.get(`/entitlements_me?uid=${uid}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching entitlements:', error);
    throw error;
  }
};
