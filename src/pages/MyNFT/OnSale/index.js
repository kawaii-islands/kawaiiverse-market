import cn from "classnames/bind";
import { useState, useEffect } from "react";
import styles from "../index.module.scss";
import { InputAdornment, TextField, Input } from "@mui/material";
import { Search as SearchIcon } from "@material-ui/icons";
import { Menu, Dropdown, Pagination, Row } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { Button } from "@mui/material";
import cancel from "src/assets/icons/cancel.svg";
import ListSkeleton from "src/components/ListSkeleton/ListSkeleton";
import ListNft from "src/components/ListNft/ListNft";
import { useHistory, useParams } from "react-router";
import { toast } from "react-toastify";
import NFT1155_ABI from "src/utils/abi/KawaiiverseNFT1155.json";
import RELAY_ABI from "src/utils/abi/relay.json";
import KAWAIIVERSE_NFT1155_ABI from "src/utils/abi/KawaiiverseNFT1155.json";
import {
    KAWAIIVERSE_STORE_ADDRESS,
    KAWAII_TOKEN_ADDRESS,
    RELAY_ADDRESS,
    MARKETPLACE_ADDRESS,
} from "src/consts/address";
import MARKETPLACE_ABI from "src/utils/abi/KawaiiMarketplace.json";
import KAWAII_STORE_ABI from "src/utils/abi/KawaiiverseStore.json";
import { URL } from "src/consts/constant";
import KAWAII_TOKEN_ABI from "src/utils/abi/KawaiiToken.json";
import { read, write, sign, createNetworkOrSwitch } from "src/services/web3";
import { useWeb3React } from "@web3-react/core";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Web3 from "web3";
import axios from "axios";
import { BSC_CHAIN_ID, BSC_rpcUrls } from "src/consts/blockchain";
const cx = cn.bind(styles);
const PAGE_SIZE = 15;

const OnSale = ({
    displayList,

    menu,

    itemRender,
}) => {
    const context = useWeb3React();
    const [auctionList, setAuctionList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
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
    const { account, chainId, library } = context;
    const history = useHistory();

    useEffect(() => {
        getOnSale();
    }, [account]);

    const getOnSale = async () => {
        if (!account) return;
        try {
            setLoading(true);
            let auctionList = await read("getAuctionByAddress", BSC_CHAIN_ID, MARKETPLACE_ADDRESS, MARKETPLACE_ABI, [
                account,
            ]);
            console.log("*****" + auctionList);
            auctionList = await Promise.all(
                auctionList.map(async (auction, idx) => {
                    let gameAddress = auction[0];
                    let nftId = auction[3][0];
                    let balance = auction[4];
                    const res = await axios.get(`${URL}/v1/nft/${gameAddress.toLowerCase()}/${nftId}`);
                    // console.log("STATUS :", auction.status);
                    if (res.status === 200) {
                        return { auction, balance, detail: res.data.data, game: gameAddress, auctionId: idx };
                    }
                }),
            );
            auctionList = auctionList.filter(auction => {
                return auction.auction.status === "0";
            });
            setAuctionList(auctionList.reverse());
            return auctionList;
        } catch (error) {
            toast.error(error);
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className={cx("right-top-title")}>On Sale</div>
            <div className={cx("right-top")}>
                <div className={cx("right-top-title")}>{auctionList?.length} items</div>

                <Input
                    disableUnderline
                    placeholder="Search NFT by name, id,..."
                    // value={search}
                    // onChange={handleSearch}
                    className={cx("search")}
                    endAdornment={
                        <InputAdornment position="end">
                            <SearchIcon className={cx("icon")} />
                        </InputAdornment>
                    }
                />
                <div className={cx("group-button-filter")}>
                    <Dropdown overlay={menu} className={cx("drop-down")} trigger={["click"]}>
                        <div className={cx("drop-down-label")}>
                            <span>Sort by</span> <DownOutlined />
                        </div>
                    </Dropdown>
                </div>

                {/* <Button
                    className={cx("button")}
                    onClick={() => {
                        history.push({ search: "?view=false" });
                        setIsSellNFT(true);
                    }}
                >
                    Sell NFT
                </Button> */}
            </div>

            {/* <div className={cx("right-filter")}>
                {gameSelected?.map((game, idx) => (
                    <div className={cx("filter-box")} key={game.gameAddress}>
                        <img
                            className={cx("filter-box-image")}
                            src={cancel}
                            alt="cancel"
                            onClick={() => handleDeleteFilter(game.gameAddress)}
                        />
                        <span style={{ paddingLeft: "5px" }}>{game.gameName}</span>
                    </div>
                ))}

                {gameSelected.length > 0 && (
                    <div className={cx("filter-clear")} onClick={handleClearFilter}>
                        CLEAR ALL
                    </div>
                )}
            </div> */}

            <Row gutter={[20, 20]} className={cx("list")}>
                {loading ? (
                    <ListSkeleton page={"store"} />
                ) : (
                    <ListNft
                        loading={loading}
                        gameItemList={auctionList.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)}
                        // place="boughtNft"
                        // place2="onsale"
                        place="onsale"
                        // gameSelected={address}
                    />
                )}
            </Row>
            {displayList && displayList.length > 0 && (
                <div className={cx("pagination")}>
                    <Pagination
                        pageSize={PAGE_SIZE}
                        showSizeChanger={false}
                        current={currentPage}
                        total={auctionList?.length}
                        onChange={page => setCurrentPage(page)}
                        itemRender={itemRender}
                    />
                </div>
            )}
        </>
    );
};

export default OnSale;
