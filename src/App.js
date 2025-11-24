import {BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
import AgilePage from "./pages/AgilePage"
import WaterfallPage from "./pages/WaterfallPage";


function App() {
  return (
    <Router>
      <nav style={{padding: "1rem", background: "#eee"}}>
      <h3 style={{ padding: "10px", border: "solid 4px", color: "blue"}}>Click on <Link to="/agile">Agile</Link> or <Link to="/waterfall">Waterfall </Link> 
       to see my project in action.</h3>
      </nav>
   
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