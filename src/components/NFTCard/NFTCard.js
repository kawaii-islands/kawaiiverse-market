//@ts-nocheck
import React, { useEffect, useRef } from "react";
import styles from "./NFTCard.module.scss";
import cn from "classnames/bind";

import formatNumber, { bigNumber } from "src/utils/formatNumber";

const cx = cn.bind(styles);

const NFTCard = ({ data }) => {
    const canvasRef = useRef(null);
    console.log(data);
    return (
        <div className={cx("nft-card")}>
            <div
                className={cx("nft-card-container")}
                // onClick={() => {
                //     if (supply === undefined) {
                //         history.push(`/auction/${tokenId}/${indexToken}/${token}`);
                //     } else if (type === "profile") {
                //         history.push(`/profile/nft/${tokenId}`);
                //     } else {
                //         history.push(`/nft/${tokenId}`);
                //     }
                // }}
            >
                <div className={cx("nft-card-container-header")}>
                    <div className={cx("tag")}>#{data.detail.tokenId}</div>
                    <img src={`https://images.kawaii.global/kawaii-marketplace-image/origin-tag.png`} />
                    {/* {items[tokenId].breedType === "origin" && (
                        <img src={("https://images.kawaii.global/kawaii-marketplace-image/origin-tag.png")} />
                    )}
                    {items[tokenId].breedType === "f1" && (
                        <img
                            src={("https://images.kawaii.global/kawaii-marketplace-image/nurtured.png")}
                            style={{ width: 80, height: 27 }}
                        />
                    )} */}
                </div>
                <div className={cx("total")}>Total: {parseInt(data.balance) + parseInt(data.sellingBalance)}</div>
                <div className={cx("image")}>
                    <>
                        <img className={cx("avatar")} src={data.detail.imageUrl} />
                    </>

                    {/* <canvas width={150} height={150} ref={canvasRef} /> */}

                    {/* {balance && onSale === undefined && <div className={cx("balance")}>{balance}</div>} */}
                </div>
                <div className={cx("name")}>{data.detail.name}</div>
                {/* {supply === undefined && ( */}
                {/* <div className={cx("price")}>
                    <img src={`https://images.kawaii.global/kawaii-marketplace-image/origin-tag.png`} />
                    <div className={cx("amount")}>123</div>
                    <div className={cx("dollar")}>$123</div>
                </div> */}
                {/* )} */}

                {/* {onSale !== undefined && ( */}
                <div className={cx("onSale")}>
                    <div className={cx("content")}>
                        <div className={cx("left")}>
                            <div className={cx("title")}>Onsale</div>
                            <div className={cx("subTitle")}>(Est.)</div>
                        </div>
                        <div className={cx("right")}>
                            <div className={cx("line")}></div>
                            <div className={cx("value")}>{data.sellingBalance}</div>
                        </div>
                    </div>
                </div>
                {/* )} */}
            </div>
        </div>
    );
};

export default NFTCard;
