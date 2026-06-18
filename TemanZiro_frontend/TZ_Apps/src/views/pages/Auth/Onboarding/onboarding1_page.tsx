import OnboardingLayout from '@/views/layouts/OnboardingLayout/onboardinglayout';
import OnboardingContent from '@/views/components/OnBoardingScreen/onboarding';
import imgSS from '@/assets/image/splashscreen1.svg';
import styles from './onboarding_page.module.css';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '@/controllers/hooks/useAuth';

export default function OnBoarding1Page() {
  const navigate = useNavigate();
  const { currentUser, role } = useAuth();
  const handleNext = () => {
    console.log("Pindah ke halaman ke Onboarding 2");
    navigate('/onboarding-2');
  };

  useEffect(() => {
    if (currentUser) {
      navigate(role === "companion" ? "/companion-dashboard" : "/dashboard");
      return;
    }
  }, []);

  return (
    <OnboardingLayout>
      <OnboardingContent
        image={imgSS}
        title={
          <>
            Temukan <span className={styles.textHighlight}>Teman Jalan</span> di <span className={styles.textHighlight}>Sekitarmu!</span>
          </>
        }
        description="Nggak perlu jauh-jauh cari teman main. TemanZiro bantu kamu nemuin partner aktivitas yang jaraknya paling dekat dari lokasimu sekarang. Langsung janjian, langsung berangkat!"
        buttonText="Mulai Sekarang"
        onButtonClick={handleNext}
      />
    </OnboardingLayout>
  );
}