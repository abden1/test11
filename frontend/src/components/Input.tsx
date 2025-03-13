import React, { useState } from 'react';
import { TextInput, View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  error?: string;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'decimal-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  editable?: boolean;
  success?: boolean;
  successMessage?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  onLeftIconPress?: () => void;
  style?: any;
  inputStyle?: any;
  labelStyle?: any;
  autoCorrect?: boolean;
  variant?: 'outlined' | 'filled' | 'underlined';
  returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send';
  onSubmitEditing?: () => void;
  blurOnSubmit?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  error,
  keyboardType = 'default',
  autoCapitalize = 'none',
  multiline = false,
  numberOfLines = 1,
  maxLength,
  editable = true,
  success = false,
  successMessage,
  leftIcon,
  rightIcon,
  onRightIconPress,
  onLeftIconPress,
  style,
  inputStyle,
  labelStyle,
  autoCorrect = false,
  variant = 'outlined',
  returnKeyType,
  onSubmitEditing,
  blurOnSubmit,
}) => {
  const [focused, setFocused] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const animatedScale = new Animated.Value(1);
  
  const handleFocus = () => {
    setFocused(true);
    Animated.timing(animatedScale, {
      toValue: 0.98,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };
  
  const handleBlur = () => {
    setFocused(false);
    Animated.timing(animatedScale, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };
  
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  
  const getContainerStyle = () => {
    switch (variant) {
      case 'filled':
        return styles.filledContainer;
      case 'underlined':
        return styles.underlinedContainer;
      default:
        return styles.outlinedContainer;
    }
  };
  
  const getInputStyle = () => {
    switch (variant) {
      case 'filled':
        return styles.filledInput;
      case 'underlined':
        return styles.underlinedInput;
      default:
        return styles.outlinedInput;
    }
  };
  
  const getBorderColor = () => {
    if (error) return styles.errorBorder;
    if (success) return styles.successBorder;
    if (focused) return styles.focusedBorder;
    return {};
  };

  // Password visibility toggle icon
  const passwordIcon = secureTextEntry ? (
    <TouchableOpacity onPress={togglePasswordVisibility} style={styles.iconContainer}>
      <Ionicons
        name={passwordVisible ? 'eye-off-outline' : 'eye-outline'}
        size={24}
        color="#777"
      />
    </TouchableOpacity>
  ) : null;
  
  // Right icon or password visibility toggle
  const renderRightIcon = () => {
    if (secureTextEntry) {
      return passwordIcon;
    } else if (rightIcon) {
      return (
        <TouchableOpacity 
          onPress={onRightIconPress} 
          style={styles.iconContainer}
          disabled={!onRightIconPress}
        >
          {rightIcon}
        </TouchableOpacity>
      );
    }
    return null;
  };

  return (
    <Animated.View 
      style={[
        styles.container, 
        { transform: [{ scale: animatedScale }] },
        style
      ]}
    >
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      
      <View style={[
        styles.inputContainer,
        getContainerStyle(),
        getBorderColor(),
        error ? styles.errorInput : {},
        success ? styles.successInput : {},
        focused ? styles.focusedInput : {},
        !editable ? styles.disabledInput : {},
      ]}>
        {leftIcon && (
          <TouchableOpacity 
            onPress={onLeftIconPress} 
            style={styles.leftIconContainer}
            disabled={!onLeftIconPress}
          >
            {leftIcon}
          </TouchableOpacity>
        )}
        
        <TextInput
          style={[
            styles.input,
            getInputStyle(),
            multiline && styles.multilineInput,
            leftIcon && styles.inputWithLeftIcon,
            (rightIcon || secureTextEntry) && styles.inputWithRightIcon,
            inputStyle,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#999"
          secureTextEntry={secureTextEntry && !passwordVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          maxLength={maxLength}
          editable={editable}
          autoCorrect={autoCorrect}
          onFocus={handleFocus}
          onBlur={handleBlur}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          blurOnSubmit={blurOnSubmit}
        />
        
        {renderRightIcon()}
      </View>
      
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : success && successMessage ? (
        <Text style={styles.successText}>{successMessage}</Text>
      ) : null}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 12,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  inputWithLeftIcon: {
    paddingLeft: 8,
  },
  inputWithRightIcon: {
    paddingRight: 8,
  },
  outlinedContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
  },
  outlinedInput: {
    paddingVertical: 10,
  },
  filledContainer: {
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
  },
  filledInput: {
    paddingVertical: 12,
  },
  underlinedContainer: {
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 4,
  },
  underlinedInput: {
    paddingVertical: 8,
  },
  iconContainer: {
    padding: 4,
  },
  leftIconContainer: {
    marginRight: 8,
    padding: 4,
  },
  errorInput: {
    borderColor: '#FF6B6B',
  },
  successInput: {
    borderColor: '#10B981',
  },
  focusedInput: {
    borderColor: '#5046E5',
  },
  disabledInput: {
    backgroundColor: '#f9f9f9',
    opacity: 0.7,
  },
  errorBorder: {
    borderColor: '#FF6B6B',
  },
  successBorder: {
    borderColor: '#10B981',
  },
  focusedBorder: {
    borderColor: '#5046E5',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 14,
    marginTop: 4,
  },
  successText: {
    color: '#10B981',
    fontSize: 14,
    marginTop: 4,
  },
});

export default Input; 