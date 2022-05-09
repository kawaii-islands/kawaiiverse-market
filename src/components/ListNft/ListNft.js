import { useEffect, useState } from "react";
import cn from "classnames/bind";
import { useHistory } from "react-router";
import { Empty, Row } from "antd";
import styles from "./ListNft.module.scss";
import NFTItem from "src/components/NFTItem/NFTItem";

const cx = cn.bind(styles);
const ListNft = ({ gameItemList, gameSelected, loading, place }) => {
    const history = useHistory();
    return (
        <>
            {gameItemList.length > 0 ? (
                <div className={cx("list-nft")}>
                    {gameItemList.map((item, index) => item && (
                        <NFTItem
                            key={`nft-item-${index}`}
                            isStore={true}
                            data={item}
                            place={place}
                            handleNavigation={() => {
                                if (place === "boughtNft") {
                                    history.push({
                                        pathname: `/profile/${item.detail.contract}/${item.detail.tokenId}`,
                                    });
                                } else {
                                    history.push({
                                        pathname: `/profile/store/view-nft/${gameSelected}/${item.detail._id}/${item.detail.tokenId}/${item.detail.index}`,
                                    });
                                }
                            }}
                        />
                    ))}
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
