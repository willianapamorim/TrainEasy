import { COLORS } from "@/src/constants/colors";
import React from "react";
import { StyleSheet, TextInput, TextInputProps } from "react-native";

interface InputProps extends TextInputProps {
  placeholder: string;
}

export function Input({ placeholder, ...rest }: InputProps) {
  return (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor={COLORS.gray}
      autoCapitalize="none"
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.grayLight,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: COLORS.black,
    backgroundColor: "transparent",
  },
});
