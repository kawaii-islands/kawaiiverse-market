import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import Grid from "@mui/material/Grid";
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
import NFT1155_ABI from "src/utils/abi/KawaiiverseNFT1155.json";
import RELAY_ABI from "src/utils/abi/relay.json";
import KAWAIIVERSE_NFT1155_ABI from "src/utils/abi/KawaiiverseNFT1155.json";
import { KAWAIIVERSE_STORE_ADDRESS, KAWAII_TOKEN_ADDRESS, RELAY_ADDRESS } from "src/consts/address";
import KAWAII_STORE_ABI from "src/utils/abi/KawaiiverseStore.json";
import KAWAII_TOKEN_ABI from "src/utils/abi/KawaiiToken.json";
import { read, write, sign, createNetworkOrSwitch } from "src/services/web3";
import { useWeb3React } from "@web3-react/core";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Web3 from "web3";
import { BSC_CHAIN_ID, BSC_rpcUrls } from "src/consts/blockchain";
import LoadingModal from "src/components/LoadingModal2/LoadingModal";
// import KAWAII_STORE_ABI from "src/utils/abi/KawaiiverseStore.json";
import logoKawaii from "src/assets/images/logo_kawaii.png";
import AuctionModal from "./AuctionModal/AuctionModal";
import BuyModal from "./BuyModal/BuyModal";
const cx = cn.bind(styles);
const web3 = new Web3(BSC_rpcUrls);

const NFTDetail = () => {
    const history = useHistory();

    const { account, library, chainId } = useWeb3React();
    const { gameAddress, tokenId, index } = useParams();
    const [nftInfo, setNftInfo] = useState();
    const [loading, setLoading] = useState(true);
    // const { account } = useWeb3React();
    const { pathname } = useLocation();
    const [showModalLoading, setShowModalLoading] = useState(false);
    const [loadingTitle, setLoadingTitle] = useState("");
    const [stepLoading, setStepLoading] = useState(0);
    const [hash, setHash] = useState();
    const [open, setOpen] = useState(false);
    const [openBuy, setOpenBuy] = useState(false);
    const [loadingModal, setLoadingModal] = useState(false);
    useEffect(() => {
        getNftInfo();
    }, [useParams, account]);

    let pathnames = pathname.split("/").filter(Boolean);
    pathnames.splice(5, 1);
    pathnames.splice(2, 1);
    pathnames.splice(1, 4);

    const getNftInfo = async () => {
        setLoading(true);

        try {
            const balance = await getBalanceOf(gameAddress, tokenId);

            const resNftInfo = await axios.get(`${URL}/v1/nft/${gameAddress.toLowerCase()}/${tokenId}`);

            let gameItem = [];

            if (resNftInfo.data.data) {
                gameItem = { balance, ...resNftInfo.data.data };
            }

            setNftInfo(gameItem);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const getBalanceOf = async (gameAddress, id) => {
        const balance = await read("balanceOf", BSC_CHAIN_ID, gameAddress, NFT1155_ABI, [account, id]);
        return balance;
    };

    return loading ? (
        <LoadingPage />
    ) : (
        <MainLayout>
            <div className={cx("mint-nft-detail")}>
                <AuctionModal open={open} setOpen={setOpen} nftInfo={nftInfo} />
                <BuyModal openBuy={openBuy} setOpenBuy={setOpenBuy} />
                {showModalLoading && (
                    <LoadingModal
                        show={showModalLoading}
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

                    {console.log("nftInfo :>> ", nftInfo)}

                    <Col offset={1} span={13} className={cx("right")}>
                        <div className={cx("top")}>
                            <div className={cx("title")}>
                                <span className={cx("first")}>{nftInfo?.name}</span>
                                <span className={cx("second")}>#{nftInfo?.tokenId}</span>
                            </div>
                        </div>

                        <div className={cx("category")}>{nftInfo?.category}</div>
                        <Button className={cx("sell-btn")} onClick={() => setOpen(true)}>
                            Sell NFT
                        </Button>
                        <Button className={cx("sell-btn")} onClick={() => setOpenBuy(true)}>
                            Buy NFT
                        </Button>
                        <div className={cx("content")}>
                            <span className={cx("title")}>Amount:</span>
                            <span className={cx("value")}>{nftInfo?.balance}</span>
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
