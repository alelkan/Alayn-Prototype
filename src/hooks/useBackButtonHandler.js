import { useEffect } from 'react';
import { App } from '@capacitor/app';

export function useBackButtonHandler(handler) {
  useEffect(() => {
    const backButtonListener = App.addListener('backButton', (data) => {
      handler(data);
    });

    return () => {
      backButtonListener.remove();
    };
  }, [handler]);
} 