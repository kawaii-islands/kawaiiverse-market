import React, { useEffect, useState } from "react";
import cn from "classnames/bind";
import styles from "./NFTItem.module.scss";
import logoKawaii from "../../assets/images/logo_kawaii.png";
import Web3 from "web3";
import { BSC_rpcUrls } from "src/consts/blockchain";

const cx = cn.bind(styles);
const web3 = new Web3(BSC_rpcUrls);

const NFTItem = ({ onClick, data, handleNavigation, isStore, place }) => {
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
                    {place !== "boughtNft" && (
                        <div className={cx("tag")}>
                            {data.amount - data.alreadySale}/{data.amount || data.supply} Left
                        </div>
                    )}
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
                                {data.price ? Number(web3.utils.fromWei(data.price.toString())) : 0} KWT
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NFTItem;
