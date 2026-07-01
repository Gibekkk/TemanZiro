import React from "react";
import SecondaryLayout from "@/views/layouts/SecondaryLayout/SecondaryLayout";
import { View, Text, TextInput } from "react-native";
import styles from "./EditProfileCompanion.style";
import ProfilePicture from "@/views/components/ProfilePicture/ProfilePicture";
import GenderSelector from "@/views/components/GenderSelector/GenderSelector";
import { useCompanionEditProfile } from "@/controllers/hooks/Companion/useCompanionEditProfile";
import LocationCard from "@/views/components/LocationCard/LocationCard";
import AddressInput from "@/views/components/AddressInput/AddressInput";
import InterestSelector from "@/views/components/InterestSelector/InterestSelector";
import PersonaSelector from "@/views/components/PersonaSelector/PersonaSelector";

import IconUser from "@/assets/icon/profil.svg";
import IconAge from "@/assets/icon/date-non.svg";
import TimeSelector from "@/views/components/TimeSelector/TimeSelector";
import TimeSelection from "@/views/components/TimePicker/TimePicker";
import GeneralButton from "@/views/components/GeneralButton/GeneralButton";

export default function EditProfileCompanion() {
    const {
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
    } = useCompanionEditProfile();

    return (
        <SecondaryLayout title="Edit Profile">
            {/* Profile Avatar Section */}
            <View style={styles.profileSection}>
                <View style={styles.avatarWrapper}>
                    <ProfilePicture
                        uri={companionProfile?.url_photoprofile_companion}
                        profileLoading={profileLoading}
                        showCameraIcon={true}
                        onImageSelected={(uri) => {
                            console.log("Selected image uri:", uri);
                        }}
                    />
                </View>
            </View>

            {/* Form Section */}
            <View>
                {/* Nama Lengkap Card */}
                <View style={styles.card}>
                    <Text style={styles.label}>Nama Lengkap</Text>
                    <View style={styles.inputContainerRow}>
                        <IconUser width={20} height={20} style={styles.inputIcon} />
                        <TextInput
                            style={styles.bottomBorderInput}
                            value={name}
                            onChangeText={setName}
                            placeholder="Nama Lengkap"
                            placeholderTextColor="#94a3b8"
                        />
                    </View>
                </View>

                {/* Jenis Kelamin Card */}
                <View style={styles.card}>
                    <Text style={styles.label}>Jenis Kelamin</Text>
                    <GenderSelector
                        value={gender}
                        onChange={(newGender) => {
                            setGender(newGender);
                            console.log("Selected gender:", newGender);
                        }}
                    />
                </View>

                {/* Umur Card */}
                <View style={styles.card}>
                    <Text style={styles.label}>Umur</Text>
                    <View style={styles.inputContainerRow}>
                        <IconAge width={18} height={18} style={styles.inputIcon} />
                        <TextInput
                            style={styles.bottomBorderInput}
                            value={age}
                            onChangeText={setAge}
                            placeholder="Umur"
                            keyboardType="numeric"
                            placeholderTextColor="#94a3b8"
                        />
                    </View>
                </View>

                {/* Lokasi Card */}
                <View style={styles.card}>
                    <Text style={styles.label}>Lokasi (Alamat)</Text>
                    <AddressInput
                        value={location}
                        onChangeText={setLocation}
                    />
                </View>

                {/* City */}
                <LocationCard
                    title="Kotamu"
                    label="Dimana kamu tinggal?"
                    cities={cities}
                    value={selectedCity}
                    onValueChange={handleCityChange}
                />
                {!!cityError && (
                    <Text style={styles.errorText}>{cityError}</Text>
                )}

                {/* Philosophy */}
                <View style={styles.card}>
                    <Text style={styles.label}>Filosofi Hidup</Text>
                    <View style={styles.inputContainerRow}>
                        <TextInput
                            style={styles.bottomBorderInput}
                            value={philosophy}
                            onChangeText={setPhilosophy}
                            placeholder="Filosofi hidup kamu"
                            placeholderTextColor="#94a3b8"
                            multiline={true}
                            numberOfLines={4}
                            textAlignVertical="top"
                        />
                    </View>
                </View>

                {/* Interest Activity */}
                <InterestSelector
                    value={interests}
                    onChange={setInterests}
                    showHeader={true}
                />

                {/* Karakter Persona Card */}
                <PersonaSelector
                    value={persona}
                    onMinatChange={setPersona}
                    showHeader={true}
                />

                <TimeSelector
                    value={selectedDays}
                    onValueChange={setSelectedDays}
                />
                <TimeSelection
                    value={selectedTime}
                    onTimeChange={(data) => {
                        setSelectedTime(data.mode === "fullday" ? "00:00-23:59" : `${data.startTime}-${data.endTime}`);
                    }}
                />

                <GeneralButton
                    variant="primary"
                    style={styles.button}
                    onClick={handleSave}
                >
                    Simpan
                </GeneralButton>
            </View>
        </SecondaryLayout>
    )
}