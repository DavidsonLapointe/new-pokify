
import { SetupStripeProducts } from "@/components/admin/stripe/SetupStripeProducts";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F1F0FB] to-white py-12">
      <div className="container">
        <h1 className="text-4xl font-bold text-center mb-8">Leadly</h1>
        <div className="max-w-xl mx-auto">
          <SetupStripeProducts />
        </div>
      </div>
    </div>
  );
}
