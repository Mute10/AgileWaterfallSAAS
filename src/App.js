import {BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
import AgilePage from "./pages/AgilePage"
import WaterfallPage from "./pages/WaterfallPage";


function App() {
  return (
    <Router>
      <nav style={{padding: "1rem", background: "#eee"}}>
      <h3 style={{ padding: "10px", border: "solid 4px", color: "blue"}}><Link style={{color: "#e7b82bff"}}to="/agile">Agile</Link> Methodology. <br/> 
      <Link style={{color: "#1091eeff"}}to="/waterfall">Waterfall</Link> Methodology.</h3>
      </nav>
   <h1>Click on one of the above.</h1>
      <div style={{padding: "1rem"}}>
      
        <Routes>
         
          <Route path="/agile" element={<AgilePage/>} />
          <Route path="/waterfall" element={<WaterfallPage/>} />
        </Routes>
      </div>
    </Router>
    
  )
}
export default App;