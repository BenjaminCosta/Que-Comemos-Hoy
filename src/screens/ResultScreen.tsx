import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ConfettiCannon from 'react-native-confetti-cannon';
import { RootStackParamList } from '../types';
import { theme } from '../theme';
import { PrimaryButton, Card } from '../components';

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
  panchos: require('../../assets/food_icons/hotdog.png'),
  pollo: require('../../assets/food_icons/chicken.png'),
  ensalada: require('../../assets/food_icons/salad.png'),
  sandwich: require('../../assets/food_icons/sandwich.png'),
  omelette: require('../../assets/food_icons/omelette.png'),
};

type Props = NativeStackScreenProps<RootStackParamList, 'Result'>;

export const ResultScreen: React.FC<Props> = ({ navigation, route }) => {
  const { food } = route.params;
  const confettiRef = useRef<any>(null);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const { width, height } = Dimensions.get('window');

  useEffect(() => {
    // Trigger confetti on mount
    setTimeout(() => {
      confettiRef.current?.start();
    }, 100);

    // Animate card entrance
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleViewRecipe = () => {
    if (food.recipe) {
      navigation.navigate('RecipeDetail', { food });
    }
  };

  const handleGoBack = () => {
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      {/* Fondo con color de la comida */}
      <View style={[styles.backgroundOverlay, { backgroundColor: food.color, opacity: 0.1 }]} />
      
      <SafeAreaView style={styles.safeArea}>
      {/* Confetti celebration */}
      <ConfettiCannon
        ref={confettiRef}
        count={100}
        origin={{ x: width / 2, y: 0 }}
        autoStart={false}
        fadeOut
        fallSpeed={2500}
        colors={[
          theme.colors.primary,
          theme.colors.accent,
          '#FF6B9D',
          '#9B59B6',
          '#2ECC71',
        ]}
      />

      <View style={styles.content}>
        <Text style={styles.subtitle}>¡Hoy comemos!</Text>

        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <LinearGradient
            colors={[food.color, food.color]}
            style={styles.resultCard}
          >
            <View style={styles.iconCircle}>
              <Image
                source={FOOD_ICON_ASSETS[food.id as keyof typeof FOOD_ICON_ASSETS] || food.iconSource}
                style={styles.foodIcon}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.foodName}>{food.name}</Text>
          </LinearGradient>
        </Animated.View>

        <View style={styles.buttonsContainer}>
          {food.recipe ? (
            <PrimaryButton
              title="Ver receta"
              onPress={handleViewRecipe}
              variant="secondary"
              icon={<MaterialCommunityIcons name="book-open-variant" size={20} color="#FFF" />}
              style={styles.button}
            />
          ) : (
            <View style={styles.noRecipeContainer}>
              <MaterialCommunityIcons name="alert-circle-outline" size={20} color={theme.colors.text} style={{ opacity: 0.5, marginRight: theme.spacing.xs }} />
              <Text style={styles.noRecipeText}>Sin receta todavía</Text>
            </View>
          )}

          <PrimaryButton
            title="Volver"
            onPress={handleGoBack}
            variant="outline"
            icon={<MaterialCommunityIcons name="home" size={20} color={theme.colors.primary} />}
          />
        </View>
      </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  backgroundOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: theme.spacing.xl,
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: 32,
    fontFamily: 'Nunito_900Black',
    fontWeight: '900',
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    textShadowColor: 'rgba(77, 150, 255, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  resultCard: {
    padding: theme.spacing.xxl,
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    borderRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 18,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  iconCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 5,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  foodIcon: {
    width: 100,
    height: 100,
  },
  foodName: {
    fontSize: 42,
    fontFamily: 'Nunito_900Black',
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
  sparkles: {
    flexDirection: 'row',
    gap: 12,
  },
  sparkle: {
    fontSize: 32,
  },
  buttonsContainer: {
    gap: theme.spacing.md,
  },
  button: {
    marginBottom: theme.spacing.sm,
  },
  noRecipeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    marginBottom: theme.spacing.sm,
  },
  noRecipeText: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    color: theme.colors.text,
    opacity: 0.7,
  },
});
