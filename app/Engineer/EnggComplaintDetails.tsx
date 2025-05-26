import React, { useState, useRef } from 'react';
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
  TouchableOpacity,
  PanResponder,
  Dimensions,
  Image,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList, NavigationProps } from '../types';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { generatePdfFromHtml, generateDocxFromHtml } from '../../utils/documentGenerator';
import { createComplaintReportTemplate } from '../../utils/complaintReportTemplate';
import Svg, { Path, G } from 'react-native-svg';
import * as FileSystem from 'expo-file-system';
import ViewShot from 'react-native-view-shot';

type EnggComplaintDetailsRouteProp = RouteProp<RootStackParamList, 'Engineer/EnggComplaintDetails'>;

export default function EnggComplaintDetails() {
  const route = useRoute<EnggComplaintDetailsRouteProp>();
  const navigation = useNavigation<NavigationProps>();
  const { complaintNo, clientName } = route.params;
  const insets = useSafeAreaInsets();

  // Form field states
  const [remark, setRemark] = useState('');
  const [workStatus, setWorkStatus] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [hasSubmitAttempt, setHasSubmitAttempt] = useState(false);
  const [documentFormat, setDocumentFormat] = useState<'pdf' | 'docx'>('pdf');
  const [showDocFormatModal, setShowDocFormatModal] = useState(false);

  // Form field states for new fields
  const [faultReported, setFaultReported] = useState('');
  const [typeOfCall, setTypeOfCall] = useState('');
  const [showTypeOfCallModal, setShowTypeOfCallModal] = useState(false);
  const [callAttendedDate, setCallAttendedDate] = useState('');
  const [callAttendedTime, setCallAttendedTime] = useState('');
  const [callCompletedDate, setCallCompletedDate] = useState('');
  const [callCompletedTime, setCallCompletedTime] = useState('');
  const [partReplaced, setPartReplaced] = useState('');
  const [causeProblem, setCauseProblem] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [materialTakenOut, setMaterialTakenOut] = useState('');
  const [customerComment, setCustomerComment] = useState('');
  const [customerSignature, setCustomerSignature] = useState<string | null>(null);
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  
  // For signature drawing
  const [paths, setPaths] = useState<Array<string>>([]);
  const [currentPath, setCurrentPath] = useState<string>('');
  const signatureRef = useRef<any>(null);

  // Get dimensions for signature pad
  const screenWidth = Dimensions.get('window').width;
  const padWidth = Math.min(screenWidth - 80, 500);
  const padHeight = 200;
  
  // PanResponder for signature drawing
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        setCurrentPath(`M ${locationX} ${locationY}`);
      },
      onPanResponderMove: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        setCurrentPath(prevPath => `${prevPath} L ${locationX} ${locationY}`);
      },
      onPanResponderRelease: () => {
        // Save the current path when touch ends
        if (currentPath) {
          setPaths(prevPaths => [...prevPaths, currentPath]);
          setCurrentPath(''); // Reset current path
        }
      },
    })
  ).current;

  // Clear signature
  const clearSignature = () => {
    setPaths([]);
    setCurrentPath('');
    setCustomerSignature(null);
  };

  // Save signature
  const saveSignature = async () => {
    if (paths.length > 0 || currentPath) {
      try {
        if (signatureRef.current) {
          // Properly format options for ViewShot
          const options = {
            format: 'jpg',
            quality: 0.9,
            result: 'data-uri'  // Ensure we get data URI format directly
          };
          
          // Capture the signature with proper options
          const capturedSignature = await signatureRef.current.capture(options);
          console.log('Signature captured:', capturedSignature.substring(0, 30) + '...');
          
          setCustomerSignature(capturedSignature);
          setShowSignaturePad(false);
          
          // Log success for debugging
          console.log('Signature saved successfully');
        } else {
          Alert.alert('Error', 'Failed to capture signature');
        }
      } catch (error) {
        console.error('Error capturing signature:', error);
        Alert.alert('Error', 'Failed to capture signature');
      }
    } else {
      Alert.alert('Error', 'Please provide a signature');
    }
  };

  // Open signature pad
  const openSignaturePad = () => {
    // Reset paths when opening the signature pad if there's no existing signature
    if (!customerSignature) {
      setPaths([]);
      setCurrentPath('');
    }
    setShowSignaturePad(true);
  };

  // Handle form submission
  const handleSubmit = async () => {
    setHasSubmitAttempt(true);

    if (!workStatus) {
      Alert.alert('Error', 'Please select a work status');
      return;
    }

    if (!customerSignature) {
      Alert.alert('Error', 'Please provide customer signature');
      return;
    }

    if (!faultReported) {
      Alert.alert('Error', 'Please enter fault reported');
      return;
    }

    if (!typeOfCall) {
      Alert.alert('Error', 'Please select type of call');
      return;
    }

    if (!callAttendedDate || !callAttendedTime) {
      Alert.alert('Error', 'Please enter call attended date and time');
      return;
    }

    if (!callCompletedDate || !callCompletedTime) {
      Alert.alert('Error', 'Please enter call completed date and time');
      return;
    }

    if (!remark.trim()) {
      Alert.alert('Error', 'Please add a remark');
      return;
    }

    // Show format selection modal
    setShowDocFormatModal(true);
  };

  // Handle final submission with document generation
  const handleFinalSubmit = async () => {
    // Log signature data for debugging
    console.log('Signature data length:', 
      customerSignature ? customerSignature.length : 'No signature');
    
    const formData = {
      complaintNo,
      clientName,
      workStatus,
      remark,
      faultReported,
      typeOfCall,
      callAttendedDate,
      callAttendedTime,
      callCompletedDate,
      callCompletedTime,
      partReplaced,
      causeProblem,
      diagnosis,
      materialTakenOut,
      customerComment,
      customerSignature,
      submittedAt: new Date().toISOString(),
      // Add additional fields from route.params
      systemName: route.params.SYSTEM_NAME || '',
      assignDate: route.params.Assign_Date || '',
      location: route.params.Address || '',
      taskType: route.params.Task_Type || '',
      status: route.params.status || '',
    };

    // Generate document from form data with the specialized template
    try {
      console.log(`Generating ${documentFormat.toUpperCase()} from form data...`);
      const htmlContent = createComplaintReportTemplate(formData);
      const fileName = `complaint_${complaintNo}_report`;

      let success = false;

      if (documentFormat === 'pdf') {
        success = await generatePdfFromHtml(htmlContent, fileName);
      } else {
        success = await generateDocxFromHtml(htmlContent, fileName);
      }

      if (success) {
        console.log(`${documentFormat.toUpperCase()} generated successfully`);
      } else {
        console.error(`Failed to generate ${documentFormat.toUpperCase()}`);
      }
    } catch (error) {
      console.error(`Error in ${documentFormat.toUpperCase()} generation:`, error);
    }

    console.log('Form Data:', formData);
    Alert.alert('Success', `Data submitted and ${documentFormat.toUpperCase()} report generated successfully`, [
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
    <SafeAreaView style={[styles.container, { paddingBottom: insets.bottom }]}>
      <StatusBar />
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
          <View style={{ flexDirection: 'row' }}>
            <Pressable style={styles.shareButton}>
              <Ionicons name="share-outline" size={24} color="#fff" />
            </Pressable>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.complaintNoContainer}>
            <Text style={styles.complaintNo}>Complaint No. - {complaintNo}</Text>
          </View>

          <View style={styles.infoSectionBox}>
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

          <View style={styles.formSectionBox}>
            <Text style={styles.sectionTitle}>Update Status</Text>

            {/* Fault Reported */}
            <Text style={styles.formLabel}>Fault Reported:</Text>
            <TextInput
              style={[
                styles.textInput,
                hasSubmitAttempt && !faultReported ? styles.inputError : null
              ]}
              placeholder="Enter fault reported..."
              value={faultReported}
              onChangeText={setFaultReported}
            />
            {hasSubmitAttempt && !faultReported && (
              <Text style={styles.errorText}>Please enter fault reported</Text>
            )}

            {/* Type of Call Dropdown */}
            <Text style={styles.formLabel}>Type of Call:</Text>
            <Pressable
              style={[
                styles.dropdownButton,
                hasSubmitAttempt && !typeOfCall ? styles.inputError : null
              ]}
              onPress={() => setShowTypeOfCallModal(true)}
            >
              <Text style={styles.dropdownButtonText}>
                {typeOfCall || 'Select Type of Call'}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </Pressable>
            {hasSubmitAttempt && !typeOfCall && (
              <Text style={styles.errorText}>Please select type of call</Text>
            )}

            <Modal
              visible={showTypeOfCallModal}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setShowTypeOfCallModal(false)}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Select Type of Call</Text>

                  {['Installation', 'Warranty', 'Call Basis', 'AMC', 'Preventive'].map((type) => (
                    <Pressable
                      key={type}
                      style={styles.modalItem}
                      onPress={() => {
                        setTypeOfCall(type);
                        setShowTypeOfCallModal(false);
                      }}
                    >
                      <Text style={styles.modalItemText}>{type}</Text>
                    </Pressable>
                  ))}

                  <Pressable
                    style={styles.modalCloseButton}
                    onPress={() => setShowTypeOfCallModal(false)}
                  >
                    <Text style={styles.modalCloseText}>Close</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>

            {/* Call Attended Date and Time */}
            <Text style={styles.formLabel}>Call Attended on Date:</Text>
            <View style={styles.dateTimeContainer}>
              <TextInput
                style={[
                  styles.dateTimeInput,
                  hasSubmitAttempt && !callAttendedDate ? styles.inputError : null
                ]}
                placeholder="YYYY-MM-DD"
                value={callAttendedDate}
                onChangeText={setCallAttendedDate}
              />
              <TextInput
                style={[
                  styles.dateTimeInput,
                  hasSubmitAttempt && !callAttendedTime ? styles.inputError : null
                ]}
                placeholder="HH:MM"
                value={callAttendedTime}
                onChangeText={setCallAttendedTime}
              />
            </View>
            {hasSubmitAttempt && (!callAttendedDate || !callAttendedTime) && (
              <Text style={styles.errorText}>Please enter date and time</Text>
            )}

            {/* Call Completed Date and Time */}
            <Text style={styles.formLabel}>Call Completed on:</Text>
            <View style={styles.dateTimeContainer}>
              <TextInput
                style={[
                  styles.dateTimeInput,
                  hasSubmitAttempt && !callCompletedDate ? styles.inputError : null
                ]}
                placeholder="YYYY-MM-DD"
                value={callCompletedDate}
                onChangeText={setCallCompletedDate}
              />
              <TextInput
                style={[
                  styles.dateTimeInput,
                  hasSubmitAttempt && !callCompletedTime ? styles.inputError : null
                ]}
                placeholder="HH:MM"
                value={callCompletedTime}
                onChangeText={setCallCompletedTime}
              />
            </View>
            {hasSubmitAttempt && (!callCompletedDate || !callCompletedTime) && (
              <Text style={styles.errorText}>Please enter date and time</Text>
            )}

            {/* Part Replaced */}
            <Text style={styles.formLabel}>Part Replaced/Stand by (if any):</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter parts replaced..."
              value={partReplaced}
              onChangeText={setPartReplaced}
            />

            {/* Cause of Problem */}
            <Text style={styles.formLabel}>Cause of Problem:</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter cause of problem..."
              value={causeProblem}
              onChangeText={setCauseProblem}
            />

            {/* Diagnosis */}
            <Text style={styles.formLabel}>Diagnosis:</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter diagnosis..."
              value={diagnosis}
              onChangeText={setDiagnosis}
            />

            {/* Material Taken Out */}
            <Text style={styles.formLabel}>Material Taken Out (if any):</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter materials taken out..."
              value={materialTakenOut}
              onChangeText={setMaterialTakenOut}
            />

            {/* Customer Comment */}
            <Text style={styles.formLabel}>Customer Comment:</Text>
            <TextInput
              style={[styles.textInput, { height: 100 }]}
              multiline
              numberOfLines={4}
              placeholder="Enter customer's comment here..."
              value={customerComment}
              onChangeText={setCustomerComment}
            />

            {/* Customer Signature */}
            <Text style={styles.formLabel}>Customer Signature:</Text>
            <Pressable
              style={styles.signatureBox}
              onPress={openSignaturePad}
            >
              {customerSignature ? (
                <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                  <Image 
                    source={{ uri: customerSignature }}
                    style={{ width: '80%', height: 70, resizeMode: 'contain' }}
                  />
                  <Text style={styles.signatureText}>Signature Saved ✓</Text>
                </View>
              ) : (
                <Text style={styles.signaturePlaceholder}>Tap to add signature</Text>
              )}
            </Pressable>

            {/* Remarks */}
            <Text style={styles.formLabel}>Remarks:</Text>
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

            {/* Status Dropdown */}
            <Text style={styles.formLabel}>Status:</Text>
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
            {hasSubmitAttempt && !workStatus && (
              <Text style={styles.errorText}>Please select a work status</Text>
            )}

            <Modal
              visible={showStatusModal}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setShowStatusModal(false)}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Select Work Status</Text>

                  {['Completed', 'Pending', 'Stand By', 'Under Observation'].map((status) => (
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

            <Pressable style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </Pressable>
          </View>
        </View>

        {/* Document Format Selection Modal */}
        <Modal
          visible={showDocFormatModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowDocFormatModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.formatModalContainer}>
              <Text style={styles.formatModalTitle}>Choose Document Format</Text>

              <TouchableOpacity
                style={[
                  styles.formatOption,
                  documentFormat === 'pdf' && styles.formatOptionSelected
                ]}
                onPress={() => setDocumentFormat('pdf')}
              >
                <Text style={[
                  styles.formatOptionText,
                  documentFormat === 'pdf' && styles.formatOptionTextSelected
                ]}>
                  PDF Format
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.formatOption,
                  documentFormat === 'docx' && styles.formatOptionSelected
                ]}
                onPress={() => setDocumentFormat('docx')}
              >
                <Text style={[
                  styles.formatOptionText,
                  documentFormat === 'docx' && styles.formatOptionTextSelected
                ]}>
                  DOCX Format (Word)
                </Text>
              </TouchableOpacity>

              <View style={styles.formatButtonsContainer}>
                <TouchableOpacity
                  style={styles.formatCancelButton}
                  onPress={() => setShowDocFormatModal(false)}
                >
                  <Text style={styles.formatCancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.formatSubmitButton}
                  onPress={() => {
                    setShowDocFormatModal(false);
                    handleFinalSubmit();
                  }}
                >
                  <Text style={styles.formatSubmitButtonText}>Submit & Download</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Signature Pad Modal */}
        <Modal
          visible={showSignaturePad}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowSignaturePad(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.signatureModalContent}>
              <Text style={styles.modalTitle}>Customer Signature</Text>
              
              <ViewShot 
                ref={signatureRef} 
                style={styles.signaturePad} 
                options={{ format: 'jpg', quality: 0.9, result: 'data-uri' }}
              >
                <View style={styles.signatureBackground}>
                  <Svg height="100%" width="100%" viewBox={`0 0 ${padWidth} ${padHeight}`}>
                    <G>
                      {/* Draw all saved paths */}
                      {paths.map((path, index) => (
                        <Path
                          key={`path-${index}`}
                          d={path}
                          stroke="black"
                          strokeWidth={2}
                          fill="none"
                        />
                      ))}
                      
                      {/* Draw current path */}
                      {currentPath ? (
                        <Path
                          d={currentPath}
                          stroke="black"
                          strokeWidth={2}
                          fill="none"
                        />
                      ) : null}
                    </G>
                  </Svg>
                </View>
              </ViewShot>
              
              {/* Touch handler overlay for signature pad */}
              <View 
                style={[styles.signatureOverlay]}
                {...panResponder.panHandlers}
              />

              <View style={styles.signatureButtons}>
                <TouchableOpacity
                  style={styles.signatureButton}
                  onPress={clearSignature}
                >
                  <Text style={styles.signatureButtonText}>Clear</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.signatureButton, styles.signatureButtonPrimary]}
                  onPress={saveSignature}
                >
                  <Text style={[styles.signatureButtonText, { color: '#fff' }]}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
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
    padding: 5,
    borderRadius: 5,
   
    
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
  infoSectionBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#0066CC',
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
  formSectionBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#0066CC',
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
    padding: 10,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor: '#f9f9f9',
    color: '#333',   
    height: 50, // set to whatever height you want

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
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dateTimeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9f9f9',
    color: '#333',
    marginRight: 8,
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  formatModalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: '80%',
    maxWidth: 400,
  },
  formatModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  formatOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    marginBottom: 10,
  },
  formatOptionSelected: {
    backgroundColor: '#e8eaf6',
    borderColor: '#3f51b5',
  },
  formatOptionText: {
    fontSize: 16,
    color: '#333',
  },
  formatOptionTextSelected: {
    fontWeight: 'bold',
    color: '#1a237e',
  },
  formatButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  formatCancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  formatCancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#616161',
  },
  formatSubmitButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#1a237e',
    borderRadius: 8,
    alignItems: 'center',
  },
  formatSubmitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  signatureBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signatureText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
  },
  signaturePlaceholder: {
    color: '#666',
    fontSize: 16,
  },
  signatureModalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 500,
  },
  signaturePad: {
    height: 200,
    width: '100%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginVertical: 20,
    overflow: 'hidden',
  },
  signatureBackground: {
    backgroundColor: '#fff',
    height: '100%',
    width: '100%',
  },
  signatureOverlay: {
    position: 'absolute',
    top: 20 + 20, // modalTitle height + marginVertical
    left: 20,
    right: 20,
    height: 200,
    backgroundColor: 'transparent',
  },
  signatureButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  signatureButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  signatureButtonPrimary: {
    backgroundColor: '#1a73e8',
    borderColor: '#1a73e8',
  },
  signatureButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
}); 