import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Text, TouchableOpacity } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import Input from '../components/Input';
import Button from '../components/Button';
import { portfolioApi } from '../services/api';
import { AddProjectScreenProps } from '../types/navigation';
import { ProjectRequest } from '../types/api';

// Validation schema
const validationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string(),
  technologiesUsed: Yup.array().of(Yup.string()).min(1, 'At least one technology is required'),
});

// Initial form values
const initialValues: ProjectRequest = {
  title: '',
  description: '',
  technologiesUsed: [],
};

// Common technologies options
const commonTechnologies = [
  'JavaScript', 'TypeScript', 'React', 'React Native', 'Angular', 'Vue.js',
  'Node.js', 'Express', 'Spring Boot', 'Java', 'Python', 'Django',
  'Flask', 'PHP', 'Laravel', 'HTML/CSS', 'PostgreSQL', 'MongoDB',
  'MySQL', 'GraphQL', 'REST API', 'AWS', 'Azure', 'Firebase',
  'Docker', 'Kubernetes', 'Git', 'CI/CD', 'Figma', 'Sketch',
  'Photoshop', 'Illustrator', 'XD', 'InVision', 'Swift', 'Kotlin'
];

const AddProjectScreen: React.FC<AddProjectScreenProps> = ({ route, navigation }) => {
  const { freelancerId } = route.params;
  const [newTechnology, setNewTechnology] = useState('');
  const [showTechnologiesList, setShowTechnologiesList] = useState(false);

  const handleAddProject = async (values: ProjectRequest, { setSubmitting }: any) => {
    try {
      await portfolioApi.addProject(freelancerId, values);
      
      Alert.alert(
        'Success',
        'Project added to your portfolio!',
        [
          {
            text: 'Add Another',
            onPress: () => navigation.reset({
              index: 0,
              routes: [{ name: 'AddProject', params: { freelancerId } }],
            }),
          },
          {
            text: 'Search Projects',
            onPress: () => navigation.navigate('SearchProjects'),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to add project');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <LinearGradient
      colors={['#e6f7ff', '#f0f9ff', '#ffffff']}
      style={styles.container}
    >
      <ScrollView>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Add Project to Portfolio</Text>
          <Text style={styles.subtitle}>Showcase your work and skills to potential clients</Text>
          
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleAddProject}
          >
            {({ handleChange, handleSubmit, values, errors, touched, isSubmitting, setFieldValue }) => (
              <View>
                <Input
                  label="Project Title"
                  value={values.title}
                  onChangeText={handleChange('title')}
                  placeholder="Enter project title"
                  error={touched.title && typeof errors.title === 'string' ? errors.title : undefined}
                  leftIcon={<Ionicons name="document-text-outline" size={20} color="#4b5d67" />}
                />
                
                <Input
                  label="Description"
                  value={values.description || ''}
                  onChangeText={handleChange('description')}
                  placeholder="Enter project description"
                  error={touched.description && typeof errors.description === 'string' ? errors.description : undefined}
                  multiline={true}
                  numberOfLines={4}
                  leftIcon={<Ionicons name="information-circle-outline" size={20} color="#4b5d67" />}
                />
                
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>Technologies Used</Text>
                  
                  <View style={styles.technologiesInputContainer}>
                    <Input
                      label=""
                      value={newTechnology}
                      onChangeText={setNewTechnology}
                      placeholder="Type or select technologies"
                      error={typeof errors.technologiesUsed === 'string' ? errors.technologiesUsed : undefined}
                      style={{ flex: 1 }}
                      leftIcon={<Ionicons name="code-outline" size={20} color="#4b5d67" />}
                    />
                    <TouchableOpacity
                      style={styles.addButton}
                      onPress={() => {
                        if (newTechnology.trim()) {
                          const updatedTechnologies = [...values.technologiesUsed, newTechnology.trim()];
                          setFieldValue('technologiesUsed', updatedTechnologies);
                          setNewTechnology('');
                        }
                      }}
                    >
                      <Ionicons name="add" size={24} color="white" />
                    </TouchableOpacity>
                  </View>
                  
                  <TouchableOpacity
                    style={styles.showListButton}
                    onPress={() => setShowTechnologiesList(!showTechnologiesList)}
                  >
                    <Text style={styles.showListButtonText}>
                      {showTechnologiesList ? 'Hide Common Technologies' : 'Show Common Technologies'}
                    </Text>
                    <Ionicons 
                      name={showTechnologiesList ? 'chevron-up-outline' : 'chevron-down-outline'} 
                      size={16} 
                      color="#4b5d67" 
                      style={{ marginLeft: 5 }}
                    />
                  </TouchableOpacity>
                  
                  {showTechnologiesList && (
                    <View style={styles.technologiesList}>
                      {commonTechnologies.map((tech) => (
                        <TouchableOpacity
                          key={tech}
                          style={[
                            styles.technologyItem,
                            values.technologiesUsed.includes(tech) && styles.selectedTechnologyItem
                          ]}
                          onPress={() => {
                            if (!values.technologiesUsed.includes(tech)) {
                              const updatedTechnologies = [...values.technologiesUsed, tech];
                              setFieldValue('technologiesUsed', updatedTechnologies);
                            }
                          }}
                        >
                          <Text style={[
                            styles.technologyItemText,
                            values.technologiesUsed.includes(tech) && styles.selectedTechnologyItemText
                          ]}>
                            {tech}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                  
                  {values.technologiesUsed.length > 0 && (
                    <View style={styles.selectedTechnologies}>
                      <Text style={styles.selectedTitle}>Selected Technologies:</Text>
                      <View style={styles.tagsContainer}>
                        {values.technologiesUsed.map((tech, index) => (
                          <View key={`${tech}-${index}`} style={styles.tag}>
                            <Text style={styles.tagText}>{tech}</Text>
                            <TouchableOpacity
                              onPress={() => {
                                const updatedTechnologies = values.technologiesUsed.filter((_, i) => i !== index);
                                setFieldValue('technologiesUsed', updatedTechnologies);
                              }}
                              style={styles.removeTagButton}
                            >
                              <Ionicons name="close-circle" size={16} color="rgba(255,255,255,0.9)" />
                            </TouchableOpacity>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
                </View>
                
                <Button
                  title="Add Project"
                  onPress={handleSubmit}
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                  type="primary"
                  size="large"
                  fullWidth={true}
                  rounded={true}
                  icon={<Ionicons name="add-circle-outline" size={20} color="white" />}
                />
              </View>
            )}
          </Formik>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 25,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    marginTop: 20,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4b5d67',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6c7a89',
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 22,
  },
  fieldContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
    color: '#4b5d67',
  },
  technologiesInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  addButton: {
    backgroundColor: '#56c596',
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  showListButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginBottom: 12,
  },
  showListButtonText: {
    color: '#4b5d67',
    fontWeight: '500',
  },
  technologiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#d1d8e0',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#fff',
  },
  technologyItem: {
    margin: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
  },
  selectedTechnologyItem: {
    backgroundColor: 'rgba(86, 197, 150, 0.2)',
  },
  technologyItemText: {
    color: '#4b5d67',
  },
  selectedTechnologyItemText: {
    color: '#4b5d67',
    fontWeight: '500',
  },
  selectedTechnologies: {
    marginTop: 16,
  },
  selectedTitle: {
    fontWeight: '500',
    marginBottom: 8,
    color: '#4b5d67',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4b5d67',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: '#fff',
    marginRight: 4,
  },
  removeTagButton: {
    marginLeft: 2,
  },
});

export default AddProjectScreen; 