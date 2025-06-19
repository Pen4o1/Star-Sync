import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const UserDatePicker = ({ value, onChange, label = 'Date of Birth' }) => {
  const [show, setShow] = useState(false);

  const handleChange = (event, selectedDate) => {
    setShow(Platform.OS === 'ios');
    if (selectedDate) onChange(selectedDate);
  };

  return (
    <View style={styles.inputContainer}>
      <Text style={[styles.label, styles.labelWhite]}>{label}</Text>
      <TouchableOpacity
        style={styles.inputWrapper}
        onPress={() => setShow(true)}
        activeOpacity={0.8}
      >
        <Text style={[styles.input, styles.inputWhite]}>
          {value.toISOString().split('T')[0]}
        </Text>
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          value={value}
          mode="date"
          display="default"
          onChange={handleChange}
          maximumDate={new Date()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  labelWhite: {
    color: '#FFFFFF',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    paddingLeft: 20,
    borderRadius: 20,
    minHeight: 48,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  input: {
    flex: 1,
    borderRadius: 15,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: 'transparent',
    color: '#FFFFFF',
    fontSize: 16,
  },
  inputWhite: {
    color: '#FFFFFF',
  },
});

export default UserDatePicker; 