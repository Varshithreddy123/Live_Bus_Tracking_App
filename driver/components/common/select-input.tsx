import React from "react";
import { View, Text, StyleSheet } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { useTheme } from "@react-navigation/native";

interface InputProps {
  title: string;
  placeholder: string;
  items: { label: string; value: string }[];
  onValueChange: (value: string) => void;
  showWarning: boolean;
  warning: string;
}

export default function SelectInput({
  title,
  placeholder,
  items,
  onValueChange,
  showWarning,
  warning,
}: InputProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={[styles.title, { color: colors.text}]}>{title}</Text>
      
      {/* Dropdown */}
      <View
        style={[
          styles.pickerContainer,
          { borderColor: showWarning ? colors.notification : colors.border },
        ]}
      >
        <RNPickerSelect
          onValueChange={onValueChange}
          items={items}
          placeholder={{ label: placeholder, value: "" }}
          style={{
            inputIOS: [styles.input, { color: colors.text }],
            inputAndroid: [styles.input, { color: colors.text }],
            placeholder: { color: colors.background || "#999" },
          }}
          useNativeAndroidPickerStyle={false}
        />
      </View>

      {/* Warning message */}
      {showWarning && (
        <Text style={[styles.warningText, { color: colors.notification }]}>
          {warning}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    justifyContent: "center",
    height: 50,
  },
  input: {
    fontSize: 16,
    paddingVertical: 10,
  },
  warningText: {
    marginTop: 5,
    fontSize: 13,
    color: "red",
  },
});
