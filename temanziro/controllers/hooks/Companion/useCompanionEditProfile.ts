import { useEffect, useState } from "react";
import { useAuth } from "@/controllers/hooks/useAuth";
import { useUserProfile } from "@/controllers/hooks/useUserProfile";
import { CompanionProfile } from "@/domain/models/CompanionModel";
import { useRouter } from "expo-router";
import { Gender } from "@/constants/UserDetails";
import {
    USE_DUMMY_DATA,
    DUMMY_COMPANION_PROFILE,
} from "@/constants/Config";
import { CompanionRepository } from "@/data/repositories/CompanionRepository";
import { Alert } from "react-native";

export function useCompanionEditProfile() {
    const { currentUser } = useAuth();
    const { userProfile, profileLoading: contextProfileLoading } = useUserProfile();
    const router = useRouter();

    const [companionProfile, setCompanionProfile] = useState<CompanionProfile | null>(null);
    const [localLoading, setLocalLoading] = useState<boolean>(USE_DUMMY_DATA);

    const [name, setName] = useState("");
    const [gender, setGender] = useState<Gender>("rahasia");
    const [age, setAge] = useState("");
    const [location, setLocation] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [cityError, setCityError] = useState("");
    const [philosophy, setPhilosophy] = useState("");
    const [interests, setInterests] = useState<string[]>([]);
    const [persona, setPersona] = useState<string[]>([]);
    const [selectedTime, setSelectedTime] = useState<string>("");
    const [selectedDays, setSelectedDays] = useState<string[]>([]);

    const cities = ["Jakarta", "Surabaya", "Makassar", "Bandung"];

    const handleCityChange = (val: string) => {
        setSelectedCity(val);
        setCityError("");
    };

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
            setName(finalCompanionProfile.name_companion || "");
            setGender((finalCompanionProfile.gender_companion || "rahasia") as Gender);
            setAge(finalCompanionProfile.age_companion ? String(finalCompanionProfile.age_companion) : "");
            setLocation(finalCompanionProfile.address_companion || "");
            setPhilosophy(finalCompanionProfile.philosophy_companion || "");
            setInterests(finalCompanionProfile.preference_activity_companion || []);
            setPersona(finalCompanionProfile.preference_companion || []);
            setSelectedCity(finalCompanionProfile.city_companion || "");
            setSelectedTime(finalCompanionProfile.schedule?.time ? `${finalCompanionProfile.schedule.time[0]}-${finalCompanionProfile.schedule.time[1]}` : "");
            setSelectedDays(finalCompanionProfile.schedule?.days || []);
        }
    }, [finalCompanionProfile]);

    const parseTimeToMinutes = (timeStr: string): [number, number] | null => {
        if (!timeStr) return null;
        const parts = timeStr.split("-");
        if (parts.length !== 2) return null;

        const parsePart = (part: string) => {
            const [h, m] = part.split(":").map(Number);
            return h * 60 + m;
        };

        return [parsePart(parts[0]), parsePart(parts[1])];
    };

    const handleSave = async () => {
        // if (!currentUser?.uid) return;
        // try {
        //     const timeTuple = parseTimeToMinutes(selectedTime);

        //     await CompanionRepository.updateCompanionProfile(currentUser.uid, {
        //         name_companion: name,
        //         gender_companion: gender,
        //         age_companion: Number(age) || 0,
        //         address_companion: location,
        //         city_companion: selectedCity,
        //         philosophy_companion: philosophy,
        //         preference_activity_companion: interests,
        //         preference_companion: persona,
        //         schedule: {
        //             days: selectedDays,
        //             time: timeTuple,
        //         },
        //     });
            Alert.alert("Sukses", "Profil berhasil diperbarui!");
            router.back();
        // } catch (error) {
        //     console.error("Error updating profile:", error);
        //     Alert.alert("Gagal", "Gagal memperbarui profil.");
        // }
    };

    return {
        companionProfile,
        profileLoading,
        name, setName,
        gender, setGender,
        age, setAge,
        location, setLocation,
        selectedCity,
        cityError,
        philosophy, setPhilosophy,
        interests, setInterests,
        persona, setPersona,
        selectedTime, setSelectedTime,
        selectedDays, setSelectedDays,
        cities,
        handleCityChange,
        handleSave,
    };
}