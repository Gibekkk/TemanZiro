import OnboardingLayout from '@/views/layouts/OnboardingLayout/onboardinglayout';
import OnboardingContent from '@/views/components/OnBoardingScreen/onboarding';
import imgSS from '@/assets/image/splashscreen3.svg';
import styles from './onboarding_page.module.css';
import { useNavigate } from 'react-router-dom';

export default function OnBoarding3Page() {
  const navigate = useNavigate();
  const handleNext = () => {
    console.log("Pindah ke halaman login/register");
    navigate('/login');
  };

  return (
    <OnboardingLayout>
        <OnboardingContent 
          image={imgSS}
          title={
        <>
          Bikin Tiap <span className={styles.textHighlight}>Aktivitas Makin Seru!</span>
        </>
      }
          description="Dari ngopi sore, mabar game, sampai olahraga bareng. Apapun hobi dan rencanamu hari ini, bakal jauh lebih pecah dan asyik kalau ada teman seru yang nemenin!"
          buttonText="Lanjutkan"
          onButtonClick={handleNext}
        />
    </OnboardingLayout>
  );
}