import React, { useEffect, useState } from "react";
import cn from "classnames/bind";
import styles from "./CardSellBundle.module.scss";
import logoKawaii from "../../assets/images/logo_kawaii.png";
import Web3 from "web3";
import { BSC_rpcUrls } from "src/consts/blockchain";
import plus from "src/assets/images/plus.png"
import minus from "src/assets/images/minus.png"
const cx = cn.bind(styles);
const web3 = new Web3(BSC_rpcUrls);

const Card = ({ data, listSell, setListSell }) => {
    const [quantity, setQuantity] = useState(0);
    const { balance: maxQuantity } = data;
    const changeQuantity = (e) => {
        const {name} = e.target;
        const VALUE = 1;
        let newQuantity;
        let exist = false;
        let newList = [...listSell];
        if(name === "plus"){
            
            newQuantity = Math.min(quantity + VALUE, maxQuantity);
            setQuantity(newQuantity);
        }
        if(name === "minus"){
            newQuantity = Math.max(quantity - VALUE, 0);
            setQuantity(newQuantity);
        }
        
        newList.forEach(nft => {
            if(nft.detail.tokenId === data.detail.tokenId){
                exist = true;
                nft.detail.quantity = newQuantity;
            }
            return nft;
        })
        if(!exist){
            data.detail.quantity = newQuantity;
            newList.push(data);
        }
        setListSell(newList);
    }
    return (
        <div className={cx("nft-item")}>
            <div className={cx("container")}>
                <div
                    className={cx("top")}
                    style={{
                        backgroundImage: data?.detail.imageUrl
                            ? `url(${data.detail.imageUrl})`
                            : `url(https://images.kawaii.global/kawaii-marketplace-image/items/206008.png)`,
                    }}
                >
                   
                </div>
               
                <div className={cx("bottom")}>
                    <div className={cx("bottom-1")}>
                    <div className={cx("title")}>{data?.detail.name || "Name"}</div>
                    <div className={cx("balance")}>{data?.balance || "Name"}</div>
                    </div>
                    <div className={cx("nftId")}>#{data?.detail.tokenId || 1001}</div>
                    
                </div>
                <div className={cx("quantity")}>
                    <img src={minus} alt="minus" name="minus" onClick={changeQuantity}/>
                    <input type="number" value={quantity}  
                    
                    onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}/>
                    <img src={plus} alt="plus" name="plus" onClick={changeQuantity}/>

                </div>
            </div>
        </div>
    );
};

export default Card;
