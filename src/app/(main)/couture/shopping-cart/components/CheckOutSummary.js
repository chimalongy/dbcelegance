export default function CheckoutSummary() {
  return (
    <div className=" bg-white p-6  shadow  space-y-6 relative lg:static">
      {/* Total Section */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Total</h2>
        <div className="flex justify-between text-gray-700">
          <span>Subtotal</span>
          <span className="font-medium">8.700,00 €</span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>Delivery</span>
          <a href="#" className="text-sm text-gray-500 underline">
            Estimated delivery time and costs
          </a>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>Incl. taxes</span>
          <span className="font-medium">1.450,00 €</span>
        </div>
      </div>

      {/* Checkout Button */}
      <button className="absolute left-0 right-0 m-auto  lg:static w-[80%] bg-gray-800 text-white p-4  font-medium hover:bg-gray-900">
    Continue to checkout
        <span className="float-right">8.700,00 €</span>
      </button>

      {/* Divider */}
      <div className="flex items-center space-x-2">
        <div className="flex-1 border-t border-gray-300" />
        <span className="text-sm text-gray-500">or pay with</span>
        <div className="flex-1 border-t border-gray-300" />
      </div>

      {/* PayPal */}
      <button className="w-full border rounded-md py-3 flex justify-center hover:bg-gray-50">
        <img
          src="https://www.paypalobjects.com/webstatic/icon/pp258.png"
          alt="PayPal"
          className="h-5"
        />
      </button>

      {/* Terms */}
      <p className="text-center text-xs text-gray-500">
        By placing your order you agree to the{' '}
        <a href="#" className="underline">
          terms of service
        </a>
      </p>
    </div>
  );
}
