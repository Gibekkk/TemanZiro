import React from "react";
import { useAuth } from "@/controllers/hooks/useAuth";
import CheckInButton from "./CheckInButton";

interface CheckInActionProps {
  bookingId: string;
  targetName?: string;
  isDisabled?: boolean;
}

export default function CheckInAction({
  bookingId,
  targetName,
  isDisabled = false,
}: CheckInActionProps) {
  const { role } = useAuth();

  // Menentukan mode dan teks tombol berdasarkan role
  const isUser = role !== "companion";
  const mode: "camera" | "qr" = isUser ? "camera" : "qr";
  const buttonText = isUser ? "Check In Now" : "Generate QR Code";

  return (
    <CheckInButton
      mode={mode}
      payload={bookingId}
      buttonText={buttonText}
      targetName={targetName}
      isDisabled={isDisabled}
    />
  );
}
