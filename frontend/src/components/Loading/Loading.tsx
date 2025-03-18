import styled, { keyframes } from "styled-components";

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 20px;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

interface LoadingProps {
  size?: "small" | "medium" | "large";
}

export default function Loading({ size = "medium" }: LoadingProps) {
  const getSize = () => {
    switch (size) {
      case "small":
        return "20px";
      case "large":
        return "60px";
      default:
        return "40px";
    }
  };

  return (
    <SpinnerContainer>
      <Spinner style={{ width: getSize(), height: getSize() }} />
    </SpinnerContainer>
  );
}
