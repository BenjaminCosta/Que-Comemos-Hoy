import AsyncStorage from '@react-native-async-storage/async-storage';
import { Food, SpinData } from '../types';
import { DEFAULT_FOODS } from '../data/foods';

const FOODS_KEY = '@que_comemos_hoy/foods';
const SPINS_KEY = '@que_comemos_hoy/spins';

// Foods Storage
export const loadFoods = async (): Promise<Food[]> => {
  try {
    const data = await AsyncStorage.getItem(FOODS_KEY);
    if (data) {
      const loadedFoods = JSON.parse(data);
      
      // PASO 1: Merge/actualizar comidas existentes con datos nuevos de DEFAULT_FOODS
      const mergedFoods = loadedFoods.map((savedFood: Food) => {
        const defaultFood = DEFAULT_FOODS.find(df => df.id === savedFood.id);
        
        if (defaultFood) {
          // Merge: keep saved state (isActive) but update with new fields from DEFAULT_FOODS
          return {
            ...defaultFood, // Get all updated fields (imageSource, recipe, etc.)
            isActive: savedFood.isActive !== undefined ? savedFood.isActive : true,
          };
        }
        
        // For custom foods, ensure they have the custom icon
        return {
          ...savedFood,
          isActive: savedFood.isActive !== undefined ? savedFood.isActive : true,
          iconSource: savedFood.isDefault ? savedFood.iconSource : require('../../assets/food_icons/food.png'),
        };
      });
      
      // PASO 2: Agregar comidas nuevas de DEFAULT_FOODS que no existen en el storage
      const existingIds = new Set(mergedFoods.map((f: Food) => f.id));
      const newFoods = DEFAULT_FOODS.filter(df => !existingIds.has(df.id)).map(nf => ({
        ...nf,
        isActive: false, // Nuevas comidas inactivas por defecto
      }));
      
      const completeFoods = [...mergedFoods, ...newFoods];
      
      // Save updated data back to storage
      await saveFoods(completeFoods);
      return completeFoods;
    }
    // First time: randomize 5 active foods and save
    const randomizedFoods = randomizeFiveActiveFoods(DEFAULT_FOODS);
    await saveFoods(randomizedFoods);
    return randomizedFoods;
  } catch (error) {
    console.error('Error loading foods:', error);
    return DEFAULT_FOODS;
  }
};

// Helper function to randomly select 5 foods to be active
const randomizeFiveActiveFoods = (foods: Food[]): Food[] => {
  // Shuffle array using Fisher-Yates algorithm
  const shuffled = [...foods];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  // Set first 5 as active, rest as inactive
  return shuffled.map((food, index) => ({
    ...food,
    isActive: index < 5,
  }));
};

export const saveFoods = async (foods: Food[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(FOODS_KEY, JSON.stringify(foods));
  } catch (error) {
    console.error('Error saving foods:', error);
  }
};

// Spins Storage
export const loadSpinData = async (): Promise<SpinData> => {
  try {
    const data = await AsyncStorage.getItem(SPINS_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return { lastSpinDate: '', spinsToday: 0 };
  } catch (error) {
    console.error('Error loading spin data:', error);
    return { lastSpinDate: '', spinsToday: 0 };
  }
};

export const saveSpinData = async (spinData: SpinData): Promise<void> => {
  try {
    await AsyncStorage.setItem(SPINS_KEY, JSON.stringify(spinData));
  } catch (error) {
    console.error('Error saving spin data:', error);
  }
};
