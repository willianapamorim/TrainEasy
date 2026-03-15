import { COLORS } from "@/src/constants/colors";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

type IconName = "google" | "facebook" | "phone";

interface SocialButtonProps extends TouchableOpacityProps {
  icon: IconName;
}

const ICON_MAP = {
  google: <FontAwesome name="google" size={24} color={COLORS.black} />,
  facebook: <FontAwesome name="facebook" size={24} color={COLORS.black} />,
  phone: <MaterialIcons name="phone" size={24} color={COLORS.black} />,
} as const;

export function SocialButton({ icon, ...rest }: SocialButtonProps) {
  return (
    <TouchableOpacity style={styles.button} activeOpacity={0.7} {...rest}>
      {ICON_MAP[icon]}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: COLORS.grayLight,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
  },
});
