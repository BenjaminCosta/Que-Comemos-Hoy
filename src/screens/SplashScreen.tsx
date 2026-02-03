import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { theme } from '../theme';
import { LoadingIndicator } from '../components';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    // Navigate to Home after delay
    const timer = setTimeout(() => {
      navigation.replace('Home');
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Fondo con degradado celeste */}
      <LinearGradient
        colors={['#E8F4FA', '#D4EDFA', '#C5E9FC', '#B8E6FF']}
        locations={[0, 0.3, 0.7, 1]}
        style={styles.gradientBackground}
      />

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Image 
          source={require('../../assets/adaptive-icon.png')} 
          style={styles.appIcon}
          resizeMode="contain"
        />
        <View style={styles.loadingContainer}>
          <LoadingIndicator />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B8E6FF',
    alignItems: 'center',
    justifyContent: 'center',
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
  content: {
    alignItems: 'center',
    zIndex: 1,
  },
  appIcon: {
    width: 400,
    height: 400,
  },
  loadingContainer: {
    marginTop: theme.spacing.xxl,
  },
});
