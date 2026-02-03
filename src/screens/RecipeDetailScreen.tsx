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
import { Card } from '../components';
import { getBackButtonTop } from '../utils/responsive';

type Props = NativeStackScreenProps<RootStackParamList, 'RecipeDetail'>;

// Helper para obtener ícono según dificultad
const getDifficultyIcon = (difficulty: string) => {
  switch (difficulty) {
    case 'Fácil':
      return 'star-outline';
    case 'Media':
      return 'star-half-full';
    case 'Difícil':
      return 'star';
    default:
      return 'star-outline';
  }
};

// Helper para obtener color según dificultad
const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Fácil':
      return '#2ECC71';
    case 'Media':
      return '#F39C12';
    case 'Difícil':
      return '#E74C3C';
    default:
      return '#95A5A6';
  }
};

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
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={64}
            color={theme.colors.muted}
          />
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
        {/* Header con botón back */}
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

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header con nombre de la comida */}
          <View style={[styles.titleHeader, { backgroundColor: food.color }]}>
            <Text style={styles.titleHeaderText}>{food.name}</Text>
          </View>

          {/* Imagen de la comida */}
          {food.imageSource ? (
            <View style={styles.imageContainer}>
              <Image 
                source={food.imageSource} 
                style={styles.foodImage}
                resizeMode="cover"
              />
            </View>
          ) : (
            <Card style={styles.imagePlaceholder}>
              <LinearGradient
                colors={[
                  `${food.color}20`,
                  `${food.color}10`,
                  `${food.color}05`,
                ]}
                style={styles.imagePlaceholderGradient}
              >
                <MaterialCommunityIcons
                  name="image-outline"
                  size={64}
                  color={food.color}
                  style={styles.imagePlaceholderIcon}
                />
                <Text style={[styles.imagePlaceholderText, { color: food.color }]}>
                  Foto ilustrativa
                </Text>
              </LinearGradient>
            </Card>
          )}

          {/* Badges de tiempo y dificultad */}
          <View style={styles.badgesContainer}>
            <View style={[styles.badge, styles.timeBadge]}>
              <MaterialCommunityIcons
                name="clock-outline"
                size={20}
                color={food.color}
              />
              <Text style={[styles.badgeText, { color: food.color }]}>
                {food.recipe.time}
              </Text>
            </View>

            <View style={[
              styles.badge,
              styles.difficultyBadge,
              { borderColor: getDifficultyColor(food.recipe.difficulty) }
            ]}>
              <MaterialCommunityIcons
                name={getDifficultyIcon(food.recipe.difficulty)}
                size={20}
                color={getDifficultyColor(food.recipe.difficulty)}
              />
              <Text style={[
                styles.badgeText,
                { color: getDifficultyColor(food.recipe.difficulty) }
              ]}>
                {food.recipe.difficulty}
              </Text>
            </View>
          </View>

          {/* Badges de porciones y tipo */}
          <View style={styles.badgesContainer}>
            <View style={[styles.badge, styles.servingsBadge]}>
              <MaterialCommunityIcons
                name="account-group-outline"
                size={20}
                color={food.color}
              />
              <Text style={[styles.badgeText, { color: food.color }]}>
                {food.recipe.servings}
              </Text>
            </View>

            <View style={[styles.badge, styles.typeBadge]}>
              <MaterialCommunityIcons
                name="food-variant"
                size={20}
                color={food.color}
              />
              <Text style={[styles.badgeText, { color: food.color }]}>
                {food.recipe.type}
              </Text>
            </View>
          </View>

          {/* Sección Ingredientes */}
          <Card style={styles.section}>
            <View style={[styles.sectionHeader, { borderLeftColor: food.color }]}>
              <MaterialCommunityIcons
                name="format-list-bulleted"
                size={24}
                color={food.color}
              />
              <Text style={styles.sectionTitle}>Ingredientes</Text>
            </View>
            <View style={styles.sectionContent}>
              {food.recipe.ingredients.map((ingredient, index) => (
                <View key={index} style={styles.listItem}>
                  <View style={[styles.bulletPoint, { backgroundColor: food.color }]} />
                  <Text style={styles.listItemText}>{ingredient}</Text>
                </View>
              ))}
            </View>
          </Card>

          {/* Sección Preparación */}
          <Card style={styles.section}>
            <View style={[styles.sectionHeader, { borderLeftColor: food.color }]}>
              <MaterialCommunityIcons
                name="chef-hat"
                size={24}
                color={food.color}
              />
              <Text style={styles.sectionTitle}>Preparación</Text>
            </View>
            <View style={styles.sectionContent}>
              {food.recipe.steps.map((step, index) => (
                <View key={index} style={styles.stepItem}>
                  <View style={[styles.stepNumber, { backgroundColor: food.color }]}>
                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.stepText}>{step}</Text>
                </View>
              ))}
            </View>
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
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  
  // Header con nombre de comida
  titleHeader: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: 20,
    marginBottom: theme.spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  titleHeaderText: {
    fontSize: 28,
    fontFamily: 'Nunito_800ExtraBold',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  // Placeholder de imagen
  imagePlaceholder: {
    marginBottom: theme.spacing.lg,
    padding: 0,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  imageContainer: {
    marginBottom: theme.spacing.lg,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  foodImage: {
    width: '100%',
    height: 200,
  },
  imagePlaceholderGradient: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderIcon: {
    opacity: 0.5,
    marginBottom: theme.spacing.sm,
  },
  imagePlaceholderText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
    opacity: 0.6,
  },

  // Badges de tiempo y dificultad
  badgesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  timeBadge: {
    borderColor: 'transparent',
  },
  difficultyBadge: {
    // borderColor aplicado dinámicamente
  },
  servingsBadge: {
    borderColor: 'transparent',
  },
  typeBadge: {
    borderColor: 'transparent',
  },
  badgeText: {
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
    marginLeft: theme.spacing.xs,
  },

  // Secciones
  section: {
    marginBottom: theme.spacing.lg,
    padding: 0,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: 'rgba(245, 245, 245, 0.9)',
    borderLeftWidth: 4,
    // borderLeftColor aplicado dinámicamente
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Nunito_800ExtraBold',
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  sectionContent: {
    padding: theme.spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',

  },

  // Lista de ingredientes
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
    paddingLeft: theme.spacing.xs,
  },
  bulletPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 7,
    marginRight: theme.spacing.md,
  },
  listItemText: {
    fontSize: 15,
    fontFamily: 'Nunito_600SemiBold',
    color: theme.colors.text,
    flex: 1,
    lineHeight: 22,
  },

  // Pasos de preparación
  stepItem: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    // backgroundColor aplicado dinámicamente
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  stepNumberText: {
    fontSize: 16,
    fontFamily: 'Nunito_800ExtraBold',
    color: '#FFFFFF',
  },
  stepText: {
    fontSize: 15,
    fontFamily: 'Nunito_600SemiBold',
    color: theme.colors.text,
    flex: 1,
    lineHeight: 22,
  },

  // Empty state
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
    color: theme.colors.muted,
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
});
