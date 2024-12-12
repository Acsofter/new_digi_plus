import { PaymentsFilters } from "../Payments/components/PaymentsFilters";
import { PaymentsTable } from "../Payments/components/PaymentsTable";
import {
  PaymentProvider
} from "../Payments/contexts/PaymentContext";

export const Payments = () => {
  return (
    <div className="w-full">
      <PaymentProvider>
        <PaymentsFilters />
        <PaymentsTable />
      </PaymentProvider>
    </div>
  );
};
