import { Routes, Route } from "react-router-dom";
import Subjects from "./screens/subjects/Subjects";
import Dashboard from "./screens/dashbord/Dashbord";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./theme/theme"; // this should export a full theme object

function App() {
  return (
    <ThemeProvider theme={theme}> 
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Dashboard />}>
          <Route path="subjects" element={<Subjects />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
