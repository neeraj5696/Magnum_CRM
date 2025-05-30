import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_FOLDER } from '@env';
import cloudinaryConfig from '../config/cloudinary.config';

const EnvTest = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Environment Variables Test</Text>
      
      <Text style={styles.label}>Direct from @env:</Text>
      <Text style={styles.value}>CLOUDINARY_CLOUD_NAME: {CLOUDINARY_CLOUD_NAME || 'not set'}</Text>
      <Text style={styles.value}>CLOUDINARY_UPLOAD_PRESET: {CLOUDINARY_UPLOAD_PRESET || 'not set'}</Text>
      <Text style={styles.value}>CLOUDINARY_FOLDER: {CLOUDINARY_FOLDER || 'not set'}</Text>
      
      <Text style={styles.label}>From cloudinaryConfig:</Text>
      <Text style={styles.value}>cloudName: {cloudinaryConfig.cloudName}</Text>
      <Text style={styles.value}>uploadPreset: {cloudinaryConfig.uploadPreset}</Text>
      <Text style={styles.value}>folder: {cloudinaryConfig.folder}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    marginBottom: 2,
  },
});

export default EnvTest; 