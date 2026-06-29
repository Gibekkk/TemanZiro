import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { useTheme } from '@/controllers/hooks/useTheme';
// Nanti kamu bisa import icon beneran di sini, misalnya:
// import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
    const { theme } = useTheme();
  return (
    <Tabs
      screenOptions={{
        // ==========================================
        // 1. TEMPAT ATUR STYLE GLOBAL TAB BAR
        // ==========================================
        tabBarStyle: {
          backgroundColor: `${theme.colors.secondary}40`, 
          borderTopWidth: 1,       
          borderTopColor: '#e5e5e5', 
          height: 100,                
          paddingBottom: 10,      
          paddingTop: 5,           
          // elevation: 5,         
          // shadowColor: '#000',   
        },
        tabBarActiveTintColor: `${theme.colors.lightText}`,  
        tabBarInactiveTintColor: '#8E8E93',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false, // Sembunyikan header bawaan jika ingin buat custom header di tiap screen
      }}
    >
      {/* ========================================== */}
      {/* 2. DAFTAR TABS & TEMPAT ATUR ICON MASING-MASING */}
      {/* ========================================== */}
      
      <Tabs.Screen
        name="(dashboard)"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, focused }) => (
            // Placeholder Icon (Ganti dengan komponen Icon kamu)
            // Contoh: <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
            <View style={{ width: 24, height: 24, backgroundColor: `${theme.colors.lightText}`, borderRadius: 12 }} />
          ),
        }}
      />

      <Tabs.Screen
        name="(temanjalan)"
        options={{
          title: 'Teman Jalan',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ width: 24, height: 24, backgroundColor: color, borderRadius: 12 }} />
          ),
        }}
      />

      <Tabs.Screen
        name="(chat)"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ width: 24, height: 24, backgroundColor: color, borderRadius: 12 }} />
          ),
        }}
      />

      <Tabs.Screen
        name="(profile)"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ width: 24, height: 24, backgroundColor: color, borderRadius: 12 }} />
          ),
        }}
      />
    </Tabs>
  );
}