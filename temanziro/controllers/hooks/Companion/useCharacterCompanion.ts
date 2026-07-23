import { useState, useEffect } from "react";
import { useAuth } from "@/controllers/hooks/useAuth";
import { useUserProfile } from "@/controllers/hooks/useUserProfile";
import { CompanionProfile } from "@/domain/models/CompanionModel";
import { useRouter } from "expo-router";
import { CompanionRepository } from "@/data/repositories/CompanionRepository";
import { Alert } from "react-native";
import { USE_DUMMY_DATA, DUMMY_COMPANION_PROFILE, DEFAULT_TRAITS } from "@/constants/Config";

export function useCharacterCompanion() {
    const { currentUser } = useAuth();
    const { userProfile, profileLoading: contextProfileLoading } = useUserProfile();
    const router = useRouter();

    const [companionProfile, setCompanionProfile] = useState<CompanionProfile | null>(null);
    const [localLoading, setLocalLoading] = useState<boolean>(USE_DUMMY_DATA);

    // Form States
    const [philosophy, setPhilosophy] = useState("");
    const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
    const [customTraits, setCustomTraits] = useState<string[]>([]);

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
            setPhilosophy(finalCompanionProfile.philosophy_companion || "");

            const savedTraits = finalCompanionProfile.preference_companion || [];
            setSelectedTraits(savedTraits);

            // Filter out default traits to find custom ones
            const custom = savedTraits.filter((trait) => !DEFAULT_TRAITS.includes(trait));
            setCustomTraits(custom);
        }
    }, [finalCompanionProfile]);

    const toggleTrait = (trait: string) => {
        if (selectedTraits.includes(trait)) {
            setSelectedTraits(selectedTraits.filter((t) => t !== trait));
        } else {
            setSelectedTraits([...selectedTraits, trait]);
        }
    };

    const addCustomTrait = (trait: string) => {
        const trimmed = trait.trim();
        if (!trimmed) return;

        // Check if already exists in either default or custom list
        const lowerList = [...DEFAULT_TRAITS, ...customTraits].map((t) => t.toLowerCase());
        if (lowerList.includes(trimmed.toLowerCase())) {
            Alert.alert("Perhatian", "Karakter tersebut sudah ada.");
            return;
        }

        setCustomTraits([...customTraits, trimmed]);
        setSelectedTraits([...selectedTraits, trimmed]);
    };

    const handleSave = async () => {
        if (!philosophy.trim()) {
            Alert.alert("Perhatian", "Silakan isi filosofi hidup Anda.");
            return;
        }

        if (selectedTraits.length === 0) {
            Alert.alert("Perhatian", "Silakan pilih setidaknya satu karakter.");
            return;
        }

        if (!USE_DUMMY_DATA && currentUser?.uid) {
            try {
                await CompanionRepository.updateCompanionProfile(currentUser.uid, {
                    philosophy_companion: philosophy,
                    preference_companion: selectedTraits,
                });
            } catch (error) {
                console.error("Error saving character profile:", error);
                Alert.alert("Gagal", "Gagal menyimpan data.");
                return;
            }
        }

        Alert.alert("Sukses", "Filosofi hidup dan karakter berhasil disimpan!");
        router.back();
    };

    return {
        profileLoading,
        philosophy,
        setPhilosophy,
        selectedTraits,
        customTraits,
        toggleTrait,
        addCustomTrait,
        handleSave,
    };
}
