import { useEffect, useState } from "react";
import cn from "classnames/bind";
import { useHistory } from "react-router";
import { Empty, Row } from "antd";
import styles from "./ListNft.module.scss";
import NFTItem from "src/components/NFTItem/NFTItem";

const cx = cn.bind(styles);
const ListNft = ({ gameItemList, gameSelected, loading, place, place2 }) => {
    const history = useHistory();
    console.log(gameItemList);
    return (
        <>
            {gameItemList.length > 0 ? (
                <div className={cx("list-nft")}>
                    {gameItemList.map(
                        (item, index) =>
                            item && (
                                <NFTItem
                                    key={`nft-item-${index}`}
                                    isStore={true}
                                    data={item}
                                    place={place}
                                    handleNavigation={() => {
                                        switch (place) {
                                            case "onsale":
                                                history.push({
                                                    pathname: `/auction/${item.game}/${item.auctionId}/${item.detail.tokenId}`,
                                                });
                                                break;

                                            case "boughtNft":
                                                history.push({
                                                    pathname: `/view/${item.detail.contract}/${item.detail.tokenId}`,
                                                });
                                                break;

                                            default:
                                                history.push({
                                                    pathname: `/profile/${item.detail.contract}/${item.detail.tokenId}`,
                                                });
                                                break;
                                        }
                                    }}
                                />
                            ),
                    )}
                </div>
            ) : (
                <>
                    <Empty style={{ margin: "20px auto", color: "#FFF" }} />
                </>
            )}
        </>
    );
};
export default ListNft;
