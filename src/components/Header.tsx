import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../theme';
import { getHeaderPaddingTop } from '../utils/responsive';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  const insets = useSafeAreaInsets();
  const headerPaddingTop = getHeaderPaddingTop(insets.top);
  
  return (
    <LinearGradient
      colors={['#B8D9F5', '#9BC5ED', '#86B5E5']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={[styles.wrapper, { paddingTop: headerPaddingTop }]}
    >
      <View style={styles.container}>
        <LinearGradient
          colors={['rgba(90, 150, 200, 0.65)', 'rgba(80, 140, 190, 0.70)', 'rgba(70, 130, 185, 0.75)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.titleContainer}
        >
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
        </LinearGradient>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    paddingBottom: 34,
    paddingHorizontal: 0,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 35,
    shadowColor: '#4D7BCE',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 12,
    zIndex: 100,
  },
  container: {
    alignItems: 'center',
    paddingTop: 8,
  },
  titleContainer: {
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 24,
  },
  title: {
    fontSize: 31.5,
    fontFamily: 'Nunito_700Bold',
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.text,
    opacity: 0.7,
    textAlign: 'center',
    marginTop: 4,
    fontSize: 15,
  },
});
