import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  Alert,
  Modal,
  Platform,
  StatusBar,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { RootStackParamList, NavigationProps } from '../types';

type EnggComplaintDetailsRouteProp = RouteProp<RootStackParamList, 'Engineer/EnggComplaintDetails'>;

export default function EnggComplaintDetails() {
  const route = useRoute<EnggComplaintDetailsRouteProp>();
  const navigation = useNavigation<NavigationProps>();
  const [remark, setRemark] = useState('');
  const { complaintNo, clientName } = route.params;
  const [workStatus, setWorkStatus] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedSignature, setUploadedSignature] = useState<string | null>(null);
  const [hasSubmitAttempt, setHasSubmitAttempt] = useState(false);

  // Request permissions for camera and media library
  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (cameraStatus !== 'granted' || libraryStatus !== 'granted') {
        Alert.alert('Sorry, we need camera and media library permissions to make this work!');
        return false;
      }
      return true;
    }
    return true;
  };

  // Handle image upload from camera or gallery
  const handleImageUpload = async (useCamera: boolean) => {
    try {
      if (Platform.OS === 'android') {
        const { status: existingStatus } = await ImagePicker.getMediaLibraryPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== 'granted') {
          Alert.alert(
            'Permission Required',
            'Please grant camera roll permissions in your phone settings to upload images.'
          );
          return;
        }

        if (useCamera) {
          const { status: cameraStatus } = await ImagePicker.getCameraPermissionsAsync();
          let finalCameraStatus = cameraStatus;

          if (cameraStatus !== 'granted') {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            finalCameraStatus = status;
          }

          if (finalCameraStatus !== 'granted') {
            Alert.alert(
              'Permission Required',
              'Please grant camera permissions in your phone settings to take photos.'
            );
            return;
          }
        }
      }

      const pickerOptions = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3] as [number, number],
        quality: 1,
      };

      const result = useCamera
        ? await ImagePicker.launchCameraAsync(pickerOptions)
        : await ImagePicker.launchImageLibraryAsync(pickerOptions);

      console.log('Image picker result:', result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        console.log('Selected image URI:', result.assets[0].uri);
        setUploadedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert(
        'Error',
        'Failed to access ' + (useCamera ? 'camera' : 'gallery') + '. Please try again.'
      );
    }
  };

  // Handle signature upload
  const handleSignatureUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setUploadedSignature(result.assets[0].uri);
        console.log('Selected signature:', result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking signature:', error);
      Alert.alert('Error', 'Failed to select signature file. Please try again.');
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    setHasSubmitAttempt(true);

    if (!workStatus) {
      Alert.alert('Error', 'Please select a work status');
      return;
    }

    if (!uploadedImage) {
      Alert.alert('Error', 'Please upload an image');
      return;
    }

    if (!uploadedSignature) {
      Alert.alert('Error', 'Please upload a signature');
      return;
    }

    if (!remark.trim()) {
      Alert.alert('Error', 'Please add a remark');
      return;
    }

    const formData = {
      complaintNo,
      clientName,
      workStatus,
      remark,
      uploadedImage,
      uploadedSignature,
      submittedAt: new Date().toISOString(),
    };

    console.log('Form Data:', formData);
    Alert.alert('Success', 'Data submitted successfully', [
      {
        text: 'OK',
        onPress: () => {
          navigation.navigate('Engineer/EnggListofcomplaint', {
            username: '',
            password: ''
          });
        }
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#000" barStyle="light-content" />
      <ScrollView>
        <View style={styles.header}>
          <Pressable 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </Pressable>
          <Text style={styles.headerTitle}>Engineer Complaint Details</Text>
          <Pressable style={styles.shareButton}>
            <Ionicons name="share-outline" size={24} color="#fff" />
          </Pressable>
        </View>

        <View style={styles.content}>
          <View style={styles.complaintNoContainer}>
            <Text style={styles.complaintNo}>Complaint No. - {complaintNo}</Text>
          </View>

          <View style={styles.infoSection}>
        
            <View style={styles.infoRow}>
              <Text style={styles.label}>Complaint Name:</Text>
              <Text style={styles.value}>{clientName}</Text>
            </View>
           
            <View style={styles.infoRow}>
              <Text style={styles.label}>Assigin Date:</Text>
              <Text style={styles.value}>{route.params.Assign_Date}</Text>
            </View>
             <View style={styles.infoRow}>
              <Text style={styles.label}>System Name:</Text>
              <Text style={styles.value}>{route.params.SYSTEM_NAME}</Text>
            </View>
             <View style={styles.infoRow}>
              <Text style={styles.label}>Task type:</Text>
              <Text style={styles.value}>{route.params.Task_Type}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Address:</Text>
              <Text style={styles.value}>{route.params.Address}</Text>
            </View>
             <View style={styles.infoRow}>
              <Text style={styles.label}>Remark:</Text>
              <Text style={styles.value}>{route.params.Remark}</Text>
            </View>
             <View style={styles.infoRow}>
              <Text style={styles.label}>Status:</Text>
              <Text style={styles.value}>{route.params.status}</Text>
            </View>
            

          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Update Status</Text>

            <Pressable 
              style={[
                styles.dropdownButton,
                hasSubmitAttempt && !workStatus ? styles.inputError : null
              ]}
              onPress={() => setShowStatusModal(true)}
            >
              <Text style={styles.dropdownButtonText}>
                {workStatus || 'Select Work Status'}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </Pressable>

            <Modal
              visible={showStatusModal}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setShowStatusModal(false)}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Select Work Status</Text>
                  
                  {['Completed', 'Pending', 'In Progress'].map((status) => (
                    <Pressable
                      key={status}
                      style={styles.modalItem}
                      onPress={() => {
                        setWorkStatus(status);
                        setShowStatusModal(false);
                      }}
                    >
                      <Text style={styles.modalItemText}>{status}</Text>
                    </Pressable>
                  ))}
                  
                  <Pressable
                    style={styles.modalCloseButton}
                    onPress={() => setShowStatusModal(false)}
                  >
                    <Text style={styles.modalCloseText}>Close</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>

            <View style={styles.uploadSection}>
              <Text style={styles.uploadLabel}>Upload Image:</Text>
              <View style={styles.uploadButtons}>
                <Pressable 
                  style={styles.uploadButton}
                  onPress={() => handleImageUpload(true)}
                >
                  <Ionicons name="camera" size={20} color="#fff" />
                  <Text style={styles.uploadButtonText}>Camera</Text>
                </Pressable>
                
                <Pressable 
                  style={styles.uploadButton}
                  onPress={() => handleImageUpload(false)}
                >
                  <Ionicons name="images" size={20} color="#fff" />
                  <Text style={styles.uploadButtonText}>Gallery</Text>
                </Pressable>
              </View>
              {uploadedImage ? (
                <Text style={styles.uploadSuccess}>✓ Image uploaded</Text>
              ) : hasSubmitAttempt ? (
                <Text style={styles.uploadError}>Please upload an image</Text>
              ) : null}
            </View>

            <View style={styles.uploadSection}>
              <Text style={styles.uploadLabel}>Upload Signature:</Text>
              <Pressable 
                style={styles.uploadButton}
                onPress={handleSignatureUpload}
              >
                <Ionicons name="document" size={20} color="#fff" />
                <Text style={styles.uploadButtonText}>Select File</Text>
              </Pressable>
              {uploadedSignature ? (
                <Text style={styles.uploadSuccess}>✓ Signature uploaded</Text>
              ) : hasSubmitAttempt ? (
                <Text style={styles.uploadError}>Please upload a signature</Text>
              ) : null}
            </View>

            <Text style={styles.formLabel}>Remark:</Text>
            <TextInput
              style={[
                styles.textInput,
                hasSubmitAttempt && !remark.trim() ? styles.inputError : null
              ]}
              multiline
              numberOfLines={4}
              placeholder="Enter your remarks here..."
              value={remark}
              onChangeText={setRemark}
            />
            {hasSubmitAttempt && !remark.trim() && (
              <Text style={styles.errorText}>Please add a remark</Text>
            )}

            <Pressable style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#1a73e8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight as number + 10 : 50,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  shareButton: {
    padding: 8,
  },
  content: {
    padding: 16,
  },
  complaintNoContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  complaintNo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  infoSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1a73e8',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    width: '40%',
    fontWeight: '600',
    color: '#555',
  },
  value: {
    flex: 1,
    color: '#333',
  },
  formSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#555',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    color: '#333',
    textAlignVertical: 'top',
    minHeight: 100,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
  },
  dropdownButtonText: {
    color: '#555',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  modalItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
  },
  modalCloseButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
  },
  uploadSection: {
    marginBottom: 16,
  },
  uploadLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#555',
  },
  uploadButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a73e8',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  uploadButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#1a73e8',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  uploadSuccess: {
    color: 'green',
    marginTop: 4,
  },
  uploadError: {
    color: 'red',
    marginTop: 4,
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 1,
  },
  errorText: {
    color: 'red',
    marginTop: -12,
    marginBottom: 8,
  },
}); 