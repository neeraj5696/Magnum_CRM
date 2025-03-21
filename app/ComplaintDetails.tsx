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
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

type RootStackParamList = {
  ComplaintDetails: {
    complaintNo: string;
    clientName: string;
    status: string;
    dateTime: string;
  };
};

type ComplaintDetailsRouteProp = RouteProp<RootStackParamList, 'ComplaintDetails'>;

export default function ComplaintDetails() {
  const route = useRoute<ComplaintDetailsRouteProp>();
  const navigation = useNavigation();
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
    Alert.alert('Success', 'Data submitted successfully');
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
          <Text style={styles.headerTitle}>Complaint Details</Text>
          <Pressable style={styles.shareButton}>
            <Ionicons name="share-outline" size={24} color="#fff" />
          </Pressable>
        </View>

        <View style={styles.content}>
          <View style={styles.complaintNoContainer}>
            <Text style={styles.complaintNo}>Complaint No. - {complaintNo}</Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.label}>Client Name : {clientName}</Text>
            <Text style={styles.label}>Product Name : dfdsfdsfdsfd fvdsfsf</Text>
            <Text style={styles.label}>Description : Others</Text>
            <Text style={styles.label}>Remark : checking some cloud poblem-9953506590</Text>
            <Text style={styles.label}>Address : dfdsfd,dsfdsf</Text>
            <Text style={styles.label}>Phone :</Text>
            <Text style={styles.label}>Assigned Engineer : NIRAJ KUMAR YADAV</Text>
            <Text style={styles.label}>Last updated on :</Text>
          </View>

          <Pressable 
            style={[
              styles.statusButton,
              hasSubmitAttempt && !workStatus && styles.requiredField
            ]}
            onPress={() => setShowStatusModal(true)}
          >
            <Text style={styles.statusButtonText}>
              {workStatus || 'Select your work status *'}
            </Text>
          </Pressable>

          <View style={styles.buttonRow}>
            <Pressable 
              style={[
                styles.uploadButton,
                hasSubmitAttempt && !uploadedImage && styles.requiredField
              ]}
              onPress={() => {
                Alert.alert(
                  'Upload Image',
                  'Choose image source',
                  [
                    { text: 'Camera', onPress: () => handleImageUpload(true) },
                    { text: 'Gallery', onPress: () => handleImageUpload(false) },
                    { text: 'Cancel', style: 'cancel' },
                  ]
                );
              }}
            >
              <Text style={styles.uploadButtonText}>
                {uploadedImage ? 'IMAGE UPLOADED' : 'UPLOAD IMAGE *'}
              </Text>
            </Pressable>
            <Pressable 
              style={[
                styles.uploadButton,
                hasSubmitAttempt && !uploadedSignature && styles.requiredField
              ]}
              onPress={handleSignatureUpload}
            >
              <Text style={styles.uploadButtonText}>
                {uploadedSignature ? 'SIGNATURE UPLOADED' : 'UPLOAD SIGNATURE *'}
              </Text>
            </Pressable>
          </View>

          <View style={[
            styles.remarkContainer,
            hasSubmitAttempt && !remark.trim() && styles.requiredField
          ]}>
            <TextInput
              style={styles.remarkInput}
              placeholder="Remark *"
              value={remark}
              onChangeText={setRemark}
              multiline
            />
          </View>

          <Pressable 
            style={styles.submitButton}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>SUBMIT</Text>
          </Pressable>
        </View>

        {/* Work Status Modal */}
        <Modal
          visible={showStatusModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowStatusModal(false)}
        >
          <Pressable 
            style={styles.modalOverlay}
            onPress={() => setShowStatusModal(false)}
          >
            <View style={styles.modalContent}>
              <Pressable
                style={styles.modalOption}
                onPress={() => {
                  setWorkStatus('Pending');
                  setShowStatusModal(false);
                }}
              >
                <Text style={styles.modalOptionText}>Pending</Text>
              </Pressable>
              <View style={styles.modalDivider} />
              <Pressable
                style={styles.modalOption}
                onPress={() => {
                  setWorkStatus('Completed');
                  setShowStatusModal(false);
                }}
              >
                <Text style={styles.modalOptionText}>Completed</Text>
              </Pressable>
            </View>
          </Pressable>
        </Modal>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: 40,
    paddingBottom: 10,
    backgroundColor: '#000',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  backButton: {
    padding: 8,
  },
  shareButton: {
    padding: 8,
  },
  content: {
    padding: 16,
  },
  complaintNoContainer: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 25,
    padding: 10,
    marginBottom: 20,
  },
  complaintNo: {
    fontSize: 16,
    textAlign: 'center',
    color: '#000',
  },
  infoSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  statusButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 25,
    marginBottom: 20,
  },
  statusButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  uploadButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 25,
    width: '48%',
  },
  uploadButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
  },
  remarkContainer: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 10,
    marginBottom: 20,
    padding: 10,
    height: 100,
  },
  remarkInput: {
    flex: 1,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 0,
  },
  submitButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '80%',
    overflow: 'hidden',
  },
  modalOption: {
    padding: 20,
  },
  modalOptionText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#000',
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  requiredField: {
    borderColor: '#ff0000',
    borderWidth: 1,
  },
}); 