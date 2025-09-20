"use client";
import React, { useMemo, useEffect, useState } from "react";
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

import AuthOptions from "./components/AuthOptions";
import CheckOutSteps from "./components/CheckOutSteps";
import { useGeoDataStore } from "@/app/lib/store/geoDataStore";

const CheckOut = () => {
  let geoData = useGeoDataStore((state)=>state.geoData)
  const router = useRouter();

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

  let [authentucated, setauthenticated] = useState(false);
  const [selectedauthtype, setSelectedAuthtype] = useState(null);

  const [session, setSession] = useState(null);

  useEffect(() => {
    const sessionValue = Cookies.get("session") || null;
    setSession(sessionValue);
    console.log("Session:", sessionValue);
  }, []);

  useEffect(() => {
    if (
      (loggedCustomer !== null &&
        loggedCustomer.customer_id &&
        session &&
        session !== null) ||
      guestCustomerValue !== ""
    ) {
      setauthenticated(true);
    } else {
      setauthenticated(false);
    }
  }, [loggedCustomer, guestCustomerValue]);

  // ✅ Calculate subtotal from newOrder
  const subtotal = useMemo(() => {
    if (!newOrder?.cart) return 0;
    return newOrder.cart.reduce((total, product) => {
      const size = product.selected_size;
      const price = parseFloat(
        product.product_sizes.find((s) => s.size === size?.user_selected_size)
          ?.price || 0
      );
      return total + price * (size?.quantity || 1);
    }, 0);
  }, [newOrder]);

  const total = subtotal;

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);

  const [showForm, setShowForm] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState("");
  const [useShippingForBilling, setUseShippingForBilling] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState("");
  const [countries, setCountries] = useState([]);
  const [formData, setFormData] = useState({
    title: "Mr",
    firstName: "",
    lastName: "",
    country: "",
    address: "",
    phone: "",
  });

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
    if (!billingFormData.firstName) newErrors.firstName = "First name is required";
    if (!billingFormData.lastName) newErrors.lastName = "Last name is required";
    if (!billingFormData.country) newErrors.country = "Country is required";
    if (!billingFormData.address) newErrors.address = "Address is required";
    if (!billingFormData.phone) newErrors.phone = "Phone number is required";
    setBillingErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


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

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row flex-1 bg-gray-50 pt-[30px] lg:pt-[85px] overflow-y-auto hide-scrollbar">
        {/* Left Section */}
        <div className=" mt-8 lg:mt-3 flex-2 hide-scrollbar w-full lg:px-[150px] lg:overflow-y-auto lg:h-[calc(100vh-80px)] ">
          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-md border border-gray-200">
            {guestCustomerValue && guestCustomerValue !== null ? (
              <div className="flex items-center gap-2 text-gray-700">
                <CiUser className="text-gray-400 text-xl" />
                <span>
                  <span className="text-gray-500">Connected as:</span>{" "}
                  <span className="text-gray-600">{guestCustomerValue}</span>
                </span>
              </div>
            ) : (
              loggedCustomer &&
              loggedCustomer.customer_id && (
                <div className="flex items-center gap-2 text-gray-700">
                  <FaRegUser className="text-gray-400 text-xl" />
                  <span>
                    <span className="text-gray-500">Customer:</span>{" "}
                    <span className="text-gray-600">
                      {loggedCustomer.email}
                    </span>
                  </span>
                </div>
              )
            )}

            <button
              className="text-gray-500 hover:text-gray-600 transition"
              aria-label="Edit email"
              onClick={() => {
                setauthenticated(false);
                clearGuestCustomer();
                setSelectedAuthtype(null);
              }}
            >
              <FiEdit className="text-xl" />
            </button>
          </div>
          {/* <div className="bg-white p-4 lg:6 text-lg ">
            {guestCustomerValue && guestCustomerValue !== null ? (
              <p><span className="text-gray-500"> <CiUser/>Guest Order:</span> {guestCustomerValue}</p>
            ) : (
              loggedCustomer &&
              loggedCustomer.customer_id && (
                <p><span className="text-gray-500"><FaRegUser/>Logged Customer:</span> {loggedCustomer.email}</p>
              )
            )}
          </div> */}

          {authentucated ? (
            <div>
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
              />
            </div>
          ) : (
            <AuthOptions
              selectedauthtype={selectedauthtype}
              setSelectedAuthtype={setSelectedAuthtype}
            />
          )}
        </div>

        {/* Right Section */}
        <div className="flex-1 w-full pb-14 lg:max-h-full bg-white overflow-y-scroll">
          <div className="bg-white p-6 space-y-6 relative lg:static">
            {/* Order Summary */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold mb-4 tracking-wide">
                Order Summary
              </h2>

              <div className="flex flex-col gap-4">
                {newOrder?.cart?.map((item, index) => {
                  const size = item.selected_size?.user_selected_size;
                  const quantity = item.selected_size?.quantity || 1;
                  const price = parseFloat(
                    item.product_sizes.find((s) => s.size === size)?.price || 0
                  );
                  return (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-20 h-24 border border-gray-200 rounded overflow-hidden">
                        <img
                          src={item.product_gallery?.[0]?.url}
                          alt={item.product_name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col flex-1">
                        <p className="text-sm text-gray-800">
                          {item.product_name}
                        </p>
                        <p className="text-xs text-gray-500">Size: {size}</p>
                        <p className="text-xs text-gray-500">Qty: {quantity}</p>
                      </div>
                      <div className="text-sm font-medium">
                        {geoData.currency_symbol}{formatPrice((geoData?.exchange_rate* price )* quantity)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Packaging & Gifting */}
            <div className="border-b border-gray-200 pb-6 pt-6">
              <h2 className="text-xl font-semibold mb-4 tracking-wide">
                Packaging &amp; Gifting
              </h2>

              <div className="flexitems-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-300">
                  🎁
                </div>
                <p className="text-sm text-gray-700">
                  {newOrder?.packaging?.selectedpackaging === "signature"
                    ? "Signature Packaging"
                    : "Standard Packaging"}
                </p>
                
              </div>
              <button className="bg-gray-300 p-3 mt-4 w-full ml-auto text-sm underline text-gray-600 hover:text-black">
                  Edit
                </button>
            </div>

            {/* Total */}
            <div className="pt-6">
              <div className="flex justify-between text-base font-semibold mb-2">
                <span>Total</span>
                <span>{geoData?.currency_symbol} {formatPrice(geoData?.exchange_rate * total)}</span>
              </div>
              <button
                onClick={() => router.push("/checkout/payment")}
                className="w-full mt-4 bg-black text-white py-3 rounded text-sm uppercase tracking-wide hover:opacity-90 transition"
              >
                Proceed to Payment
              </button>
            </div>

            {/* Terms */}
            <p className="text-center text-xs text-gray-500 mt-2">
              By placing your order you agree to the{" "}
              <a href="#" className="underline">
                terms of service
              </a>
            </p>
          </div>

          {/* Help & Services */}
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
              <div className="flex flex-col gap-3">
                <p className="mb-3 text-sm">
                  Your credit card details are safe with us. All the information
                  is protected using Secure Sockets Layer (SSL) technology.
                </p>
                <div className="flex space-x-4">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg"
                    alt="Visa"
                    className="h-6"
                  />
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg"
                    alt="Amex"
                    className="h-6"
                  />
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                    alt="Mastercard"
                    className="h-6"
                  />
                </div>
              </div>
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
                  6 pm GMT, or at any time via email.
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
                or exchange. For any questions or immediate changes, please
                contact DBC ELEGANCE Customer Care.
              </p>
            </AccordionItem>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;
