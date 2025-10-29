"use client";
import React, { useMemo, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { useRouter } from "next/navigation";
import { FiChevronDown } from "react-icons/fi";
import { RiSecurePaymentLine } from "react-icons/ri";
import { CiUser } from "react-icons/ci";
import { FaRegUser } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import {
  MdOutlineContactSupport,
  MdOutlineCalendarToday,
} from "react-icons/md";
import { CiDeliveryTruck } from "react-icons/ci";
import Cookies from "js-cookie";

import { useGuestCustomerStore } from "@/app/lib/store/guestCustomer";
import { useLoggedCustomerStore } from "@/app/lib/store/loggedCustomer";
import { useNewOrderStorage } from "@/app/lib/store/neworder";
import { useGeoDataStore } from "@/app/lib/store/geoDataStore";

import AuthOptions from "./components/AuthOptions";
import CheckOutSteps from "./components/CheckOutSteps";
import axios from "axios";
import { apiSummary } from "@/app/lib/apiSummary";
import toast from "react-hot-toast";
import CategoryLoader from "@/app/components/CategoryLoader copy";

const CheckOut = () => {
  const [showpage, setShowpage] = useState(false);
  const [handlingPayment, sethandlingPayment] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [selectedAuthType, setSelectedAuthType] = useState(null);
  const [session, setSession] = useState(null);

  const router = useRouter();
  const geoData = useGeoDataStore((state) => state.geoData);
  const loggedCustomer = useLoggedCustomerStore(
    (state) => state.loggedCustomer
  );
  const guestCustomerValue = useGuestCustomerStore(
    (state) => state.guestCustomer
  );
  const clearGuestCustomer = useGuestCustomerStore(
    (state) => state.clearGuestCustomer
  );
  const newOrder = useNewOrderStorage((state) => state.newOrder);

  const [showForm, setShowForm] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState("");
  const [useShippingForBilling, setUseShippingForBilling] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState("");
  const [countries, setCountries] = useState([]);
  const [formData, setFormData] = useState({
    title: "Mr",
    firstName: "Chimaobi",
    lastName: "Olegeme",
    country: "Nigeria",
    address: "123 Main St",
    phone: "1234567890",
  });
  // const [formData, setFormData] = useState({
  //   title: "Mr",
  //   firstName: "",
  //   lastName: "",
  //   country: "",
  //   address: "",
  //   phone: "",
  // });

  const [billingFormData, setBillingFormData] = useState({
    title: "Mr",
    firstName: "",
    lastName: "",
    country: "",
    address: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const [billingErrors, setBillingErrors] = useState({});
  const [completedSteps, setCompletedSteps] = useState({
    shippingAddress: false,
    shippingMethod: false,
    billingPayment: false,
  });
  const [isPurchaseReady, setIsPurchaseReady] = useState(false);

  const allStepsCompleted =
    completedSteps.shippingAddress &&
    completedSteps.shippingMethod &&
    completedSteps.billingPayment &&
    isPurchaseReady;

  // ✅ Calculate subtotal from newOrder
  const subtotal = useMemo(() => {
    if (!newOrder?.cart) return 0;
    return newOrder.cart.reduce((total, item) => {
      const size = item.selected_size;

      if (item.product_sizes) {
        const price = parseFloat(
          item.product_sizes.find((s) => s.size === size?.user_selected_size)
            ?.price || 0
        );
        return total + price * (size?.quantity || 1);
      }

      if (item.accessory_sizes) {
        const price = parseFloat(
          item.accessory_sizes.find((s) => s.size === size?.user_selected_size)
            ?.price || 0
        );
        return total + price * (size?.quantity || 1);
      }

      return total;
    }, 0);
  }, [newOrder]);

  const total = subtotal;

  // ✅ Format price for display
  const formatPrice = (price) =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);

  // ✅ Initialize Flutterwave payment
  const initializeFlutterwavePayment = () => {
    return new Promise((resolve, reject) => {
      if (typeof window === "undefined" || !window.FlutterwaveCheckout) {
        reject(new Error("Flutterwave not loaded"));
        return;
      }

      // Get email based on authentication type
      let customerEmail = guestCustomerValue; // Default to guest email
      
      // If user is logged in, use their email
      if (session && loggedCustomer) {
        // Try different possible email field names
        customerEmail = loggedCustomer.email || 
                       loggedCustomer.customer_email || 
                       loggedCustomer.user_email || 
                       guestCustomerValue;
      }

      const paymentData = {
        public_key: "FLWPUBK_TEST-95c42ef0e76da405eab51c16a67d8de8-X", // Replace with your Flutterwave public key
        tx_ref: `DBC-${Date.now()}`,
        amount: total,
        currency: geoData?.currency_code,
        payment_options: "card, banktransfer, ussd",
        customer: {
          email: customerEmail,
          phone_number: formData.phone,
          name: `${formData.firstName} ${formData.lastName}`,
        },
        customizations: {
          title: "DBC ELEGANCE",
          description: "Payment for items in cart",
          logo: "https://your-logo-url.com/logo.png", // Add your logo URL
        },
        callback: (response) => {
          // Payment successful
          if (response.status === "successful") {
            resolve(response);
          } else {
            reject(new Error("Payment failed or was cancelled"));
          }
        },
        onclose: () => {
          reject(new Error("Payment window closed"));
        },
      }; 

      // Initialize Flutterwave payment
      window.FlutterwaveCheckout(paymentData);
    });
  };

  // ✅ Handle payment with Flutterwave
  const handlePayment = async () => {
    sethandlingPayment(true);
    try {
      // First, prepare the order data
      let order = { ...newOrder };
      order["shipping_address"] = formData;
      order["billing_address"] = useShippingForBilling
        ? formData
        : billingFormData;
      order["customer_email"] =
        session && loggedCustomer?.id
          ? loggedCustomer?.customer_email
          : guestCustomerValue;
      order["sub_total"] = formatPrice(geoData?.exchange_rate * subtotal);
      order["total"] = formatPrice(geoData?.exchange_rate * total);
      order["geo_data"] = geoData;
      order["use_shipping_address"] = useShippingForBilling;

      console.log("order", order);

      // Initialize Flutterwave payment
      const paymentResponse = await initializeFlutterwavePayment();
      
      // If payment is successful, send order to your backend
      if (paymentResponse.status === "successful") {
        console.log("Payment successful:", paymentResponse);
        
        // Add payment reference to order
        order["payment_reference"] = paymentResponse.tx_ref;
        order["flutterwave_transaction_id"] = paymentResponse.transaction_id;
        
        // Send order to your backend
        const result = await axios.post(apiSummary.store.orders.new_order, order);

        if (result.data.success) {
          toast.success("Payment successful! Order created.");
          router.push("/couture/checkout/order-recieved");
        } else {
          toast.error("Failed to create order: " + result.data.message);
        }
      }
    } catch (error) {
      console.error("❌ Error in handlePayment:", error);
      if (error.message === "Payment window closed") {
        toast.error("Payment was cancelled. Please try again.");
      } else if (error.message === "Payment failed or was cancelled") {
        toast.error("Payment failed. Please try again.");
      } else {
        toast.error("An error occurred during payment. Please try again.");
      }
    } finally {
      sethandlingPayment(false);
    }
  };

  // ✅ Load Flutterwave script dynamically
  useEffect(() => {
    const loadFlutterwaveScript = () => {
      return new Promise((resolve, reject) => {
        if (typeof window === "undefined") {
          reject(new Error("Window is not defined"));
          return;
        }

        // Check if script is already loaded
        if (window.FlutterwaveCheckout) {
          resolve();
          return;
        }

        const script = document.createElement("script");
        script.src = "https://checkout.flutterwave.com/v3.js";
        script.async = true;
        
        script.onload = () => {
          console.log("Flutterwave script loaded successfully");
          resolve();
        };
        
        script.onerror = () => {
          reject(new Error("Failed to load Flutterwave script"));
        };

        document.head.appendChild(script);
      });
    };

    // Load Flutterwave script when component mounts
    loadFlutterwaveScript().catch(console.error);
  }, []);

  // ✅ Control when page is visible and reset auth state
  useEffect(() => {
    if (newOrder && Object.keys(newOrder).length > 0) {
      setShowpage(true);
      // Always reset auth state when entering checkout
      setAuthenticated(false);
      setSelectedAuthType(null);
      clearGuestCustomer();
      
      // If user is logged in, set up the logged in option
      if (loggedCustomer?.customer_id) {
        setSelectedAuthType('logged');
      }
    }
  }, [newOrder, clearGuestCustomer, loggedCustomer]);

  // ✅ Validate session cookie
  useEffect(() => {
    const sessionValue = Cookies.get("session");
    if (
      !sessionValue ||
      sessionValue === "null" ||
      sessionValue === "undefined"
    ) {
      Cookies.remove("session");
      setSession(null);
    } else {
      setSession(sessionValue);
    }
  }, []);

  // ✅ Authentication logic - handle auth state based on selected type
  useEffect(() => {
    if (!selectedAuthType) {
      setAuthenticated(false);
      return;
    }

    // Handle different authentication scenarios
    switch (selectedAuthType) {
      case 'logged':
        // User chose to continue as logged in
        setAuthenticated(true);
        clearGuestCustomer(); // Clear any guest data
        break;
        
      case 'guest':
      case 'guest-continue':
        // User chose to continue as guest
        setAuthenticated(true);
        break;
        
      case 'logout':
        // Handle logout case
        setAuthenticated(false);
        setSelectedAuthType(null);
        clearGuestCustomer();
        break;
        
      default:
        setAuthenticated(false);
    }
  }, [selectedAuthType, clearGuestCustomer]);

  // ✅ Reset authentication when user clicks edit
  const handleEditAuth = () => {
    setAuthenticated(false);
    clearGuestCustomer();
    setSelectedAuthType(null);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.country) newErrors.country = "Country is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateBilling = () => {
    const newErrors = {};
    if (!billingFormData.firstName)
      newErrors.firstName = "First name is required";
    if (!billingFormData.lastName) newErrors.lastName = "Last name is required";
    if (!billingFormData.country) newErrors.country = "Country is required";
    if (!billingFormData.address) newErrors.address = "Address is required";
    if (!billingFormData.phone) newErrors.phone = "Phone number is required";
    setBillingErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Accordion reusable component
  const AccordionItem = ({ title, children, defaultOpen = false }) => {
    const [open, setOpen] = useState(defaultOpen);
    return (
      <div className="border-b border-gray-200 p-3 flex flex-col gap-4">
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between py-4 text-left"
        >
          <span className="font-medium text-sm uppercase tracking-wide text-gray-700">
            {title}
          </span>
          <FiChevronDown
            className={`h-4 w-4 transition-transform duration-200 text-gray-500 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
        {open && <div className="pb-4 text-sm text-gray-600">{children}</div>}
      </div>
    );
  };

  // ✅ Helper for product display
  const getProductDisplayInfo = (item) => {
    const size = item.selected_size?.user_selected_size;
    const quantity = item.selected_size?.quantity || 1;

    if (item.product_sizes) {
      const price = parseFloat(
        item.product_sizes.find((s) => s.size === size)?.price || 0
      );
      return {
        name: item.product_name,
        image: item.product_gallery?.[0]?.url,
        size,
        quantity,
        price,
        type: "product",
      };
    }

    if (item.accessory_sizes) {
      const price = parseFloat(
        item.accessory_sizes.find((s) => s.size === size)?.price || 0
      );
      return {
        name: item.accessory_name,
        image: item.accessory_gallery?.[0]?.url,
        size,
        quantity,
        price,
        type: "accessory",
      };
    }

    return {
      name: "Unknown Product",
      image: "",
      size: "",
      quantity: 1,
      price: 0,
      type: "unknown",
    };
  };

  // ✅ Get display email for authenticated user
  const getDisplayEmail = () => {
    if (loggedCustomer && loggedCustomer.customer_id) {
      return loggedCustomer.email;
    } else if (guestCustomerValue) {
      return guestCustomerValue;
    }
    return "";
  };

  // ✅ Page loader until data is ready
  if (!showpage) return <CategoryLoader />;

  return (
    <div className="min-h-screen flex flex-col hide-scrollbar">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white px-4 py-4 md:px-6 md:py-6 flex border-b border-gray-200 ">
        <div className="flex items-center cursor-pointer" onClick={router.back}>
          <MdKeyboardArrowLeft size={24} className="text-gray-700" />
          <p className="text-sm text-gray-700">Back</p>
        </div>
        <div className="mx-auto flex flex-row text-xl gap-3 items-center text-black">
          <p className="tracking-wide lg:text-3xl">DBC ELEGANCE</p>
        </div>
      </div>

      {/* Main */}
      <div className="flex flex-col lg:flex-row flex-1 bg-gray-50 pt-[30px] lg:pt-[85px] overflow-y-auto hide-scrollbar">
        {/* LEFT */}
        <div className="mt-8 lg:mt-3 flex-2 hide-scrollbar w-full lg:px-[150px] lg:overflow-y-auto lg:h-[calc(100vh-80px)] ">
          {/* Always show AuthOptions when not authenticated or when editing */}
          {!authenticated || selectedAuthType === 'edit' ? (
            <div className="w-full">
              <div className="mb-6 text-center">
                <h2 className="text-xl font-medium text-gray-900">How would you like to continue?</h2>
                <p className="text-gray-600 mt-2">Choose an option to proceed with your order</p>
              </div>
              <AuthOptions
                selectedauthtype={selectedAuthType}
                setSelectedAuthtype={(type) => {
                  if (type === 'edit') {
                    // Clear auth and show auth options
                    setAuthenticated(false);
                    setSelectedAuthType(null);
                    clearGuestCustomer();
                  } else {
                    setSelectedAuthType(type);
                  }
                }}
              />
            </div>
          ) : (
            // Show user info when authenticated
            <div>
              <div className="flex flex-col justify-between bg-gray-50 rounded-md border border-gray-200">
                <div className="flex flex-row justify-between items-center px-3 py-4">
                  <div className="flex   items-center gap-2 text-gray-700">
                    {loggedCustomer && loggedCustomer.customer_id ? (
                      <FaRegUser className="text-gray-400 text-xl" />
                    ) : (
                      <CiUser className="text-gray-400 text-xl" />
                    )}
                    <span>
                      <span className="text-gray-500">
                        {loggedCustomer && loggedCustomer.customer_id
                          ? "Customer:"
                          : "Connected as:"}
                      </span>{" "}
                      <span className="text-gray-600">{getDisplayEmail()}</span>
                    </span>
                  </div>
                  <button 
                    className="text-gray-500 hover:text-gray-600 transition"
                    onClick={handleEditAuth}
                  >
                    <FiEdit className="text-xl" />
                  </button>
                </div>

                <CheckOutSteps
                  showForm={showForm}
                  setShowForm={setShowForm}
                  selectedShipping={selectedShipping}
                  setSelectedShipping={setSelectedShipping}
                  useShippingForBilling={useShippingForBilling}
                  setUseShippingForBilling={setUseShippingForBilling}
                  selectedPayment={selectedPayment}
                  setSelectedPayment={setSelectedPayment}
                  formData={formData}
                  setFormData={setFormData}
                  billingFormData={billingFormData}
                  setBillingFormData={setBillingFormData}
                  errors={errors}
                  setErrors={setErrors}
                  billingErrors={billingErrors}
                  setBillingErrors={setBillingErrors}
                  countries={countries}
                  setCountries={setCountries}
                  validate={validate}
                  validateBilling={validateBilling}
                  completedSteps={completedSteps}
                  setCompletedSteps={setCompletedSteps}
                  isPurchaseReady={isPurchaseReady}
                  setIsPurchaseReady={setIsPurchaseReady}
                  // Pass the handlePayment function and loading state
                  handlePayment={handlePayment}
                  handlingPayment={handlingPayment}
                  sethandlingPayment={sethandlingPayment}
                />
              </div>
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="flex-1 w-full pb-14 lg:max-h-full bg-white overflow-y-scroll">
          <div className="bg-white p-6 space-y-6 relative lg:static">
            {/* Order Summary */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold mb-4 tracking-wide">
                Order Summary
              </h2>

              <div className="flex flex-col gap-4">
                {newOrder?.cart?.map((item, index) => {
                  const productInfo = getProductDisplayInfo(item);
                  return (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-20 h-24 border border-gray-200 rounded overflow-hidden">
                        <img
                          src={productInfo.image}
                          alt={productInfo.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col flex-1">
                        <p className="text-sm text-gray-800">
                          {productInfo.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Size: {productInfo.size}
                        </p>
                        <p className="text-xs text-gray-500">
                          Qty: {productInfo.quantity}
                        </p>
                        <p className="text-xs text-gray-400">
                          {productInfo.type === "accessory"
                            ? "Accessory"
                            : "Product"}
                        </p>
                      </div>
                      <div className="text-sm font-medium">
                        {geoData.currency_symbol}
                        {formatPrice(
                          geoData?.exchange_rate *
                            productInfo.price *
                            productInfo.quantity
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Packaging */}
            <div className="border-b border-gray-200 pb-6 pt-6">
              <h2 className="text-xl font-semibold mb-4 tracking-wide">
                Packaging &amp; Gifting
              </h2>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-300">
                  🎁
                </div>
                <p className="text-sm text-gray-700">
                  {newOrder?.packaging?.selectedpackaging === "signature"
                    ? "Signature Packaging"
                    : "Standard Packaging"}
                </p>
              </div>
              <button
                className="bg-gray-400 p-3 mt-4 w-full text-sm text-gray-600 hover:text-black"
                onClick={router.back}
              >
                Edit
              </button>
            </div>

            {/* Total */}
            <div className="pt-6">
              <div className="flex justify-between text-base font-semibold mb-2">
                <span>Total</span>
                <span>
                  {geoData?.currency_symbol}{" "}
                  {formatPrice(geoData?.exchange_rate * total)}
                </span>
              </div>

              <button
                onClick={handlePayment}
                disabled={
                  !allStepsCompleted || !authenticated || handlingPayment
                }
                className={`w-full mt-4 px-6 py-3 rounded text-sm uppercase tracking-wide transition ${
                  allStepsCompleted && authenticated && !handlingPayment
                    ? "bg-black text-white hover:opacity-90 cursor-pointer"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {handlingPayment ? "Processing..." : "Proceed to Payment"}
              </button>
            </div>

            <p className="text-center text-xs text-gray-500 mt-2">
              By placing your order you agree to the{" "}
              <a href="#" className="underline">
                terms of service
              </a>
            </p>
          </div>

          {/* Help Section */}
          <div className="p-6 bg-white">
            <h2 className="text-xl font-semibold mb-4 tracking-wide">
              Help &amp; Services
            </h2>

            <AccordionItem
              title={
                <div className="flex gap-2 items-center text-gray-600">
                  <RiSecurePaymentLine size={20} />
                  <p className="text-sm uppercase tracking-wide">
                    100% secure payment
                  </p>
                </div>
              }
              defaultOpen
            >
              <p className="mb-3 text-sm">
                Your credit card details are safe with us. All the information
                is protected using SSL encryption.
              </p>
            </AccordionItem>

            <AccordionItem
              title={
                <div className="flex gap-2 items-center text-gray-600">
                  <MdOutlineContactSupport size={20} />
                  <p className="text-sm uppercase tracking-wide">
                    Need assistance?
                  </p>
                </div>
              }
            >
              <div className="flex flex-col gap-3">
                <p className="pb-2.5 text-sm">
                  DBC ELEGANCE Client Service Center is available by phone from
                  Monday to Friday from 10 am to 8 pm and Saturday from 10 am to
                  6 pm GMT, or via email.
                </p>
                <div className="bg-black text-white rounded-sm p-3 text-sm">
                  Contact us by phone: 08157967548
                </div>
                <div className="bg-black text-white rounded-sm p-3 text-sm">
                  Contact us by email: support@dbcelegance.com
                </div>
              </div>
            </AccordionItem>

            <AccordionItem
              title={
                <div className="flex gap-2 items-center text-gray-600">
                  <CiDeliveryTruck size={20} />
                  <p className="text-sm uppercase tracking-wide">
                    Free standard delivery
                  </p>
                </div>
              }
            >
              <p className="text-sm">
                Enjoy free standard delivery on all orders.
              </p>
            </AccordionItem>

            <AccordionItem
              title={
                <div className="flex gap-2 items-center text-gray-600">
                  <MdOutlineCalendarToday size={20} />
                  <p className="text-sm uppercase tracking-wide">
                    Free returns within 30 days
                  </p>
                </div>
              }
            >
              <p className="text-sm">
                You have 30 days from the date of delivery to request a refund
                or exchange. For questions, contact our Customer Care.
              </p>
            </AccordionItem>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;