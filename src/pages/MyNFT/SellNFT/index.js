import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import axios from "axios";
import cn from "classnames/bind";
import styles from "./index.module.scss";
import { Col, Row } from "antd";
import { toast } from "react-toastify";
import Item from "./Item";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import { read, sign, write, createNetworkOrSwitch } from "src/services/web3";
import { KAWAIIVERSE_STORE_ADDRESS, RELAY_ADDRESS } from "src/consts/address";
import KAWAIIVERSE_NFT1155_ABI from "src/utils/abi/KawaiiverseNFT1155.json";
import KAWAII_STORE_ABI from "src/utils/abi/KawaiiverseStore.json";
import RELAY_ABI from "src/utils/abi/relay.json";
import { BSC_CHAIN_ID, BSC_rpcUrls } from "src/consts/blockchain";
import "react-toastify/dist/ReactToastify.css";
import LoadingModal from "src/components/LoadingModal2/LoadingModal";
import { URL } from "src/consts/constant";
import NFT1155_ABI from "src/utils/abi/KawaiiverseNFT1155.json";
import { useHistory, useParams } from "react-router";
import { LeftOutlined } from "@ant-design/icons";
import { Spin } from "antd";
const cx = cn.bind(styles);
const web3 = new Web3(BSC_rpcUrls);

const SellNFT = ({ gameSelected, setIsSellNFT, isSellNFT }) => {
    const history = useHistory();
    const [list, setList] = useState([]);
    const [listSell, setListSell] = useState([]);
    const [rowItem, setRowItem] = useState(1);
    const [canAdd, setCanAdd] = useState(false);

    const [error, setError] = useState(false);
    const [loadingTx, setLoadingTx] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const { address } = useParams();
    const { account, library, chainId } = useWeb3React();
    const [isApprovedForAll, setIsApprovedForAll] = useState(false);
    const [stepLoading, setStepLoading] = useState(0);
    const [hash, setHash] = useState();
    const [showModalLoading, setShowModalLoading] = useState(false);
    const [loadingTitle, setLoadingTitle] = useState("");

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [loadingGetList, setLoadingGetList] = useState(true);

    return (
        <div className={cx("table")}>
            {showModalLoading && (
                <LoadingModal
                    show={showModalLoading}
                    network={"BscScan"}
                    loading={loading}
                    title={loadingTitle}
                    stepLoading={stepLoading}
                    onHide={() => {
                        setShowModalLoading(false);
                        setHash(undefined);
                        setStepLoading(0);
                    }}
                    hash={hash}
                    hideParent={() => {}}
                    setIsSellNFT={setIsSellNFT}
                />
            )}
            <div className={cx("main-title")}>
                <LeftOutlined
                    onClick={() => {
                        history.push({ search: "?view=true" });
                        setIsSellNFT(false);
                    }}
                />
                SELL NFT
            </div>
            <Row className={cx("table-header")}>
                <Col span={3} style={{ textAlign: "center" }} className={cx("search")}>
                    NFT
                </Col>
                <Col span={3} style={{ textAlign: "center" }}>
                    Token ID
                </Col>
                <Col span={3} style={{ textAlign: "center" }}>
                    Name
                </Col>

                <Col span={4} style={{ textAlign: "center" }}>
                    KWT/NFT
                </Col>
                <Col span={5} style={{ textAlign: "center" }}>
                    Quantity
                </Col>
                <Col span={3} style={{ textAlign: "center" }}>
                    Supply
                </Col>
                <Col span={3} style={{ textAlign: "center" }}>
                    {/* <input type="checkbox" /> */}
                </Col>
            </Row>
            <div className={cx("table-body")}>
                {loadingGetList ? (
                    <Spin className={cx("spin")} />
                ) : (
                    new Array(rowItem).fill().map((i, idx) => (
                        <Item
                            setList={setList}
                            setCanAdd={setCanAdd}
                            setRowItem={setRowItem}
                            rowItem={rowItem}
                            // addItem={addItem}
                            submitted={submitted}
                            setSubmitted={setSubmitted}
                            list={list}
                            listSell={listSell}
                            setListSell={setListSell}
                            key={`row-item-${idx}`}
                            index={idx}
                            success={success}
                            setSuccess={setSuccess}
                        />
                    ))
                )}
            </div>
            <div className={cx("wrapper-btn")}>
                <Button
                    className={cx("wrapper-btn--sell", listSell.length && "wrapper-btn--sell--active")}
                    // onClick={sellNft}
                >
                    Submit
                </Button>
            </div>
        </div>
    );
};

export default SellNFT;
