import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  matchPath,
} from "react-router-dom";
import "./App.css";
 
  
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();

  // Inside AppContent component
  const hideFooterPatterns = [
   
    "/customerProfile"
  ];

  const shouldShowFooter = !hideFooterPatterns.some((pattern) =>
    matchPath(pattern, location.pathname)
  );
  return (
    <div className="app-container">
      {shouldShowFooter && <Navbar />} 
      <main>
        <Routes>
          {/* =====================================home pages===================================================== */}

        

          {/* ========================================================================================== */}
        </Routes>
      </main>
      {shouldShowFooter && <Footer />}
    </div>
  );
}

export default App;
