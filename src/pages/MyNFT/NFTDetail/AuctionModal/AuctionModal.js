import { useState, useEffect } from "react";
import tagIcon from "src/assets/icons/tag.svg";
import styles from "./AuctionModal.module.scss";
import cn from "classnames/bind";
import { CloseOutlined } from "@ant-design/icons";
import exchangeIcon from "src/assets/icons/exchange.svg";
import { Button } from "@mui/material";
import Modal from "react-bootstrap/Modal";
import { Input, Tooltip, InputAdornment } from "@material-ui/core";
import { toast } from "react-toastify";
import { sign, read, createNetworkOrSwitch, write } from "src/services/web3";
import * as web3 from "web3";
import { useHistory } from "react-router";

import { BSC_CHAIN_ID } from "src/consts/blockchain";
// import FACTORY_ABI from "src/utils/abi/factory.json";
import NFT1155_ABI from "src/utils/abi/KawaiiverseNFT1155.json";
import { useWeb3React } from "@web3-react/core";
import { FACTORY_ADDRESS, MARKETPLACE_ADDRESS } from "src/consts/address";
import MARKETPLACE_ABI from "src/utils/abi/KawaiiMarketplace.json";
// import KAWAII_STORE_ABI from "src/utils/abi/KawaiiverseStore.json";
// import { KAWAIIVERSE_STORE_ADDRESS } from "src/consts/address";
// import ListNft from "src/components/ListNft/ListNft";

import axios from "axios";
import LoadingModal from "src/components/LoadingModal2/LoadingModal";
import { floorFormat } from "src/utils/formatNumber";
const cx = cn.bind(styles);
const ModalContent = ({ open, setOpen, balance, nftInfo }) => {
    const [kwtPrice, setKwtPrice] = useState(0);
    const [tab, setTab] = useState(1);
    const [startPrice, setStartPrice] = useState("");
    const [endPrice, setEndPrice] = useState("");
    const [amount, setAmount] = useState("");
    const [durationDay, setDurationDay] = useState("");
    const [hash, setHash] = useState();
    const [stepLoading, setStepLoading] = useState(0);
    const [showModalLoading, setShowModalLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [sellOption, setSellOption] = useState("fixed"); //fixed || auction
    const [isContinue, setIsContinue] = useState(false);
    const [showModalConfirm, setShowModalConfirm] = useState(false);
    const history = useHistory();

    const context = useWeb3React();
    const { account, chainId, library } = context;

    useEffect(() => {
        getKwtPrice();
    }, []);
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

    const isApprovedForAll = async address => {
        return read("isApprovedForAll", BSC_CHAIN_ID, nftInfo.contract, NFT1155_ABI, [MARKETPLACE_ADDRESS, address]);
        //  co ve la dang sai
    };
    console.log(nftInfo);
    const approve = async address => {
        await write("setApprovalForAll", library.provider, nftInfo.contract, NFT1155_ABI, [MARKETPLACE_ADDRESS, true], {
            from: account,
        });
    };
    const resetForm = () => {
        setStartPrice("");
        setEndPrice("");
        setAmount("");
        setDurationDay("");
    };
    const submit = async () => {
        if (!account) return;
        try {
            const duration = tab === 1 ? 60 * 60 * 24 : Math.floor(3600 * 24 * Number(durationDay));
            let balance = nftInfo.balance;
            if (sellOption == "auction" && Number(durationDay) < 0.007)
                return toast.error("Duration must be greater than 0.007!");

            if (!amount || Number(amount) < 1 || Number(amount) % 1 != 0) {
                return toast.error("Invalid amount!");
            }
            if (Number(amount) > Number(balance)) {
                return toast.error("Amount must not be greater than balance!");
            }
            // if (!isContinue && Number(amount) + Number(usingAmount) > balance) {
            //     return setShowModalConfirm(true);
            // }
            if (!startPrice || startPrice < 0) {
                return toast.error("Invalid starting price!");
            }
            if (!endPrice || endPrice < 0) {
                return toast.error("Invalid ending price!");
            }
            if (!duration || duration < 0) {
                return toast.error("Invalid duration!");
            }
            const address = MARKETPLACE_ADDRESS;
            const abi = MARKETPLACE_ABI;
            setLoading(true);
            setStepLoading(0);
            setShowModalLoading(true);
            console.log(amount, balance, startPrice, endPrice, duration);
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
            const isApproved = await isApprovedForAll(address);
            console.log("isApproved : ", isApproved);

            if (!isApproved) {
                await approve(address);
            }
            console.log(web3.utils.toWei(startPrice));
            const res = await write(
                "createAuction",
                library.provider,
                MARKETPLACE_ADDRESS,
                MARKETPLACE_ABI,
                [
                    [
                        nftInfo.contract,
                        "0x0000000000000000000000000000000000000000",
                        [nftInfo.tokenId.toString()],
                        [amount],
                        [],
                        web3.utils.toWei(startPrice),
                        web3.utils.toWei(endPrice),
                        duration,
                    ],
                ],
                {
                    from: account,
                },
                callback,
            );
            setStepLoading(2);
            resetForm();
            history.push({
                pathname: `/profile`,
            });
            // history.push(`/auction/${id}/${parseInt(res.events[0].raw.topics[3])}/kwt`);
        } catch (error) {
            console.log(error);
            setStepLoading(3);
            toast.error(error.message || "An error occurred!");
        } finally {
            setLoading(false);
            setIsContinue(false);
        }
    };
    useEffect(() => {
        setStartPrice("");
        setEndPrice("");
    }, [sellOption]);
    return (
        <>
            {showModalLoading && (
                <LoadingModal
                    show={true}
                    network={"BscScan"}
                    loading={loading}
                    title={"Selling NFT"}
                    stepLoading={stepLoading}
                    onHide={() => {
                        setShowModalLoading(false);
                        setHash(null);
                        setStepLoading(0);
                    }}
                    hash={hash}
                    hideParent={() => setOpen(false)}
                    notClose
                    notViewNft="true"
                />
            )}

            <Modal
                centered
                show={open}
                onHide={() => setOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div className={cx("content")}>
                    <CloseOutlined />
                    <div className={cx("header")}>
                        <img src={tagIcon} alt="" />
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
                        {tab === 1 && (
                            <>
                                <div className={cx("row")}>
                                    <span>Amount</span>
                                    <div className={cx("row-right")}>
                                        <Input
                                            disableUnderline
                                            type="number"
                                            placeholder="0"
                                            className={cx("input")}
                                            value={amount}
                                            onChange={e => {
                                                setAmount(e.target.value);
                                            }}
                                            min={0}
                                            // endAdornment={
                                            //     <InputAdornment position="end">
                                            //         <div className={cx("unit")}>
                                            //             <img alt="" src={require("src/assets/icons/kwt.png").default} />{" "}
                                            //             KWT
                                            //         </div>
                                            //     </InputAdornment>
                                            // }
                                        />
                                    </div>
                                </div>
                                <div className={cx("row")}>
                                    <span>Sell at</span>
                                    <div className={cx("row-right")}>
                                        <Input
                                            disableUnderline
                                            type="number"
                                            placeholder="0"
                                            className={cx("input")}
                                            value={startPrice}
                                            onChange={e => {
                                                setStartPrice(e.target.value);
                                                setEndPrice(e.target.value);
                                            }}
                                            min={0}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <div className={cx("unit")}>
                                                        <img alt="" src={require("src/assets/icons/kwt.png").default} />{" "}
                                                        KWT
                                                    </div>
                                                </InputAdornment>
                                            }
                                        />
                                    </div>
                                </div>
                                <div className={cx("row2")}>
                                    <span>
                                        <img src={exchangeIcon} />
                                    </span>
                                    <div>${floorFormat(startPrice * kwtPrice, 4)}</div>
                                </div>
                                <div className={cx("row2")}>
                                    You'll receive {floorFormat(startPrice * 0.95, 4)} KWT after subtracting a 5% fee.
                                </div>
                                <Button onClick={submit} className={cx("confirm-btn")}>
                                    <img src={tagIcon} />
                                    <span>Confirm</span>
                                </Button>
                            </>
                        )}
                        {tab === 2 && (
                            <>
                                <div className={cx("row")}>
                                    <span>Amount</span>
                                    <div className={cx("row-right")}>
                                        <Input
                                            disableUnderline
                                            type="number"
                                            placeholder="0"
                                            className={cx("input")}
                                            value={amount}
                                            onChange={e => {
                                                setAmount(e.target.value);
                                            }}
                                            min={0}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <div className={cx("unit")}>
                                                        <img alt="" src={require("src/assets/icons/kwt.png").default} />{" "}
                                                        KWT
                                                    </div>
                                                </InputAdornment>
                                            }
                                        />
                                    </div>
                                </div>
                                <div className={cx("row")}>
                                    <span>Start price</span>
                                    <div className={cx("row-right")}>
                                        <Input
                                            disableUnderline
                                            type="number"
                                            placeholder="0"
                                            className={cx("input")}
                                            value={startPrice}
                                            onChange={e => {
                                                setStartPrice(e.target.value);
                                            }}
                                            min={0}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <div className={cx("unit")}>
                                                        <img alt="" src={require("src/assets/icons/kwt.png").default} />{" "}
                                                        KWT
                                                    </div>
                                                </InputAdornment>
                                            }
                                        />
                                    </div>
                                </div>
                                <div className={cx("row2")}>
                                    <span>
                                        <img src={exchangeIcon} />
                                    </span>
                                    <div>${floorFormat(startPrice * kwtPrice, 4)}</div>
                                </div>
                                <div className={cx("row")}>
                                    <span>End price</span>
                                    <div className={cx("row-right")}>
                                        <Input
                                            disableUnderline
                                            type="number"
                                            placeholder="0"
                                            className={cx("input")}
                                            value={endPrice}
                                            onChange={e => {
                                                setEndPrice(e.target.value);
                                            }}
                                            min={0}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <div className={cx("unit")}>
                                                        <img alt="" src={require("src/assets/icons/kwt.png").default} />{" "}
                                                        KWT
                                                    </div>
                                                </InputAdornment>
                                            }
                                        />
                                    </div>
                                </div>
                                <div className={cx("row2")}>
                                    <span>
                                        <img src={exchangeIcon} />
                                    </span>
                                    <div>${floorFormat(endPrice * kwtPrice, 4)}</div>
                                </div>
                                <div className={cx("row")}>
                                    <span>Duration</span>
                                    <div className={cx("row-right")}>
                                        <Input
                                            disableUnderline
                                            type="number"
                                            placeholder="0"
                                            className={cx("input")}
                                            value={durationDay}
                                            onChange={e => {
                                                setDurationDay(e.target.value);
                                            }}
                                            min={0}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <div className={cx("unit")}>days</div>
                                                </InputAdornment>
                                            }
                                        />
                                    </div>
                                </div>

                                <div className={cx("row2")}>A 5% fee will be taken from the final sale price.</div>
                                <Button className={cx("confirm-btn")} onClick={submit}>
                                    <img src={tagIcon} />
                                    <span>Confirm</span>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </Modal>
        </>
    );
};
export default ModalContent;
