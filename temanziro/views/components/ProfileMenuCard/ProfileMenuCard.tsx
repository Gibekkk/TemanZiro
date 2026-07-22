import React from "react";
import { View } from "react-native";
import styles from "./ProfileMenuCard.style"

interface ProfileMenuCardProps {
    children: React.ReactNode;
}

export default function ProfileMenuCard({ children }: ProfileMenuCardProps) {
    const childrenArray = React.Children.toArray(children);

    return (
        <View style={styles.card}>
            {childrenArray.map((child, index) => {
                const isLast = index === childrenArray.length - 1;
                return (
                    <React.Fragment key={index}>
                        {child}
                        {!isLast && <View style={styles.divider} />}
                    </React.Fragment>
                );
            })}
        </View>
    );
}
