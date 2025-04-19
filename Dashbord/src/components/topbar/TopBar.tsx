import "./topbar.scss";

interface ScreenHeaderProps {
  title?: string;
  onBack?: () => void;
  onClick?: () => void;
}

const TopBar: React.FC<ScreenHeaderProps> = ({ title, onBack, onClick }) => {
  return (
    <div id="top-bar">
      <div></div>
     
      <div></div>
    </div>
  );
};

export default TopBar;
