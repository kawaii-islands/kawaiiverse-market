import cn from "classnames/bind";
import styles from "../index.module.scss";
import { InputAdornment, TextField, Input } from "@mui/material";
import { Search as SearchIcon } from "@material-ui/icons";
import { Menu, Dropdown, Pagination, Row } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { Button } from "@mui/material";
import cancel from "src/assets/icons/cancel.svg";
import ListSkeleton from "src/components/ListSkeleton/ListSkeleton";
import ListNft from "src/components/ListNft/ListNft";
import { useHistory, useParams } from "react-router";

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
    const history = useHistory();

    return (
        <>
            <div className={cx("right-top")}>
                <div className={cx("right-top-title")}>{displayList?.length} items</div>

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

                <Button
                    className={cx("button")}
                    onClick={() => {
                        history.push({ search: "?view=false" });
                        setIsSellNFT(true);
                    }}
                >
                    Sell NFT
                </Button>
            </div>

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
                        gameItemList={displayList.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)}
                        // place="marketplace"
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
                        itemRender={itemRender}
                    />
                </div>
            )}
        </>
    );
};

export default ViewNFT;
