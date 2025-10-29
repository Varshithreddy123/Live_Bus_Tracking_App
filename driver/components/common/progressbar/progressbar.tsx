import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  PlatformColor,
} from "react-native";
import { useTheme } from "@react-navigation/native";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  titles?: string[];
}

const { width } = Dimensions.get("window");

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
  titles,
}) => {
  const { colors } = useTheme();
  const progress = (currentStep / totalSteps) * 100;

  const safeColors = {
    background: String(colors.background || "#f9f9f9"),
    card: String(colors.card || "white"),
    border: String(colors.border || "#ccc"),
    text: String(colors.text || "#000"),
    primary: String(colors.primary || "#007bff"),
  };

  return (
    <View style={styles.container}>
      {/* Step Titles */}
      {titles && (
        <View style={styles.titlesRow}>
          {titles.map((title, index) => (
            <Text
              key={index}
              style={[
                styles.stepTitle,
                index + 1 <= currentStep && styles.activeTitle,
                { color: index + 1 <= currentStep ? safeColors.primary : safeColors.border }
              ]}
            >
              {title}
            </Text>
          ))}
        </View>
      )}

      {/* Progress Bar */}
      <View style={[styles.progressBackground, { backgroundColor: safeColors.border }]}>
        <View style={[styles.progressFill, { backgroundColor: safeColors.primary, width: `${progress}%` }]} />
      </View>

      {/* Step Dots */}
      <View style={styles.stepsRow}>
        {[...Array(totalSteps)].map((_, index) => (
          <View
            key={index}
            style={[
              styles.stepDot,
              index + 1 <= currentStep && styles.activeDot,
              { backgroundColor: index + 1 <= currentStep ? safeColors.primary : safeColors.border }
            ]}
          />
        ))}
      </View>

      {/* Step Text */}
      <Text style={[styles.progressText, { color: safeColors.text }]}>
        Step {currentStep} of {totalSteps}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width * 0.9,
    alignSelf: "center",
    marginTop: 20,
  },
  titlesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  stepTitle: {
    fontSize: 12,
    color: PlatformColor("systemGray"), // iOS/Android adaptive color
    fontWeight: "500",
  },
  activeTitle: {
    color: PlatformColor("systemBlue"),
    fontWeight: "700",
  },
  progressBackground: {
    height: 8,
    borderRadius: 10,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 10,
  },
  stepsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: PlatformColor("systemGray4"),
  },
  activeDot: {
    backgroundColor: PlatformColor("systemBlue"),
  },
  progressText: {
    textAlign: "center",
    marginTop: 8,
    fontSize: 13,
    color: PlatformColor("label"),
    fontWeight: "600",
  },
});

export default ProgressBar;
