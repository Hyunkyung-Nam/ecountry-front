import React, { useEffect, useRef, useState } from 'react';
import { Avatar, Button } from 'antd';
import styled from 'styled-components';
import axios from 'axios';
import useAuth from '../hooks/useAuth';
import { useNavigate, useParams } from 'react-router-dom';
import { setStudentInfoList } from '../store/studentInfoReducer';
import { useDispatch } from 'react-redux';
import { storage } from '../config/Firebase';
import { uploadBytes, getDownloadURL, ref } from 'firebase/storage';
import { chatBotList } from '../hooks/Functions';
import { ToastContainer, toast } from 'react-toastify';

const Name = styled.div`
  box-sizing: border-box;
  font-size: 25px;
  color: #333;
  font-weight: 700;
`;

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  justify-content: flex-start;
  .btnBox {
    display: flex;
    gap: 10px;
  }
`;
const ToManagerBtn = styled.button`
  border-radius: 11px;
  border: none;
  text-align: center;
  font-size: 13px;
  color: #606060;
  padding: 14px 20px;
  margin-top: 5px;
  height: 32px;
  box-shadow: 1px 1.3px #c0bebe;
  display: flex;
  align-items: center;
`;

const ProfileName = styled.div`
  display: flex;
  padding-top: 5px;
  font-size: 25px;
  color: #333;
  font-weight: 700;
  gap: 10px;
  .job {
    font-size: 15px;
    color: #635f5f;
    padding-top: 15px;
  }
`;
const LogoutBtn = styled.button`
  border-radius: 11px;
  border: none;
  text-align: center;
  font-size: 13px;
  color: #606060;
  padding: 14px 20px;
  margin-top: 5px;
  box-shadow: 1px 1.3px #c0bebe;
  height: 32px;
  display: flex;
  align-items: center;
  text-wrap: nowrap;
  img {
    width: 16px;
    height: 16px;
  }
`;

//관리자 info
export function MainProfile() {
  const { id } = useParams();
  const [userInfo, setUserInfo] = useAuth(id);
  const fileInputRef = useRef(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(
    'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
  );
  const [selectedFile, setSelectedFile] = useState(null);
  const [name, setName] = useState('');

  //정보 불러오기
  const getInfo = async () => {
    try {
      const res = await axios({
        method: 'GET',
        url: `${process.env.REACT_APP_HOST}/api/user/info`,
        headers: {
          'Content-Type': `application/json`,
          'ngrok-skip-browser-warning': '69420',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (res.data.success) {
        setName(res.data.result.name);
        setUploadedImageUrl(res.data.result.img);
      } else {
        console.error(res.data.message);
      }
    } catch (error) {
      console.error('로그인 요청 실패:', error);
    }
  };

  const dataURLtoBlob = (dataurl) => {
    let arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  const uploadImageFunc = async (file) => {
    // file 매개변수 추가
    if (!file) return;
    const fileId = userInfo.id; // 파일명 사용자 id로 설정
    const fileInputRef = ref(storage, `profileImages/${fileId}`);
    try {
      await uploadBytes(fileInputRef, file);
      const url = await getDownloadURL(fileInputRef); // 업로드된 파일의 URL 가져옴
      console.log('반환된 이미지경로 : ' + url);
      return url; // URL을 반환
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      return null;
    }
  };
  //프로필 사진 변경
  const updateImg = async () => {
    let imageUrl = uploadedImageUrl;
    if (selectedFile && !uploadedImageUrl.startsWith('https://')) {
      let blob = dataURLtoBlob(uploadedImageUrl);
      const uploadUrl = await uploadImageFunc(blob);
      if (uploadUrl) {
        imageUrl = uploadUrl;
        setUploadedImageUrl(uploadUrl);
      }
    }

    try {
      const res = await axios({
        method: 'PATCH',
        url: `${process.env.REACT_APP_HOST}/api/user`,
        headers: {
          'Content-Type': `application/json`,
          'ngrok-skip-browser-warning': '69420',
          // Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        data: {
          id: userInfo.id,
          img: imageUrl,
        },
      });
      if (res.data.success) {
        console.log(res.data.success);
        toast.success('프로필 변경이 완료되었습니다.');
        getInfo();
      } else {
        console.log(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);

      // 파일을 읽어서 화면에 표시
      const reader = new FileReader();
      reader.onloadend = () => {
        // onloadend 이벤트 사용
        setUploadedImageUrl(reader.result); // 미리보기 이미지 설정
      };
      reader.readAsDataURL(file);
    } else {
      // 업로드 취소할 시 기본 이미지로 설정
      setUploadedImageUrl(
        'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
      );
    }
  };

  useEffect(() => {
    setUserInfo();
  }, []);

  useEffect(() => {
    if (userInfo?.authority) {
      getInfo();
    }
  }, [userInfo]);

  return (
    <>
      <ToastContainer />
      <Avatar
        src={uploadedImageUrl}
        style={{ marginRight: '10px', cursor: 'pointer' }}
        size={64}
        onClick={() => {
          fileInputRef.current.click();
        }}
      />
      <input
        type="file"
        style={{ display: 'none' }}
        accept="image/jpg,image/png,image/jpeg"
        name="profile_img"
        onChange={handleImageUpload}
        ref={fileInputRef}
      />
      <button onClick={updateImg}>완료</button>

      <Name>{name}</Name>
    </>
  );
}

export function GetName() {
  const { id } = useParams();
  const [userInfo, setUserInfo] = useAuth(id);
  const [name, setName] = useState('');
  const [job, setJob] = useState('');
  const dispatch = useDispatch();
  const [isManager, setIsManager] = useState(false);
  const navigate = useNavigate();

  const getUserName = async () => {
    try {
      const res = await axios({
        method: 'GET',
        url: `${process.env.REACT_APP_HOST}/api/user/info`,
        headers: {
          'Content-Type': `application/json`,
          'ngrok-skip-browser-warning': '69420',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (res.data.success) {
        console.log('success');
        setName(res.data.result.name);
        setJob(res.data.result.job);
        if (userInfo.isStudent) {
          dispatch(setStudentInfoList(res.data.result));
        } else {
          dispatch(setStudentInfoList({ skills: [0, 1, 2, 3, 4, 5] }));
          setIsManager(true);
        }
      } else {
        console.error(res.data.message);
      }
    } catch (error) {
      console.error('정보 요청 실패:', error);
    }
  };
  const logoutFunc = () => {
    if (!window.confirm('로그아웃 하시겠습니까?')) {
      return;
    }
    localStorage.removeItem('token');
    window.location.href = `/${id}/login`;
  };

  const movetoManager = () => {
    navigate(`/${id}/manager`);
  };

  // useEffect(() => {
  //   if (localStorage.getItem('token')) {
  //     setUserInfo();
  //     console.log('useE실행');
  //   }
  // }, []);
  useEffect(() => {
    setUserInfo();
    console.log('setUserInfo');
  }, []);

  useEffect(() => {
    console.log('userInfo', userInfo);
    if (userInfo?.authority) {
      getUserName();
      console.log('getUserName 호출');
    }
  }, [userInfo]);

  return (
    <ProfileContainer>
      <ProfileName>
        {name} <div className="job">{job}</div>
      </ProfileName>
      <div className="btnBox">
        <LogoutBtn onClick={logoutFunc}>
          로그아웃
          <img
            src={`${process.env.PUBLIC_URL}/images/icon-sign-out.png`}
            alt="복사"
          />
        </LogoutBtn>
        {isManager && (
          <ToManagerBtn onClick={movetoManager}>관리자 페이지</ToManagerBtn>
        )}
      </div>
    </ProfileContainer>
  );
}
