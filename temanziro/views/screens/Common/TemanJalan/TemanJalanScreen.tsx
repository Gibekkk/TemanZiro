import React, { useRef, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import styles from './TemanJalanScreen.style';
import { ITEM_WIDTH } from '@/views/components/FeaturedCard/FeaturedCard.style';
import { useTemanJalan, BookingData } from '@/controllers/hooks/Common/useTemanJalan';
import MainLayout from '@/views/layouts/MainLayout/MainLayout';
import MainLayoutCompanion from '@/views/layouts/MainLayout/MainLayoutCompanion';
import FeaturedCard from '@/views/components/FeaturedCard/FeaturedCard';
import ScheduleTabs from '@/views/components/ScheduleTabs/ScheduleTabs';

export default function TemanJalanScreen() {
    const { loading, featuredDataList, role, isCompanion, theme, handleChatPress } = useTemanJalan();
    const [activeIndex, setActiveIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    const handleScroll = (event: any) => {
        const scrollOffset = event.nativeEvent.contentOffset.x;
        const index = Math.round(scrollOffset / ITEM_WIDTH);
        setActiveIndex(index);
    };

    const renderCard = ({ item }: { item: BookingData }) => {
        return (
            <FeaturedCard
                item={item}
                theme={theme}
                role={role}
                handleChatPress={handleChatPress}
            />
        );
    };


    const renderContent = () => {
        return (
            <View style={[styles.container]}>
                {loading ? (
                    <View style={styles.centerContainer}>
                        <ActivityIndicator size="large" color={theme.colors.secondary} />
                        <Text style={[styles.emptyText, { color: theme.colors.textSecondary, marginTop: 10 }]}>
                            Memuat sorotan...
                        </Text>
                    </View>
                ) : featuredDataList.length === 0 ? (
                    <View style={styles.centerContainer}>
                        <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                            Belum ada aktivitas.
                        </Text>
                    </View>
                ) : (
                    <View style={styles.carouselContainer}>
                        <FlatList
                            ref={flatListRef}
                            data={featuredDataList}
                            renderItem={renderCard}
                            keyExtractor={(item) => item.id}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            snapToAlignment="center"
                            snapToInterval={ITEM_WIDTH}
                            decelerationRate="fast"
                            contentContainerStyle={styles.cardsWrapper}
                            onScroll={handleScroll}
                            scrollEventThrottle={16}
                        />

                        {featuredDataList.length > 0 && (
                            <View style={styles.paginationWindow}>
                                <View
                                    style={[
                                        styles.paginationTrack,
                                        {
                                            transform: [
                                                {
                                                    translateX: -Math.max(
                                                        0,
                                                        Math.min(activeIndex - 1, featuredDataList.length - 3)
                                                    ) * 16
                                                }
                                            ]
                                        }
                                    ]}
                                >
                                    {featuredDataList.map((_, index) => (
                                        <View
                                            key={index}
                                            style={[
                                                styles.dot,
                                                activeIndex === index ? styles.dotActive : styles.dotInactive,
                                                { backgroundColor: activeIndex === index ? theme.colors.secondary : theme.colors.border }
                                            ]}
                                        />
                                    ))}
                                </View>
                            </View>
                        )}
                    </View>
                )}
            </View>
        );
    };

    if (isCompanion) {
        return (
            <MainLayoutCompanion showHeader={true} useScrollView={false} backgroundColor="#ffffff" isDashboard={false} paddingBottom={0}>
                {renderContent()}
                <ScheduleTabs role="companion" />
            </MainLayoutCompanion>
        );
    }

    return (
        <MainLayout showHeader={true} useScrollView={false} isDashboard={false} paddingBottom={0}>
            {renderContent()}
            <ScheduleTabs role="booker" />
        </MainLayout>
    );
}