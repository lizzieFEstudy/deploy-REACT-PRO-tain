import { css, styled } from "styled-components";

export const CommentInput = styled.input`
  background: transparent;
  border: 1px solid white;
  margin-left: 20px;
  margin-bottom: 20px;
  width: 300px;
  height: 30px;
  padding: 5px;
  color: black;
`;

export const StDetailPage = styled.div`
  margin: 100px auto 0px;
  border: 1px solid red;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const StDetailBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  ${({ size }) => {
    switch (size) {
      case 'placeTitle':
        return css`
          width: 70%;
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
`;

export const StReviewCountBox = styled.div`
  display: flex;
  flex-direction: row;
`;

export const StarButton = styled.button`
  font-size: 20px;
  color: ${(props) => (props.active ? 'gold' : 'gray')};
  background: transparent;
  border: none;
  cursor: pointer;
  outline: none;
`;

export const StCommentBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid #ccc;
  padding: 10px;
  margin: 10px 0;
  position: relative;
`;

export const StCommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
`;

export const StCommentContent = styled.div`
  margin-bottom: 10px;
`;

export const StCommentButtons = styled.div`
  display: flex;
  gap: 5px;
`;

export const StBtnWrap = styled.div`
  position: absolute;
  top: 5px;
  right: 5px;
  display: flex;
  gap: 5px;
`;

export const StCommentDetails = styled.div`
  display: flex;
  align-items: center;
`;

export const StDropdownCtn = styled.div`
 display: flex;
 flex-direction: row;
`;

export const StDropdown = styled.div`
  user-select: none;
  width: 300px;
  margin: 20px;
  position: relative;
`;

export const StDropdownBtn = styled.div`
  cursor: pointer;
  padding: 15px 20px;
  background-color: white;
  border: 1px solid gray;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const StDropdownContent = styled.div`
  position: absolute;
  top: 110%;
  left: 0;
  padding: 10px;
  background-color: white;
  border: 1px solid gray;
  border-radius: 20px;
  width: 95%;
`;

export const StDropdownItem = styled.div`
  cursor: pointer;
  padding: 10px;
  transition: all 0.2s;
  &:hover {
    background-color: #f4f4f4;
  }
`;