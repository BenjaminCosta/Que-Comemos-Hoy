export interface Food {
  id: string;
  name: string;
  color: string;
  iconSource: any; // PNG image require source
  imageSource?: any; // Optional ilustrative image for recipe
  isDefault: boolean;
  isActive: boolean; // Whether this food is active on the wheel
  recipe?: Recipe;
}

export interface Recipe {
  ingredients: string[];
  steps: string[];
  time: string; // Tiempo estimado (ej: "30 minutos")
  difficulty: 'Fácil' | 'Media' | 'Difícil'; // Nivel de dificultad
  servings: string; // Cantidad de personas (ej: "4 personas")
  type: string; // Tipo de receta (ej: "Plato principal", "Entrada", etc.)
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
