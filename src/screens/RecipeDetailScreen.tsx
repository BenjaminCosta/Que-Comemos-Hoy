import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../types';
import { theme } from '../theme';
import { Card, Header } from '../components';
import { getBackButtonTop } from '../utils/responsive';

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

type Props = NativeStackScreenProps<RootStackParamList, 'RecipeDetail'>;

export const RecipeDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { food } = route.params;
  const insets = useSafeAreaInsets();
  const backButtonTopPosition = getBackButtonTop(insets.top);

  if (!food.recipe) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
        <View style={styles.header}>
          <TouchableOpacity
            style={[styles.backButton, { marginTop: backButtonTopPosition }]}
            onPress={() => navigation.goBack()}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color={theme.colors.text}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay receta disponible</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      {/* Fondo con degradado celeste */}
      <LinearGradient
        colors={['#E8F4FA', '#D4EDFA', '#C5E9FC', '#B8E6FF']}
        locations={[0, 0.3, 0.7, 1]}
        style={styles.gradientBackground}
      />

      <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.backButton, { marginTop: backButtonTopPosition }]}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color={theme.colors.text}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.titleContainer}>
          <View style={styles.iconCircle}>
            <Image
              source={FOOD_ICON_ASSETS[food.id as keyof typeof FOOD_ICON_ASSETS] || food.iconSource}
              style={styles.foodIcon}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.title}>{food.name}</Text>
        </View>

        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons
              name="format-list-bulleted"
              size={24}
              color={theme.colors.primary}
            />
            <Text style={styles.sectionTitle}>Ingredientes</Text>
          </View>
          {food.recipe.ingredients.map((ingredient, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listItemText}>{ingredient}</Text>
            </View>
          ))}
        </Card>

        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons
              name="chef-hat"
              size={24}
              color={theme.colors.primary}
            />
            <Text style={styles.sectionTitle}>Preparación</Text>
          </View>
          {food.recipe.steps.map((step, index) => (
            <View key={index} style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </Card>
      </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  decorativeShapes: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
  },
  backButton: {
    marginBottom: theme.spacing.sm,
    // marginTop aplicado dinámicamente
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 12,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.95)',
  },
  foodIcon: {
    width: 56,
    height: 56,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Nunito_900Black',
    color: theme.colors.primary,
    marginTop: theme.spacing.md,
    textShadowColor: 'rgba(77, 150, 255, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  section: {
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderRadius: 24,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Nunito_800ExtraBold',
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
    alignItems: 'flex-start',
  },
  bullet: {
    ...theme.typography.body,
    color: theme.colors.primary,
    marginRight: theme.spacing.sm,
    fontWeight: 'bold',
  },
  listItemText: {
    fontSize: 15,
    fontFamily: 'Nunito_600SemiBold',
    color: theme.colors.text,
    flex: 1,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  stepNumberText: {
    ...theme.typography.smallBold,
    color: theme.colors.background,
  },
  stepText: {
    fontSize: 15,
    fontFamily: 'Nunito_600SemiBold',
    color: theme.colors.text,
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.muted,
  },
});
