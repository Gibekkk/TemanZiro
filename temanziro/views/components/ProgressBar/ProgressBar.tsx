import React from "react";
import { View, Text } from "react-native";
import styles from "./ProgressBar.style";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  title: string;
}

export default function ProgressBar({ currentStep, totalSteps, title }: ProgressBarProps) {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.textWrapper}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.stepInfo}>
          {currentStep} dari {totalSteps}
        </Text>
      </View>
      <View style={styles.barBackground}>
        <View
          style={[
            styles.barFill,
            { width: `${progressPercentage}%` },
          ]}
        />
      </View>
    </View>
  );
}