import React, { useEffect, useState } from "react";
import cn from "classnames/bind";
import styles from "./NFTItem.module.scss";
import logoKawaii from "../../assets/images/logo_kawaii.png";
import Web3 from "web3";
import { BSC_rpcUrls } from "src/consts/blockchain";
import { DataArray } from "@mui/icons-material";

const cx = cn.bind(styles);
const web3 = new Web3(BSC_rpcUrls);

const NFTItem = ({ onClick, data, handleNavigation, isStore, place }) => {
    let tag;
    switch (place) {
        case "onsale":
            tag = <div className={cx("tag")}>Selling {data.balance[0]} item</div>;
            break;

        case "view":
            tag = <div className={cx("tag")}>Available {data.balance} item</div>;
            break;

        case "boughtNft":
            tag = <div className={cx("tag")}>Selling {data.balance[0]} item</div>;
            break;

        default:
            tag = (
                <div className={cx("tag")}>
                    {data.amount - data.alreadySale}/{data.amount || data.supply} left
                </div>
            );
            break;
    }

    let price;
    switch (place) {
        case "onsale":
            price = Number(web3.utils.fromWei(data.auction.startingPrice.toString()));
            break;

        default:
            price = data.price ? Number(web3.utils.fromWei(data.price.toString())) : 0;
            break;
    }
    console.log(data);
    if (data.detail)
        return (
            <div className={cx("nft-item")}>
                <div className={cx("container")} onClick={handleNavigation}>
                    <div
                        className={cx("top")}
                        style={{
                            backgroundImage: data?.detail.imageUrl
                                ? `url(${data.detail.imageUrl})`
                                : `url(https://images.kawaii.global/kawaii-marketplace-image/items/206008.png)`,
                        }}
                    >
                        {tag}
                    </div>
                    {place === "boughtNft" && (
                        <div className={cx("middle")}>
                            <div className={cx("tag-market")}>
                                <img src={data.game.logoUrl || logoKawaii} alt="" />
                                <span>{data.game.gameName}</span>
                            </div>
                            <div className={cx("quantity")}>{data.balance}</div>
                        </div>
                    )}
                    <div className={cx("bottom")}>
                        <div className={cx("title")}>{data?.detail.name || "Name"}</div>
                        <div className={cx("nftId")}>#{data?.detail.tokenId}</div>
                        {place !== "boughtNft" && (
                            <div className={cx("number-box")}>
                                <span className={cx("number")}>
                                    {/* {data.price ? Number(web3.utils.fromWei(data.price.toString())) : 0} KWT */}
                                    {price} KWT
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
};

export default NFTItem;
