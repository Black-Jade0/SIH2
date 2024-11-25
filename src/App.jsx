import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UploadPdf from "./pages/Uploadpage";
import LandingPage from "./pages/Landingpage";
import EducatorSignin from "./pages/Signin";
import UploadPdfForEval from "./pages/UploadForEval";
import UploadPageUser from "./pages/UploadPageUser";

const App = () => {

    return (
        <Router>
        <Routes>
            <Route path="/upload" element={<UploadPdf/>} ></Route>  {/*For uploading question pdf to database */}
            <Route path="/" element={<LandingPage/>} ></Route>
            <Route path="/usereval1" element={<UploadPageUser/>} ></Route> {/*For users
             to upload answer for evaluation */}
            <Route path="/edusignin" element={<EducatorSignin/>} ></Route>
        </Routes>
        </Router>
    );
};

export default App;
