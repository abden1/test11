import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Register: undefined;
  AddProject: { freelancerId: number };
  SearchProjects: undefined;
};

export type RegisterScreenProps = NativeStackScreenProps<RootStackParamList, 'Register'>;
export type AddProjectScreenProps = NativeStackScreenProps<RootStackParamList, 'AddProject'>;
export type SearchProjectsScreenProps = NativeStackScreenProps<RootStackParamList, 'SearchProjects'>; 