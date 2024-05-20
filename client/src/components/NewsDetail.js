import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GetTimeText } from '../hooks/Functions';

export function SetNewsDetail() {
  const { id } = useParams();
  const [news, setNews] = useState([
    {
      id: 1,
      title: '뉴스 제목 1',
      createdAt: '2024/5/16 15:46',
      content: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
    },
    {
      id: 2,
      title: '뉴스 제목 2',
      createdAt: '2024/5/16 15:46',
      content: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
    },
    {
      id: 3,
      title: '뉴스 제목 3',
      createdAt: '2024/5/16 15:46',
      content: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
    },
    {
      id: 4,
      title: '뉴스 제목 4',
      createdAt: '2024/5/16 15:46',
      content: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
    },
    {
      id: 5,
      title: '뉴스 제목 5',
      createdAt: '2024/5/16 15:46',
      content: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
    },
    {
      id: 6,
      title: '뉴스 제목 6',
      createdAt: '2024/5/16 15:46',
      content: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
    },
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  // 뉴스 관련
  const itemsPerPage = 3;
  const [indexOfLastItem, setIndexOfLastItem] = useState(0);
  const [indexOfFirstItem, setIndexOfFirstItem] = useState(0);
  const [currentItems, setCurrentItems] = useState([]); //한페이지에 들어가는 뉴스들
  const [totalPages, setTotalPages] = useState(0);

  const getNews = async () => {
    try {
      const res = await axios({
        method: 'GET',
        url: `${process.env.REACT_APP_HOST}/api/post/articles/${id}`,
      });
      console.log(res.data.result);
      setNews(res.data.result);
    } catch {
      // 프론트 완료 후 작성
    }
  };

  const nextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  useEffect(() => {
    getNews();
  }, []);

  useEffect(() => {
    if (news.length > 0) {
      setIndexOfLastItem(Math.min(currentPage * itemsPerPage, news.length));
      setIndexOfFirstItem((currentPage - 1) * itemsPerPage);
      setTotalPages(Math.ceil(news.length / itemsPerPage));
    }
  }, [currentPage, news]);

  useEffect(() => {
    setCurrentItems(news.slice(indexOfFirstItem, indexOfLastItem));
  }, [indexOfFirstItem, indexOfLastItem]);

  //기사 내용을 50자까지만 출력하게 함
  const truncateText = (text, maxLength = 100) => {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  return (
    <>
      {/* <div className="content"> */}
      <div>
        <div className="newsHead" style={{ marginBottom: '10%' }}>
          뉴스
        </div>
        {news.length !== 0 ? (
          <div className="newsInfo">
            {/* {news.map((item) => (
              <div key={item.id}>
                <span>{item.title}</span>
              </div>
            ))} */}
          </div>
        ) : (
          <div className="newsContent">
            <span>뉴스가 존재하지 않습니다.</span>
            <Link
              className="registerBtn"
              to="/:id/manager/news/write"
              style={{ color: 'black' }}
            >
              등록하기
            </Link>
          </div>
        )}
        {currentItems.map((news, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              flexDirection: 'row',
              position: 'relative',
              marginBottom: '10px',
              borderRadius: '18px',
              padding: '5%',
              alignItems: 'center',
              border: '0.1px solid gray',
            }}
            onClick={() => navigate(`/${id}/news/read/${news.id}`)}
          >
            <img
              src="/images/icon-diagram-process.gif"
              style={{ width: '10%', height: '10%' }}
              alt="News Image"
            />

            <p style={{ marginLeft: '5%' }}>
              <div>{news.title}</div>
              <div style={{ fontSize: '11px' }}>
                {GetTimeText(news.createdAt)}
              </div>
              <div style={{ fontSize: '11px' }} className="textLimit">
                {news.content}
              </div>
            </p>
          </div>
        ))}
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          {/* 이전 페이지 그룹 버튼 */}
          <button
            onClick={() =>
              setCurrentPage((prevPage) => Math.max(prevPage - 5, 1))
            }
            disabled={currentPage <= 1}
            style={{ marginRight: '10px' }}
          >
            &lt;
          </button>
          {/* 페이지 번호 표시 */}
          {[...Array(totalPages).keys()].map((pageNum) => {
            const showPage =
              pageNum + 1 >= currentPage - 2 && pageNum + 1 <= currentPage + 2;
            return (
              showPage && (
                <button
                  key={pageNum + 1}
                  onClick={() => setCurrentPage(pageNum + 1)}
                  style={{
                    margin: '0 5px',
                    padding: '5px 10px',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    backgroundColor:
                      currentPage === pageNum + 1 ? '#eee' : 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  {pageNum + 1}
                </button>
              )
            );
          })}
          {/* 다음 페이지 그룹 버튼 */}
          <button
            onClick={() =>
              setCurrentPage((prevPage) => Math.min(prevPage + 5, totalPages))
            }
            disabled={currentPage >= totalPages}
            style={{ marginLeft: '10px' }}
          >
            &gt;
          </button>
        </div>
      </div>
    </>
  );
}
