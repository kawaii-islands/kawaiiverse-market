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
import { sign, read, createNetworkOrSwitch } from "src/services/web3";
import * as web3 from "web3";

import { BSC_CHAIN_ID } from "src/consts/blockchain";
import FACTORY_ABI from "src/utils/abi/factory.json";
import NFT1155_ABI from "src/utils/abi/KawaiiverseNFT1155.json";
import { useWeb3React } from "@web3-react/core";
import { FACTORY_ADDRESS } from "src/consts/address";
import KAWAII_STORE_ABI from "src/utils/abi/KawaiiverseStore.json";
import { KAWAIIVERSE_STORE_ADDRESS } from "src/consts/address";
import ListNft from "src/components/ListNft/ListNft";

import axios from "axios";
const cx = cn.bind(styles);
const ModalContent = ({ open, setOpen, balance }) => {
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

    const context = useWeb3React();
    const { account, chainId, library } = context;
    const submit = async () => {
        try {
            const duration =
                tab === 1
                    ? 60 * 60 * 24
                    : Math.floor(3600 * 24 * Number(durationDay));

            if (sellOption == "auction" && Number(durationDay) < 0.007)
                return toast.error("Duration must be greater than 0.007!");

            if (!amount || Number(amount) < 1 || Number(amount) % 1 != 0) {
                return toast.error("Invalid amount!");
            }
            if (Number(amount) > balance) {
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
            // const address = MARKETPLACE_KWT_ADDRESS;
            // const abi = MARKETPLACE_ABI;
            setLoading(true);
            setStepLoading(0);
            setShowModalLoading(true);
            if (chainId !== BSC_CHAIN_ID) {
                const error = await createNetworkOrSwitch(library.provider);
                if (error) {
                    throw new Error("Please change network to Binance smart chain!");
                }
            }
            // const isApproved = await isApprovedForAll(address);
            // if (!isApproved) {
            //     await approve(address);
            // }
            // const callback = (hash) => {
            //     setHash(hash);
            //     setStepLoading(1);
            // };
            // const nonce = await read("nonces", BSC_CHAIN_ID, address, abi, [account]);
            // const contractName = await read("NAME", BSC_CHAIN_ID, address, abi, []);

            // const EIP712Domain = [
            //     { name: "name", type: "string" },
            //     { name: "version", type: "string" },
            //     { name: "chainId", type: "uint256" },
            //     { name: "verifyingContract", type: "address" },
            // ];
            let contractName = "";
            let address = "";
            const domain = {
                name: contractName,
                version: "1",
                chainId: BSC_CHAIN_ID,
                verifyingContract: address,
            };
            const Data = [
                { name: "_tokenId", type: "uint256" },
                { name: "_amount", type: "uint256" },
                { name: "_startingPrice", type: "uint256" },
                { name: "_endingPrice", type: "uint256" },
                { name: "_duration", type: "uint256" },
                { name: "nonce", type: "uint256" },
            ];

            // const message = {
            //     _tokenId: id,
            //     _amount: amount,
            //     _startingPrice: web3.utils.toWei(startPrice),
            //     _endingPrice: web3.utils.toWei(endPrice),
            //     _duration: duration,
            //     nonce,
            // };
            // const data = JSON.stringify({
            //     types: {
            //         EIP712Domain,
            //         Data,
            //     },
            //     domain,
            //     primaryType: "Data",
            //     message,
            // });
            // const signature = await sign(account, data, library.provider);
            // const { r, s, v } = signature;
            // const res = await write(
            //     "createAuction",
            //     library.provider,
            //     RELAY_ADDRESS,
            //     RELAY_ABI,
            //     [
            //         address,
            //         KAWAII_CORE_ADDRESS,
            //         id,
            //         amount,
            //         web3.utils.toWei(startPrice),
            //         web3.utils.toWei(endPrice),
            //         duration,
            //         account,
            //         v,
            //         r,
            //         s,
            //     ],
            //     {
            //         from: account,
            //     },
            //     callback
            // );
            // setStepLoading(2);
            // history.push(`/auction/${id}/${parseInt(res.events[0].raw.topics[3])}/kwt`);
        } catch (error) {
            console.log(error);
            // setStepLoading(3);
            toast.error(error.message || "An error occurred!");
        } finally {
            // setLoading(false);
            // setIsContinue(false);
        }
        
    }
    useEffect(() => {
        setStartPrice("");
        setEndPrice("");
    }, [sellOption]);
    return (
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
                                            setAmount(e.target.value)
                                        }}
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
                                                    <img alt="" src={require("src/assets/icons/kwt.png").default} /> KWT
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
                                <div>$1000</div>
                            </div>
                            <div className={cx("row2")}>You'll receive 0 KWT after subtracting a 5% fee.</div>
                            <Button 
                            onClick={submit}
                            className={cx("confirm-btn")}>
                                <img src={tagIcon} />
                                <span>Confirm</span>
                            </Button>
                        </>
                    )}
                    {tab === 2 && (
                        <>
                            <div className={cx("row")}>
                                <span>Amount</span>
                                <Input
                                        disableUnderline
                                        type="number"
                                        placeholder="0"
                                        className={cx("input")}
                                        value={amount}
                                        onChange={e => {
                                            setAmount(e.target.value)
                                        }}
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
                                                    <img alt="" src={require("src/assets/icons/kwt.png").default} /> KWT
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
                                <div>$1000</div>
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
                                                    <img alt="" src={require("src/assets/icons/kwt.png").default} /> KWT
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
                                <div>$1000</div>
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
                                            setDurationDay(e.target)
                                            
                                        }}
                                        min={0}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <div className={cx("unit")}>
                                                    days
                                                </div>
                                            </InputAdornment>
                                        }
                                    />
                                </div>
                            </div>
                            
                            <div className={cx("row2")}>A 5% fee will be taken from the final sale price.</div>
                            <Button className={cx("confirm-btn")}>
                                <img src={tagIcon} />
                                <span>Confirm</span>
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </Modal>
    );
};
export default ModalContent;
