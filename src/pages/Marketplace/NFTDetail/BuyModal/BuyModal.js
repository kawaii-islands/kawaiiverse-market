import { useState, useEffect } from "react";
import styles from "./BuyModal.module.scss";
import cn from "classnames/bind";
import Modal from "react-bootstrap/Modal";
import LoadingModal from "src/components/LoadingModal2/LoadingModal";
import tagIcon from "src/assets/icons/tag.svg";
import { Input, Tooltip, InputAdornment } from "@material-ui/core";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Button } from "@mui/material";
import { toast } from "react-toastify";
import { useWeb3React } from "@web3-react/core";
import { read, createNetworkOrSwitch, write } from "src/services/web3";
import { KAWAII_TOKEN_ADDRESS, MARKETPLACE_ADDRESS } from "src/consts/address";
import * as web3 from "web3";
import { BSC_CHAIN_ID } from "src/consts/blockchain";
import KWTtoken from "src/assets/icons/KWTtoken.svg";
import defaultImage from "src/assets/icons/default_image.svg";
import tagPriceSmall from "src/assets/icons/tagPriceSmall.svg";
import axios from "axios";
import { floorFormat } from "src/utils/formatNumber";

import KAWAII_TOKEN_ABI from "src/utils/abi/KawaiiToken.json";
import MARKETPLACE_ABI from "src/utils/abi/KawaiiMarketplace.json";

const cx = cn.bind(styles);
const BuyModal = ({ openBuy, setOpenBuy }) => {
    const [showModalLoading, setShowModalLoading] = useState(false);
    const [stepLoading, setStepLoading] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hash, setHash] = useState();
    const [auctionId, setAuctionId] = useState();
    const [kwtPrice, setKwtPrice] = useState(0);
    const price = 1000;

    const context = useWeb3React();
    const { account, chainId, library } = context;

    useEffect(() => {
        getAuctionId();
        getKwtPrice();
    }, []);

    const getUserAllowance = async () => {
        const userAllowance = await read("allowance", BSC_CHAIN_ID, KAWAII_TOKEN_ADDRESS, KAWAII_TOKEN_ABI, [
            account,
            MARKETPLACE_ADDRESS,
        ]);
        return userAllowance;
    };

    const checkAllowance = async () => {
        console.log("check allowance");
        const userAllowance = await getUserAllowance();
        console.log(web3.utils.fromWei(userAllowance.toString()));
        console.log(" " + price);
        if (price > web3.utils.fromWei(userAllowance.toString())) approve(price.toString());
    };

    const getKwtPrice = async () => {
        try {
            const res = await axios.get(
                "https://api.coingecko.com/api/v3/simple/price?ids=kawaii-islands&vs_currencies=usd",
            );
            if (res.status === 200) {
                setKwtPrice(res.data["kawaii-islands"]?.usd);
            }
        } catch (error) {
            toast.error(error);
            console.log(error);
        }
    };

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
            console.log(auctionId - 1, web3.utils.toWei("2"));
            if (chainId !== BSC_CHAIN_ID) {
                const error = await createNetworkOrSwitch(library.provider);
                if (error) {
                    throw new Error("Please change network to Binance smart chain!");
                }
            }
            // await approve();
            await checkAllowance();

            await write(
                "bid",
                library.provider,
                MARKETPLACE_ADDRESS,
                MARKETPLACE_ABI,
                [auctionId - 1, web3.utils.toWei(price.toString())],
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
        const auction = await read("auctionId", BSC_CHAIN_ID, MARKETPLACE_ADDRESS, MARKETPLACE_ABI, []);
        setAuctionId(auction);
    };

    const approve = async amount => {
        await write(
            "approve",
            library.provider,
            KAWAII_TOKEN_ADDRESS,
            KAWAII_TOKEN_ABI,
            [MARKETPLACE_ADDRESS, web3.utils.toWei(amount)],
            {
                from: account,
            },
        );
    };

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

            <Modal show={openBuy} onHide={() => setOpenBuy(false)} dialogClassName={cx("modal-box")} centered>
                <Modal.Body className={cx("modal-body")}>
                    <div className={cx("header")}>
                        <div className={cx("left")}>
                            <img src={tagIcon} alt="tag-price" />
                            <span className={cx("text")}>Buy item</span>
                        </div>

                        <CloseRoundedIcon className={cx("right")} onClick={() => setOpenBuy(false)} />
                    </div>

                    <div className={cx("body")}>
                        <div className={cx("body-left")}>
                            <img src={defaultImage} alt="icon" className={cx("image")} />
                            <div className={cx("id")}>ID: #{auctionId - 1}</div>
                        </div>
                        <div className={cx("body-right")}>
                            <div className={cx("one-field")}>
                                <div className={cx("title")}>Price/NFT:</div>
                                <div className={cx("value")}>
                                    <span className={cx("kwt-token")}>
                                        <img src={KWTtoken} alt="kwt-token" />
                                        <span>&nbsp;2</span>
                                    </span>
                                    <span>${floorFormat(kwtPrice, 4)}</span>
                                </div>
                            </div>

                            <div className={cx("one-field")}>
                                <div className={cx("title")}>Amount:</div>
                                <div className={cx("value")} style={{ fontWeight: "600" }}>
                                    <span>2</span>
                                </div>
                            </div>

                            <div className={cx("one-field")}>
                                <div className={cx("title")}>Total price:</div>
                                <div className={cx("value")} style={{ fontWeight: "600" }}>
                                    <span className={cx("kwt-token")}>
                                        <img src={KWTtoken} alt="kwt-token" />
                                        <span>&nbsp; 123</span>
                                    </span>
                                    <span>${floorFormat(kwtPrice * 2, 4)}</span>
                                </div>
                            </div>

                            <Button className={cx("button")} onClick={submit}>
                                <img src={tagPriceSmall} alt="tag-price" />
                                &nbsp; &nbsp; Buy
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};
export default BuyModal;
