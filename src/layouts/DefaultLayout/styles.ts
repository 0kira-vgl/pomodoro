import styled from "styled-components";

export const LayoutContainer = styled.div`
  max-width: 74rem;
  height: calc(100vh - 7rem);
  margin: 3rem auto;
  padding: 2.5rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  background: ${(props) => props.theme["gray-800"]};
`;
