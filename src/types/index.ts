export interface Food {
  id: string;
  name: string;
  color: string;
  iconSource: any; // PNG image require source
  isDefault: boolean;
  isActive: boolean; // Whether this food is active on the wheel
  recipe?: Recipe;
}

export interface Recipe {
  ingredients: string[];
  steps: string[];
}

export interface SpinData {
  lastSpinDate: string; // ISO date string
  spinsToday: number;
}

export type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
  EditFoods: undefined;
  Result: { food: Food };
  RecipeDetail: { food: Food };
};
