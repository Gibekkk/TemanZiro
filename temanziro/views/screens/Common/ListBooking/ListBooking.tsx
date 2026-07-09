import SecondaryLayout from '@/views/layouts/SecondaryLayout/SecondaryLayout';
import ScheduleTabs from '@/views/components/ScheduleTabs/ScheduleTabs';
import styles from './ListBooking.style';

import { useTemanJalan } from '@/controllers/hooks/Common/useTemanJalan';
import React from 'react';
import { View } from 'react-native';

export default function ListBooking() {
    const { featuredDataList, loading, isCompanion } = useTemanJalan();

    return (
        <SecondaryLayout title="Pemesanan" showBackButton={true} noPadding={true}>
            <View style={styles.container}>
                {isCompanion ? (
                    <ScheduleTabs
                        role="companion"
                        schedules={featuredDataList}
                        loading={loading}
                        isFull={true}
                    />
                ) : (
                    <ScheduleTabs
                        role="booker"
                        schedules={featuredDataList}
                        loading={loading}
                        isFull={true}
                    />
                )}
            </View>
        </SecondaryLayout>
    )
}