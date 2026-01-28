import { Food } from '../types';
import { FOOD_ICONS } from './foodIcons';

export const CUSTOM_FOOD_COLORS = [
  '#4D96FF', // Primary celeste
  '#F9C74F', // Accent gold
  '#FF6B9D', // Pink
  '#9B59B6', // Purple
  '#2ECC71', // Green
  '#E74C3C', // Red
  '#3498DB', // Blue
  '#F39C12', // Orange
];

export const DEFAULT_FOODS: Food[] = [
  {
    id: 'hamburguesas',
    name: 'Hamburguesas',
    color: '#E74C3C',
    iconSource: FOOD_ICONS.burger,
    isDefault: true,
    isActive: false, // Will be randomly assigned on first load
    recipe: {
      ingredients: [
        '500g carne picada',
        '4 panes de hamburguesa',
        'Lechuga',
        'Tomate',
        'Queso cheddar',
        'Sal y pimienta',
      ],
      steps: [
        'Formar las hamburguesas con la carne picada y sazonar',
        'Cocinar en plancha a fuego medio-alto 4-5 minutos por lado',
        'Agregar el queso 1 minuto antes de terminar',
        'Tostar los panes ligeramente',
        'Armar con lechuga, tomate y tu salsa favorita',
      ],
    },
  },
  {
    id: 'pizza',
    name: 'Pizza',
    color: '#F39C12',
    iconSource: FOOD_ICONS.pizza,
    isDefault: true,
    isActive: false,
    recipe: {
      ingredients: [
        'Masa de pizza',
        'Salsa de tomate',
        'Muzzarella',
        'Orégano',
        'Aceite de oliva',
      ],
      steps: [
        'Estirar la masa en una pizzera aceitada',
        'Agregar salsa de tomate',
        'Cubrir con muzzarella',
        'Espolvorear orégano',
        'Hornear a 220°C por 15-20 minutos',
      ],
    },
  },
  {
    id: 'empanadas',
    name: 'Empanadas',
    color: '#C0392B',
    iconSource: FOOD_ICONS.empanadas,
    isDefault: true,
    isActive: false,
    recipe: {
      ingredients: [
        '12 tapas de empanadas',
        '400g carne picada',
        '2 cebollas',
        '1 morrón rojo',
        'Comino y pimentón',
        'Aceitunas',
      ],
      steps: [
        'Rehogar la cebolla y el morrón picados',
        'Agregar la carne y cocinar con especias',
        'Dejar enfriar el relleno',
        'Rellenar las tapas y repulgar',
        'Hornear a 200°C por 20-25 minutos',
      ],
    },
  },
  {
    id: 'pasta',
    name: 'Pasta',
    color: '#27AE60',
    iconSource: FOOD_ICONS.pasta,
    isDefault: true,
    isActive: false,
    recipe: {
      ingredients: [
        '500g pasta (fideos)',
        'Salsa a elección',
        'Queso rallado',
        'Sal',
      ],
      steps: [
        'Hervir abundante agua con sal',
        'Cocinar la pasta según tiempo del paquete',
        'Escurrir y mezclar con la salsa',
        'Servir con queso rallado',
      ],
    },
  },
  {
    id: 'guiso',
    name: 'Guiso',
    color: '#8E5A2A',
    iconSource: FOOD_ICONS.guiso,
    isDefault: true,
    isActive: false,
    recipe: {
      ingredients: [
        '500g carne picada o trozada',
        '2 papas',
        '1 zanahoria',
        '1 cebolla',
        '1 morrón',
        'Caldo',
        'Arroz o fideos',
      ],
      steps: [
        'Dorar la carne en aceite',
        'Agregar cebolla y morrón picados',
        'Incorporar papas y zanahoria en cubos',
        'Cubrir con caldo y cocinar 30 minutos',
        'Agregar arroz o fideos y cocinar hasta que estén tiernos',
      ],
    },
  },
  {
    id: 'tarta',
    name: 'Tarta',
    color: '#16A085',
    iconSource: FOOD_ICONS.tarta,
    isDefault: true,
    isActive: false,
    recipe: {
      ingredients: [
        '2 tapas de tarta',
        '3 huevos',
        '200ml crema de leche',
        'Verduras o jamón y queso',
        'Sal y pimienta',
      ],
      steps: [
        'Colocar una tapa en molde aceitado',
        'Preparar relleno con huevos batidos, crema y ingredientes',
        'Verter sobre la tapa',
        'Cubrir con la segunda tapa',
        'Hornear a 180°C por 35-40 minutos',
      ],
    },
  },
  {
    id: 'polenta',
    name: 'Polenta',
    color: '#F4D03F',
    iconSource: FOOD_ICONS.polenta,
    isDefault: true,
    isActive: false,
    recipe: {
      ingredients: [
        '250g polenta',
        '1 litro agua o caldo',
        'Salsa a elección',
        'Queso rallado',
        'Sal',
      ],
      steps: [
        'Hervir agua con sal',
        'Agregar polenta en lluvia, revolviendo constantemente',
        'Cocinar 30-40 minutos hasta espesar',
        'Servir con salsa y queso',
      ],
    },
  },
  {
    id: 'sushi',
    name: 'Sushi',
    color: '#5DADE2',
    iconSource: FOOD_ICONS.sushi,
    isDefault: true,
    isActive: false,
    recipe: {
      ingredients: [
        'Arroz para sushi',
        'Alga nori',
        'Pescado fresco o vegetales',
        'Vinagre de arroz',
        'Salsa de soja',
      ],
      steps: [
        'Cocinar arroz y mezclarlo con vinagre',
        'Colocar alga nori sobre esterilla',
        'Distribuir arroz sobre el alga',
        'Agregar relleno y enrollar firmemente',
        'Cortar en porciones y servir con salsa',
      ],
    },
  },
  {
    id: 'tacos',
    name: 'Tacos',
    color: '#9B59B6',
    iconSource: FOOD_ICONS.taco,
    isDefault: true,
    isActive: false,
    recipe: {
      ingredients: [
        'Tortillas de maíz',
        '400g carne picada',
        'Lechuga',
        'Tomate',
        'Queso',
        'Especias mexicanas',
      ],
      steps: [
        'Cocinar la carne con especias',
        'Calentar las tortillas',
        'Rellenar con carne',
        'Agregar lechuga, tomate y queso',
        'Servir con salsa picante',
      ],
    },
  },
  {
    id: 'milanesa',
    name: 'Milanesa',
    color: '#EC7063',
    iconSource: FOOD_ICONS.milanesa,
    isDefault: true,
    isActive: false,
    recipe: {
      ingredients: [
        '4 milanesas de carne',
        '2 huevos',
        'Pan rallado',
        'Perejil picado',
        'Aceite para freír',
        'Sal',
      ],
      steps: [
        'Batir los huevos con sal',
        'Mezclar pan rallado con perejil',
        'Pasar milanesas por huevo y luego por pan rallado',
        'Freír en aceite caliente hasta dorar',
        'Servir con limón y tu guarnición favorita',
      ],
    },
  },
];
