import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
  ManagerLoginScreen: undefined;
  HomeScreen: undefined;
  SignUpScreen: undefined;
  Listofcomplaint: { username: string; password: string };
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
  Check: {
    username: string;
    password: string;
    data: undefined;
  };
};

// Navigation prop type for useNavigation()
export type NavigationProps = StackNavigationProp<RootStackParamList>;

// Default export to fix the warning
export default {
  RootStackParamList: {} as RootStackParamList,
  NavigationProps: {} as NavigationProps,
};
