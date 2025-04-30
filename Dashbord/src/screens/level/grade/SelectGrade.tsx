import ScreenHeader from '../../../components/header/screen/ScreenHeader';
import './select_grade.scss'
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const SelectGrade = () => {
    const { id } = useParams();
    const navigate = useNavigate();
  return (
    <div id="screen_container">
      <ScreenHeader onBack={()=>navigate('/subjects')} title="Select Grade"/>
      <div className="select-grade-wrapper">
        <div className='grade-card' onClick={() => navigate(`/subject/${id}/10`)}>
            <div className='grade-card-content'>
                <h1>Grade 10</h1>
               
            </div>
        </div>
        <div className='grade-card' onClick={() => navigate(`/subject/${id}/11`)}>

        <div className='grade-card-content'>
                <h1>Grade 11</h1>
               
            </div>
        </div>
      </div>
    </div>
  );
};

export default SelectGrade;
