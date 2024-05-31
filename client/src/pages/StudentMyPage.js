import { useNavigate, useParams } from 'react-router-dom';

import '../styles/studentMypage.scss';

import Template from '../components/Template';
import { StudentIdCard } from '../components/StudentIdCard';
import { PageHeader } from '../components/Headers';
import { StudentPayStub } from './StudentPayStub';

export default function StudentMyPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleChangePassword = () => {
    navigate(`/${id}/changePw`);
  };

  return (
    <Template
      childrenTop={<PageHeader>{'마이페이지'}</PageHeader>}
      childrenBottom={
        <>
          <button className="changePassword-btn" onClick={handleChangePassword}>
            비밀번호 변경
          </button>

          <StudentIdCard />
          <StudentPayStub />
        </>
      }
    />
  );
}
