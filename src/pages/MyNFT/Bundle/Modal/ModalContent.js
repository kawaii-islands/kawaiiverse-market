import { useState } from "react";
import tagIcon from "src/assets/icons/tag.svg";
import styles from "./ModalContent.module.scss";
import cn from "classnames/bind";
import { CloseOutlined } from "@ant-design/icons";
import exchangeIcon from "src/assets/icons/exchange.svg";
import { Button } from "@mui/material";
const cx = cn.bind(styles);
const ModalContent = ({}) => {
    const [tab, setTab] = useState(1);
    return (
        <div className={cx("content")}>
            <CloseOutlined />
            <div className={cx("header")}>
                <img src={tagIcon} />
                <span>Sell bundle of 12</span>
            </div>
            <div className={cx("tabs")}>
                <div onClick={() => setTab(1)} className={cx(tab === 1 && "tabs--active")}>
                    Fixed price
                </div>
                <div onClick={() => setTab(2)} className={cx(tab === 2 && "tabs--active")}>
                    Auction
                </div>
            </div>
            <div className={cx("tab-content")}>
                {tab === 1 && <><div className={cx("row")}>
                    <span>Amount</span>
                    <div className={cx("row-right")}>
                        <div>100</div>
                    </div>
                </div>
                <div className={cx("row")}>
                    <span>Sell at</span>
                    <div className={cx("row-right")}>
                        <input type="number" />
                        <span>KWT</span>
                    </div>
                </div>
                <div className={cx("row2")}>
                    <span>
                        <img src={exchangeIcon} />
                    </span>
                    <div>$1000</div>
                </div>
                <div  className={cx("row2")}>You will receive 1000 KWT ($1000) after</div>
                <Button className={cx("confirm-btn")}>
                    <img src={tagIcon} />
                    <span>Confirm</span>
                </Button></>}
                {tab === 2 && <><div className={cx("row")}>
                    <span>Amount</span>
                    <div className={cx("row-right")}>
                        <div>100</div>
                    </div>
                </div>
                <div className={cx("row")}>
                    <span>Start price</span>
                    <div className={cx("row-right")}>
                        <input type="number" />
                        <span>KWT</span>
                    </div>
                </div>
                <div className={cx("row2")}>
                    <span>
                        <img src={exchangeIcon} />
                    </span>
                    <div>$1000</div>
                </div>
                <div className={cx("row")}>
                    <span>End price</span>
                    <div className={cx("row-right")}>
                        <input type="number" />
                        <span>KWT</span>
                    </div>
                </div>
                <div className={cx("row2")}>
                    <span>
                        <img src={exchangeIcon} />
                    </span>
                    <div>$1000</div>
                </div>
                <div className={cx("row")}>
                    <span>Duration</span>
                    <div className={cx("row-right")}>
                        <input type="number" />
                        <span>KWT</span>
                    </div>
                </div>
                <div className={cx("row2")}>
                    <span>
                        <img src={exchangeIcon} />
                    </span>
                    <div>$1000</div>
                </div>
                <div  className={cx("row2")}>You will receive 1000 KWT ($1000) after</div>
                <Button className={cx("confirm-btn")}>
                    <img src={tagIcon} />
                    <span>Confirm</span>
                </Button></>}
            </div>
        </div>
    );
};
export default ModalContent;
