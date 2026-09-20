import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps } from 'react-native';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success';

export interface ButtonProps extends TouchableOpacityProps {
  label: string;
  variante?: ButtonVariant;
  className?: string;
  onPress?: () => void;
}

export const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-yellow-300 text-black',
  secondary: 'bg-cyan-300 text-black',
  danger: 'bg-pink-400 text-black',
  success: 'bg-emerald-300 text-black',
};

export const Button: React.FC<ButtonProps> = ({
  label,
  variante = 'primary',
  className = '',
  onPress,
  disabled,
  ...props
}) => {
  const currentVariant = variantStyles[variante] || variantStyles.primary;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={disabled}
      className={`border-[3px] border-black rounded-lg py-3 px-5 items-center justify-center shadow-[3px_3px_0px_0px_#000000] ${currentVariant} ${
        disabled ? 'opacity-50' : ''
      } ${className}`}
      {...props}
    >
      <Text className="text-sm font-black uppercase tracking-wider text-black">
        {label}
      </Text>
    </TouchableOpacity>
  );
};