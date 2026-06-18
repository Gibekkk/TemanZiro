

export default function CallButton() {
  const openDialer = () => {
    const phoneNumber = "112";
    window.location.href = `tel:${phoneNumber}`;
  };

  return (
    <button onClick={openDialer}>
      Hubungi Darurat
    </button>
  );
}