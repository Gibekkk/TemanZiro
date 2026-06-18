import { useAuth } from "@/controllers/hooks/useAuth";
import CheckInButton from "@/views/components/CheckInBtn/checkinbtn";

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

  const isUser = role !== "companion";
  const mode = isUser ? "camera" : "qr";
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