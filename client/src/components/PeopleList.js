import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ConfirmBtn } from './Btns';
import { useDispatch, useSelector } from 'react-redux';
import { peopleListInfo } from '../store/peopleListReducer';
import { ReactComponent as Arrow } from '../images/ico-arr-left.svg';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';

import '../styles/setting.scss';

export function SetPeopleList() {
  const { id } = useParams();
  const [studentName, setStudentName] = useState(''); //이름
  const [attendanceNumber, setAttendanceNumber] = useState(''); //출석번호
  const [rating, setRating] = useState(''); //신용등급
  const [job, setJob] = useState(''); // 직업
  const [resetPassword, setResetPassword] = useState(''); //재설정 비밀번호
  const [studentList, setStudentList] = useState([]); //학생 리스트
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(true);
  const [jobList, setJobList] = useState([]); // 직업 리스트
  console.log(studentList);
  const getInfo = async () => {
    const res = await axios({
      method: 'GET',
      url: `${process.env.REACT_APP_HOST}/api/student/${id}`,
      headers: {
        'Content-Type': `application/json`,
        'ngrok-skip-browser-warning': '69420',
      },
    });
    console.log(res.data.result);
    setStudentList(res.data.result);
    const res2 = await axios({
      method: 'GET',
      url: `${process.env.REACT_APP_HOST}/api/job/${id}`,
      headers: {
        'Content-Type': `application/json`,
        'ngrok-skip-browser-warning': '69420',
      },
    });
    setJobList(res2.data.result);
  };
  //업데이트 -DB
  const updateStudent = async (studentId) => {
    const res = await axios({
      method: 'PATCH',
      url: `${process.env.REACT_APP_HOST}/api/student/${id}`,
      data: [
        {
          id: studentId,
          name: studentName,
          rollNumber: attendanceNumber,
          pw: resetPassword ? resetPassword : null,
          rating,
          jobId: job,
        },
      ],
      headers: {
        'Content-Type': `application/json`,
        'ngrok-skip-browser-warning': '69420',
      },
    });
    if (res.data.success) {
      handleCloseAccordion();
      getInfo();
    }
  };
  //추가 - DB
  const addStudent = async () => {
    const res = await axios({
      method: 'POST',
      url: `${process.env.REACT_APP_HOST}/api/student/${id}`,
      data: [
        {
          name: studentName,
          rollNumber: attendanceNumber,
          pw: resetPassword,
        },
      ],
    });
    if (res.data.success) {
      toast.success('국민 추가가 완료되었습니다.', { autoClose: 1300 });
      console.log(res.data.success);
    }
    getInfo();
  };

  const resetBtn = () => {
    if (
      studentName !== '' ||
      attendanceNumber !== '' ||
      rating !== '' ||
      job !== '' ||
      selectedIndex !== null
    ) {
      const isConfirmed = window.confirm('초기화 하시겠습니까?');
      if (!isConfirmed) {
        return;
      }
      setAttendanceNumber('');
      setStudentName('');
      setRating('');
      setJob('');
      setResetPassword('');
      setSelectedIndex(null);
    }
  };
  //추가
  const handleAddPeopleList = () => {
    if (!studentName || !attendanceNumber || !resetPassword) {
      alert('모든 값을 입력해주세요');
      return;
    }
    addStudent();
    setAttendanceNumber('');
    setStudentName('');
    setRating('');
    setJob('');
    setResetPassword('');
    setSelectedIndex(null);
  };
  const selectInput = (student, index) => {
    if (selectedIndex === index) {
      //이미 선택해 있었다면
      setAttendanceNumber('');
      setStudentName('');
      setRating('');
      setJob('');
      setResetPassword('');
      setSelectedIndex(null);
      updateStudent(student.id);
    } else {
      //새로 추가
      setAttendanceNumber(student.rollNumber);
      setStudentName(student.name);
      setRating(student.rating);
      setJob(student.jobId);
      setResetPassword('');
      setIsAccordionOpen(true);
      setIsAddOpen(false);
      setSelectedIndex(index);
    }
  };

  const handleCloseAccordion = () => {
    setSelectedIndex(null);
    setAttendanceNumber('');
    setStudentName('');
    setRating('');
    setJob('');
    setResetPassword('');
    setIsAccordionOpen(false);
    setIsAddOpen(true);
  };

  const deleteBtn = (index) => (e) => {
    e.stopPropagation();
    // 삭제 로직 추가
    setAttendanceNumber('');
    setStudentName('');
    setRating('');
    setJob('');
    setResetPassword('');
    setSelectedIndex(null);
  };
  //학생 등록
  const newAddBtn = () => {
    setIsAddOpen(true);
    setIsAccordionOpen(false);
    setSelectedIndex(null);
    setAttendanceNumber('');
    setStudentName('');
    setRating('');
    setJob('');
    setResetPassword('');
  };

  const handleConfirm = () => {};

  useEffect(() => {
    getInfo();
  }, []);

  return (
    <>
      <ToastContainer />
      <div className="title-list">
        {/* <div>국민 리스트</div> */}
        <ul className="title-list">
          <li>국민리스트를 확인할 수 있습니다.</li>
          <li>국민 정보를 추가, 수정 및 삭제할 수 있습니다.</li>
          <li>학생마다 비밀번호를 재설정 할 수 있습니다.</li>
        </ul>
      </div>

      {studentList?.map((student, index) => (
        <>
          <div
            className={`display ${
              isAccordionOpen && selectedIndex === index ? 'accordion-open' : ''
            } ${selectedIndex === index ? 'selected' : ''}`}
            key={index}
            onClick={() => selectInput(student, index)}
            style={{ fontSize: '14px', color: '#666666' }}
          >
            {student.rollNumber}번 {student.name}
            <Arrow stroke="#ddd" className="accArrBtn" />
          </div>
          {isAccordionOpen && selectedIndex === index && (
            <form className="box-style">
              <div className="reset">
                <div className="set-title">이름</div>
                <img
                  className="resetBtn"
                  src={`${process.env.PUBLIC_URL}/images/icon-delete.png`}
                  onClick={(e) => deleteBtn(index)}
                  alt="삭제"
                />
              </div>
              <input
                className="set-input"
                type="text"
                value={studentName}
                onChange={(e) => {
                  setStudentName(e.target.value);
                }}
              />
              <div className="set-title">출석번호</div>
              <input
                className="set-input"
                type="number"
                min="0"
                value={attendanceNumber}
                onChange={(e) => {
                  setAttendanceNumber(e.target.value);
                }}
              />
              <div className="set-title">신용등급</div>
              <input
                className="set-input"
                type="number"
                min="0"
                value={rating}
                onChange={(e) => {
                  setRating(e.target.value);
                }}
              />
              <div className="set-title">직업</div>
              <select
                id="job"
                value={job}
                onChange={(e) => setJob(e.target.value)}
                style={{
                  marginTop: '10px',
                  marginBottom: '20px',
                  width: '100%',
                  border: 'none',
                  borderBottom: '1px solid #e9ae24',
                  backgroundColor: '#f5f6f6',
                  padding: '5px',
                }}
              >
                <option value={null}>무직</option>
                {jobList.map((data) => (
                  <option key={data.id} value={data.id}>
                    {data.name}
                  </option>
                ))}
              </select>
              <div className="set-title">비밀번호 재설정</div>
              <input
                className="set-input"
                type="number"
                maxLength={4}
                value={resetPassword}
                onChange={(e) => {
                  setResetPassword(e.target.value);
                }}
              />
              <ConfirmBtn
                onClick={() => {
                  updateStudent(student.id);
                }}
                btnName="업데이트"
                backgroundColor="#61759f"
              ></ConfirmBtn>
            </form>
          )}
        </>
      ))}

      {isAccordionOpen && (
        <ConfirmBtn
          onClick={newAddBtn}
          btnName="학생 등록"
          backgroundColor="#bacd92"
        ></ConfirmBtn>
      )}

      {isAddOpen && (
        <>
          <form className="box-style">
            <div className="reset">
              <div className="set-title">이름</div>
              {/* <img
                className="resetBtn"
                src={`${process.env.PUBLIC_URL}/images/icon-reset.png`}
                onClick={resetBtn}
                alt="Reset Button"
              /> */}
            </div>
            <input
              className="set-input"
              type="text"
              value={studentName}
              onChange={(e) => {
                setStudentName(e.target.value);
              }}
            />
            <div className="set-title">출석번호</div>
            <input
              className="set-input"
              type="number"
              min="0"
              value={attendanceNumber}
              onChange={(e) => {
                setAttendanceNumber(e.target.value);
              }}
            />
            <div className="set-title">초기 비밀번호</div>
            <input
              className="set-input"
              type="number"
              maxLength={4}
              value={resetPassword}
              onChange={(e) => {
                setResetPassword(e.target.value);
              }}
            />
            <ConfirmBtn
              onClick={handleAddPeopleList}
              btnName="국민 추가"
              backgroundColor="#bacd92"
            ></ConfirmBtn>
          </form>
          {/* <ConfirmBtn
            onClick={handleConfirm}
            btnName="완료"
            backgroundColor="#bacd92"
          ></ConfirmBtn> */}
        </>
      )}
    </>
  );
}
