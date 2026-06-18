import React from 'react';
import style from './navbar.module.css';

import IconHome from '@/assets/icon/home.svg';
import IconHomeActive from '@/assets/icon/home-active.svg';
import IconPesan from '@/assets/icon/chat.svg';
import IconPesanActive from '@/assets/icon/chat-active.svg';
import IconFriends from '@/assets/icon/friendsnon.svg';
import IconFriendsActive from '@/assets/icon/friendswhite.svg';
import IconProfil from '@/assets/icon/profil.svg';
import IconProfilActive from '@/assets/icon/profil-active.svg';
import { NavLink } from 'react-router-dom';

// 1. Buat Interface untuk menerima Role
interface BottomNavbarProps {
  role: 'user' | 'companion';
}

export default function BottomNavbar({ role }: BottomNavbarProps) {
  
  // 2. Atur path secara dinamis berdasarkan role
  const navItems = [
    { 
      id: 'Home',
      path: role === 'user' ? '/dashboard' : '/companion-dashboard', 
      label: 'Home', 
      imgInactive: IconHome, 
      imgActive: IconHomeActive 
    },
    { 
      id: 'Pesan', 
      path: '/list-chat',
      label: 'Pesan', 
      imgInactive: IconPesan, 
      imgActive: IconPesanActive 
    },
    { 
      id: 'Friends', 
      path: '/friends-page',
      label: 'Friends', 
      imgInactive: IconFriends, 
      imgActive: IconFriendsActive 
    },
    { 
      id: 'Profil', 
      // Jika role-nya 'user', ke /profile. Jika bukan, ke /profile-companion
      path: role === 'user' ? '/profile' : '/profile-companion', 
      label: 'Profil', 
      imgInactive: IconProfil, 
      imgActive: IconProfilActive 
    },
  ];

  return (
    <nav className={style.navbar}>
      {navItems.map((item) => {
        return (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) => 
              `${style.navItem} ${isActive ? style.navItemActive : ''}`
            }
          >
            {({ isActive }) => (
              <>
                <img 
                  src={isActive ? item.imgActive : item.imgInactive} 
                  alt={item.label} 
                  className={style.navIconImage} 
                />
                <span className={isActive ? style.navTextActive : style.navText}>
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}