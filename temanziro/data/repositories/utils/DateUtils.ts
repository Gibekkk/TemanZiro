import firestore, { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

export const NormaliseDate = (value: any): string | null => {
    if (!value) return null;
    if (value && typeof value.toDate === "function") {
        const date = value.toDate();
        if (date instanceof Date && !isNaN(date.getTime())) {
            return date.toISOString().slice(0, 10);
        }
        return null;
    }
    if (value instanceof Date) {
        if (!isNaN(value.getTime())) {
            return value.toISOString().slice(0, 10);
        }
        return null;
    }
    if (typeof value === "string") {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
            return date.toISOString().slice(0, 10);
        }
        const parts = value.split('-');
        if (parts.length >= 3) {
            const year = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1;
            const day = parseInt(parts[2], 10);
            if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
                return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            }
        }
        return null;
    }
    return null;
}

export const stringToTimestamp = (dateString: string | null | undefined): FirebaseFirestoreTypes.Timestamp | null => {
    if (!dateString) return null;
    try {
        const dateObject = new Date(dateString);
        if (isNaN(dateObject.getTime())) {
            return null;
        }
        return firestore.Timestamp.fromDate(dateObject);
    } catch (error) {
        console.error("Error converting string to timestamp:", error);
        return null;
    }
};

export const formatDateToLocal = (value: any, locale: string = 'id-ID'): string | null => {
    let dateObject: Date;

    if (value && typeof value.toDate === "function") {
        dateObject = value.toDate();
    } else if (value instanceof Date) {
        dateObject = value;
    } else if (typeof value === "string") {
        dateObject = new Date(value);
    } else {
        return null;
    }

    if (isNaN(dateObject.getTime())) {
        return null;
    }

    return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric' }).format(dateObject);
};