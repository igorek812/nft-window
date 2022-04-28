import React from "react";
import MainPage from "./pages/main-page";
import CreateNftPage from "./pages/create-nft-page";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";

const App = () => {

    return (
        <Router>
            <Routes>
                <Route exact path='/' element={<MainPage />} />
                <Route exact path='/create' element={<CreateNftPage />} />
                <Route path="*" element={<MainPage />}/>
            </Routes>
        </Router>
    );
};

export default App;