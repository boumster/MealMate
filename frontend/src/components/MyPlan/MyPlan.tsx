import React from "react";

import { Container, Table, TableRow, TableHeader, TableCell, ViewButton } from "../../styles/styles";

export default function MyPlan() {
  const plans = [
    { name: "Plan A", id: "1" },
    { name: "Plan B", id: "2" },
  ];

  return (
    <Container>
      <h2>My Plans</h2>
      <Table>
        <thead>
          <tr>
            <TableHeader>Plans</TableHeader>
            <TableHeader>View</TableHeader>
          </tr>
        </thead>
        <tbody>
          {plans.map((plan) => (
            <TableRow key={plan.id}>
              <TableCell width="90%">{plan.name}</TableCell>
              <TableCell>
                <ViewButton as="a" href={`/plan/${plan.id}`}>View</ViewButton>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
