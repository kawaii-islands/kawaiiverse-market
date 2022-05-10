import React, { useEffect, useState, useLayoutEffect, useRef } from "react";
import LoadingPage from "src/components/LoadingPage/LoadingPage";
import MainLayout from "src/components/MainLayout";
import styles from "./index.module.scss";
import cn from "classnames/bind";
import { Col, Row } from "antd";
import FilterStore from "src/components/FilterStore/FilterStore";
import { Button } from "@mui/material";
import { read } from "src/services/web3";
import { BSC_CHAIN_ID } from "src/consts/blockchain";
import FACTORY_ABI from "src/utils/abi/factory.json";
import NFT1155_ABI from "src/utils/abi/KawaiiverseNFT1155.json";
import { useWeb3React } from "@web3-react/core";
import { FACTORY_ADDRESS } from "src/consts/address";
import KAWAII_STORE_ABI from "src/utils/abi/KawaiiverseStore.json";
import { KAWAIIVERSE_STORE_ADDRESS } from "src/consts/address";
import ListNft from "src/components/ListNft/ListNft";
import { toast } from "react-toastify";
import axios from "axios";
import FilterMobile from "src/components/FilterMobile/FilterMobile";
import { useParams } from "react-router-dom";
import { KAWAII1155_ADDRESS } from "src/consts/constant";
import { URL } from "src/consts/constant";
import ListSkeleton from "src/components/ListSkeleton/ListSkeleton";
import { InputAdornment, TextField, Input } from "@mui/material";
import { Menu, Dropdown, Pagination } from "antd";
import { DownOutlined } from "@ant-design/icons";
import filter from "src/assets/icons/filter.svg";
import { Search as SearchIcon } from "@material-ui/icons";

import cancel from "src/assets/icons/cancel.svg";
const cx = cn.bind(styles);

const PAGE_SIZE = 15;

const gameExample = {
    gameAddress: "0xeAeF56aA32a3DC03ed0A05dd388F673904D38f63",
    gameName: "hoang",
    logoUrl: "https://ipfs.infura.io/ipfs/Qme4PujFrD33BvAnWZSnhUidWBNw88eZVghUAjQAxVWY2T",
};

const ItemExample = {
    balance: "90",
    detail: {
        attributes: {
            _id: "627a0e3b4dd87f58831c30aa",
            type: "",
            value: "",
            image: "",
        },
        author: "user",
        category: "",
        contract: "0xeaef56aa32a3dc03ed0a05dd388f673904d38f63",
        description: "",
        imagePreviewUrl: "",
        imageThumbnailUrl: "",
        imageUrl:
            "data:image/jpeg;base64,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",
        mimeType: "",
        name: "NFT for sale",
        rarity: "",
        supply: 100,
        tags: [""],
        tokenId: 55,
        __v: 0,
        _id: "627a0e3b4dd87f58831c30a9",
    },

    game: {
        gameAddress: "0xeAeF56aA32a3DC03ed0A05dd388F673904D38f63",
        gameName: "hoang",
        logoUrl: "https://ipfs.infura.io/ipfs/Qme4PujFrD33BvAnWZSnhUidWBNw88eZVghUAjQAxVWY2T",
    },
};
const Marketplace = () => {
    const { account } = useWeb3React();
    const [loadingListNFT, setLoadingListNFT] = useState(false);
    const [loadingPage, setLoadingPage] = useState(false);
    const [openFilterModal, setOpenFilterModal] = useState(false);
    const [gameList, setGameList] = useState([gameExample]);
    const [gameSelected, setGameSelected] = useState([]);
    const [activeTab, setActiveTab] = useState(1);
    const [listNft, setListNft] = useState([ItemExample]);
    const [search, setSearch] = useState("");
    const [listSearch, setListSearch] = useState([]);
    const [originalList, setOriginalList] = useState([]);
    const [sort1, setSort] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const firstUpdate = useRef(true);

    let displayList = listSearch.length > 0 || search !== "" ? listSearch : listNft;
    const menu = (
        <Menu className={cx("menu-dropdown")}>
            <Menu.Item
                key="low-high"
                // onClick={() => handleSort("low")}
                className={cx(sort1 === "low" && "menu-dropdown--active")}
            >
                <div>Price: Low to High</div>
            </Menu.Item>
            <Menu.Item
                key="high-low"
                // onClick={() => handleSort("high")}
                className={cx(sort1 === "high" && "menu-dropdown--active")}
            >
                <div>Price: High to Low</div>
            </Menu.Item>
        </Menu>
    );
    return loadingPage ? (
        <LoadingPage />
    ) : (
        <MainLayout>
            <div className={cx("profile")}>
                {openFilterModal && (
                    <FilterMobile
                        setOpenFilterModal={setOpenFilterModal}
                        gameList={gameList}
                        setGameSelected={setGameSelected}
                        gameSelected={gameSelected}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                    />
                )}
                <div className={cx("row")}>
                    <div className={cx("left")}>
                        <FilterStore
                            gameList={gameList}
                            setGameSelected={setGameSelected}
                            gameSelected={gameSelected}
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                        />
                    </div>

                    <div className={cx("right")}>
                        <div className={cx("right-top")}>
                            <div className={cx("right-top-title")}>{displayList?.length} items</div>

                            <Input
                                disableUnderline
                                placeholder="Search for NFT"
                                value={search}
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
                        </div>

                        <div className={cx("right-filter")}>
                            {gameSelected.map((game, idx) => (
                                <div className={cx("filter-box")} key={game.gameAddress}>
                                    <img
                                        className={cx("filter-box-image")}
                                        src={cancel}
                                        alt="cancel"
                                        // onClick={() => handleDeleteFilter(game.gameAddress)}
                                    />
                                    <span style={{ paddingLeft: "5px" }}>{game.gameName}</span>
                                </div>
                            ))}

                            {gameSelected.length > 0 && (
                                <div
                                    className={cx("filter-clear")}
                                    // onClick={handleClearFilter}
                                >
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
                                    gameItemList={displayList.slice(
                                        (currentPage - 1) * PAGE_SIZE,
                                        currentPage * PAGE_SIZE,
                                    )}
                                    place="boughtNft"
                                    // gameSelected={address}
                                />
                            )}
                        </Row>
                        {displayList?.length > 0 && (
                            <div className={cx("pagination")}>
                                <Pagination
                                    pageSize={PAGE_SIZE}
                                    showSizeChanger={false}
                                    current={currentPage}
                                    total={displayList?.length}
                                    onChange={page => setCurrentPage(page)}
                                    // itemRender={itemRender}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Marketplace;
