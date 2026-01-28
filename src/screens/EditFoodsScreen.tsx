import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RootStackParamList, Food } from '../types';
import { theme } from '../theme';
import { Card, PrimaryButton } from '../components';
import { getBackButtonTop } from '../utils/responsive';
import { loadFoods, saveFoods } from '../storage/storage';
import { CUSTOM_FOOD_COLORS } from '../data/foods';

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

type Props = NativeStackScreenProps<RootStackParamList, 'EditFoods'>;

const MAX_NAME_LENGTH = 20;

export const EditFoodsScreen: React.FC<Props> = ({ navigation }) => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [newFoodName, setNewFoodName] = useState('');
  const insets = useSafeAreaInsets();
  const backButtonTopPosition = getBackButtonTop(insets.top);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const loadedFoods = await loadFoods();
    setFoods(loadedFoods);
  };

  const handleAddFood = async () => {
    const trimmedName = newFoodName.trim();

    if (!trimmedName) {
      Alert.alert('Error', 'Por favor ingresá un nombre');
      return;
    }

    if (trimmedName.length > MAX_NAME_LENGTH) {
      Alert.alert('Error', `El nombre no puede tener más de ${MAX_NAME_LENGTH} caracteres`);
      return;
    }

    // Check for duplicates
    if (foods.some(f => f.name.toLowerCase() === trimmedName.toLowerCase())) {
      Alert.alert('Error', 'Ya existe una comida con ese nombre');
      return;
    }

    // Create new custom food
    const customFoodCount = foods.filter(f => !f.isDefault).length;
    const colorIndex = customFoodCount % CUSTOM_FOOD_COLORS.length;

    const newFood: Food = {
      id: `custom-${Date.now()}`,
      name: trimmedName,
      color: CUSTOM_FOOD_COLORS[colorIndex],
      iconSource: require('../../assets/food_icons/food.png'), // Icono consistente para comidas personalizadas
      isDefault: false,
      isActive: true, // New foods are active by default
    };

    const updatedFoods = [...foods, newFood];
    await saveFoods(updatedFoods);
    setFoods(updatedFoods);
    setNewFoodName('');
    Alert.alert('¡Listo!', `"${trimmedName}" agregado a la ruleta`);
  };

  const handleToggleActive = async (food: Food) => {
    const updatedFoods = foods.map(f =>
      f.id === food.id ? { ...f, isActive: !f.isActive } : f
    );
    await saveFoods(updatedFoods);
    setFoods(updatedFoods);
  };

  const handleDeleteFood = async (food: Food) => {
    Alert.alert(
      'Eliminar comida',
      `¿Querés eliminar "${food.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const updatedFoods = foods.filter(f => f.id !== food.id);
            await saveFoods(updatedFoods);
            setFoods(updatedFoods);
          },
        },
      ]
    );
  };

  const renderFoodItem = ({ item }: { item: Food }) => {
    const cardStyle = item.isActive 
      ? styles.foodItem
      : [styles.foodItem, styles.foodItemInactive];
    const iconStyles = item.isActive 
      ? styles.foodIcon
      : [styles.foodIcon, styles.iconInactive];
    const nameStyles = item.isActive 
      ? styles.foodName
      : [styles.foodName, styles.foodNameInactive];
    
    return (
      <View style={cardStyle}>
        <View style={styles.foodContent}>
          <View style={styles.foodLeft}>
            <View style={[styles.colorChip, { backgroundColor: item.color }]} />
            <Image
              source={FOOD_ICON_ASSETS[item.id as keyof typeof FOOD_ICON_ASSETS] || item.iconSource}
              style={iconStyles}
              resizeMode="contain"
            />
            <View style={styles.foodNameContainer}>
              <Text style={nameStyles}>{item.name}</Text>
              {!item.isActive && (
                <Text style={styles.inactiveLabel}>Inactiva</Text>
              )}
            </View>
          </View>
          <View style={styles.foodRight}>
            <TouchableOpacity 
              onPress={() => handleToggleActive(item)}
              style={styles.actionButton}
            >
              <MaterialCommunityIcons
                name={item.isActive ? "eye" : "eye-off"}
                size={24}
                color={item.isActive ? theme.colors.primary : theme.colors.muted}
              />
            </TouchableOpacity>
            {!item.isDefault && (
              <TouchableOpacity 
                onPress={() => handleDeleteFood(item)}
                style={styles.actionButton}
              >
                <MaterialCommunityIcons
                  name="delete"
                  size={24}
                  color={theme.colors.error}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

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
        <Text style={styles.headerTitle}>Editar comidas</Text>
      </View>

      <View style={styles.addSection}>
        <View style={styles.addCard}>
          <Text style={styles.addLabel}>Agregar nueva comida</Text>
          <View style={styles.addInputRow}>
            <TextInput
              style={styles.input}
              placeholder="Ej: Ravioles"
              placeholderTextColor={theme.colors.muted}
              value={newFoodName}
              onChangeText={setNewFoodName}
              maxLength={MAX_NAME_LENGTH}
            />
            <TouchableOpacity onPress={handleAddFood} disabled={!newFoodName.trim()} activeOpacity={0.8}>
              <LinearGradient
                colors={['#FFD666', '#F9A825']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={[styles.addButton, !newFoodName.trim() && styles.addButtonDisabled]}
              >
                <MaterialCommunityIcons name="plus" size={24} color="#FFF" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <Text style={styles.charCounter}>
            {newFoodName.length}/{MAX_NAME_LENGTH}
          </Text>
        </View>
      </View>

      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>
          Todas las comidas ({foods.filter(f => f.isActive).length} activas / {foods.length} totales)
        </Text>
        <FlatList
          data={foods}
          keyExtractor={(item) => item.id}
          renderItem={renderFoodItem}
          contentContainerStyle={styles.list}
        />
      </View>
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
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Nunito_800ExtraBold',
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  backButton: {
    marginBottom: theme.spacing.sm,
    // marginTop aplicado dinámicamente
  },
  addSection: {
    padding: theme.spacing.lg,
  },
  addCard: {
    padding: theme.spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 24,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 12,
  },
  addLabel: {
    fontSize: 16,
    fontFamily: 'Nunito_800ExtraBold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  addInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  input: {
    flex: 1,
    borderWidth: 2,
    borderColor: 'rgba(77, 150, 255, 0.25)',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
    color: theme.colors.text,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderTopColor: 'rgba(255, 255, 255, 0.6)',
    borderLeftColor: 'rgba(255, 255, 255, 0.6)',
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderBottomColor: 'rgba(0, 0, 0, 0.15)',
    borderRightColor: 'rgba(0, 0, 0, 0.15)',
    shadowColor: '#F9A825',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  addButtonDisabled: {
    opacity: 0.5,
  },
  charCounter: {
    fontSize: 12,
    fontFamily: 'Nunito_600SemiBold',
    color: theme.colors.muted,
    textAlign: 'right',
    marginTop: theme.spacing.xs,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  listTitle: {
    fontSize: 18,
    fontFamily: 'Nunito_800ExtraBold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  list: {
    paddingBottom: theme.spacing.lg,
  },
  foodItem: {
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    borderRadius: 20,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  foodContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  foodLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  colorChip: {
    width: 16,
    height: 16,
    borderRadius: 8,
    ...theme.shadows.small,
  },
  foodIcon: {
    width: 28,
    height: 28,
  },
  foodNameContainer: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
    color: theme.colors.text,
  },
  foodNameInactive: {
    color: theme.colors.muted,
  },
  inactiveLabel: {
    ...theme.typography.caption,
    color: theme.colors.muted,
    marginTop: 2,
  },
  foodItemInactive: {
    opacity: 0.6,
  },
  iconInactive: {
    opacity: 0.5,
  },
  foodRight: {
    marginLeft: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginLeft: theme.spacing.sm,
  },
});
