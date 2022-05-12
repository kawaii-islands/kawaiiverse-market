import React, { useEffect, useState, useLayoutEffect, useRef } from "react";
import LoadingPage from "src/components/LoadingPage/LoadingPage";
import MainLayout from "src/components/MainLayout";
import styles from "./index.module.scss";
import cn from "classnames/bind";
import Filter from "src/components/Filter/Filter";
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
import { useParams } from "react-router-dom";
import { KAWAII1155_ADDRESS } from "src/consts/constant";
import { URL } from "src/consts/constant";
import ListSkeleton from "src/components/ListSkeleton/ListSkeleton";
import { InputAdornment, TextField, Input } from "@mui/material";
import { Menu, Dropdown, Pagination, Row } from "antd";
import { DownOutlined } from "@ant-design/icons";
import filter from "src/assets/icons/filter.svg";
import ViewNFT from "./ViewNFT";
import SellNFT from "./Bundle";
import OnSale from "./OnSale";
import { useHistory } from "react-router-dom";

const cx = cn.bind(styles);

const PAGE_SIZE = 15;
const MyNFT = () => {
    const { account } = useWeb3React();
    const [loadingListNFT, setLoadingListNFT] = useState(true);
    const [loadingPage, setLoadingPage] = useState(false);
    const [gameList, setGameList] = useState([]);
    const [gameSelected, setGameSelected] = useState([]);
    const [activeTab, setActiveTab] = useState(1);
    const [listNft, setListNft] = useState([]);
    const [search, setSearch] = useState("");
    const [listSearch, setListSearch] = useState([]);
    const [originalList, setOriginalList] = useState([]);
    const [sort1, setSort] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const firstUpdate = useRef(true);
    const { location } = useHistory();
    const [isSellNFT, setIsSellNFT] = useState(false);

    useEffect(() => {
        getListBuyNFT();
    }, [account, activeTab]);

    useEffect(() => {
        getGameList();
    }, []);

    useEffect(() => {
        if (location?.search) {
            let value = location?.search.split("=")[1];
            if (value === "true") {
                setIsSellNFT(false);
            }
            if (value === "false") {
                setIsSellNFT(true);
            }
        }
    }, [location]);

    const handleSearch = e => {
        setSearch(e.target.value);
        let listSearch = listNft.filter(nft => {
            if (nft.name) {
                return (
                    nft?.name.toUpperCase().includes(e.target.value.toUpperCase()) ||
                    nft?.tokenId.toString().includes(e.target.value)
                );
            }
            return false;
        });

        if (e.target.value === "") {
            setListSearch([]);
            return;
        }
        setListSearch([...listSearch]);
    };

    const checkGameIfIsSelected = address => {
        let count = -1;
        gameSelected.map((game, idx) => {
            if (game.gameAddress === address) {
                count = idx;
            }
        });
        return count;
    };

    const handleDeleteFilter = address => {
        setGameSelected(gameSelected => {
            const copyGame = [...gameSelected];
            copyGame.splice(checkGameIfIsSelected(address), 1);
            return copyGame;
        });
    };

    const handleClearFilter = () => {
        setGameSelected([]);
    };

    useLayoutEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        } else {
            getListBuyNFT();
        }
    }, [gameSelected]);

    const itemRender = (current, type, originalElement) => {
        if (type === "prev") {
            return <span style={{ color: "#FFFFFF" }}>Prev</span>;
        }
        if (type === "next") {
            return <span style={{ color: "#FFFFFF" }}>Next</span>;
        }
        return originalElement;
    };

    const getGameItemLength = async gameAddress => {
        let length;
        length = await read("lengthSellNFT1155", BSC_CHAIN_ID, KAWAIIVERSE_STORE_ADDRESS, KAWAII_STORE_ABI, [
            gameAddress,
        ]);
        return length;
    };

    const getGameItemData = async (gameAddress, gameIndex) => {
        let gameData;
        gameData = await read("dataNFT1155s", BSC_CHAIN_ID, KAWAIIVERSE_STORE_ADDRESS, KAWAII_STORE_ABI, [
            gameAddress,
            gameIndex,
        ]);
        return gameData;
    };

    // const mergeArrayData = (dataArray1, dataArray2) => {
    //     let mergedArray = dataArray1.map((nft1, idx1) => {
    //         let nft = nft1;
    //         dataArray2.map((nft2, idx2) => {
    //             if (Number(nft1.tokenId) === Number(nft2.tokenId)) {
    //                 nft = { ...nft2, ...nft1 };
    //             }
    //         });

    //         return nft;
    //     });
    //     return mergedArray;
    // };

    // const logGameData = async a => {
    //     // setLoadingListNFT(true);

    //     console.log("a :>> ", a);

    //     try {
    //         let game;
    //         if (gameSelected?.length) {
    //             game = gameSelected;
    //         } else {
    //             game = gameList;
    //         }
    //         if (a) {
    //             game = a;
    //         }
    //         const tmpGameArray = Array(game.length).fill(1);
    //         const gameListData = await Promise.all(
    //             tmpGameArray.map(async (nftId, idx) => {
    //                 let gameItemLength = await getGameItemLength(game[idx].gameAddress);
    //                 const tmpItemArray = Array(Number(gameItemLength)).fill(1);
    //                 let res = await axios.get(`${URL}/v1/nft/${game[idx].gameAddress}`);
    //                 if (res.status === 200) {
    //                     const gameItemData = await Promise.all(
    //                         tmpItemArray.map(async (nftId, index) => {
    //                             let gameItem = await getGameItemData(game[idx].gameAddress, index);

    //                             gameItem.index = index;
    //                             gameItem.game = game[idx];
    //                             return gameItem;
    //                         }),
    //                     );
    //                     let mergeArray = mergeArrayData(gameItemData, res.data.data);
    //                     mergeArray = mergeArray.filter(nft => {
    //                         return nft.contract && Number(nft?.amount) - Number(nft?.alreadySale) > 0;
    //                     });
    //                     return mergeArray;
    //                 }
    //             }),
    //         );
    //         console.log(gameListData.flat(3));
    //         setOriginalList(gameListData.flat(3));
    //         setListNft(gameListData.flat(3));
    //         setLoadingListNFT(false);
    //         return gameListData.flat(3);
    //     } catch (error) {
    //         console.log(error);
    //         toast.error(error.message || "An error occurred!");
    //     } finally {
    //         // setLoadingListNFT(false);
    //     }
    // };

    const handleSort = sort => {
        if (sort === sort1) {
            setSort("");
            setListNft(originalList);
            if (search !== "") {
                let listSearch = listNft.filter(nft => {
                    if (nft.name) {
                        return (
                            nft?.name.toUpperCase().includes(search.toUpperCase()) ||
                            nft?.tokenId.toString().includes(search)
                        );
                    }
                    return false;
                });
                setListSearch([...listSearch]);
            }
            return;
        }
        setSort(sort);
        let newList = search !== "" ? [...listSearch] : [...listNft];

        if (sort === "low") {
            newList = newList.sort(function (a, b) {
                return Number(a.price) - Number(b.price);
            });
        }
        if (sort === "high") {
            newList = newList.sort(function (a, b) {
                return Number(b.price) - Number(a.price);
            });
        }
        if (search !== "") {
            setListSearch(newList);
            return;
        }
        setListNft(newList);
    };

    const getGameList = async () => {
        setLoadingListNFT(true);
        try {
            setGameList([]);
            const totalGame = await getGameLength();
            const tmpArray = Array.from({ length: totalGame }, (v, i) => i);
            const gameListData = await Promise.all(
                tmpArray.map(async (nftId, index) => {
                    let gameAddress = await getGameAddress(index);
                    let gameName = await read("name", BSC_CHAIN_ID, gameAddress, NFT1155_ABI, []);
                    let res = await axios.get(`${URL}/v1/game/logo?contract=${gameAddress}`);
                    // console.log(gameAddress, gameName)
                    if (res.status === 200 && res.data.data[0]) {
                        return { gameAddress, gameName, logoUrl: res.data.data[0].logoUrl };
                    }
                    return { gameAddress, gameName };
                }),
            );

            getListBuyNFT(gameListData);
            setGameList(gameListData);

            return gameListData;
        } catch (error) {
            console.log(error);
            toast.error(error.message || "An error occurred!");
        } finally {
            // setLoadingListNFT(false);
        }
    };

    const getGameLength = async () => {
        let length = await read("lengthListNFT1155", BSC_CHAIN_ID, KAWAIIVERSE_STORE_ADDRESS, KAWAII_STORE_ABI, []);
        return length;
    };

    const getGameAddress = async gameIndex => {
        let address = await read("listNFT1155", BSC_CHAIN_ID, KAWAIIVERSE_STORE_ADDRESS, KAWAII_STORE_ABI, [gameIndex]);
        return address;
    };

    const getListBuyNFT = async a => {
        try {
            let game;
            if (gameSelected?.length) {
                game = gameSelected;
            } else {
                game = gameList;
            }
            if (a) {
                game = a;
            }
            if (!account) return;
            let listBuyNFT = await Promise.all(
                game.map(async (game, index) => {
                    let totalNftByGame = await getTotalNftOfUser(game.gameAddress);

                    if (totalNftByGame > 0) {
                        const tmpNftArray = Array.from({ length: totalNftByGame }, (v, i) => i);

                        const nftInfo = await Promise.all(
                            tmpNftArray.map(async (nft, idx) => {
                                let nftId = await getNftId(game.gameAddress, idx);

                                const balance = await getBalanceOf(game.gameAddress, nftId);
                                console.log("balance :>> ", balance);

                                const res = await axios.get(`${URL}/v1/nft/${game.gameAddress.toLowerCase()}/${nftId}`);
                                console.log("res :>> ", res.data.data);

                                if (res.data.data) {
                                    console.log({ balance, detail: res.data.data, game: game });
                                    return { balance, detail: res.data.data, game: game };
                                }
                            }),
                        );
                        // console.log(nftInfo)
                        return nftInfo;
                    }
                }),
            );

            listBuyNFT = listBuyNFT.flat(3).filter(Boolean);
            console.log(listBuyNFT);
            setOriginalList(listBuyNFT);
            setListNft(listBuyNFT);
        } catch (error) {
            console.log(error);
            toast.error(error.message || "An error occurred!");
        } finally {
            setLoadingListNFT(false);
        }
    };

    const getTotalNftOfUser = async gameAddress => {
        // console.log("gameAddress :>> ", gameAddress);
        const length = await read("getTotalNftOfUser", BSC_CHAIN_ID, gameAddress, NFT1155_ABI, [account]);

        return length;
    };

    const getNftId = async (gameAddress, id) => {
        const nftId = await read("getIdOfUserAtIndex", BSC_CHAIN_ID, gameAddress, NFT1155_ABI, [account, id]);
        return nftId;
    };

    const getBalanceOf = async (gameAddress, id) => {
        const balance = await read("balanceOf", BSC_CHAIN_ID, gameAddress, NFT1155_ABI, [account, id]);
        return balance;
    };

    let displayList = listSearch.length > 0 || search !== "" ? listSearch : listNft;
    const menu = (
        <Menu className={cx("menu-dropdown")}>
            <Menu.Item
                key="low-high"
                onClick={() => handleSort("low")}
                className={cx(sort1 === "low" && "menu-dropdown--active")}
            >
                <div>Price: Low to High</div>
            </Menu.Item>
            <Menu.Item
                key="high-low"
                onClick={() => handleSort("high")}
                className={cx(sort1 === "high" && "menu-dropdown--active")}
            >
                <div>Price: High to Low</div>
            </Menu.Item>
        </Menu>
    );
    console.log(activeTab);
    return loadingPage ? (
        <LoadingPage />
    ) : (
        <MainLayout>
            <div className={cx("profile")}>
                <div className={cx("row")}>
                    <div className={cx("left")}>
                        <Filter
                            gameList={gameList}
                            setGameSelected={setGameSelected}
                            gameSelected={gameSelected}
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                        />
                    </div>

                    <div className={cx("right")}>
                        {/* {isSellNFT ? (
                            <SellNFT 
                            listNft={listNft}
                            gameSelected={gameSelected} 
                            setIsSellNFT={setIsSellNFT} 
                            isSellNFT={isSellNFT} />
                        ) : (
                            <ViewNFT
                                displayList={displayList}
                                search={search}
                                handleSearch={handleSearch}
                                menu={menu}
                                gameSelected={gameSelected}
                                handleDeleteFilter={handleDeleteFilter}
                                handleClearFilter={handleClearFilter}
                                loadingListNFT={loadingListNFT}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                itemRender={itemRender}
                                setIsSellNFT={setIsSellNFT}
                            />
                        )} */}
                        {activeTab === 1 && (
                            <ViewNFT
                                displayList={displayList.reverse()}
                                search={search}
                                handleSearch={handleSearch}
                                menu={menu}
                                gameSelected={gameSelected}
                                handleDeleteFilter={handleDeleteFilter}
                                handleClearFilter={handleClearFilter}
                                loadingListNFT={loadingListNFT}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                itemRender={itemRender}
                                setIsSellNFT={setIsSellNFT}
                            />
                        )}
                        {activeTab === 2 && (
                            <OnSale
                                displayList={[]}
                                search={search}
                                handleSearch={handleSearch}
                                menu={menu}
                                gameSelected={gameSelected}
                                handleDeleteFilter={handleDeleteFilter}
                                handleClearFilter={handleClearFilter}
                                loadingListNFT={loadingListNFT}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                itemRender={itemRender}
                                setIsSellNFT={setIsSellNFT}
                            />
                        )}
                        {activeTab === 3 && (
                            <SellNFT
                                listNft={listNft}
                                gameSelected={gameSelected}
                                setIsSellNFT={setIsSellNFT}
                                isSellNFT={isSellNFT}
                            />
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default MyNFT;
