import React, { useEffect, useRef } from "react";
import {
  View, Text, TouchableOpacity,
  Keyboard, Animated, PanResponder,
} from "react-native";
import styles from "./WheelColumn.style";

const formatTime = (num: number) => num.toString().padStart(2, "0");

interface WheelColumnProps {
  value: number;
  max: number;
  onChange: (val: number) => void;
  label?: string;
  itemHeight?: number;
  visibleItems?: number;
  activeColor: string;
  textColor: string;
}

const WheelColumn = ({
  value,
  max,
  onChange,
  label,
  itemHeight = 48,
  visibleItems = 5,
  activeColor,
  textColor,
}: WheelColumnProps) => {
  const data = Array.from({ length: max + 1 }, (_, i) => i);
  const translateY = useRef(new Animated.Value(-value * itemHeight)).current;
  const currentOffset = useRef(-value * itemHeight);
  const lastOffset = useRef(-value * itemHeight);

  useEffect(() => {
    const target = -value * itemHeight;
    currentOffset.current = target;
    lastOffset.current = target;
    Animated.spring(translateY, {
      toValue: target,
      useNativeDriver: true,
      tension: 120,
      friction: 10,
    }).start();
  }, [value]);

  const snapToIndex = (offset: number) => {
    const minOffset = -(max * itemHeight);
    const maxOffset = 0;
    const clamped = Math.max(minOffset, Math.min(maxOffset, offset));
    const index = Math.round(-clamped / itemHeight);
    const snapped = -(index * itemHeight);

    currentOffset.current = snapped;
    lastOffset.current = snapped;

    Animated.spring(translateY, {
      toValue: snapped,
      useNativeDriver: true,
      tension: 150,
      friction: 12,
    }).start();

    if (index !== value) onChange(index);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 2,
      onPanResponderGrant: () => {
        translateY.stopAnimation((val) => {
          currentOffset.current = val;
          lastOffset.current = val;
        });
        Keyboard.dismiss();
      },
      onPanResponderMove: (_, g) => {
        const newOffset = lastOffset.current + g.dy;
        const minOffset = -(max * itemHeight);
        const maxOffset = 0;
        let bounded = newOffset;
        if (newOffset > maxOffset) {
          bounded = maxOffset + (newOffset - maxOffset) * 0.2;
        } else if (newOffset < minOffset) {
          bounded = minOffset + (newOffset - minOffset) * 0.2;
        }
        translateY.setValue(bounded);
        currentOffset.current = bounded;
      },
      onPanResponderRelease: (_, g) => {
        snapToIndex(currentOffset.current + g.vy * 80);
      },
      onPanResponderTerminate: () => {
        snapToIndex(currentOffset.current);
      },
    })
  ).current;

  return (
    <View
      style={[styles.container, { height: itemHeight * visibleItems }]}
      {...panResponder.panHandlers}
    >
      <Animated.View
        style={{
          transform: [{
            translateY: Animated.add(
              translateY,
              new Animated.Value(itemHeight * 2)
            ),
          }],
        }}
      >
        {data.map((val) => {
          const distance = Math.abs(val - value);
          const isActive = val === value;

          return (
            <TouchableOpacity
              key={val}
              activeOpacity={0.7}
              style={[styles.wheelItem, { height: itemHeight }]}
              onPress={() => {
                const target = -(val * itemHeight);
                currentOffset.current = target;
                lastOffset.current = target;
                Animated.spring(translateY, {
                  toValue: target,
                  useNativeDriver: true,
                  tension: 150,
                  friction: 12,
                }).start();
                onChange(val);
              }}
            >
              <Text
                style={[
                  styles.wheelText,
                  isActive
                    ? [styles.wheelTextActive, { color: activeColor }]
                    : {
                        color: textColor,
                        fontSize: distance === 1 ? 16 : 13,
                        opacity: distance === 1 ? 0.6 : 0.3,
                      },
                ]}
              >
                {formatTime(val)}{label ? ` ${label}` : ""}
              </Text>
            </TouchableOpacity>
          );
        })}
      </Animated.View>
    </View>
  );
};

export default WheelColumn;