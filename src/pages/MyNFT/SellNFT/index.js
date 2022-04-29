import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import axios from "axios";
import cn from "classnames/bind";
import styles from "./index.module.scss";
import { Col, Row } from "antd";
import { toast } from "react-toastify";

import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import Modal from 'react-bootstrap/Modal';
import { read, sign, write, createNetworkOrSwitch } from "src/services/web3";
import { KAWAIIVERSE_STORE_ADDRESS, RELAY_ADDRESS } from "src/consts/address";
import KAWAIIVERSE_NFT1155_ABI from "src/utils/abi/KawaiiverseNFT1155.json";
import KAWAII_STORE_ABI from "src/utils/abi/KawaiiverseStore.json";
import RELAY_ABI from "src/utils/abi/relay.json";
import { BSC_CHAIN_ID, BSC_rpcUrls } from "src/consts/blockchain";
import LoadingModal from "src/components/LoadingModal2/LoadingModal";
import { URL } from "src/consts/constant";
import NFT1155_ABI from "src/utils/abi/KawaiiverseNFT1155.json";
import { useHistory, useParams } from "react-router";


import { Spin } from "antd";
import ModalContent from "./Modal/ModalContent.js";
import CardSellBundle from "src/components/CardSellBundle/CardSellBundle";
import cartIcon from "src/assets/images/cart.png";
const cx = cn.bind(styles);
const web3 = new Web3(BSC_rpcUrls);

const SellNFT = ({ gameSelected, setIsSellNFT, isSellNFT, listNft }) => {
    const [listSell, setListSell] = useState([]);
    const [open, setOpen] = useState(false);
    // useEffect(() => {
    //     setListSell([...listNft]);
    // }, [listNft]);
    let total = 0;
    listSell.forEach(nft => {
        if (nft.detail.quantity) {
            total += nft.detail.quantity;
        }
    });
    const sell = () => {
     
      if(!total) return;

      if(listSell.length === 1) {
        toast.error("Please choose at least 2 items");
        return;
      }
      setOpen(true)
    }
    return (
        <>
            <div className={cx("main-title")}>Choose nfts</div>
            <div className={cx("list")}>
                {listNft.map((nft, idx) => (
                    <CardSellBundle key={`cardsell-${idx}`} 
                    setListSell={setListSell} 
                    data={nft} 
                
                    listSell={listSell} />
                ))}
            </div>
            <div className={cx("footer")}>
                <div className={cx("cart")}>
                    <img src={cartIcon} alt="cart" />
                    <div className={cx("total")}>{total}</div>
                </div>
                <Button onClick={sell}>Sell Bundle</Button>
            </div>
            <Modal
                show={open}
                onHide={() => setOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
              
              <ModalContent />

            </Modal>
        </>
    );
};

export default SellNFT;
