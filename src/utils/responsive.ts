import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

// Thresholds para detectar tamaños de pantalla
export const SCREEN_HEIGHT_THRESHOLD = {
  SMALL: 670,  // iPhone SE, pantallas pequeñas
  MEDIUM: 760, // iPhone 11, 12, 13
  LARGE: 850,  // iPhone Pro Max, Android grandes
};

export const SCREEN_WIDTH_THRESHOLD = {
  SMALL: 360,
  MEDIUM: 400,
};

/**
 * Determina el tipo de pantalla basado en altura
 */
export const getScreenSize = () => {
  if (height < SCREEN_HEIGHT_THRESHOLD.SMALL) return 'small';
  if (height < SCREEN_HEIGHT_THRESHOLD.MEDIUM) return 'medium';
  if (height < SCREEN_HEIGHT_THRESHOLD.LARGE) return 'large';
  return 'xlarge';
};

/**
 * Spacing responsivo para evitar que el header tape la ruleta
 * Retorna el espacio entre header y contenido principal
 */
export const getHeaderSpacing = () => {
  const screenSize = getScreenSize();
  
  switch (screenSize) {
    case 'small':
      return 115; // Pantallas pequeñas: menos espacio
    case 'medium':
      return 119; // iPhone estándar (mantener actual)
    case 'large':
      return 130; // Pantallas grandes: más espacio
    case 'xlarge':
      return 145; // Pantallas muy grandes (Android S20, etc): mucho más espacio
    default:
      return 119;
  }
};

/**
 * Padding top del header basado en altura de pantalla
 * Evita que el header invada el status bar/notch
 */
export const getHeaderPaddingTop = (safeAreaTop: number) => {
  const screenSize = getScreenSize();
  const baseOffset = Platform.select({ ios: 8, android: 12 }) || 8;
  
  switch (screenSize) {
    case 'small':
      return safeAreaTop + baseOffset;
    case 'medium':
      return safeAreaTop + baseOffset + 4;
    case 'large':
      return safeAreaTop + baseOffset + 8;
    case 'xlarge':
      return safeAreaTop + baseOffset + 12;
    default:
      return safeAreaTop + baseOffset;
  }
};

/**
 * Tamaño de la ruleta basado en dimensiones de pantalla
 * Mantiene el tamaño actual en iPhone, ajusta en pantallas más grandes
 */
export const getRouletteSize = () => {
  const screenSize = getScreenSize();
  const baseSize = Math.min(width * 0.924, 370);
  
  // En pantallas muy grandes, reducir un poco el tamaño para dar más aire
  if (screenSize === 'xlarge' && height > 900) {
    return Math.min(baseSize * 0.95, 350);
  }
  
  return baseSize;
};

/**
 * Posición de las flechas de navegación (back button)
 * Basado en SafeArea insets + offset responsivo
 */
export const getBackButtonTop = (safeAreaTop: number) => {
  const screenSize = getScreenSize();
  
  // Offset base por plataforma
  const platformOffset = Platform.select({ ios: 12, android: 16 }) || 12;
  
  // Ajuste adicional según tamaño de pantalla
  let sizeOffset = 0;
  switch (screenSize) {
    case 'small':
      sizeOffset = 0;
      break;
    case 'medium':
      sizeOffset = 4;
      break;
    case 'large':
      sizeOffset = 8;
      break;
    case 'xlarge':
      sizeOffset = 12;
      break;
  }
  
  return safeAreaTop + platformOffset + sizeOffset;
};

/**
 * Márgenes verticales responsivos para contenido scrollable
 */
export const getContentSpacing = () => {
  const screenSize = getScreenSize();
  
  switch (screenSize) {
    case 'small':
      return { top: 8, bottom: 12 };
    case 'medium':
      return { top: 12, bottom: 16 };
    case 'large':
      return { top: 16, bottom: 20 };
    case 'xlarge':
      return { top: 20, bottom: 24 };
    default:
      return { top: 12, bottom: 16 };
  }
};
