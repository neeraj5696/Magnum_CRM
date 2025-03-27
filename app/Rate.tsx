import { View, Text, TextInput, Button, Alert } from 'react-native';
import React, { useState } from 'react';

const Rate = () => {
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    const numericRating = parseFloat(rating);

    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      Alert.alert('Invalid Rating', 'Please provide a rating between 1 and 5.');
      return;
    }

    console.log(`Rating: ${numericRating}`);
    console.log(`Comment: ${comment}`);

    Alert.alert('Thank you!', 'Your feedback has been submitted.');
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 10 }}>Rate the App</Text>
      <TextInput
        placeholder="Enter a rating (1-5)"
        keyboardType="numeric"
        value={rating}
        onChangeText={setRating}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Leave a comment"
        value={comment}
        onChangeText={setComment}
        style={{ borderBottomWidth: 1, marginBottom: 20 }}
      />
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

export default Rate;
