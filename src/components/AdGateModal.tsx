import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../theme';

interface AdGateModalProps {
  visible: boolean;
  onClose: () => void;
  onWatchAd: () => void;
}

export const AdGateModal: React.FC<AdGateModalProps> = ({
  visible,
  onClose,
  onWatchAd,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="ticket-confirmation" size={60} color="#FFD666" />
          </View>
          
          <Text style={styles.title}>¡Giros agotados!</Text>
          <Text style={styles.message}>
            Ya usaste tus 2 giros gratis de hoy.
          </Text>
          <Text style={styles.submessage}>
            Para seguir jugando, mirá un anuncio.
          </Text>

          <View style={styles.placeholder}>
            <MaterialCommunityIcons name="television-play" size={40} color={theme.colors.primary} style={{ opacity: 0.5 }} />
            <Text style={styles.placeholderText}>
              Anuncio aquí
            </Text>
          </View>

          <LinearGradient
            colors={['#FFD666', '#FFBE3D', '#F9A825']}
            locations={[0, 0.5, 1]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.primaryButtonGradient}
          >
            <TouchableOpacity style={styles.primaryButton} onPress={onWatchAd}>
              <MaterialCommunityIcons name="play-circle" size={24} color="#FFFFFF" />
              <Text style={styles.primaryButtonText}>Ver anuncio</Text>
            </TouchableOpacity>
          </LinearGradient>

          <TouchableOpacity style={styles.secondaryButton} onPress={onClose}>
            <Text style={styles.secondaryButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: theme.spacing.xl,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 15,
    borderWidth: 3,
    borderColor: 'rgba(255, 214, 102, 0.3)',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Nunito_900Black',
    fontWeight: '900',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  message: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
    lineHeight: 22,
  },
  submessage: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    color: theme.colors.text,
    opacity: 0.6,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  placeholder: {
    backgroundColor: '#F5F5F5',
    padding: theme.spacing.xl,
    borderRadius: 16,
    marginBottom: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
    borderWidth: 2,
    borderColor: 'rgba(77, 150, 255, 0.2)',
  },
  placeholderText: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    textAlign: 'center',
    color: theme.colors.text,
    opacity: 0.5,
    marginTop: theme.spacing.sm,
  },
  primaryButtonGradient: {
    borderRadius: 28,
    marginBottom: theme.spacing.sm,
    borderWidth: 3,
    borderTopColor: '#FFE89F',
    borderLeftColor: '#FFE89F',
    borderRightColor: '#D89521',
    borderBottomColor: '#C47F1A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  primaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 20,
    fontFamily: 'Nunito_800ExtraBold',
    fontWeight: '800',
    textAlign: 'center',
    color: '#FFFFFF',
    textShadowColor: 'rgba(210, 130, 20, 0.7)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  secondaryButton: {
    paddingVertical: theme.spacing.md,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
    fontWeight: '700',
    textAlign: 'center',
    color: theme.colors.primary,
  },
});
