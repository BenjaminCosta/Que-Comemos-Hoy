import { useEffect, useState } from 'react';
import { Asset } from 'expo-asset';
import { FOOD_ICONS } from '../data/foodIcons';

/**
 * Hook to pre-load all food icons and return their URIs
 * Fixes iOS real device SvgImage rendering issues
 * 
 * NOTE: Run 'expo start -c' after changes to clear cache
 */
export const useFoodIconsLoaded = () => {
  const [iconUris, setIconUris] = useState<Record<string, string>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadAssets = async () => {
      try {
        // Pre-load all food icons using Asset.fromModule().downloadAsync()
        const entries = Object.entries(FOOD_ICONS);
        const uriMap: Record<string, string> = {};
        
        await Promise.all(
          entries.map(async ([key, module]) => {
            const asset = Asset.fromModule(module);
            await asset.downloadAsync();
            uriMap[key] = asset.uri || '';
          })
        );
        
        setIconUris(uriMap);
        setLoaded(true);
      } catch (error) {
        console.error('Error loading food icons:', error);
        // Still set loaded to true to avoid blocking forever
        setLoaded(true);
      }
    };

    loadAssets();
  }, []);

  return { loaded, iconUris };
};
