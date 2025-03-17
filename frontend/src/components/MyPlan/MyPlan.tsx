import React from "react";

import { Container, Table, TableRow, TableHeader, TableCell, ViewButton } from "../../styles/styles";

export default function myplan() {
  const plans = [
    { name: "Plan A", id: "1" },
    { name: "Plan B", id: "2" },
  ];

  return (
    <Container>
      <h2>Plans</h2>
      <p>Based on your requirements, here is a plan just for you!</p>
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
              <TableCell>{plan.name}</TableCell>
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
