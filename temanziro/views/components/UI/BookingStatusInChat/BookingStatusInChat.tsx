import { View, Text } from 'react-native';
import React from 'react';
import style from './BookingStatusInChat.style';

import IconBooking from '@/assets/icon/usercheck.svg';
import IconTickGreen from '@/assets/icon/check_green.svg';
import IconMoneyGreen from '@/assets/icon/money_green.svg';
import IconTime from '@/assets/icon/time.svg';
import IconCloseRed from '@/assets/icon/close_red.svg';
import IconSearch from '@/assets/icon/search.svg';
import IconRequest from '@/assets/icon/role1.svg';

import { BOOKING_STATUS } from '@/constants/BookingDetails';

export type BookingStatusType = typeof BOOKING_STATUS[keyof typeof BOOKING_STATUS];
export type UserRole = 'user' | 'companion';

export const getBookingStatusText = (status: BookingStatusType, role: UserRole): string => {
    switch (status) {
        case BOOKING_STATUS.KONFIRMASI:
            return "Booking Diterima";

        case BOOKING_STATUS.BERLANGSUNG:
            return "Check-in Tersedia";

        case BOOKING_STATUS.SELESAI:
            return role === 'companion' ? "Pembayaran Diterima" : "Booking Selesai";

        case BOOKING_STATUS.MENUNGGU_PEMBAYARAN:
            return "Menunggu Pembayaran";

        case BOOKING_STATUS.MENCARI:
            return "Mencari Companion...";

        case BOOKING_STATUS.PERMINTAAN:
            return "Permintaan Masuk";

        case BOOKING_STATUS.BATAL:
            return "Booking Dibatalkan";

        default:
            return "";
    }
};

const getBookingStatusIcon = (status: BookingStatusType, role: UserRole) => {
    switch (status) {
        case BOOKING_STATUS.SELESAI:
            return role === 'companion' ? (
                <IconMoneyGreen height={20} width={20} />
            ) : (
                <IconTickGreen height={20} width={20} />
            );

        case BOOKING_STATUS.MENUNGGU_PEMBAYARAN:
            return <IconTime height={20} width={20} />;

        case BOOKING_STATUS.KONFIRMASI:
            return <IconBooking height={20} width={20} />;

        case BOOKING_STATUS.BERLANGSUNG:
            return <IconTickGreen height={20} width={20} />;

        case BOOKING_STATUS.MENCARI:
            return <IconSearch height={20} width={20} />;

        case BOOKING_STATUS.PERMINTAAN:
            return <IconRequest height={20} width={20} />;

        case BOOKING_STATUS.BATAL:
            return <IconCloseRed height={20} width={20} />;

        default:
            return <IconBooking height={20} width={20} />;
    }
};

export default function BookingStatusInChat({ status, role }: { status: BookingStatusType; role: UserRole }) {
    const text = getBookingStatusText(status, role);
    if (!text) return null;

    return (
        <View style={style.container}>
            {getBookingStatusIcon(status, role)}
            <Text style={style.text}>{text}</Text>
        </View>
    );
}