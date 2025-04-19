import SideBar from "../../components/sidebar/SideBar";
import { Outlet } from "react-router-dom";
import "./dashbord.scss";
import TopBar from "../../components/topbar/TopBar";

const Dashboard = () => {
  return (
    <div id="dashbord">
      <div className="screen_container">
        <TopBar title="Dashboard" />
      </div>
      <SideBar />
      <Outlet />
    </div>
  );
};

export default Dashboard;
