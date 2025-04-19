
import SideBar from "../../components/sidebar/SideBar";
import { Outlet } from "react-router-dom";
import "./dashbord.scss";

const Dashboard = () => {
  return (
    <div id="dashbord">
      <SideBar />
    
        <Outlet />
      
    </div>
  );
};

export default Dashboard;