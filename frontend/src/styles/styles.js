import styled from "styled-components";

const Container = styled.div`
    background-color: #f0f0f0;
    padding: 1.5rem;
    margin: 1.5rem auto;
    max-width: 65rem;
    border-radius: 0.5rem;
    box-shadow: 0 0.2rem 1rem rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Input = styled.input`
    padding: 1rem;
  margin: 0.5rem 0;
  width: 100%;
  max-width: 20rem;
  border: 0.1rem solid #ccc;
  border-radius: 0.4rem;
`;

const Button = styled.button`
    padding: 0.75rem 1.5rem;
    margin: 0.75rem 0;
    background-color: #3f51b5;
    color: white;
    border: none;
    border-radius: 0.4rem;
    cursor: pointer;
    &:hover {
        background-color: #303f9f;
    }
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding-right: 0.75rem;
`;
const Label = styled.label`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  max-width: 20rem;
  margin-bottom: 1rem;
`;

const FormRow = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    max-width: 45rem;
    margin-bottom: 0.75rem;

    & > ${Label} {
        flex: 1;
        margin-right: 0.75rem;
    }

    & > ${Label}:last-child {
        margin-right: 0;
    }

    @media (max-width: 768px) {
        flex-direction: column;

        & > ${Label} {
            margin-right: 0;
            margin-bottom: 0.75rem;
        }
    }
`;

const DropDown = styled.select`
  padding: 1rem;
  margin: 0.5rem 0;
  width: 22.125rem;
  border: 0.1rem solid #ccc;
  border-radius: 0.4rem;
  background-color: white;
  cursor: pointer;
  color: #6c757d;

  &:focus {
    outline: none;
    border-color: #3f51b5;
  }
`;

export { Container, Input, Button, Form, Label, FormRow, DropDown };
