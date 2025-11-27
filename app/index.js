import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Alert, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

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
            <Ionicons name="person-circle-outline" size={80} color="#007AFF" />
          )}
        </TouchableOpacity>
        <Text style={styles.changePictureText}>Click this icon to change picture</Text>
        <Text style={styles.title}>Welcome Back, {user?.name}!</Text>
        <Text style={styles.subtitle}>Activity 3</Text>
      </View>

      {/* User Info Card */}
      <View style={styles.card}>
        <View style={styles.infoRow}>
          <Ionicons name="person-outline" size={20} color="#007AFF" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Name</Text>
            <Text style={styles.infoValue}>{user?.name || user?.email}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <Ionicons name="mail-outline" size={20} color="#007AFF" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{user?.email}</Text>
          </View>
        </View>


      </View>

      {/* About Button */}
      <TouchableOpacity style={styles.aboutButton} onPress={() => setIsModalVisible(true)}>
        <Ionicons name="information-circle-outline" size={20} color="#fff" />
        <Text style={styles.aboutText}>About</Text>
      </TouchableOpacity>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#fff" />
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
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>App Info</Text>
            <Image
              source={require('../assets/images/2x2-pic.png')}
              style={styles.modalImage}
              contentFit="cover"
            />
            <Text style={styles.modalLabel}>Submitted By:</Text>
            <Text style={styles.modalValue}>Charl Hans Adrian Acuesta</Text>
            <Text style={styles.modalLabel}>Submitted To:</Text>
            <Text style={styles.modalValue}>Jay Ian Camelotes</Text>
            <Text style={styles.modalLabel}>Bio:</Text>
            <Text style={styles.modalValue}>Though I&apos;m still discovering who I am, I continue to walk the path to success.
              &ldquo;In the end, we will remember not the words of our enemies, but the silence of our friends.&rdquo; - Martin Luther King Jr.
            </Text>
            <Text style={styles.modalLabel}>Address:</Text>
            <Text style={styles.modalValue}>Guinobatan, Trinidad, Bohol</Text>
            <Text style={styles.modalLabel}>Final Project in IT Elective 1:</Text>
            <Text style={styles.modalValue}>Mobile Dev</Text>
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
    backgroundColor: '#121212',
    paddingHorizontal: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 15,
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
  },
  card: {
    width: '100%',
    backgroundColor: '#1e1e1e',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#333',
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
    color: '#888',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#333',
    marginVertical: 15,
  },
  navigationInfo: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
  navigationText: {
    fontSize: 14,
    color: '#888',
    marginBottom: 15,
    textAlign: 'center',
    justifyContent: 'center',
  },
  tabsPreview: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  tabItem: {
    alignItems: 'center',
  },
  tabText: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff4444',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 12,
    marginTop: 10,
  },
  logoutText: {
    color: '#fff',
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
    borderColor: '#007AFF',
  },
  changePictureText: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
    marginBottom: 10,
  },
  aboutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  aboutText: {
    color: '#fff',
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
    backgroundColor: '#1e1e1e',
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
    color: '#fff',
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
    color: '#888',
    alignSelf: 'flex-start',
    marginBottom: 5,
  },
  modalValue: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 15,
    textAlign: 'left',
  },
});
