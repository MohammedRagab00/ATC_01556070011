import styled from "styled-components";

const Button = styled.button`
  background: ${({ theme }) => theme.accent};
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

export default Button;
