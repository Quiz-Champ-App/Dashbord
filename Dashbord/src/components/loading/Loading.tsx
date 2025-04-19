import CircularProgress from '@mui/material/CircularProgress';
import "./loading.scss";

export default function Loading() {
  return(
    <div id="loading">
      <div className="spinner-container">
        <CircularProgress color="inherit" />
      </div>
    </div>
  );
}