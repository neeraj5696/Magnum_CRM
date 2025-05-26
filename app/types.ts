import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
  // Manager Routes
  ManagerLoginScreen: { role?: string };
  Managerpage: { role?: string };
  LoginScreen: { role?: string }; // This is needed for backward compatibility
  
  // Common Routes
  HomeScreen: undefined;
  SignUpScreen: undefined;
  Rate: undefined;
  index: undefined;
  ChangePassword: { role?: string };
  CheckInOut: { role?: string };
  
  // Engineer Routes
  "Engineer/EnggLoginScreen": { role?: string };
  "Engineer/EnggListofcomplaint": { 
    username: string; 
    password: string;
  };
  "Engineer/EnggComplaintDetails": { 
    complaintNo: string;
    clientName: string;
    status: string;
    dateTime: string;
    Engineer:string;
    Assign_Date: string;
    Task_Type: string;
    Address: string;
    Remark: string;
    SYSTEM_NAME:string;
    username: string;
    password: string;
  };
  
  // Manager Complaint Routes
  Listofcomplaint: { 
    username: string; 
    password: string;
  };
  ComplaintDetails: { 
    complaintNo: string;
    clientName: string;
    status: string;
    dateTime: string;
  };
  
  // Check Routes
  Check: {
    username: string;
    password: string;
    data: undefined;
  };
  
  // Legacy routes for compatibility
  EnggLoginScreen: { role?: string };
  EnggListofcomplaint: { 
    username: string; 
    password: string;
  };
  EnggComplaintDetails: { 
    complaintNo: string;
    clientName: string;
    status: string;
    dateTime: string;
  };
};

// Navigation prop type for useNavigation()
export type NavigationProps = StackNavigationProp<RootStackParamList>;

// Default export to fix the warning
export default {
  RootStackParamList: {} as RootStackParamList,
  NavigationProps: {} as NavigationProps,
};
