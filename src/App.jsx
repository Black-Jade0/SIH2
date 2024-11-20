import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UploadPdf from "./pages/Uploadpage";
import LandingPage from "./pages/Landingpage";
import EducatorSignin from "./pages/Signin";

const App = () => {

    return (
        <Router>
        <Routes>
            <Route path="/upload" element={<UploadPdf/>} ></Route>
            <Route path="/" element={<LandingPage/>} ></Route>
            <Route path="/edusignin" element={<EducatorSignin/>} ></Route>
        </Routes>
        </Router>
    );
};

export default App;
