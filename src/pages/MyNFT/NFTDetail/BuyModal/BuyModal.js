import { useState, useEffect } from "react";
import styles from "./BuyModal.module.scss";
import cn from "classnames/bind";
import Modal from "react-bootstrap/Modal";
import LoadingModal from "src/components/LoadingModal2/LoadingModal";
import tagIcon from "src/assets/icons/tag.svg";
import { Input, Tooltip, InputAdornment } from "@material-ui/core";
import { Button } from "@mui/material";
import { toast } from "react-toastify";
import { useWeb3React } from "@web3-react/core";
import { read, createNetworkOrSwitch, write } from "src/services/web3";
import { KAWAII_TOKEN_ADDRESS, MARKETPLACE_ADDRESS } from "src/consts/address";
import * as web3 from "web3";
import { BSC_CHAIN_ID } from "src/consts/blockchain";

import KAWAII_TOKEN_ABI from "src/utils/abi/KawaiiToken.json";
import MARKETPLACE_ABI from "src/utils/abi/KawaiiMarketplace.json";

const cx = cn.bind(styles);
const BuyModal = ({ openBuy, setOpenBuy }) => {
    const [showModalLoading, setShowModalLoading] = useState(false);
    const [stepLoading, setStepLoading] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hash, setHash] = useState();

    const context = useWeb3React();
    const { account, chainId, library } = context;

    const submit = async () => {
        if (!account) return;
        try {
            setLoading(true);
            setStepLoading(0);
            setShowModalLoading(true);
            const callback = hash => {
                setHash(hash);
                setStepLoading(1);
            };
            if (chainId !== BSC_CHAIN_ID) {
                const error = await createNetworkOrSwitch(library.provider);
                if (error) {
                    throw new Error("Please change network to Binance smart chain!");
                }
            }
            await approve();
            await write(
                "bid",
                library.provider,
                MARKETPLACE_ADDRESS,
                MARKETPLACE_ABI,
                [12, web3.utils.toWei("2")],
                {
                    from: account,
                },
                callback,
            );
            setStepLoading(2);
        } catch (error) {
            console.log(error);
            setStepLoading(3);
            toast.error(error.message || "An error occurred!");
        } finally {
            setLoading(false);
        }
    };

    const getAuctionId = async () => {
        return read("auctionId", BSC_CHAIN_ID, MARKETPLACE_ADDRESS, MARKETPLACE_ABI, []);
    };

    const approve = async () => {
        await write(
            "approve",
            library.provider,
            KAWAII_TOKEN_ADDRESS,
            KAWAII_TOKEN_ABI,
            [MARKETPLACE_ADDRESS, web3.utils.toWei("20")],
            {
                from: account,
            },
        );
    };

    // const purchase = async () => {
    //     await write("bid", library.provider, MARKETPLACE_ADDRESS, MARKETPLACE_ABI, [12, web3.utils.toWei("2")], {
    //         from: account,
    //     });
    // };

    return (
        <>
            {showModalLoading && (
                <LoadingModal
                    show={true}
                    network={"BscScan"}
                    loading={loading}
                    title={"Purchasing NFT"}
                    stepLoading={stepLoading}
                    onHide={() => {
                        setShowModalLoading(false);
                        setHash(null);
                        setStepLoading(0);
                    }}
                    hash={hash}
                    hideParent={() => setOpenBuy(false)}
                    notClose
                    notViewNft="true"
                />
            )}

            <Modal
                centered
                show={openBuy}
                onHide={() => setOpenBuy(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div className={cx("content")}>
                    <div className={cx("header")}>
                        <img src={tagIcon} alt="" />
                        <span>Buy NFT</span>
                    </div>
                    <div className={cx("tab-content")}>
                        <div className={cx("row")}>
                            <span>Amount</span>
                            <div className={cx("row-right")}>
                                <Input
                                    readOnly
                                    disableUnderline
                                    type="number"
                                    placeholder="0"
                                    className={cx("input")}
                                    value={2}
                                    min={0}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <div className={cx("unit")}>
                                                <img alt="" src={require("src/assets/icons/kwt.png").default} /> KWT
                                            </div>
                                        </InputAdornment>
                                    }
                                />
                            </div>
                        </div>
                        <div className={cx("row")}>
                            <span>Sell at</span>
                            <div className={cx("row-right")}>
                                <Input
                                    readOnly
                                    disableUnderline
                                    type="number"
                                    placeholder="0"
                                    className={cx("input")}
                                    value={2}
                                    min={0}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <div className={cx("unit")}>
                                                <img alt="" src={require("src/assets/icons/kwt.png").default} /> KWT
                                            </div>
                                        </InputAdornment>
                                    }
                                />
                            </div>
                        </div>
                        <Button className={cx("confirm-btn")} onClick={submit}>
                            <img src={tagIcon} />
                            <span>Confirm</span>
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};
export default BuyModal;
