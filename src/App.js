import React, { Suspense } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { light } from "src/themes/light";
import "./App.css";
import "antd/dist/antd.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import { CacheSwitch } from "react-router-cache-route";

import Header from "src/components/Header/index";
import LoadingPage from "./components/LoadingPage/LoadingPage";
import Messages from "./components/Messages";

const Home = React.lazy(() => import("src/pages/Home/index.js"));
const MyNFT = React.lazy(() => import("src/pages/MyNFT/index.js"));
const Marketplace = React.lazy(() => import("src/pages/Marketplace/index.js"));
const NFTDetail = React.lazy(() => import("src/pages/MyNFT/NFTDetail/index.js"));

function App() {
    return (
        <Provider store={store}>
            <ThemeProvider theme={light}>
                <CssBaseline />
                <Messages />

                <ToastContainer />
                <Router>
                    <Header />
                    <CacheSwitch>
                        <Suspense fallback={<LoadingPage />}>
                            <Route exact path="/" component={props => <Home {...props} />} />
                            <Route exact path="/profile" component={props => <MyNFT {...props} />} />
                            <Route exact path="/marketplace" component={props => <Marketplace {...props} />} />
                            <Route
                                path="/profile/:gameAddress/:tokenId"
                                component={props => <NFTDetail {...props} />}
                            />
                        </Suspense>
                    </CacheSwitch>
                </Router>
            </ThemeProvider>
        </Provider>
    );
}

export default App;
