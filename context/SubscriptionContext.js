import React from 'react';

const SubscriptionContext = React.createContext({
  isSubscribed: false,
  openPaywall: () => {},
});

export default SubscriptionContext;
