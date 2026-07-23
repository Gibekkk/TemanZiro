import { useState, useEffect } from "react";
import { useAuth } from "@/controllers/hooks/useAuth";
import { useUserProfile } from "@/controllers/hooks/useUserProfile";
import { CompanionProfile } from "@/domain/models/CompanionModel";
import { useRouter } from "expo-router";
import { CompanionRepository } from "@/data/repositories/CompanionRepository";
import { Alert } from "react-native";
import { USE_DUMMY_DATA, DUMMY_COMPANION_PROFILE } from "@/constants/Config";

export function useActivityCompanion() {
    const { currentUser } = useAuth();
    const { userProfile, profileLoading: contextProfileLoading } = useUserProfile();
    const router = useRouter();

    const [companionProfile, setCompanionProfile] = useState<CompanionProfile | null>(null);
    const [localLoading, setLocalLoading] = useState<boolean>(USE_DUMMY_DATA);

    const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [timeMode, setTimeMode] = useState<"standard" | "full_day">("standard");
    const [startHour, setStartHour] = useState("12");
    const [startMinute, setStartMinute] = useState("00");
    const [endHour, setEndHour] = useState("14");
    const [endMinute, setEndMinute] = useState("00");
    const [acceptedGender, setAcceptedGender] = useState<string>("");
    const [selectedActivities, setSelectedActivities] = useState<string[]>([]);

    useEffect(() => {
        if (USE_DUMMY_DATA) {
            setLocalLoading(true);
            const timer = setTimeout(() => {
                setCompanionProfile(DUMMY_COMPANION_PROFILE);
                setLocalLoading(false);
            }, 1000);
            return () => clearTimeout(timer);
        } else {
            setCompanionProfile(null);
            setLocalLoading(false);
        }
    }, [currentUser]);

    const profileLoading = USE_DUMMY_DATA ? localLoading : contextProfileLoading;
    const finalCompanionProfile = USE_DUMMY_DATA ? companionProfile : (userProfile as CompanionProfile | null);

    useEffect(() => {
        if (finalCompanionProfile) {
            const days = finalCompanionProfile.schedule?.days || [];
            setSelectedDays(days);

            const timeTuple = finalCompanionProfile.schedule?.time;
            if (timeTuple && timeTuple.length === 2) {
                const startMins = timeTuple[0];
                const endMins = timeTuple[1];

                if (startMins === 0 && endMins === 1439) {
                    setTimeMode("full_day");
                } else {
                    setTimeMode("standard");
                    const startH = Math.floor(startMins / 60);
                    const startM = startMins % 60;
                    const endH = Math.floor(endMins / 60);
                    const endM = endMins % 60;

                    setStartHour(String(startH).padStart(2, "0"));
                    setStartMinute(String(startM).padStart(2, "0"));
                    setEndHour(String(endH).padStart(2, "0"));
                    setEndMinute(String(endM).padStart(2, "0"));
                }
            } else {
                setTimeMode("standard");
                setStartHour("12");
                setStartMinute("00");
                setEndHour("14");
                setEndMinute("00");
            }

            const docData = finalCompanionProfile as any;
            setAcceptedGender(docData.accepted_gender || "");

            setSelectedActivities(finalCompanionProfile.preference_activity_companion || []);
        }
    }, [finalCompanionProfile]);

    const handlePresetSelect = (preset: string) => {
        setSelectedPreset(preset);
        if (preset === "weekdays") {
            setSelectedDays(["Senin", "Selasa", "Rabu", "Kamis", "Jumat"]);
        } else if (preset === "weekend") {
            setSelectedDays(["Sabtu", "Minggu"]);
        } else if (preset === "semua") {
            setSelectedDays(["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"]);
        }
    };

    const handleResetDays = () => {
        setSelectedPreset(null);
        setSelectedDays([]);
    };

    const toggleDay = (day: string) => {
        setSelectedPreset(null);
        if (selectedDays.includes(day)) {
            setSelectedDays(selectedDays.filter((d) => d !== day));
        } else {
            setSelectedDays([...selectedDays, day]);
        }
    };

    const toggleActivity = (activity: string) => {
        const lowerActivity = activity.toLowerCase();
        if (selectedActivities.includes(lowerActivity)) {
            setSelectedActivities(selectedActivities.filter((act) => act !== lowerActivity));
        } else {
            setSelectedActivities([...selectedActivities, lowerActivity]);
        }
    };

    const handleSave = async () => {
        if (selectedDays.length === 0) {
            Alert.alert("Perhatian", "Silakan pilih setidaknya satu hari ketersediaan.");
            return;
        }

        if (!acceptedGender) {
            Alert.alert("Perhatian", "Silakan pilih Gender yang Diterima.");
            return;
        }

        let startMins = 0;
        let endMins = 1439;

        if (timeMode === "standard") {
            const sh = parseInt(startHour, 10);
            const sm = parseInt(startMinute, 10);
            const eh = parseInt(endHour, 10);
            const em = parseInt(endMinute, 10);

            if (isNaN(sh) || isNaN(sm) || isNaN(eh) || isNaN(em) || sh > 23 || sm > 59 || eh > 23 || em > 59) {
                Alert.alert("Perhatian", "Format jam/menit tidak valid.");
                return;
            }

            startMins = sh * 60 + sm;
            endMins = eh * 60 + em;

            if (startMins >= endMins) {
                Alert.alert("Perhatian", "Waktu berakhir harus setelah waktu mulai.");
                return;
            }
        }

        const timeTuple: [number, number] = [startMins, endMins];

        if (!USE_DUMMY_DATA && currentUser?.uid) {
            try {
                await CompanionRepository.updateCompanionProfile(currentUser.uid, {
                    schedule: {
                        days: selectedDays,
                        time: timeTuple,
                    },
                    preference_activity_companion: selectedActivities,
                    // Storing accepted_gender dynamically since it is not in the base model
                    ...({ accepted_gender: acceptedGender } as any),
                });
            } catch (error) {
                console.error("Error saving activities profile:", error);
                Alert.alert("Gagal", "Gagal menyimpan data.");
                return;
            }
        }

        Alert.alert("Sukses", "Ketersediaan dan aktivitas berhasil disimpan!");
        router.back();
    };

    return {
        profileLoading,
        selectedPreset,
        selectedDays,
        timeMode,
        setTimeMode,
        startHour,
        setStartHour,
        startMinute,
        setStartMinute,
        endHour,
        setEndHour,
        endMinute,
        setEndMinute,
        acceptedGender,
        setAcceptedGender,
        selectedActivities,
        handlePresetSelect,
        toggleDay,
        toggleActivity,
        handleResetDays,
        handleSave,
    };
}
