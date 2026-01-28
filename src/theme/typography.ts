// Nunito font family (loaded via expo-font)
// Weights: 400 (Regular), 600 (SemiBold), 700 (Bold), 800 (ExtraBold)

export const fontFamilies = {
  regular: 'Nunito_400Regular',
  semiBold: 'Nunito_600SemiBold',
  bold: 'Nunito_700Bold',
  extraBold: 'Nunito_800ExtraBold',
};

export const typography = {
  // Large titles
  h1: {
    fontFamily: fontFamilies.extraBold,
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  
  // Section headers
  h2: {
    fontFamily: fontFamilies.bold,
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.3,
  },
  
  // Card titles
  h3: {
    fontFamily: fontFamilies.bold,
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: -0.2,
  },
  
  // Body text
  body: {
    fontFamily: fontFamilies.regular,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
  },
  
  // Body medium weight
  bodyBold: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
  },
  
  // Button labels
  button: {
    fontFamily: fontFamilies.bold,
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: 0.2,
  },
  
  // Small text
  small: {
    fontFamily: fontFamilies.regular,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0,
  },
  
  // Small bold text
  smallBold: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0,
  },
  
  // Caption/metadata
  caption: {
    fontFamily: fontFamilies.regular,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0,
  },
};

export type Typography = typeof typography;
