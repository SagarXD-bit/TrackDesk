import { CustomerForm } from "../form";

export default async function NewCustomerPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Add Customer</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Create a new customer record</p>
      </div>
      <CustomerForm />
    </div>
  );
}
