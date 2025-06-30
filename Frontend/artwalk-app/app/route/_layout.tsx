import React from "react"; // ← Das war bisher gefehlt!
import { Stack } from "expo-router";
import { RouteFormProvider } from "../../hooks/useRouteForm";

export default function RouteLayout() {
  return (
    <RouteFormProvider>
      <Stack />
    </RouteFormProvider>
  );
}