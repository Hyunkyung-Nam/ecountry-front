import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import '../styles/settingHeader.scss';

export function ManagerHeader() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const positions = [
    { name: '홈', path: `/${id}/manager` },
    { name: '은행', path: `/${id}/manager/bank` },
    { name: '투자', path: `/${id}/manager/investment` },
    { name: '국민 리스트', path: `/${id}/manager/peopleList` },
    { name: '국회', path: `/${id}/manager/assembly` },
    { name: '자리 배치도', path: `/${id}/manager/seatMap` },
    { name: '세법 관리 페이지', path: `/${id}/manager/taxLawList` },
    { name: '직업 관리', path: `/${id}/manager/jobList` },
  ];

  return (
    <header>
      <img
        className="header-logo"
        src={`${process.env.PUBLIC_URL}/images/logo-defaultImg.jpg`}
        alt="로고"
      />
      <nav>
        <ul className="header-menu">
          {positions.map(({ name, path }) => (
            <li
              key={name}
              className={window.location.pathname === path ? 'active' : ''}
            >
              <div onClick={() => handleNavigation(path)}>{name}</div>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}