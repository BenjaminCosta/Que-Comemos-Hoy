import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Image,
  Pressable,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import Svg, { Path, G, Image as SvgImage, Defs, ClipPath, Circle, RadialGradient, LinearGradient, Stop } from 'react-native-svg';
import { Food } from '../types';
import { theme } from '../theme';
import { getRouletteSize } from '../utils/responsive';

// Pre-registrar TODOS los food icons con require() directo (iOS fix)
const FOOD_ICON_ASSETS = {
  hamburguesas: require('../../assets/food_icons/burger.png'),
  pizza: require('../../assets/food_icons/pizza.png'),
  empanadas: require('../../assets/food_icons/empanadas.png'),
  pasta: require('../../assets/food_icons/pasta.png'),
  guiso: require('../../assets/food_icons/guiso.png'),
  tarta: require('../../assets/food_icons/tarta.png'),
  polenta: require('../../assets/food_icons/polenta.png'),
  sushi: require('../../assets/food_icons/sushi.png'),
  tacos: require('../../assets/food_icons/taco.png'),
  milanesa: require('../../assets/food_icons/milanesa.png'),
};

/**
 * RouletteWheel Component
 * 
 * IMPORTANT: If food icons don't render on iOS real device:
 * 1. Stop the dev server
 * 2. Run: npx expo start -c (to clear cache)
 * 3. Reload the app in Expo Go
 * 
 * The component uses expo-asset to pre-load icons and convert
 * require() modules to URIs for SvgImage compatibility on iOS.
 */

interface RouletteWheelProps {
  foods: Food[];
  isSpinning: boolean;
  selectedFood?: Food;
  stoppedFood?: Food; // The food where the wheel stopped
  onSpinComplete?: () => void;
  onSpin?: () => void;
}

const RING_WIDTH = 12;
const DOT_SIZE = 8;
const NUM_DOTS = 32;
const SEPARATOR_WIDTH = 2;

// AUMENTAR visibilidad de palitos/marcas del borde
const NOTCH_SIZE = 7.0; // AUMENTADO de 5.3 a 7.0 (32% más grande)
const NOTCH_COLOR = 'rgba(255, 255, 255, 0.98)'; // Más blanco y visible
const NOTCH_STROKE_COLOR = 'rgba(240, 240, 240, 0.9)'; // Borde más definido
const NOTCH_STROKE_WIDTH = 1.4; // Borde más grueso

export const RouletteWheel: React.FC<RouletteWheelProps> = ({
  foods,
  isSpinning,
  selectedFood,
  stoppedFood,
  onSpinComplete,
  onSpin,
}) => {
  const { width } = useWindowDimensions();
  const WHEEL_SIZE = getRouletteSize();
  
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const lastRotation = useRef(0);
  
  // Tick effect animations
  const pointerBounceAnim = useRef(new Animated.Value(0)).current;
  const wheelTickAnim = useRef(new Animated.Value(0)).current;
  const lastTickIndex = useRef(0);

  useEffect(() => {
    if (isSpinning && selectedFood) {
      // Calculate target angle for selected food
      const selectedIndex = foods.findIndex(f => f.id === selectedFood.id);
      const sliceAngle = 360 / foods.length;
      const tickStep = sliceAngle;
      
      // Calculate target rotation (multiple full rotations + target slice)
      // We want the arrow at the top to point to the selected slice
      let targetSliceRotation = selectedIndex * sliceAngle;
      
      // VARIAR posición final DENTRO del slice ganador (evitar repetitividad)
      const safeMargin = tickStep * 0.18; // Evitar caer muy cerca de separadores
      const randomOffset = safeMargin + Math.random() * (tickStep - 2 * safeMargin);
      targetSliceRotation += randomOffset;
      
      const fullRotations = 4;
      const totalRotation = (fullRotations * 360) + (360 - targetSliceRotation);
      
      // Duración aumentada con pequeña variación para naturalidad
      const baseDuration = 5000;
      const durationVariation = baseDuration * (0.96 + Math.random() * 0.08); // ±4% variación
      
      // Reset animation values
      rotateAnim.setValue(lastRotation.current);
      wheelTickAnim.setValue(0);
      lastTickIndex.current = Math.floor(lastRotation.current / tickStep);
      
      // Add listener for tick effects
      const listenerId = rotateAnim.addListener(({ value }) => {
        const totalProgress = (value - lastRotation.current) / totalRotation;
        
        // Detección de tick por índice monotónico (100% sincronizado, no falla en wrap 0-360)
        const currentTickIndex = Math.floor(value / tickStep);
        
        if (currentTickIndex !== lastTickIndex.current) {
          lastTickIndex.current = currentTickIndex;
          
          // Calcular progreso de fase final (último 25%)
          const finalPhaseProgress = Math.max(0, (totalProgress - 0.75) / 0.25);
          
          // Bounce MÁS NOTORIO, especialmente al final (efecto casino)
          const baseBounce = 12;
          const finalBounce = 18;
          const bounceIntensity = baseBounce + (finalBounce - baseBounce) * finalPhaseProgress;
          
          // Rebote del pointer - sincronizado perfectamente y MÁS VISIBLE
          Animated.sequence([
            Animated.timing(pointerBounceAnim, {
              toValue: bounceIntensity,
              duration: 55,
              easing: Easing.out(Easing.quad),
              useNativeDriver: true,
            }),
            Animated.spring(pointerBounceAnim, {
              toValue: 0,
              friction: 7,
              tension: 180,
              useNativeDriver: true,
            }),
          ]).start();
          
          // WHEEL "TRABA" con micro-frenada + recover (efecto "tac" con envión natural)
          Animated.sequence([
            // Step back: frenadita corta
            Animated.timing(wheelTickAnim, {
              toValue: -0.35,
              duration: 18,
              easing: Easing.in(Easing.quad),
              useNativeDriver: true,
            }),
            // Recover: vuelta suave con envión natural
            Animated.timing(wheelTickAnim, {
              toValue: 0,
              duration: 55,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
          ]).start();
        }
      });
      
      // Easing suave y monotónico sin aceleración al final (desaceleración larga)
      const smoothEasing = Easing.bezier(0.0, 0.0, 0.2, 1); // Material Design decelerate
      
      // Animate to target con desaceleración suave, continua y más larga
      Animated.timing(rotateAnim, {
        toValue: lastRotation.current + totalRotation,
        duration: durationVariation,
        easing: smoothEasing,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          lastRotation.current = lastRotation.current + totalRotation;
          rotateAnim.removeListener(listenerId);
          onSpinComplete?.();
        }
      });
      
      // Cleanup listener on unmount
      return () => {
        rotateAnim.removeListener(listenerId);
      };
    }
  }, [isSpinning, selectedFood]);

  // Rotation con micro-frenada en cada tick (efecto "traba")
  const rotation = Animated.add(
    rotateAnim,
    wheelTickAnim
  ).interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });
  
  // Rebote del pointer
  const pointerRotation = pointerBounceAnim.interpolate({
    inputRange: [0, 15],
    outputRange: ['0deg', '15deg'],
  });

  const sliceAngle = 360 / foods.length;
  const radius = WHEEL_SIZE / 2;
  
  // Dynamic icon size based on number of foods (responsive)
  const getIconSize = () => {
    if (foods.length <= 5) return 56;
    if (foods.length <= 8) return 48;
    if (foods.length <= 12) return 42;
    return 36;
  };
  
  const iconSize = getIconSize();

  // Calcular posiciones de íconos para renderizar como Image overlay
  const iconLayouts = foods.map((food, index) => {
    const sliceAngleRad = (sliceAngle * Math.PI) / 180;
    const midAngle = (index + 0.5) * sliceAngleRad - Math.PI / 2;
    
    const centerOuterRadius = 28;
    const rInner = centerOuterRadius + 14;
    const rOuter = radius - Math.max(14, iconSize * 0.65);
    const rIcon = (rInner + rOuter) / 2;
    
    const iconX = WHEEL_SIZE / 2 + rIcon * Math.cos(midAngle) - iconSize / 2;
    const iconY = WHEEL_SIZE / 2 + rIcon * Math.sin(midAngle) - iconSize / 2;
    
    // Usar el asset pre-registrado en este archivo (iOS fix)
    const iconAsset = FOOD_ICON_ASSETS[food.id as keyof typeof FOOD_ICON_ASSETS];
    
    return {
      key: food.id,
      left: iconX,
      top: iconY,
      size: iconSize,
      source: iconAsset || food.iconSource, // Fallback a food.iconSource
      centerX: iconX + iconSize / 2,
      centerY: iconY + iconSize / 2,
    };
  });

  // Helper to create SVG path for donut slice (sector anular)
  const describeDonutSlice = (
    cx: number,
    cy: number,
    rInner: number,
    rOuter: number,
    startAngle: number,
    endAngle: number
  ): string => {
    const startOuter = {
      x: cx + rOuter * Math.cos(startAngle),
      y: cy + rOuter * Math.sin(startAngle),
    };
    const endOuter = {
      x: cx + rOuter * Math.cos(endAngle),
      y: cy + rOuter * Math.sin(endAngle),
    };
    const startInner = {
      x: cx + rInner * Math.cos(startAngle),
      y: cy + rInner * Math.sin(startAngle),
    };
    const endInner = {
      x: cx + rInner * Math.cos(endAngle),
      y: cy + rInner * Math.sin(endAngle),
    };

    const largeArcFlag = endAngle - startAngle <= Math.PI ? 0 : 1;

    return [
      `M ${startOuter.x} ${startOuter.y}`,
      `A ${rOuter} ${rOuter} 0 ${largeArcFlag} 1 ${endOuter.x} ${endOuter.y}`,
      `L ${endInner.x} ${endInner.y}`,
      `A ${rInner} ${rInner} 0 ${largeArcFlag} 0 ${startInner.x} ${startInner.y}`,
      `Z`,
    ].join(' ');
  };

  // Render decorative dots around the ring
  const renderDots = () => {
    const dots = [];
    const dotRadius = WHEEL_SIZE / 2 + RING_WIDTH / 2;
    const containerSize = WHEEL_SIZE + RING_WIDTH * 2;
    
    for (let i = 0; i < NUM_DOTS; i++) {
      const angle = (i * 360) / NUM_DOTS;
      const angleRad = (angle * Math.PI) / 180;
      const x = dotRadius * Math.cos(angleRad - Math.PI / 2);
      const y = dotRadius * Math.sin(angleRad - Math.PI / 2);
      
      dots.push(
        <View
          key={`dot-${i}`}
          style={[
            styles.dot,
            {
              left: containerSize / 2 + x - DOT_SIZE / 2,
              top: containerSize / 2 + y - DOT_SIZE / 2,
            },
          ]}
        />
      );
    }
    return dots;
  };

  // Render notch marks around the wheel edge - MÁS VISIBLES
  const renderNotches = () => {
    const notches = [];
    const numSlices = foods.length;
    const notchRadius = radius - 16; // Ajustado para mejor posición
    
    for (let i = 0; i < numSlices; i++) {
      const angle = (i * 360) / numSlices;
      const angleRad = (angle * Math.PI) / 180 - Math.PI / 2;
      const x = WHEEL_SIZE / 2 + notchRadius * Math.cos(angleRad);
      const y = WHEEL_SIZE / 2 + notchRadius * Math.sin(angleRad);
      
      // Agregar sombra suave para mejor visibilidad
      notches.push(
        <G key={`notch-${i}`}>
          {/* Sombra suave */}
          <Circle
            cx={x}
            cy={y}
            r={NOTCH_SIZE * 1.1}
            fill="rgba(0, 0, 0, 0.15)"
            opacity={0.3}
          />
          
          {/* Marca principal - MÁS VISIBLE */}
          <Circle
            cx={x}
            cy={y}
            r={NOTCH_SIZE}
            fill={NOTCH_COLOR}
            strokeWidth={NOTCH_STROKE_WIDTH}
            stroke={NOTCH_STROKE_COLOR}
          />
          
          {/* Highlight interno para efecto 3D */}
          <Circle
            cx={x - NOTCH_SIZE * 0.2}
            cy={y - NOTCH_SIZE * 0.2}
            r={NOTCH_SIZE * 0.4}
            fill="rgba(255, 255, 255, 0.6)"
          />
        </G>
      );
    }
    return notches;
  };
  
  // Render decorative dots around the center circle
  const renderCenterDots = () => {
    const dots = [];
    const centerSize = 54;
    const ringWidth = 8;
    const centerDotSize = 5;
    const numCenterDots = 16;
    const dotRadius = centerSize / 2 + ringWidth / 2;
    const containerSize = centerSize + ringWidth * 2;
    
    for (let i = 0; i < numCenterDots; i++) {
      const angle = (i * 360) / numCenterDots;
      const angleRad = (angle * Math.PI) / 180;
      const x = dotRadius * Math.cos(angleRad - Math.PI / 2);
      const y = dotRadius * Math.sin(angleRad - Math.PI / 2);
      
      dots.push(
        <View
          key={`center-dot-${i}`}
          style={[
            styles.centerDot,
            {
              left: containerSize / 2 + x - centerDotSize / 2,
              top: containerSize / 2 + y - centerDotSize / 2,
              width: centerDotSize,
              height: centerDotSize,
              borderRadius: centerDotSize / 2,
            },
          ]}
        />
      );
    }
    return dots;
  };

  return (
    <View style={styles.container}>
      <View style={[
        styles.wheelContainer,
        { 
          width: WHEEL_SIZE + RING_WIDTH * 2 + 10,
          height: WHEEL_SIZE + RING_WIDTH * 2 + 10,
        }
      ]}>
        <View style={[
          styles.ringContainer,
          {
            width: WHEEL_SIZE + RING_WIDTH * 2,
            height: WHEEL_SIZE + RING_WIDTH * 2,
            borderRadius: (WHEEL_SIZE + RING_WIDTH * 2) / 2,
          }
        ]}>
          <View style={[
            styles.ring,
            {
              width: WHEEL_SIZE + RING_WIDTH * 2,
              height: WHEEL_SIZE + RING_WIDTH * 2,
              borderRadius: (WHEEL_SIZE + RING_WIDTH * 2) / 2,
            }
          ]} />
          {renderDots()}
        </View>
        
        <Animated.View
          style={[
            styles.wheel,
            {
              width: WHEEL_SIZE,
              height: WHEEL_SIZE,
              borderRadius: WHEEL_SIZE / 2,
            },
            {
              transform: [{ rotate: rotation }],
            },
          ]}
        >
          <Svg width={WHEEL_SIZE} height={WHEEL_SIZE} style={styles.svgWheel}>
            <Defs>
              <ClipPath id="wheelClip">
                <Circle cx={WHEEL_SIZE / 2} cy={WHEEL_SIZE / 2} r={radius} />
              </ClipPath>
              
              <RadialGradient id="depthGradient" cx="50%" cy="50%">
                <Stop offset="0%" stopColor="rgba(255, 255, 255, 0.25)" />
                <Stop offset="50%" stopColor="rgba(255, 255, 255, 0)" />
                <Stop offset="100%" stopColor="rgba(0, 0, 0, 0.2)" />
              </RadialGradient>
              
              <RadialGradient id="innerShadow" cx="50%" cy="50%">
                <Stop offset="0%" stopColor="rgba(0, 0, 0, 0)" />
                <Stop offset="85%" stopColor="rgba(0, 0, 0, 0)" />
                <Stop offset="100%" stopColor="rgba(0, 0, 0, 0.5)" />
              </RadialGradient>
              
              <LinearGradient id="topHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor="rgba(255, 255, 255, 0.4)" />
                <Stop offset="30%" stopColor="rgba(255, 255, 255, 0.15)" />
                <Stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
              </LinearGradient>
            </Defs>
            
            <G clipPath="url(#wheelClip)">
              {foods.map((food, index) => {
                const sliceAngleRad = (sliceAngle * Math.PI) / 180;
                const startAngle = index * sliceAngleRad - Math.PI / 2;
                const endAngle = (index + 1) * sliceAngleRad - Math.PI / 2;
                
                const centerOuterRadius = 28;
                const rInner = centerOuterRadius + 2;
                const rOuter = radius - 1;
                
                const pathData = describeDonutSlice(
                  WHEEL_SIZE / 2,
                  WHEEL_SIZE / 2,
                  rInner,
                  rOuter,
                  startAngle,
                  endAngle
                );
                
                const separatorWidth = 0.015;
                const separatorPath = describeDonutSlice(
                  WHEEL_SIZE / 2,
                  WHEEL_SIZE / 2,
                  rInner,
                  rOuter,
                  endAngle - separatorWidth / 2,
                  endAngle + separatorWidth / 2
                );
                
                return (
                  <G key={`slice-${food.id}`}>
                    <Path d={pathData} fill={food.color} />
                    
                    <Circle
                      cx={WHEEL_SIZE / 2}
                      cy={WHEEL_SIZE / 2}
                      r={centerOuterRadius + 10}
                      fill={food.color}
                      clipPath={`url(#sliceClip${index})`}
                    />
                    
                    <ClipPath id={`sliceClip${index}`}>
                      <Path
                        d={`M ${WHEEL_SIZE / 2} ${WHEEL_SIZE / 2} L ${WHEEL_SIZE / 2 + radius * Math.cos(startAngle)} ${WHEEL_SIZE / 2 + radius * Math.sin(startAngle)} A ${radius} ${radius} 0 0 1 ${WHEEL_SIZE / 2 + radius * Math.cos(endAngle)} ${WHEEL_SIZE / 2 + radius * Math.sin(endAngle)} Z`}
                      />
                    </ClipPath>
                    
                    <Path d={pathData} fill="url(#topHighlight)" opacity={0.1} />
                    
                    <Path 
                      d={separatorPath} 
                      fill="rgba(255, 255, 255, 0.9)" 
                      opacity={20}
                    />
                    
                    <Path
                      d={`M ${WHEEL_SIZE / 2 + rInner * Math.cos(endAngle)} ${WHEEL_SIZE / 2 + rInner * Math.sin(endAngle)} L ${WHEEL_SIZE / 2 + (centerOuterRadius + 2) * Math.cos(endAngle)} ${WHEEL_SIZE / 2 + (centerOuterRadius + 2) * Math.sin(endAngle)}`}
                      stroke="rgba(255, 255, 255, 0.9)"
                      strokeWidth={2}
                      strokeOpacity={20}
                    />
                  </G>
                );
              })}
              
              <Circle 
                cx={WHEEL_SIZE / 2} 
                cy={WHEEL_SIZE / 2} 
                r={30} 
                fill="#ffffff"
                opacity={0.1}
              />
              
              <Circle 
                cx={WHEEL_SIZE / 2} 
                cy={WHEEL_SIZE / 2} 
                r={radius} 
                fill="url(#depthGradient)" 
                opacity={0.15}
              />
              
              <Circle 
                cx={WHEEL_SIZE / 2} 
                cy={WHEEL_SIZE / 2} 
                r={radius} 
                fill="url(#innerShadow)" 
                opacity={0.1}
              />
              
              {/* MARCAS DEL BORDE MÁS VISIBLES */}
              {renderNotches()}
            </G>
            
            {/* Sombras de los íconos dentro del SVG */}
            {iconLayouts.map((layout) => (
              <Circle
                key={`shadow-${layout.key}`}
                cx={layout.centerX}
                cy={layout.centerY}
                r={layout.size * 0.4}
                fill="rgba(0, 0, 0, 0.15)"
                opacity={0.5}
              />
            ))}
          </Svg>
          
          {/* Íconos de comida renderizados como Image normal (iOS fix) */}
          <View 
            pointerEvents="none" 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: WHEEL_SIZE,
              height: WHEEL_SIZE,
            }}
          >
            {iconLayouts.map((layout) => (
              <Image
                key={`icon-${layout.key}`}
                source={layout.source}
                style={{
                  position: 'absolute',
                  left: layout.left,
                  top: layout.top,
                  width: layout.size,
                  height: layout.size,
                }}
                resizeMode="contain"
              />
            ))}
          </View>
          
          <View style={[styles.centerContainer, {
            width: 62,
            height: 62,
            top: WHEEL_SIZE / 2 - 31,
            left: WHEEL_SIZE / 2 - 31,
          }]}>
            <View style={styles.centerRingContainer}>
              <View style={styles.centerRing} />
            </View>
            
            <Pressable
              style={[
                styles.center,
                stoppedFood && { backgroundColor: stoppedFood.color, borderColor: stoppedFood.color }
              ]}
              onPress={onSpin}
              disabled={isSpinning}
            >
              {stoppedFood ? (
                <Image
                  source={stoppedFood.iconSource}
                  style={{ width: 46, height: 46 }}
                  resizeMode="contain"
                />
              ) : (
                <Image
                  source={require('../../assets/food_icons/wheel.png')}
                  style={{ width: 50, height: 50 }}
                  resizeMode="contain"
                />
              )}
            </Pressable>
          </View>
        </Animated.View>
      </View>
      
      <Animated.View 
        style={[
          styles.arrowContainer,
          {
            transform: [{ rotate: pointerRotation }]
          }
        ]}
      >
        <Image
          source={require('../../assets/food_icons/pointer_spin.png')}
          style={styles.pointerImage}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: theme.spacing.md,
    position: 'relative',
  },
  wheelContainer: {
    // Dimensiones dinámicas aplicadas inline
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  ringContainer: {
    position: 'absolute',
    // Dimensiones dinámicas aplicadas inline
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    // Dimensiones dinámicas aplicadas inline
    backgroundColor: theme.colors.accent,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  dot: {
    position: 'absolute',
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: '#FFFFFF',
    opacity: 0.95,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
  },
  wheel: {
    // Dimensiones dinámicas aplicadas inline
    backgroundColor: 'transparent',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 20,
    overflow: 'visible',
    borderWidth: 1,
    borderColor: 'rgba(249, 199, 79, 0.3)',
  },
  svgWheel: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  centerContainer: {
    position: 'absolute',
    // Dimensiones dinámicas aplicadas inline
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 300,
    elevation: 300,
  },
  centerRingContainer: {
    position: 'absolute',
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerRing: {
    position: 'absolute',
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: theme.colors.accent,
    shadowColor: '#F9C74F',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 10,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  centerDot: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    opacity: 1,
    shadowColor: '#F9C74F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 4,
    borderWidth: 0.5,
    borderColor: 'rgba(249, 199, 79, 0.3)',
  },
  center: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.medium,
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 5,
  },
  arrowContainer: {
    position: 'absolute',
    top: -10,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointerImage: {
    width: 50,
    height: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },
});