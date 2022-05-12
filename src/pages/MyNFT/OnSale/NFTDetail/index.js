import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";

import cn from "classnames/bind";
import MainLayout from "src/components/MainLayout";
import { Col, Row } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { Button } from "@mui/material";
import { useParams, useHistory } from "react-router-dom";
import { URL } from "src/consts/constant";
import axios from "axios";
import { useLocation } from "react-router-dom";
import LoadingPage from "src/components/LoadingPage/LoadingPage";
import { toast } from "react-toastify";

import { MARKETPLACE_ADDRESS } from "src/consts/address";
import MARKETPLACE_ABI from "src/utils/abi/KawaiiMarketplace.json";

import { read, write, sign, createNetworkOrSwitch } from "src/services/web3";
import { useWeb3React } from "@web3-react/core";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Web3 from "web3";
import { BSC_CHAIN_ID, BSC_rpcUrls } from "src/consts/blockchain";
import LoadingModal from "src/components/LoadingModal2/LoadingModal";
// import KAWAII_STORE_ABI from "src/utils/abi/KawaiiverseStore.json";
import logoKawaii from "src/assets/images/logo_kawaii.png";

const cx = cn.bind(styles);
const web3 = new Web3(BSC_rpcUrls);

const NFTDetail = () => {
    const history = useHistory();

    const { account, library, chainId } = useWeb3React();
    const { auctionId, tokenId, gameAddress } = useParams();
    const [nftInfo, setNftInfo] = useState();
    const [loading, setLoading] = useState(true);
    const [lastestAuctionId, setLastestAuctionId] = useState(0);
    // const { account } = useWeb3React();
    const { pathname } = useLocation();
    const [showModalLoading, setShowModalLoading] = useState(false);
    const [loadingTitle, setLoadingTitle] = useState("");
    const [stepLoading, setStepLoading] = useState(0);
    const [hash, setHash] = useState();
    const [open, setOpen] = useState(false);
    const [loadingModal, setLoadingModal] = useState(false);

    useEffect(() => {
        getAuction();
        getAuctionId();
    }, [useParams, account]);

    let pathnames = pathname.split("/").filter(Boolean);
    pathnames.splice(5, 1);
    pathnames.splice(2, 1);
    pathnames.splice(1, 4);

    const getAuctionId = async () => {
        const auction = await read("auctionId", BSC_CHAIN_ID, MARKETPLACE_ADDRESS, MARKETPLACE_ABI, []);
        setLastestAuctionId(auction);
    };

    const getAuction = async () => {
        setLoading(true);
        try {
            const auctionLastest = await read("auctionId", BSC_CHAIN_ID, MARKETPLACE_ADDRESS, MARKETPLACE_ABI, []);
            setLastestAuctionId(auctionLastest);
            console.log(auctionLastest);

            const resNftInfo = await axios.get(`${URL}/v1/nft/${gameAddress.toLowerCase()}/${tokenId}`);
            console.log(resNftInfo);
            let nft;
            let auction = await read("getAuction", BSC_CHAIN_ID, MARKETPLACE_ADDRESS, MARKETPLACE_ABI, [
                auctionLastest - 1,
            ]);
            console.log(auction.status);
            let currentPrice = await read("getCurrentPrice", BSC_CHAIN_ID, MARKETPLACE_ADDRESS, MARKETPLACE_ABI, [
                auctionLastest - 1,
            ]);
            console.log(currentPrice);
            // struct Auction {
            //     address erc1155; // storegame
            //     address erc721; // nft
            //     address seller;
            //     uint256[] erc1155TokenIds;
            //     uint256[] amounts;
            //     uint256[] erc721TokenIds;
            //     uint128 startingPrice;
            //     uint128 endingPrice;
            //     uint64 duration;
            //     uint64 startedAt;
            //     Status status;
            // }
            if (resNftInfo.status === 200) {
                nft = { balance: auction[5][0], ...resNftInfo.data.data, auction, currentPrice };
            }
            console.log(nft);
            setNftInfo(nft);
        } catch (error) {
            toast.error(error);
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const cancelAuction = async () => {
        try {
            setShowModalLoading(true);
            if (nftInfo.auction.status !== "0") {
                toast.error("Auction already cancel");
                return;
            }
            await write(
                "cancelAuction",
                library.provider,
                MARKETPLACE_ADDRESS,
                MARKETPLACE_ABI,
                [lastestAuctionId - 1],
                {
                    from: account,
                },
            );
        } catch (error) {
            setStepLoading(3);
            console.log(error);
            toast.error(error);
        } finally {
            setLoading(false);
        }
    };
    return loading ? (
        <LoadingPage />
    ) : (
        <MainLayout>
            <div className={cx("mint-nft-detail")}>
                {showModalLoading && (
                    <LoadingModal
                        show={true}
                        network={"BscScan"}
                        loading={loadingModal}
                        title={loadingTitle}
                        stepLoading={stepLoading}
                        onHide={() => {
                            setShowModalLoading(false);
                            setHash(undefined);
                            setStepLoading(0);
                        }}
                        hash={hash}
                        hideParent={() => {}}
                        notViewNft={true}
                    />
                )}
                <Row>
                    <Col span={10} className={cx("left")}>
                        <Button className={cx("back")} onClick={() => history.goBack()}>
                            <LeftOutlined />
                        </Button>
                        <div className={cx("image-box")}>
                            <img
                                src={
                                    nftInfo?.imageUrl ||
                                    `https://images.kawaii.global/kawaii-marketplace-image/items/201103.png`
                                }
                                alt="icon"
                            />
                        </div>
                    </Col>

                    <Col offset={1} span={13} className={cx("right")}>
                        <div className={cx("top")}>
                            <div className={cx("title")}>
                                <span className={cx("first")}>{nftInfo?.name}</span>
                                <span className={cx("second")}>#{nftInfo?.tokenId}</span>
                            </div>
                        </div>

                        <div className={cx("category")}>{nftInfo?.category}</div>
                        <Button className={cx("sell-btn")} onClick={cancelAuction}>
                            Cancel Auction
                        </Button>
                        <div className={cx("content")}>
                            <span className={cx("title")}>Amount:</span>
                            <span className={cx("value")}>{nftInfo?.auction[3][0]}</span>
                        </div>
                        <div className={cx("content")}>
                            <span className={cx("title")}>Price:</span>
                            <span className={cx("value")}>{nftInfo?.currentPrice} KWT</span>
                        </div>
                        <div className={cx("content")}>
                            <span className={cx("title")}>Author:</span>
                            <span className={cx("value")}>{nftInfo?.author}</span>
                        </div>
                        <div className={cx("content")}>
                            <span className={cx("title")}>Description:</span>
                            <span className={cx("value")}>{nftInfo?.description}</span>
                        </div>
                        <div className={cx("content", "content-attribute")}>
                            <span className={cx("title")}>Attributes:</span>
                            <div className={cx("list-attribute")}>
                                {nftInfo?.attributes?.map((info, ind) => (
                                    <div className={cx("one-attribute")} key={`attribute-${ind}`}>
                                        <div className={cx("info-image")}>
                                            <img src={info?.image || logoKawaii} alt="attr" />
                                        </div>
                                        <div className={cx("info-attribute")}>
                                            <div className={cx("info-header")}>{info?.type}</div>
                                            <div className={cx("info-text")}>{info?.value}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </MainLayout>
    );
};

export default NFTDetail;
