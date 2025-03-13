import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, Animated, View } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  type?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  rounded?: boolean;
  style?: any;
  textStyle?: any;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  isLoading = false,
  disabled = false,
  type = 'primary',
  size = 'medium',
  fullWidth = false,
  icon,
  iconPosition = 'left',
  rounded = false,
  style,
  textStyle,
}) => {
  // Animation for press effect
  const opacity = new Animated.Value(1);
  
  const handlePressIn = () => {
    Animated.timing(opacity, {
      toValue: 0.7,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };
  
  const handlePressOut = () => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  // Get button style based on type
  const getButtonTypeStyle = () => {
    switch (type) {
      case 'secondary':
        return styles.secondaryButton;
      case 'success':
        return styles.successButton;
      case 'danger':
        return styles.dangerButton;
      case 'warning':
        return styles.warningButton;
      case 'info':
        return styles.infoButton;
      default:
        return styles.primaryButton;
    }
  };
  
  // Get text style based on type
  const getTextTypeStyle = () => {
    switch (type) {
      case 'secondary':
        return styles.secondaryText;
      case 'success':
        return styles.successText;
      case 'danger':
        return styles.dangerText;
      case 'warning':
        return styles.warningText;
      case 'info':
        return styles.infoText;
      default:
        return styles.primaryText;
    }
  };
  
  // Get button size style
  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.smallButton;
      case 'large':
        return styles.largeButton;
      default:
        return styles.mediumButton;
    }
  };
  
  // Get text size style
  const getTextSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.smallText;
      case 'large':
        return styles.largeText;
      default:
        return styles.mediumText;
    }
  };

  return (
    <Animated.View style={{ 
      opacity, 
      width: fullWidth ? '100%' : 'auto', 
      alignSelf: fullWidth ? 'stretch' : 'flex-start',
      ...style
    }}>
      <TouchableOpacity
        style={[
          styles.button,
          getButtonTypeStyle(),
          getSizeStyle(),
          rounded && styles.roundedButton,
          disabled || isLoading ? styles.disabledButton : {},
        ]}
        onPress={onPress}
        disabled={disabled || isLoading}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
      >
        {isLoading ? (
          <ActivityIndicator color={type === 'secondary' ? '#5046E5' : '#fff'} />
        ) : (
          <View style={styles.contentContainer}>
            {icon && iconPosition === 'left' && <View style={styles.iconLeft}>{icon}</View>}
            <Text 
              style={[
                styles.text, 
                getTextTypeStyle(),
                getTextSizeStyle(),
                textStyle
              ]}
            >
              {title}
            </Text>
            {icon && iconPosition === 'right' && <View style={styles.iconRight}>{icon}</View>}
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  primaryButton: {
    backgroundColor: '#4b5d67',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#4b5d67',
  },
  successButton: {
    backgroundColor: '#56c596',
  },
  dangerButton: {
    backgroundColor: '#e57a77',
  },
  warningButton: {
    backgroundColor: '#f9c74f',
  },
  infoButton: {
    backgroundColor: '#6ca6c1',
  },
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  mediumButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  largeButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  roundedButton: {
    borderRadius: 50,
  },
  disabledButton: {
    opacity: 0.6,
  },
  text: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  primaryText: {
    color: '#fff',
  },
  secondaryText: {
    color: '#4b5d67',
  },
  successText: {
    color: '#fff',
  },
  dangerText: {
    color: '#fff',
  },
  warningText: {
    color: '#fff',
  },
  infoText: {
    color: '#fff',
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
});

export default Button; 