import OnboardingLayout from '@/views/layouts/OnboardingLayout/onboardinglayout';
import OnboardingContent from '@/views/components/OnBoardingScreen/onboarding';
import imgSS from '@/assets/image/splashscreen2.svg';
import styles from './onboarding_page.module.css';
import { useNavigate } from 'react-router-dom';

export default function OnBoarding2Page() {
  const navigate = useNavigate();
  const handleNext = () => {
    console.log("Pindah ke halaman ke Onboarding 3");
    navigate('/onboarding-3');
  };

  return (
    <OnboardingLayout>
        <OnboardingContent 
          image={imgSS}
          title={
        <>
          <span className={styles.textHighlight}>Bebas Canggung</span>, <span className={styles.textHighlight}>Nambah Teman Baru!</span>
        </>
      }
          description="Sama-sama cari teman, jadi nggak perlu malu! Ziro akan bantu pastikan kamu ketemu dengan komunitas yang sefrekuensi, aman, dan super ramah. Yuk, mulai obrolan pertamamu!"
          buttonText="Lanjutkan"
          onButtonClick={handleNext}
        />
    </OnboardingLayout>
  );
}