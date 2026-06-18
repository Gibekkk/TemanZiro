import "./UserProfile.css";
import { useAuth } from "@/controllers/hooks/useAuth";
import IMGMiniZiro from "@/assets/image/mini-ziro.svg";
import { useNavigate } from "react-router-dom";

export default function UserProfile() {
    const { userProfile, loading, role } = useAuth();
    const navigate = useNavigate();

    const handleTapProfile = () => {
        navigate("/profile");
    }

    const displayName = role === "companion" ? userProfile?.name_companion : userProfile?.name_user || "TemanZiro";
    const photoUrl = (role === "companion" ? userProfile?.url_photoprofile_companion : userProfile?.url_photoprofile_user) || IMGMiniZiro;

    return (
        <div className="user-avatar-wrapper">
            <img
                src={loading ? IMGMiniZiro : photoUrl}
                alt={displayName}
                className="user-avatar-image"
                onError={(event) => {
                    event.currentTarget.src = IMGMiniZiro;
                }}
                onClick={() => {
                    handleTapProfile();
                }}
            />
        </div>
    )
}