import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { format } from 'date-fns';

export default function Check() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedAction, setSelectedAction] = useState('checkin');

  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = () => {
    // Handle check in/out submission
    console.log(`${selectedAction} at ${format(currentTime, 'HH:mm:ss')}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Attendance System</Text>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.content}>
          {/* Left Container - Current Time */}
          <View style={styles.timeContainer}>
            <Text style={styles.label}>Current Time</Text>
            <Text style={styles.time}>{format(currentTime, 'HH:mm:ss')}</Text>
          </View>

          {/* Right Container - Current Date */}
          <View style={styles.dateContainer}>
            <Text style={styles.label}>Current Date</Text>
            <Text style={styles.date}>{format(currentTime, 'EEEE')}</Text>
            <Text style={styles.date}>{format(currentTime, 'dd MMM yyyy')}</Text>
          </View>
        </View>

        {/* Bottom Container - Check In/Out Selection */}
        <View style={styles.bottomContainer}>
          <Text style={styles.label}>Select Action</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedAction}
              onValueChange={(itemValue) => setSelectedAction(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Check In" value="checkin" />
              <Picker.Item label="Check Out" value="checkout" />
            </Picker>
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  header: {
    backgroundColor: '#1a73e8',
    padding: 20,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  mainContent: {
    flex: 1,
   // justifyContent: 'space-between',
    paddingVertical: 24,
  },
  content: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    margin: 20
  },
  timeContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 12,
    marginRight: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  dateContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 12,
    marginLeft: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  label: {
    fontSize: 18,
    color: '#1a73e8',
    marginBottom: 12,
    fontWeight: '600',
  },
  time: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1a73e8',
  },
  date: {
    fontSize: 22,
    color: '#202124',
    marginBottom: 8,
    fontWeight: '500',
  },
  bottomContainer: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    padding: 24,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  pickerContainer: {
    borderWidth: 2,
    borderColor: '#e8eaed',
    borderRadius: 8,
    marginBottom: 24,
    backgroundColor: '#f8f9fa',
    overflow: 'hidden',
  },
  picker: {
    height: 56,
  },
  submitButton: {
    backgroundColor: '#1a73e8',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 