import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./theme/theme";
import Loading from "./components/loading/Loading"; 



const Dashboard = lazy(() => import("./screens/dashbord/Dashbord"));
const Subjects = lazy(() => import("./screens/subjects/Subjects"));
const SelectGrade = lazy(() => import("./screens/level/grade/SelectGrade"));
const Level=lazy(() => import("./screens/level/Levels"));
const QuizAndAnswers = lazy(() => import("./screens/level/Q&A/QuizAndAnswers"));

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Dashboard />}>
            <Route path="subjects" element={<Subjects />} />
            <Route path="subject/:id" element={<SelectGrade />} />
            <Route path="subject/:id/:grade" element={<Level/>} />
            <Route path="subject/:id/:grade/:level_id" element={<QuizAndAnswers/>} />
            
          </Route>
        </Routes>
      </Suspense>
    </ThemeProvider>
  );
}

export default App;