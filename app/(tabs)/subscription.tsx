import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  getSubscriptionPackages,
  purchaseSubscription,
  restorePurchases,
  checkSubscriptionStatus,
  SubscriptionPackage,
} from '../../services/subscriptionService';

export default function SubscriptionScreen() {
  const [packages, setPackages] = useState<SubscriptionPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSubscriptionData();
  }, []);

  const loadSubscriptionData = async () => {
    try {
      setLoading(true);
      const [subscriptionStatus, availablePackages] = await Promise.all([
        checkSubscriptionStatus(),
        getSubscriptionPackages(),
      ]);
      
      setIsSubscribed(subscriptionStatus);
      setPackages(availablePackages);
    } catch (error) {
      console.error('Error loading subscription data:', error);
      setError('Failed to load subscription data');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (packageIdentifier: string) => {
    try {
      setLoading(true);
      await purchaseSubscription(packageIdentifier);
      await loadSubscriptionData();
    } catch (error) {
      console.error('Error purchasing subscription:', error);
      setError('Failed to purchase subscription');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    try {
      setLoading(true);
      await restorePurchases();
      await loadSubscriptionData();
    } catch (error) {
      console.error('Error restoring purchases:', error);
      setError('Failed to restore purchases');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFAA1E" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a1a1a', '#2a2a2a']}
        style={styles.gradient}
      >
        <ScrollView style={styles.scrollView}>
          {isSubscribed ? (
            <View style={styles.subscribedContainer}>
              <Text style={styles.subscribedTitle}>Premium Access Active</Text>
              <Text style={styles.subscribedText}>
                Thank you for your subscription! You have access to all premium features.
              </Text>
            </View>
          ) : (
            <View style={styles.packagesContainer}>
              <Text style={styles.title}>Choose Your Plan</Text>
              {packages.map((pkg) => (
                <TouchableOpacity
                  key={pkg.identifier}
                  style={styles.packageButton}
                  onPress={() => handlePurchase(pkg.identifier)}
                >
                  <Text style={styles.packageTitle}>
                    {pkg.period} Plan
                  </Text>
                  <Text style={styles.packagePrice}>
                    {pkg.currency} {pkg.price}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.restoreButton}
            onPress={handleRestore}
          >
            <Text style={styles.restoreButtonText}>Restore Purchases</Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  subscribedContainer: {
    padding: 20,
    alignItems: 'center',
  },
  subscribedTitle: {
    color: '#FFAA1E',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subscribedText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  packagesContainer: {
    padding: 20,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  packageButton: {
    backgroundColor: '#333',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  packageTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  packagePrice: {
    color: '#FFAA1E',
    fontSize: 16,
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 16,
  },
  restoreButton: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 5,
    margin: 20,
    alignItems: 'center',
  },
  restoreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 