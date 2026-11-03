import React from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { OfflineProvider } from './context/OfflineContext';
import { MarketplaceProvider } from './context/MarketplaceContext';
import { HandymanApp } from './components/handyman/HandymanApp';

export default function App() {
  return (
    <LanguageProvider>
      <OfflineProvider>
        <MarketplaceProvider>
          <HandymanApp />
        </MarketplaceProvider>
      </OfflineProvider>
    </LanguageProvider>
  );
}
