import "./FrientList.css";
import { companion_profile } from "@/models/types/companion";
import IMGMiniZiro from "@/assets/image/mini-ziro.svg";

interface FriendListProps {
    friendsData: companion_profile[];
    isLoading: boolean;
}

export default function FriendList({ friendsData, isLoading }: FriendListProps) {

    return (
        <div className="friend-list-container">
            {isLoading ? (
                <div className="loading-text">
                    Memuat daftar teman
                </div>
            ) : friendsData.length === 0 ? (
                <div className="loading-text">
                    Belum ada teman aktif
                </div>
            ) : (
                friendsData.map((friend, index) => (
                    <div key={index} className="friend-item">
                        <div className="avatar-wrapper">
                            <img
                                src={friend.url_photoprofile_companion || IMGMiniZiro}
                                alt={friend.name_companion}
                                className="friend-avatar"
                                onError={(e) => { (e.currentTarget as HTMLImageElement).src = IMGMiniZiro; }}
                            />
                            {friend.is_online_companion && <div className="online-indicator"></div>}
                        </div>
                        <span className="friend-name">{friend.name_companion}</span>
                    </div>
                ))
            )}
        </div>
    )
}
