import style from "./progressbar.module.css";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  title: string;
}

export default function ProgressBar({ currentStep, totalSteps, title }: ProgressBarProps) {
  // Hitung persentase lebar bar
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className={style.container}>
      <div className={style.textWrapper}>
        <span className={style.title}>{title}</span>
        <span className={style.stepInfo}>
          {currentStep} dari {totalSteps}
        </span>
      </div>
      <div className={style.barBackground}>
        <div 
          className={style.barFill} 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
}