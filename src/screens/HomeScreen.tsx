import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RootStackParamList, Food, SpinData } from '../types';
import { theme } from '../theme';
import { Header, PrimaryButton, RouletteWheel, AdGateModal } from '../components';
import { loadFoods, loadSpinData, saveSpinData } from '../storage/storage';
import { getTodayDateString, shouldResetSpins } from '../utils/dateUtils';
import { getHeaderSpacing, getContentSpacing } from '../utils/responsive';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const MAX_FREE_SPINS = 2;

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [spinData, setSpinData] = useState<SpinData>({
    lastSpinDate: '',
    spinsToday: 0,
  });
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedFood, setSelectedFood] = useState<Food | undefined>(undefined);
  const [stoppedFood, setStoppedFood] = useState<Food | undefined>(undefined);
  const [showAdGate, setShowAdGate] = useState(false);

  // Obtener dimensiones y spacing responsivo
  const { height } = useWindowDimensions();
  const headerSpacing = getHeaderSpacing();
  const contentSpacing = getContentSpacing();

  useEffect(() => {
    loadData();
  }, []);

  // Reload foods when screen gains focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
    });
    return unsubscribe;
  }, [navigation]);

  const loadData = async () => {
    const loadedFoods = await loadFoods();
    // Filter to show only active foods on the wheel
    const activeFoods = loadedFoods.filter(f => f.isActive);
    setFoods(activeFoods);

    let loadedSpinData = await loadSpinData();

    // Reset spins if it's a new day
    if (shouldResetSpins(loadedSpinData.lastSpinDate)) {
      loadedSpinData = {
        lastSpinDate: getTodayDateString(),
        spinsToday: 0,
      };
      await saveSpinData(loadedSpinData);
    }

    setSpinData(loadedSpinData);
  };

  const handleSpin = async () => {
    if (isSpinning) return;

    // Check if user has free spins left
    if (spinData.spinsToday >= MAX_FREE_SPINS) {
      setShowAdGate(true);
      return;
    }

    // Pick random food
    const randomFood = foods[Math.floor(Math.random() * foods.length)];
    setSelectedFood(randomFood);

    // Start spinning
    setIsSpinning(true);

    // Update spin count
    const newSpinData: SpinData = {
      lastSpinDate: getTodayDateString(),
      spinsToday: spinData.spinsToday + 1,
    };
    await saveSpinData(newSpinData);
    setSpinData(newSpinData);
  };

  const handleSpinComplete = () => {
    if (selectedFood) {
      setIsSpinning(false);
      setStoppedFood(selectedFood); // Store the stopped food to show in center
      navigation.navigate('Result', { food: selectedFood });
    }
  };

  const handleWatchAd = () => {
    // TODO: Integrate AdMob here
    setShowAdGate(false);
    console.log('TODO: Show AdMob ad');
    
    // After ad is watched, allow the spin without incrementing the free counter
    const randomFood = foods[Math.floor(Math.random() * foods.length)];
    setSelectedFood(randomFood);
    setIsSpinning(true);
  };

  const remainingSpins = MAX_FREE_SPINS - spinData.spinsToday;

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/bg.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
          <ScrollView 
            contentContainerStyle={[
              styles.scrollContent,
              { paddingTop: contentSpacing.top }
            ]}
          >
          <View style={[styles.headerSpacer, { height: headerSpacing }]} />
          
          <RouletteWheel
            foods={foods}
            isSpinning={isSpinning}
            selectedFood={selectedFood}
            stoppedFood={stoppedFood}
            onSpinComplete={handleSpinComplete}
            onSpin={handleSpin}
          />

          <View style={styles.spinsContainer}>
          <MaterialCommunityIcons 
            name="ticket" 
            size={20} 
            color={theme.colors.primary} 
            style={styles.spinsIcon}
          />
          <Text style={styles.spinsText}>
            {remainingSpins} {remainingSpins === 1 ? 'giro' : 'giros'} gratis
          </Text>
        </View>

        <View style={styles.spinButtonContainer}>
          <ExpoLinearGradient
            colors={['#FFD666', '#FFBE3D', '#F9A825']}
            locations={[0, 0.5, 1]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.spinButtonGradient}
          >
            <PrimaryButton
              title="Girar"
              onPress={handleSpin}
              disabled={isSpinning || foods.length === 0}
              style={styles.spinButton}
              textStyle={styles.spinButtonText}
            />
          </ExpoLinearGradient>
        </View>

        <View style={styles.editButtonContainer}>
          <ExpoLinearGradient
            colors={['#9C8CFF', '#7B6FDF', '#6858C9']}
            locations={[0, 0.5, 1]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.editButtonGradient}
          >
            <PrimaryButton
              title="Editar comidas"
              onPress={() => navigation.navigate('EditFoods')}
              icon={<MaterialCommunityIcons name="pencil" size={22} color="#FFFFFF" />}
              style={styles.editButton}
              textStyle={styles.editButtonText}
            />
          </ExpoLinearGradient>
        </View>
      </ScrollView>

        <AdGateModal
          visible={showAdGate}
          onClose={() => setShowAdGate(false)}
          onWatchAd={handleWatchAd}
        />
        </SafeAreaView>
      </ImageBackground>
      
      <Header
        title="¿Qué comemos hoy?"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B8E6FF',
  },
  backgroundImage: {
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
    zIndex: 0,
  },
  safeArea: {
    flex: 1,
    zIndex: 1,
  },
  scrollContent: {
    padding: theme.spacing.md,
    paddingTop: 0,
    flexGrow: 1,
  },
  headerSpacer: {
    // Altura dinámica basada en getHeaderSpacing()
  },
  spinsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.sm,
    backgroundColor: theme.colors.primaryLight,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.full,
  },
  spinsIcon: {
    marginRight: theme.spacing.xs,
  },
  spinsText: {
    ...theme.typography.bodyBold,
    color: theme.colors.primary,
  },
  spinButtonContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  spinButtonGradient: {
    minWidth: 240,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    borderTopColor: '#FFE89F',
    borderLeftColor: '#FFE89F',
    borderRightColor: '#D89521',
    borderBottomColor: '#C47F1A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 14,
    overflow: 'visible',
  },
  spinButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 0,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  spinButtonText: {
    fontSize: 32,
    fontFamily: 'Nunito_900Black',
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: 'rgba(210, 130, 20, 0.8)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 4,
    lineHeight: 38,
    includeFontPadding: false,
  },
  editButtonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
  },
  editButtonGradient: {
    minWidth: 240,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    borderTopColor: '#B5A9FF',
    borderLeftColor: '#B5A9FF',
    borderRightColor: '#5C4AB8',
    borderBottomColor: '#4D3C9E',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    overflow: 'visible',
  },
  editButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 0,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  editButtonText: {
    fontSize: 20,
    fontFamily: 'Nunito_800ExtraBold',
    fontWeight: '800',
    color: '#FFFFFF',
    textShadowColor: 'rgba(92, 74, 184, 0.7)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
});
