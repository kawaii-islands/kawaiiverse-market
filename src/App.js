import React, { Suspense } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { light } from "src/themes/light";
import "./App.css";
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
                        </Suspense>
                    </CacheSwitch>
                </Router>
            </ThemeProvider>
        </Provider>
    );
}

export default App;
