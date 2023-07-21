import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { getComments, addComment, deleteComment, updateComment } from '../../api/comments';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { auth } from '../../firebase';

import { VscTriangleDown } from 'react-icons/vsc';

const DetailBox = ({ placeData }) => {
  const navigate = useNavigate();
  const params = useParams();

  const [nickName, setNickName] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);

  const [displayedComments, setDisplayedComments] = useState([]);

  const { isLoading, isError, data } = useQuery('comments', getComments, {
    onSuccess: (data) => {
      setDisplayedComments(data.filter((comment) => comment.shopId === shopId));
    }
  });

  //가격정보 select창 관련
  const currentPlace = placeData.category_name.split('>').pop().trim()
  console.log("currentPlace=>",currentPlace)
  const [isActive, setIsActive] = useState(false);
  const [selected, setSelected] = useState('');
  const showDropdown = () => {
    setIsActive(!isActive);
  };
  const [price, setPrice] = useState('')
  const options = (() => {
    if (currentPlace.includes("헬스")) {
        return ['헬스이용권 1개월', '헬스이용권 3개월', '헬스이용권 6개월','헬스이용권 12개월', 'PT 10회', 'PT 20회','PT 30회']
      } else if (currentPlace.includes("필라테스")) {
        return ['필라테스 회원권 1개월', '필라테스 회원권 3개월', '필라테스 회원권 6개월', '필라테스 회원권 12개월', 'PT 10회', 'PT 20회','PT 30회', '그룹레슨'] 
      } else if (currentPlace.includes("요가")) {
        return ['요가 회원권 1개월', '요가 회원권 6개월', '요가 회원권 9개월', '요가 회원권 12개월', 'PT 10회', 'PT 20회','PT 30회', '그룹레슨'] 
      } else if (currentPlace.includes("협회") || currentPlace.includes("댄스")) {
        return ['댄스 회원권 1개월', '댄스 회원권 6개월', '댄스 회원권 9개월', '댄스 회원권 12개월', 'PT 10회', 'PT 20회','PT 30회', '그룹레슨'] 
      } else {
        return ["죄송합니다. 아직 해당 기관 정보를 받지 못했습니다."]
      }})()
  
  const addComma = (value) => {
    // 입력된 값에서 숫자 이외의 문자를 모두 제거
    const numericValue = value.replace(/[^\d]/g, '');
    // 콤마 추가한 문자열 생성
    const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return formattedValue ? formattedValue + '₩' : ''
  };
  const handleChange = (event) => {
    // 1000단위마다 콤마를 추가하여 설정
    setPrice(addComma(event.target.value));
  };


  //가격정보 select창 관련

  const shopId = params.id;

  //별점 구하는 곳
  const reviews = data?.filter((item) => item.shopId === shopId);
  const commentRatingArr = reviews?.map((item) => item.rating);
  const commentRatingSum = commentRatingArr?.reduce((acc, cur) => acc + cur, 0);
  // 리뷰 개수
  const commentRatingLength = commentRatingArr?.length;
  // 총 별점 평균
  const RatingAvg = (commentRatingSum / commentRatingLength).toFixed(2);
  console.log(RatingAvg)

  const queryClient = useQueryClient();

  const mutation = useMutation(addComment, {
    onSuccess: () => {
      queryClient.invalidateQueries('comments');
    }
  });

  const deleteMutation = useMutation(deleteComment, {
    onSuccess: () => {
      queryClient.invalidateQueries('comments');
    }
  });

  const updateMutation = useMutation(updateComment, {
    onSuccess: () => {
      queryClient.invalidateQueries('comments');
    }
  });

  const addCommentHandler = async () => {
    if (!comment || rating === 0 || !selected || !price) {
      alert('모든 항목을 입력하세요');
      return;
    }

    const newComment = {
      shopId,
      nickName,
      comment,
      rating,
      userId: auth.currentUser.uid,
      selected,
      price,
    };

    mutation.mutate(newComment);

    setNickName('');
    setComment('');
    setRating(0);
  };

  const deleteCommentHandler = (id) => {
    const confirmed = window.confirm('이 댓글을 삭제하시겠습니까?');
    if (confirmed) {
      deleteMutation.mutate(id);
      setDisplayedComments((prevComments) => prevComments.filter((comment) => comment.id !== id));
    }
  };

  const updateCommentHandler = (id) => {
    const confirmed = window.confirm('이 댓글을 수정하시겠습니까?');
    if (confirmed) {
      updateMutation.mutate(id);
    }
  };

  const commentHandler = (event) => {
    setComment(event.target.value);
  };

  const handleRatingSelection = (ratingValue) => {
    setRating(ratingValue);
  };
  return (
    <>
      <StDetailPage style={{ marginTop: '100px' }}>
        <StDetailBox size="placeTitle">
          <div>{placeData?.place_name}</div>
          <StReviewCountBox>
            <div>별점: {isNaN(RatingAvg) ? 0 : RatingAvg }</div>
            <div>방문자 리뷰: {commentRatingLength}</div>
          </StReviewCountBox>
        </StDetailBox>
        <StDetailBox size="placeDetail">
          <div>{placeData?.road_address_name}</div>
          <div>{placeData?.phone ? placeData?.phone : '사장님 전화번호 넣어주세요!!'}</div>
        </StDetailBox>
        <StDetailBox size="placeReviews">
          <br />
          {data
            ?.filter((comment) => comment.shopId == shopId)
            .map((comment) => {
              return (
                <div key={comment.id}>
                  {/* <div>{users.name}</div> */}
                  <strong>
                    name| 별점 {comment.rating.toFixed(1)}| {comment.date}
                  </strong>
                  <div>
                    회원권 종류 : {comment.selected}
                  </div>
                  <div>
                    가격 : {comment.price}
                  </div>
                  <button
                    onClick={() => {
                      updateCommentHandler(comment.id);
                    }}
                  >
                    수정
                  </button>
                  <button
                    onClick={() => {
                      deleteCommentHandler(comment.id);
                    }}
                  >
                    삭제
                  </button>
                  <div>{comment.comment}</div>
                </div>
              );
            })}
        </StDetailBox>
        <StDetailBox size="placeDetail">
          <h1>리뷰를 남겨보세요</h1>
          <br />
          <div>
            <StarButton active={rating >= 1} onClick={() => handleRatingSelection(1)}>
              ★
            </StarButton>
            <StarButton active={rating >= 2} onClick={() => handleRatingSelection(2)}>
              ★
            </StarButton>
            <StarButton active={rating >= 3} onClick={() => handleRatingSelection(3)}>
              ★
            </StarButton>
            <StarButton active={rating >= 4} onClick={() => handleRatingSelection(4)}>
              ★
            </StarButton>
            <StarButton active={rating >= 5} onClick={() => handleRatingSelection(5)}>
              ★
            </StarButton>
          </div>
            <StDropdownCtn>
            <StDropdown>
              <StDropdownBtn onClick={showDropdown}>
                {selected || '가격정보를 입력해주세요!!'}
                <VscTriangleDown />
                {/* 드랍다운 그리는 메인로직 */}
                {isActive && (
                  <StDropdownContent>
                    {/* map함수로 options의 요소 options을 하나하나 돌려서 리턴한다(노란색 (로 시작). 
            DropdownItem을 클릭하면 그 선택한 요소 option을 state에 넣고(setSelcted), 드랍다운 창을 닫는다(setIsActive(false)) */}
                    {options.map((option) => (
                      <StDropdownItem
                        onClick={(event) => {
                          setSelected(option);
                          setIsActive(false);
                        }}
                      >
                        {option}
                      </StDropdownItem>
                    ))}
                  </StDropdownContent>
                )}
              </StDropdownBtn>
            </StDropdown>
            <input type="text" value={price} onChange={handleChange} placeholder='ex) 3,00,000 ₩'/>
            </StDropdownCtn>


          <CommentInput
            type="text"
            value={comment}
            onChange={(event) => commentHandler(event)}
            placeholder="내용을 입력하세요."
          />
          <button onClick={addCommentHandler}>등록</button>
        </StDetailBox>
      </StDetailPage>
    </>
  );
};

export default DetailBox;

const SInfoBox = styled.div`
  flex: 1;
  margin: 500px;
`;

const SReviewBox = styled.div`
  flex: 1;
  margin: 30px;
`;

const CommentInput = styled.input`
  background: transparent;
  border: 1px solid white;
  margin-left: 20px;
  margin-bottom: 20px;
  width: 300px;
  height: 30px;
  padding: 5px;
  color: black;
`;

const StDetailPage = styled.div`
  margin: 100px auto 0px;
  border: 1px solid red;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StDetailBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  ${({ size }) => {
    switch (size) {
      case 'placeTitle':
        return css`
          width: 50%;
          height: 20%;
        `;
      case 'placeDetail':
        return css`
          width: 70%;
          height: 20%;
        `;
      case 'placeReviews':
        return css`
          width: 70%;
          height: 80%;
        `;
    }
  }}
  border: 1px solid black;

  /* align-items: center; */
`;
const StReviewCountBox = styled.div`
  display: flex;
  flex-direction: row;
`;

const StarButton = styled.button`
  font-size: 20px;
  color: ${(props) => (props.active ? 'gold' : 'gray')};
  background: transparent;
  border: none;
  cursor: pointer;
  outline: none;
`;

const StDropdownCtn = styled.div`
 display: flex;
 flex-direction: row;
`;

const StDropdown = styled.div`
  user-select: none;
  width: 300px;
  margin: 20px;
  position: relative;
`;

const StDropdownBtn = styled.div`
  cursor: pointer;
  padding: 15px 20px;
  background-color: white;
  border: 1px solid gray;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StDropdownContent = styled.div`
  position: absolute;
  top: 110%;
  left: 0;
  padding: 10px;
  background-color: white;
  border: 1px solid gray;
  border-radius: 20px;
  width: 95%;
`;

const StDropdownItem = styled.div`
  cursor: pointer;
  padding: 10px;
  transition: all 0.2s;
  &:hover {
    background-color: #f4f4f4;
  }
`;
