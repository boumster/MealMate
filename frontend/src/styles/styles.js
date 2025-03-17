import styled from 'styled-components';

// Container for centering content
const Container = styled.div`
  background-color: #f0f0f0;
  padding: 2rem;
  margin: 2rem auto;
  max-width: 50rem;
  border-radius: 0.5rem;
  box-shadow: 0 0.2rem 1rem rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// Table styles
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  border: 1px solid #ddd;

  @media (max-width: 768px) {
    display: none; /* Hide table on small screens */
  }
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #ddd;
`;

const TableHeader = styled.th`
  background-color: #3f51b5;
  color: white;
  padding: 1rem;
  text-align: left;
`;

const TableCell = styled.td`
  padding: 1rem;
  text-align: left;
`;

// Button with hover effect
const Button = styled.button`
  padding: 1rem 2rem;
  margin: 1rem 0;
  background-color: #3f51b5;
  color: white;
  border: none;
  border-radius: 0.4rem;
  cursor: pointer;

  &:hover {
    background-color: #303f9f;
  }
`;

// Input field styling
const Input = styled.input`
  padding: 1rem;
  margin: 0.5rem 0;
  width: 100%;
  max-width: 20rem;
  border: 0.1rem solid #ccc;
  border-radius: 0.4rem;
`;

// Form styles
const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding-right: 1rem;
`;

// Labels for forms
const Label = styled.label`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  max-width: 20rem;
  margin-bottom: 1rem;
`;

// Form layout row
const FormRow = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 50rem;
  margin-bottom: 1rem;

  & > ${Label} {
    flex: 1;
    margin-right: 1rem;
  }

  & > ${Label}:last-child {
    margin-right: 0;
  }

  @media (max-width: 768px) {
    flex-direction: column;

    & > ${Label} {
      margin-right: 0;
      margin-bottom: 1rem;
    }
  }
`;

// Responsive List View (alternative for small screens)
const ResponsiveList = styled.div`
  display: block; /* Always show list format */

  & div {
    margin-bottom: 1.5rem;
  }

  & h3 {
    background-color: #3f51b5;
    color: white;
    padding: 0.8rem;
    border-radius: 5px;
    margin-bottom: 0.5rem;
  }

  & p {
    margin-left: 1rem;
  }
`;

// Styled button for table actions (viewing plans)
const ViewButton = styled(Button)`
  padding: 0.5rem 1rem;
  font-size: 1rem;
`;

export { Container, FormRow, Input, Table, Button, TableRow, Form, Label, TableHeader, TableCell, ResponsiveList, ViewButton };
