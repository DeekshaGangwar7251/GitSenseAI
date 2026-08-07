
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing/Landing";
import Analysis from "./pages/Analysis/Analysis";
import Workspace from "./pages/Workspace/Workspace";
import Reports from "./pages/Reports/Reports";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/workspace" element={<Workspace />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;