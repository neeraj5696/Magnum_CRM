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
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from './types';

type CheckScreenRouteProp = RouteProp<RootStackParamList, 'Check'>;

export default function Check() {
  const route = useRoute<CheckScreenRouteProp>();
  const { username, password } = route.params || {};
  
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedAction, setSelectedAction] = useState('checkin');
  const [engineerName, setEngineerName] = useState('');
  const [complaintNo, setComplaintNo] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchEngineerData = async () => {
      try {
        // Create URLSearchParams object for form data
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);

        const response = await fetch('https://hma.magnum.org.in/appEngglogin.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formData.toString()
        });

        const responseText = await response.text();
        let jsonResponse;
        try {
          jsonResponse = JSON.parse(responseText);
        } catch (jsonError) {
          console.error('Failed to parse response:', jsonError);
          return;
        }
        
       // console.log('API Response:', jsonResponse);

        if (jsonResponse.status === 'success' && jsonResponse.data && jsonResponse.data.length > 0) {
          const firstComplaint = jsonResponse.data[0];
          setEngineerName(firstComplaint.S_assignedengg);
          setComplaintNo(firstComplaint.S_SERVNO);
          
          console.log('Engineer Name:', firstComplaint.S_assignedengg);
          console.log('Complaint No:', firstComplaint.S_SERVNO);
        } else {
          console.error('No complaint data found');
        }
      } catch (error) {
        console.error('Error fetching engineer data:', error);
      }
    };

    if (username && password) {
      fetchEngineerData();
    }
  }, [username, password]);

  const handleSubmit = async () => {
    try {
      if (!selectedAction) {
        console.error('Please select check-in or check-out');
        return;
      }

      // Create form data
      const formData = new URLSearchParams();
      formData.append('engineerName', engineerName);
      formData.append('complaintNo', complaintNo);
      formData.append('actionType', selectedAction);
      formData.append('checkStatus', selectedAction === 'checkin' ? 'Checked In' : 'Checked Out');
      formData.append('timestamp', format(currentTime, 'yyyy-MM-dd HH:mm:ss'));
      formData.append('date', format(currentTime, 'yyyy-MM-dd'));
      formData.append('time', format(currentTime, 'HH:mm:ss'));

      console.log('Sending form data:', formData.toString());

      const response = await fetch('https://hma.magnum.org.in/appCheckINOUT.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString()
      });

      const responseText = await response.text();
      console.log('Raw API Response:', responseText);

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse response:', parseError);
        console.log('Response text:', responseText);
        return;
      }

      console.log(`Successfully ${selectedAction === 'checkin' ? 'checked in' : 'checked out'}:`, result);
      
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Attendance System</Text>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.content}>
          <View style={styles.timeContainer}>
            <Text style={styles.label}>Current Time</Text>
            <Text style={styles.time}>{format(currentTime, 'HH:mm:ss')}</Text>
          </View>

          <View style={styles.dateContainer}>
            <Text style={styles.label}>Current Date</Text>
            <Text style={styles.date}>{format(currentTime, 'EEEE')}</Text>
            <Text style={styles.date}>{format(currentTime, 'dd MMM yyyy')}</Text>
          </View>
        </View>

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
    backgroundColor: '#f4f4f4', // Lighter background for a modern feel
  },
  header: {
    backgroundColor: '#3498db', // A more vibrant blue
    padding: 20,
    alignItems: 'center',
    elevation: 5, // Increased elevation for a more pronounced shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerText: {
    color: 'white',
    fontSize: 26, // Slightly larger header text
    fontWeight: '600',
  },
  mainContent: {
    flex: 1,
    paddingVertical: 24,
  },
  content: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  timeContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 15, // More rounded corners
    marginRight: 10, // Increased spacing
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  dateContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 15,
    marginLeft: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  label: {
    fontSize: 18,
    color: '#3498db',
    marginBottom: 12,
    fontWeight: '600',
  },
  time: {
    fontSize: 24, // Larger time display
    fontWeight: 'bold',
    color: '#2c3e50', // Darker color for time
  },
  date: {
    fontSize: 20,
    color: '#34495e', // Darker color for date
    marginBottom: 8,
    fontWeight: '500',
  },
  bottomContainer: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    padding: 24,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  pickerContainer: {
    borderWidth: 2,
    borderColor: '#ecf0f1', // Lighter border color
    borderRadius: 10,
    marginBottom: 24,
    backgroundColor: '#ecf0f1', // Lighter background
    overflow: 'hidden',
  },
  picker: {
    height: 56,
  },
  submitButton: {
    backgroundColor: '#2980b9', // Slightly darker blue for button
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});