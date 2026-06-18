import style from "./successpay_page.module.css";
import PaySuccess from "@/assets/image/paysucces.svg";
import DataScreenLayout from "@/views/layouts/DataScreen/datascreenlayout";
import Button from "@/views/components/OrangeButton/orangebutton";
import OkZiro from "@/assets/image/okziro.svg";

export default function SuccesPaymentPage() {
  return (
    <DataScreenLayout title="Pembayaran Berhasil">
      <div className={style.page}>
        <div className={style.img}>
          <img src={OkZiro} alt="" className={style.ziro} />
          <img src={PaySuccess} alt="" className={style.pay} />
        </div>
        <h2 className={style.status}>Pembayaran Berhasil</h2>
        <p className={style.content}>
          Yeay! Ziro berhasil nemuin teman baru nih buat kamu. Selamat
          seru-seruan bareng, yaa!
        </p>
        <Button variant="primary">
          Pindah ke Histori Booking
        </Button>
      </div>
    </DataScreenLayout>
  );
}
