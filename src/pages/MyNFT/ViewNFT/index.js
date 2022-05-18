import cn from "classnames/bind";
import { useState, useEffect } from "react";
import styles from "../index.module.scss";
import { InputAdornment, TextField, Input } from "@mui/material";
import { Search as SearchIcon } from "@material-ui/icons";
import { Menu, Dropdown, Pagination, Row } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { Button } from "@mui/material";
import { URL } from "src/consts/constant";
import { useWeb3React } from "@web3-react/core";
import cancel from "src/assets/icons/cancel.svg";
import ListSkeleton from "src/components/ListSkeleton/ListSkeleton";
import ListNft from "src/components/ListNft/ListNft";
import { useHistory, useParams } from "react-router";
import { MARKETPLACE_ADDRESS } from "src/consts/address";
import MARKETPLACE_ABI from "src/utils/abi/KawaiiMarketplace.json";
import { read } from "src/services/web3";
import { toast } from "react-toastify";
import { BSC_CHAIN_ID } from "src/consts/blockchain";
import axios from "axios";
import filterIcon from "src/assets/icons/Vector.png";

const cx = cn.bind(styles);
const PAGE_SIZE = 15;

const ViewNFT = ({
    displayList,
    search,
    handleSearch,
    menu,
    gameSelected,
    handleDeleteFilter,
    handleClearFilter,
    loadingListNFT,
    currentPage,
    setCurrentPage,
    itemRender,
    setIsSellNFT,
}) => {
    const context = useWeb3React();

    const history = useHistory();
    const { account, chainId, library } = context;
    const [fullList, setFullList] = useState([]);
    console.log(displayList);

    useEffect(() => {
        getOnSale();
    }, [account, displayList]);

    const checkSellingBalance = (auctionList, gameAddress, tokenId) => {
        let sellingBalance = "0";
        const gameToken = auctionList.filter(
            nft => nft.detail.contract === gameAddress && nft.detail.tokenId === tokenId,
        );

        if (gameToken[0] !== undefined) {
            auctionList = auctionList.filter(nft => nft !== gameToken);
            sellingBalance = gameToken[0].sellingBalance;
        }
        return sellingBalance;
    };

    const removeFromAuctionList = (auctionList, gameAddress, tokenId) => {
        if (auctionList === undefined) return;

        console.log(auctionList, gameAddress, tokenId);
        const newList = auctionList.filter(nft => nft.detail.contract != gameAddress || nft.detail.tokenId != tokenId);
        console.log(newList);
        return newList;
    };

    const getOnSale = async () => {
        if (!account) return;
        try {
            let auctionList = await read("getAuctionByAddress", BSC_CHAIN_ID, MARKETPLACE_ADDRESS, MARKETPLACE_ABI, [
                account,
            ]);

            auctionList = await Promise.all(
                auctionList.map(async (auction, idx) => {
                    let gameAddress = auction[0];
                    let nftId = auction[3][0];
                    let balance = auction[4];
                    const res = await axios.get(`${URL}/v1/nft/${gameAddress.toLowerCase()}/${nftId}`);
                    if (res.status === 200) {
                        return {
                            auction,
                            balance: "0",
                            detail: res.data.data,
                            game: gameAddress,
                            sellingBalance: balance[0],
                        };
                    }
                }),
            );
            auctionList = auctionList.filter(auction => {
                return auction.auction.status === "0";
            });
            auctionList.map((aution, idx) => {
                delete aution.auction;
            });

            let displayListFull = displayList?.map(nft => ({
                ...nft,
                sellingBalance: checkSellingBalance(auctionList, nft.detail.contract, nft.detail.tokenId),
            }));

            displayList?.map(nft => {
                auctionList = removeFromAuctionList(auctionList, nft.detail.contract, nft.detail.tokenId);
            });
            displayListFull = [...displayListFull, ...auctionList];
            setFullList(displayListFull);
        } catch (error) {
            toast.error(error);
            console.log(error);
        }
    };

    return (
        <>
            <div className={cx("right-top")}>
                <img src={filterIcon} />
                <Input
                    disableUnderline
                    placeholder="Search NFT by name, id,..."
                    value={search}
                    onChange={handleSearch}
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
            <div className={cx("right-top-title")}>{displayList?.length} items</div>
            <div className={cx("right-filter")}>
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
            </div>

            <Row gutter={[20, 20]} className={cx("list")}>
                {loadingListNFT ? (
                    <ListSkeleton page={"store"} />
                ) : (
                    <ListNft
                        loading={loadingListNFT}
                        gameItemList={fullList.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)}
                        place="view"
                        // place="boughtNft"
                        // gameSelected={address}
                    />
                )}
            </Row>
            {displayList.length / PAGE_SIZE > 1 && (
                <div className={cx("pagination")}>
                    <Pagination
                        pageSize={PAGE_SIZE}
                        showSizeChanger={false}
                        current={currentPage}
                        total={displayList?.length}
                        onChange={page => setCurrentPage(page)}
                        itemRender={itemRender}
                    />
                </div>
            )}
        </>
    );
};

export default ViewNFT;
