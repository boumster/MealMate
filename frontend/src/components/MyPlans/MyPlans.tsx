import React, { useState, useEffect } from "react";

import {
  Container,
  Table,
  TableRow,
  TableHeader,
  TableCell,
  ViewButton,
} from "../../styles/styles";
import { useAuth } from "../../context/Auth/AuthProvider";
import { fetchMealPlans } from "../../utilities/api";

interface PlanResponse {
  id: number;
  title: string;
}

export default function MyPlans() {
  const { user } = useAuth();
  const [plans, setPlans] = useState<PlanResponse[]>([]);
  

  useEffect(() => {
    if (user) {
      fetchPlans();
    }
  }, [user]);

  async function fetchPlans() {
    try {
      const response = await fetchMealPlans(user);
      setPlans(response.mealPlans);
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  }

  useEffect(() => {
    console.log("Plans:", plans);
  }, [plans]);

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
          {plans && plans.map((plan: PlanResponse) => (
            <TableRow key={plan.id}>
              <TableCell width="90%">{plan.title}</TableCell>
              <TableCell>
                <ViewButton as="a" href={`/plan/${plan.id}`}>
                  View
                </ViewButton>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
