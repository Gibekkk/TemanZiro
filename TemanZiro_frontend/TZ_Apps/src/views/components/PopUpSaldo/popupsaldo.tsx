import style from './popupsaldo.module.css';

interface PopUpSaldoProps {
    saldoKurang: number;
    onCancel: () => void;
    onTopUp: () => void;
}

export default function PopUpSaldo(props: PopUpSaldoProps) {

    const handleCancel = () => {
        props.onCancel();
    };

    const handleTopUp = () => {
        props.onTopUp();
    };

    return (
        <div className={style.modalOverlay} onClick={props.onCancel}>
            <div className={style.modalContent} onClick={(e) => e.stopPropagation()}>
                <h3>Saldo Tidak Cukup</h3>
                <p>Saldo Anda kurang sebesar <strong>Rp {props.saldoKurang.toLocaleString()}</strong>.</p>
                
                <div className={style.buttonGroup}>
                    <button className={style.btnCancel} onClick={handleCancel}>
                        Cancel
                    </button>
                    <button className={style.btnTopUp} onClick={handleTopUp}>
                        Top Up
                    </button>
                </div>
            </div>
        </div>
    );
}
