import React, { useState, useRef, useEffect } from 'react';
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
import { generatePdfFromHtml } from '../../utils/documentGenerator';
import { createComplaintReportTemplate } from '../../utils/complaintReportTemplate';
import uploadPDFToCloudinary from '../../src/utils/cloudinaryUpload';
import Svg, { Path, G } from 'react-native-svg';
import ViewShot from 'react-native-view-shot';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Picker } from '@react-native-picker/picker';

type EnggComplaintDetailsRouteProp = RouteProp<RootStackParamList, 'Engineer/EnggComplaintDetails'>;

// DatePickerModal component
interface DatePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (date: string) => void;
  currentValue: string;
}

const DatePickerModal: React.FC<DatePickerModalProps> = ({ visible, onClose, onSelect, currentValue }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(currentValue ? new Date(currentValue) : new Date());
  const [currentMonth, setCurrentMonth] = useState<number>(selectedDate.getMonth());
  const [currentYear, setCurrentYear] = useState<number>(selectedDate.getFullYear());

  useEffect(() => {
    if (visible) {
      const date = currentValue ? new Date(currentValue) : new Date();
      setSelectedDate(date);
      setCurrentMonth(date.getMonth());
      setCurrentYear(date.getFullYear());
    }
  }, [visible, currentValue]);

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<View key={`empty-${i}`} style={styles.calendarDayEmpty} />);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const isSelected = selectedDate.getDate() === day &&
                        selectedDate.getMonth() === currentMonth &&
                        selectedDate.getFullYear() === currentYear;
      const isToday = new Date().toDateString() === date.toDateString();

      days.push(
        <TouchableOpacity
          key={day}
          style={[
            styles.calendarDay,
            isSelected && styles.calendarDaySelected,
            isToday && styles.calendarDayToday
          ]}
          onPress={() => setSelectedDate(date)}
        >
          <Text style={[
            styles.calendarDayText,
            isSelected && styles.calendarDayTextSelected,
            isToday && styles.calendarDayTextToday
          ]}>
            {day}
          </Text>
        </TouchableOpacity>
      );
    }

    return days;
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.pickerContainer}>
          <View style={styles.pickerHeader}>
            <Text style={styles.pickerTitle}>Select Date</Text>
            <View style={styles.pickerActions}>
              <TouchableOpacity onPress={onClose} style={styles.pickerActionButton}>
                <Text style={styles.pickerCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  onSelect(formatDate(selectedDate));
                  onClose();
                }}
                style={styles.pickerActionButton}
              >
                <Text style={styles.pickerDoneText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.calendarContainer}>
            <View style={styles.calendarHeader}>
              <TouchableOpacity
                onPress={() => {
                  if (currentMonth === 0) {
                    setCurrentMonth(11);
                    setCurrentYear(currentYear - 1);
                  } else {
                    setCurrentMonth(currentMonth - 1);
                  }
                }}
                style={styles.calendarArrow}
              >
                <Ionicons name="chevron-back" size={24} color="#333" />
              </TouchableOpacity>
              <Text style={styles.calendarMonthYear}>
                {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  if (currentMonth === 11) {
                    setCurrentMonth(0);
                    setCurrentYear(currentYear + 1);
                  } else {
                    setCurrentMonth(currentMonth + 1);
                  }
                }}
                style={styles.calendarArrow}
              >
                <Ionicons name="chevron-forward" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <View style={styles.calendarWeekDays}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <Text key={day} style={styles.calendarWeekDay}>{day}</Text>
              ))}
            </View>
            <View style={styles.calendarDays}>
              {renderCalendarDays()}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// TimePickerModal component
interface TimePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (time: string) => void;
  currentValue: string;
}

const TimePickerModal: React.FC<TimePickerModalProps> = ({ visible, onClose, onSelect, currentValue }) => {
  const [hours, setHours] = useState<number>(currentValue ? parseInt(currentValue.split(':')[0]) : new Date().getHours());
  const [minutes, setMinutes] = useState<number>(currentValue ? parseInt(currentValue.split(':')[1]) : new Date().getMinutes());
  const [isAM, setIsAM] = useState<boolean>(currentValue ? parseInt(currentValue.split(':')[0]) < 12 : new Date().getHours() < 12);

  useEffect(() => {
    if (visible) {
      if (currentValue) {
        const [h, m] = currentValue.split(':').map(Number);
        setHours(h);
        setMinutes(m);
        setIsAM(h < 12);
      } else {
        const now = new Date();
        setHours(now.getHours());
        setMinutes(now.getMinutes());
        setIsAM(now.getHours() < 12);
      }
    }
  }, [visible, currentValue]);

  const formatTime = (h: number, m: number, am: boolean) => {
    const hour = am ? (h === 0 ? 12 : h) : (h === 12 ? 12 : h - 12);
    return `${String(hour).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.pickerContainer}>
          <View style={styles.pickerHeader}>
            <Text style={styles.pickerTitle}>Select Time</Text>
            <View style={styles.pickerActions}>
              <TouchableOpacity onPress={onClose} style={styles.pickerActionButton}>
                <Text style={styles.pickerCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  const finalHours = isAM ? (hours === 12 ? 0 : hours) : (hours === 12 ? 12 : hours + 12);
                  onSelect(formatTime(finalHours, minutes, isAM));
                  onClose();
                }}
                style={styles.pickerActionButton}
              >
                <Text style={styles.pickerDoneText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.timePickerContent}>
            <View style={styles.timePickerColumn}>
              <Text style={styles.timePickerLabel}>Hour</Text>
              <ScrollView style={styles.timePickerScroll}>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
                  <TouchableOpacity
                    key={hour}
                    style={[
                      styles.timePickerItem,
                      hours === hour && styles.timePickerItemSelected
                    ]}
                    onPress={() => setHours(hour)}
                  >
                    <Text style={[
                      styles.timePickerItemText,
                      hours === hour && styles.timePickerItemTextSelected
                    ]}>
                      {String(hour).padStart(2, '0')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <View style={styles.timePickerColumn}>
              <Text style={styles.timePickerLabel}>Minute</Text>
              <ScrollView style={styles.timePickerScroll}>
                {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                  <TouchableOpacity
                    key={minute}
                    style={[
                      styles.timePickerItem,
                      minutes === minute && styles.timePickerItemSelected
                    ]}
                    onPress={() => setMinutes(minute)}
                  >
                    <Text style={[
                      styles.timePickerItemText,
                      minutes === minute && styles.timePickerItemTextSelected
                    ]}>
                      {String(minute).padStart(2, '0')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <View style={styles.timePickerColumn}>
              <Text style={styles.timePickerLabel}>AM/PM</Text>
              <View style={styles.ampmContainer}>
                <TouchableOpacity
                  style={[
                    styles.ampmButton,
                    isAM && styles.ampmButtonSelected
                  ]}
                  onPress={() => setIsAM(true)}
                >
                  <Text style={[
                    styles.ampmButtonText,
                    isAM && styles.ampmButtonTextSelected
                  ]}>AM</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.ampmButton,
                    !isAM && styles.ampmButtonSelected
                  ]}
                  onPress={() => setIsAM(false)}
                >
                  <Text style={[
                    styles.ampmButtonText,
                    !isAM && styles.ampmButtonTextSelected
                  ]}>PM</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

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
  const currentPathRef = useRef('');

  const [padLayout, setPadLayout] = useState({ x: 0, y: 0, width: 1, height: 1 });
  const signatureBgRef = useRef(null);

  const [showAttendedDatePicker, setShowAttendedDatePicker] = useState(false);
  const [showAttendedTimePicker, setShowAttendedTimePicker] = useState(false);
  const [showCompletedDatePicker, setShowCompletedDatePicker] = useState(false);
  const [showCompletedTimePicker, setShowCompletedTimePicker] = useState(false);

  // Pending reason state
  const [pendingReasons, setPendingReasons] = useState<string[]>([]);
  const [pendingReason, setPendingReason] = useState('');
  const [showPendingReason, setShowPendingReason] = useState(false);
  const [showPendingReasonModal, setShowPendingReasonModal] = useState(false);

  // Add new state for picker values
  const [tempDate, setTempDate] = useState(new Date());

  useEffect(() => {
    currentPathRef.current = currentPath;
  }, [currentPath]);

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
        // Save the previous stroke if it exists
        if (currentPathRef.current) {
          setPaths(prevPaths => [...prevPaths, currentPathRef.current]);
          setCurrentPath('');
        }
        const { locationX, locationY } = evt.nativeEvent;
        setCurrentPath(`M ${locationX} ${locationY}`);
      },
      onPanResponderMove: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        setCurrentPath(prevPath => `${prevPath} L ${locationX} ${locationY}`);
      },
      onPanResponderRelease: () => {
        // Save the last stroke
        if (currentPathRef.current) {
          setPaths(prevPaths => [...prevPaths, currentPathRef.current]);
          setCurrentPath('');
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
          const options = {
            format: 'jpg',
            quality: 0.9,
            result: 'data-uri'
          };
          const capturedSignature = await signatureRef.current.capture(options);
          console.log('Signature captured:', capturedSignature.substring(0, 60));
          setCustomerSignature(capturedSignature);
          setShowSignaturePad(false);
          console.log('customerSignature after save:', capturedSignature.substring(0, 60));
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

    // if (!workStatus) {
    //   Alert.alert('Error', 'Please select a work status');
    //   return;
    // }

    // if (workStatus === 'Pending' && !pendingReason) {
    //   Alert.alert('Error', 'Please select a pending reason');
    //   return;
    // }

    // if (!customerSignature) {
    //   Alert.alert('Error', 'Please provide customer signature');
    //   return;
    // }

    // if (!faultReported) {
    //   Alert.alert('Error', 'Please enter fault reported');
    //   return;
    // }

    // if (!typeOfCall) {
    //   Alert.alert('Error', 'Please select type of call');
    //   return;
    // }

    // if (!callAttendedDate || !callAttendedTime) {
    //   Alert.alert('Error', 'Please enter call attended date and time');
    //   return;
    // }

    // if (!callCompletedDate || !callCompletedTime) {
    //   Alert.alert('Error', 'Please enter call completed date and time');
    //   return;
    // }

    // if (!remark.trim()) {
    //   Alert.alert('Error', 'Please add a remark');
    //   return;
    // }

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
      const htmlContent = createComplaintReportTemplate(formData);
      const fileName = `complaint_${complaintNo}_report`;

      const result = await generatePdfFromHtml(htmlContent, fileName);
      
      if (result.success && result.localUri) {
        // Upload the generated PDF to Cloudinary
        try {
          const uploadResult = await uploadPDFToCloudinary(result.localUri);
          console.log('PDF uploaded to Cloudinary:', uploadResult);
          
          Alert.alert('Success', 'Data submitted, PDF generated and uploaded successfully', [
            {
              text: 'OK',
              onPress: () => {
                navigation.navigate('Engineer/EnggListofcomplaint', {
                  username: route.params.username,
                  password: route.params.password
                });
              }
            }
          ]);
        } catch (uploadError) {
          console.error('Error uploading to Cloudinary:', uploadError);
          Alert.alert('Warning', 'PDF generated but failed to upload to Cloudinary. Please try again later.');
        }
      } else {
        console.error('Failed to generate PDF');
        Alert.alert('Error', 'Failed to generate PDF document. Please try again.');
      }
    } catch (error) {
      console.error('Error in PDF generation:', error);
      Alert.alert('Error', 'Failed to process document. Please try again.');
    }
  };

  // Lock orientation to landscape when signature pad opens, unlock when closes
  useEffect(() => {
    if (showSignaturePad) {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    } else {
      ScreenOrientation.unlockAsync();
    }
    // On unmount, unlock orientation
    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, [showSignaturePad]);

  // Update pad layout on every layout change
  const updatePadLayout = () => {
    if (signatureBgRef.current) {
      (signatureBgRef.current as any).measureInWindow((x: number, y: number, width: number, height: number) => {
        setPadLayout({ x, y, width, height });
      });
    }
  };

  // When modal opens, and on every layout change, update pad layout
  useEffect(() => {
    if (showSignaturePad) {
      setTimeout(updatePadLayout, 100);
    }
  }, [showSignaturePad]);

  // Fetch pending reasons when workStatus is 'Pending'
  const fetchPendingReasons = async () => {
    
    const formData = new URLSearchParams();
    formData.append('username', route.params.username);
    formData.append('password', route.params.password);
   
    try {
      const res = await fetch('https://hma.magnum.org.in/appPendingstatus.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });
      const text = await res.text();
      
      // Remove prefix before parsing
      const jsonStart = text.indexOf('{');
      if (jsonStart === -1) {
        console.log('No JSON found in response');
        return;
      }
      const jsonString = text.slice(jsonStart);
      let data;
      try {
        data = JSON.parse(jsonString);
      } catch (e) {
        console.log('Failed to parse JSON:', e);
        return;
      }
      console.log('data',data);
      if (data.status === 'success' && Array.isArray(data.data)) {
        setPendingReasons(data.data.map((item: { PCOMP_STATUS: string }) => item.PCOMP_STATUS));
        setShowPendingReason(true);
        data.data.forEach((item: { PCOMP_STATUS: string }) => {
          console.log('Reason:', item.PCOMP_STATUS);
        });
      } else {
        setShowPendingReason(false);
      }
    } catch (error) {
      setShowPendingReason(false);
      console.log('error',error);
    }
  };

  
  useEffect(() => {
   
    if (workStatus === 'Pending') {
      fetchPendingReasons();
    } else {
      setShowPendingReason(false);
    }
  }, [workStatus]);

  // Helper function to format date
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  // Helper function to format time
  const formatTime = (date: Date) => {
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
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
            <View style={styles.dateTimeGroup}>
              <Text style={styles.formLabel}>Call Attended On:</Text>
              <View style={styles.dateTimeInputGroup}>
                <Pressable 
                  style={[styles.dateTimeInput, styles.dateInput]} 
                  onPress={() => setShowAttendedDatePicker(true)}
                >
                  <Ionicons name="calendar-outline" size={18} color="#666" />
                  <Text style={styles.dateTimeText}>{callAttendedDate || 'Select Date'}</Text>
                </Pressable>
                
                <Pressable 
                  style={[styles.dateTimeInput, styles.timeInput]} 
                  onPress={() => setShowAttendedTimePicker(true)}
                >
                  <Ionicons name="time-outline" size={18} color="#666" />
                  <Text style={styles.dateTimeText}>{callAttendedTime || 'Select Time'}</Text>
                </Pressable>
              </View>
            </View>

            {showAttendedDatePicker && (
              <DatePickerModal
                visible={showAttendedDatePicker}
                onClose={() => setShowAttendedDatePicker(false)}
                onSelect={setCallAttendedDate}
                currentValue={callAttendedDate}
              />
            )}
            
            {showAttendedTimePicker && (
              <TimePickerModal
                visible={showAttendedTimePicker}
                onClose={() => setShowAttendedTimePicker(false)}
                onSelect={setCallAttendedTime}
                currentValue={callAttendedTime}
              />
            )}

            {/* Call Completed Date and Time */}
            <View style={styles.dateTimeGroup}>
              <Text style={styles.formLabel}>Call Completed On:</Text>
              <View style={styles.dateTimeInputGroup}>
                <Pressable 
                  style={[styles.dateTimeInput, styles.dateInput]} 
                  onPress={() => setShowCompletedDatePicker(true)}
                >
                  <Ionicons name="calendar-outline" size={18} color="#666" />
                  <Text style={styles.dateTimeText}>{callCompletedDate || 'Select Date'}</Text>
                </Pressable>
                
                <Pressable 
                  style={[styles.dateTimeInput, styles.timeInput]} 
                  onPress={() => setShowCompletedTimePicker(true)}
                >
                  <Ionicons name="time-outline" size={18} color="#666" />
                  <Text style={styles.dateTimeText}>{callCompletedTime || 'Select Time'}</Text>
                </Pressable>
              </View>
            </View>

            {showCompletedDatePicker && (
              <DatePickerModal
                visible={showCompletedDatePicker}
                onClose={() => setShowCompletedDatePicker(false)}
                onSelect={setCallCompletedDate}
                currentValue={callCompletedDate}
              />
            )}
            
            {showCompletedTimePicker && (
              <TimePickerModal
                visible={showCompletedTimePicker}
                onClose={() => setShowCompletedTimePicker(false)}
                onSelect={setCallCompletedTime}
                currentValue={callCompletedTime}
              />
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
              style={[styles.textInput]}
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
                <View style={styles.signaturePreviewContainer}>
                  <Image
                    source={{ uri: customerSignature }}
                    style={styles.signaturePreviewImage}
                    resizeMode="contain"
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

                  {['Completed', 'Pending'].map((status) => (
                    <Pressable
                      key={status}
                      style={styles.modalItem}
                      onPress={() => {
                        setWorkStatus(status);
                        setShowStatusModal(false);
                        
                        // If Pending is selected, load the pending reasons
                        if (status === 'Pending') {
                          fetchPendingReasons();
                        }
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

            {workStatus === 'Pending' && (
              <>
                <Text style={styles.formLabel}>Pending Reason:</Text>
                <Pressable
                  style={[
                    styles.dropdownButton,
                    hasSubmitAttempt && workStatus === 'Pending' && !pendingReason ? styles.inputError : null
                  ]}
                  onPress={() => setShowPendingReasonModal(true)}
                >
                  <Text style={styles.dropdownButtonText}>
                    {pendingReason || 'Select Pending Reason'}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="#666" />
                </Pressable>
                {hasSubmitAttempt && workStatus === 'Pending' && !pendingReason && (
                  <Text style={styles.errorText}>Please select a pending reason</Text>
                )}
                
                <Modal
                  visible={showPendingReasonModal}
                  transparent={true}
                  animationType="slide"
                  onRequestClose={() => setShowPendingReasonModal(false)}
                >
                  <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                      <Text style={styles.modalTitle}>Pending Reason</Text>
                      {pendingReasons.length > 0 ? (
                        pendingReasons.map((reason) => (
                          <Pressable
                            key={reason}
                            style={styles.modalItem}
                            onPress={() => {
                              setPendingReason(reason);
                              setShowPendingReasonModal(false);
                            }}
                          >
                            <Text style={styles.modalItemText}>{reason}</Text>
                          </Pressable>
                        ))
                      ) : (
                        <Text style={styles.modalNoDataText}>Loading pending reasons...</Text>
                      )}
                      <Pressable
                        style={styles.modalCloseButton}
                        onPress={() => setShowPendingReasonModal(false)}
                      >
                        <Text style={styles.modalCloseText}>Close</Text>
                      </Pressable>
                    </View>
                  </View>
                </Modal>
              </>
            )}

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
              <ViewShot
                ref={signatureRef}
                style={styles.signaturePad}
                options={{ format: 'jpg', quality: 0.9, result: 'data-uri' }}
              >
                <View ref={signatureBgRef} style={styles.signatureBackground} onLayout={updatePadLayout}>
                  <Svg height={padLayout.height} width={padLayout.width} viewBox={`0 0 ${padLayout.width} ${padLayout.height}`}>
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

              <View style={styles.signatureButtonsSmall}>
                <TouchableOpacity
                  style={styles.signatureButtonSmall}
                  onPress={clearSignature}
                >
                  <Text style={styles.signatureButtonTextSmall}>Clear</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.signatureButtonSmall, styles.signatureButtonPrimarySmall]}
                  onPress={saveSignature}
                >
                  <Text style={[styles.signatureButtonTextSmall, { color: '#fff' }]}>Save</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
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
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#f9f9f9',
    flex: 1,
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
    height: 80, // fixed height
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  signatureText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '600',
  },
  signaturePlaceholder: {
    color: '#666',
    fontSize: 14,
  },
  signatureModalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '100%',
  },
  signaturePad: {
    height: 155,
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
  signatureButtonsSmall: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  signatureButtonSmall: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
    marginHorizontal: 8,
  },
  signatureButtonPrimarySmall: {
    backgroundColor: '#1a73e8',
    borderColor: '#1a73e8',
  },
  signatureButtonTextSmall: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  signaturePreviewContainer: {
    width: '100%',
    height: 60, // fixed preview height
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  signaturePreviewImage: {
    width: '100%',
    height: 50, // fixed image height
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: '70%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  pickerHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'column',
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  pickerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerActionButton: {
    padding: 8,
  },
  pickerContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  picker: {
    flex: 1,
    height: 200,
  },
  pickerCancelText: {
    color: '#666',
    fontSize: 16,
  },
  pickerDoneText: {
    color: '#1a73e8',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalNoDataText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    padding: 15,
  },
  dateTimeGroup: {
    marginBottom: 16,
  },
  dateTimeInputGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateInput: {
    flex: 1,
    marginRight: 8,
  },
  timeInput: {
    flex: 0.7,
  },
  dateTimeText: {
    marginLeft: 8,
    color: '#333',
  },
  timePickerContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    height: 300,
  },
  timePickerColumn: {
    flex: 1,
    alignItems: 'center',
  },
  timePickerLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  timePickerScroll: {
    width: '100%',
  },
  timePickerItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  timePickerItemSelected: {
    backgroundColor: '#e8eaf6',
    borderRadius: 8,
  },
  timePickerItemText: {
    fontSize: 16,
    color: '#333',
  },
  timePickerItemTextSelected: {
    color: '#1a73e8',
    fontWeight: 'bold',
  },
  ampmContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  ampmButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4,
    backgroundColor: '#f5f5f5',
  },
  ampmButtonSelected: {
    backgroundColor: '#1a73e8',
  },
  ampmButtonText: {
    fontSize: 16,
    color: '#333',
  },
  ampmButtonTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  calendarContainer: {
    padding: 20,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  calendarArrow: {
    padding: 8,
  },
  calendarMonthYear: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  calendarWeekDays: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  calendarWeekDay: {
    width: 40,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  calendarDays: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  calendarDay: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
  },
  calendarDaySelected: {
    backgroundColor: '#1a73e8',
    borderRadius: 20,
  },
  calendarDayToday: {
    borderWidth: 1,
    borderColor: '#1a73e8',
    borderRadius: 20,
  },
  calendarDayEmpty: {
    width: 40,
    height: 40,
    margin: 2,
  },
  calendarDayText: {
    fontSize: 16,
    color: '#333',
  },
  calendarDayTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  calendarDayTextToday: {
    color: '#1a73e8',
    fontWeight: 'bold',
  },
}); 