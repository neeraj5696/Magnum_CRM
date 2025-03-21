import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
  ManagerLoginScreen: undefined;
  HomeScreen: undefined;
  SignUpScreen: undefined;
  Listofcomplaint: undefined;
  Rate: undefined;
  LoginScreen: { role?: string };
  Managerpage: { role?: string };
  ChangePassword: { role?: string };
  index: undefined;
  ComplaintDetails: { 
    complaintNo: string;
    clientName: string;
    status: string;
    dateTime: string;
  };
  CheckInOut: { role?: string };
  Check: undefined;
};

// Navigation prop type for useNavigation()
export type NavigationProps = StackNavigationProp<RootStackParamList>;
