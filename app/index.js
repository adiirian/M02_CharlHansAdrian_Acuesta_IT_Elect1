import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Alert, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';

export default function Index() {
  const { user, logout, updateProfilePicture } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  const pickImage = async () => {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera roll permissions are required to select a profile picture.');
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const selectedImage = result.assets[0];
      const updateResult = await updateProfilePicture(selectedImage.uri);
      if (updateResult.success) {
        Alert.alert('Success', 'Profile picture updated successfully!');
      } else {
        Alert.alert('Error', updateResult.error || 'Failed to update profile picture.');
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={pickImage} style={styles.profilePictureContainer}>
          {user?.profile_picture ? (
            <Image
              source={{ uri: user.profile_picture }}
              style={styles.profilePicture}
              contentFit="cover"
            />
          ) : (
            <Image
              source={require('../assets/images/ashley.jpg')}
              style={styles.profilePicture}
              contentFit="cover"
            />
          )}
        </TouchableOpacity>
        <Text style={styles.changePictureText}>Click this icon to change picture</Text>
        <Text style={styles.title}>Welcome Back, {user?.name}!</Text>
        <Text style={styles.subtitle}>Activity 3</Text>
      </View>

      {/* User Info Card */}
      <View style={styles.card}>
        <View style={styles.infoRow}>
          <Ionicons name="person-outline" size={20} color={colors.accent} />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Name</Text>
            <Text style={styles.infoValue}>{user?.name || user?.email}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <Ionicons name="mail-outline" size={20} color={colors.accent} />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{user?.email}</Text>
          </View>
        </View>


      </View>

      {/* About Button */}
      <TouchableOpacity style={styles.aboutButton} onPress={() => setIsModalVisible(true)}>
        <Ionicons name="information-circle-outline" size={20} color={colors.surface} />
        <Text style={styles.aboutText}>About</Text>
      </TouchableOpacity>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color={colors.surface} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

            {/* Navigation Info */}
      <View style={styles.navigationInfo}>
        <Text style={styles.navigationText}>Navigate using the tabs below</Text>
      </View>

      {/* About Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setIsModalVisible(false)}>
              <Ionicons name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>My Project</Text>
            <Image
              source={require('../assets/images/ashley.jpg')}
              style={styles.modalImage}
              contentFit="cover"
            />
            <Text style={styles.modalLabel}>Submitted By:</Text>
            <Text style={styles.modalValue}>Ashley Joy Besan</Text>
            <Text style={styles.modalLabel}>Submitted To:</Text>
            <Text style={styles.modalValue}>Jay Ian Camelotes</Text>
            <Text style={styles.modalLabel}>Bio:</Text>
            <Text style={styles.modalValue}>
              Product-focused builder who enjoys crafting bright, friendly mobile flows. I document everything, love pairing sessions,
              and believe delightful UI decisions can make any requirement feel personal.
            </Text>
            <Text style={styles.modalLabel}>Address:</Text>
            <Text style={styles.modalValue}>Mayuga, Guindulman, Bohol</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 15,
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  card: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoContent: {
    marginLeft: 15,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 15,
  },
  navigationInfo: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
  navigationText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 15,
    textAlign: 'center',
    justifyContent: 'center',
  },
  tabsPreview: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabItem: {
    alignItems: 'center',
  },
  tabText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 5,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.danger,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 12,
    marginTop: 10,
  },
  logoutText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  profilePictureContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  profilePicture: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  changePictureText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 5,
    marginBottom: 10,
  },
  aboutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  aboutText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 20,
  },
  modalImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    alignSelf: 'flex-start',
    marginBottom: 5,
  },
  modalValue: {
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 15,
    textAlign: 'left',
  },
});
