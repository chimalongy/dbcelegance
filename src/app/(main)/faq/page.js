"use client";
import Navbar from '@/app/components/Nav';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MdKeyboardArrowLeft } from "react-icons/md";

const FAQCouture = () => {
    let router = useRouter();
  const [activeCategory, setActiveCategory] = useState('About The DBC ELEGANCE Site');
  const [openItems, setOpenItems] = useState(new Set());

  const toggleItem = (id) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  const categories = [
    {
      title: 'About The DBC ELEGANCE Site',
      count: 3,
      items: [
        {
          id: 'security',
          question: 'WHAT IS DBC ELEGANCE\'S POLICY ON CONFIDENTIALITY?',
          answer: `The processing, confidentiality and security of your personal data is important to us.

We are committed to offering you personalised services, while respecting your privacy and choices, in accordance with the applicable personal data regulations, in particular the General Data Protection Regulation (GDPR).

Please consult the DBC ELEGANCE privacy policy in the Privacy Policy section.

In order to provide you with the same personalised service worldwide, your data may be consulted by DBC ELEGANCE entities situated in France and abroad, including countries where the applicable personal data legislation differs from that in force in your own or within the European Union, for example to access your purchase history from a boutique other than your main boutique. Your personal data might also be processed by our account for the purposes described above by our trusted third-party suppliers. We take all necessary safeguards, notably contractual, technical and organisational measures to guarantee the privacy and security of your data and to protect such data from any misrepresentation, damage, destruction or access by unauthorised third parties.

It is important that you can control your personal data. In accordance with GDPR, you have the right to access and make corrections to your personal data, in addition to the right to request its removal, to oppose the use of your data providing you have a legitimate reason, and to obtain limitation and portability, as far as this is applicable. You are also able to request to no longer receive personalised communications about our products and services.`
        },
        {
          id: 'news',
          question: 'HOW CAN I FOLLOW DBC ELEGANCE NEWS?',
          answer: `By subscribing to the DBC ELEGANCE Newsletter, you will be one of the first to hear about new products, events and news from the House of DBC ELEGANCE.`
        },
        {
          id: 'fashion-shows',
          question: 'DBC ELEGANCE FASHION SHOWS',
          items: [
            {
              id: 'attend-show',
              question: 'HOW CAN I ATTEND A DBC ELEGANCE FASHION SHOW?',
              answer: `DBC ELEGANCE does not sell tickets to the fashion shows. Guests invited to our fashion shows are selected by our press relations department located at our Paris headquarters. 
However, you can view our fashion shows by going to the "Women" section and/or the "Men" section on the DBC ELEGANCE website.`
            },
            {
              id: 'watch-show',
              question: 'HOW CAN I WATCH A DBC ELEGANCE FASHION SHOW?',
              answer: `You can view DBC ELEGANCE fashion shows by going to the DBC ELEGANCE website, and clicking on "Women's Fashion" or "Men's Fashion". You will find our Haute Couture fashion shows as well as "ready-to-wear" and the silhouettes from the catwalks.`
            }
          ]
        }
      ]
    },
    {
      title: 'ONLINE BOUTIQUE',
      count: 9,
      items: [
        {
          id: 'products',
          question: 'DBC ELEGANCE PRODUCTS',
          items: [
            {
              id: 'purchase-online',
              question: 'CAN I PURCHASE DBC ELEGANCE PRODUCTS ON THE ONLINE BOUTIQUE?',
              answer: `A product is available for online purchase whenever the word "Order" appears. You can also contact the Client Service Center where our Client Advisors can assist you with your purchases and, if you wish, reserve your articles at the boutique of your choice.`
            },
            {
              id: 'find-boutique',
              question: 'HOW CAN I FIND A DBC ELEGANCE BOUTIQUE?',
              answer: `DBC ELEGANCE products are sold in more than 220 DBC ELEGANCE boutiques around the world.

You can find the list of our DBC ELEGANCE boutiques at DBC ELEGANCE.com by clicking on "Boutiques".`
            },
            {
              id: 'product-availability',
              question: 'HOW CAN I FIND OUT IF A PRODUCT IS AVAILABLE ON DBC ELEGANCE.COM?',
              answer: `Some of our DBC ELEGANCE items are available for purchase on the DBC ELEGANCE.com website. In order to check the availability of an item, choose the article that interests you on our website and click on it. This will result in one of two things:
If the "order" button appears, this means that you can order it online. Please be aware that only the available sizes will be displayed.
It is, however, possible that the item you are looking for is not available for online purchase, in which case it will be marked "only available in boutiques".

You can also contact the Client Service Center, where our Client Advisors will be delighted to assist you with your purchases and, if you wish, reserve your articles at the boutique of your choice.`
            },
            {
              id: 'find-product',
              question: 'HOW CAN I FIND A PRODUCT ON DBC ELEGANCE.COM?',
              answer: `The products on the website are organized by categories and by product line.
Please use the search engine, indicated by a magnifying glass, and enter the key words. All the products with a relevant match to your search will be presented.

If you have seen a DBC ELEGANCE product in the press (magazine, TV ad, social media, etc.) that is of interest to you and you cannot find it on our website, please contact our Client Service Center. Our Client Advisors will provide you with information on the product features and availability in boutiques.`
            },
            {
              id: 'product-price',
              question: 'HOW CAN I FIND OUT THE PRICE OF A DBC ELEGANCE PRODUCT THAT IS NOT ON THE WEBSITE?',
              answer: `We invite you to visit one of our DBC ELEGANCE boutiques to discover our selection of items and prices. We will be happy to show you our collections. You can find the list of our DBC ELEGANCE boutiques at DBC ELEGANCE.com by clicking on "Boutiques".

Our Client Advisors are also available to help you.`
            }
          ]
        },
        {
          id: 'account',
          question: 'YOUR ACCOUNT',
          items: [
            {
              id: 'create-account',
              question: 'HOW CAN I CREATE AN ACCOUNT?',
              answer: `You can create your DBC ELEGANCE customer account by clicking on the "Your Account" section located in the menu at the top of our website. Then click on "Create an Account" and fill in the obligatory information marked with an asterisk. Finally, click on "Validate". You will be sent a confirmation email to the address provided when creating your account.If you require assistance or further information, please contact our Client Service Center.`
            },
            {
              id: 'account-advantages',
              question: 'WHAT ARE THE ADVANTAGES OF CREATING AN ACCOUNT?',
              answer: `Creating an account on www.dbcelegance.com enables you to be identified quickly by DBC ELEGANCE when you make online purchases.
You can also:
- consult your order history
- track the delivery of your orders
- exchange or return products
- update your contact information

For your security, DBC ELEGANCE.com does not save your credit card information and will not under any circumstances share your personal data with any third parties.`
            },
            {
              id: 'modify-account',
              question: 'CAN I MAKE CHANGES OR CANCEL MY ACCOUNT ON DBC ELEGANCE.COM?',
              answer: `You can modify the information on your DBC ELEGANCE account by clicking on "Your account". Enter your user ID and your password and, once you are logged in, click on "My profile" to change or delete information.
If you want to delete your account, please contact our Client Service Center where a Client Advisor will assist you with the steps to follow.`
            },
            {
              id: 'password-recovery',
              question: 'HOW CAN I FIND MY ACCOUNT PASSWORD?',
              answer: `If you forget your password, click on "Your account" and then on "Forgot my password". An email will be sent to you to reset your password.`
            }
          ]
        },
        {
          id: 'order',
          question: 'YOUR ORDER',
          items: [
            {
              id: 'place-order',
              question: 'HOW CAN I PLACE AN ONLINE ORDER?',
              answer: `Some of our DBC ELEGANCE products are available for purchase on our website.
To place an order, add a product to your basket by clicking "Order" on the selected product page. Please also select the size and quantity you want to order, if required. Once you have selected your items, complete your order by clicking on "My basket" and then "Complete the order".

You can then modify or validate your basket and select your delivery method before making your payment.
You will be asked to complete your delivery and billing address by selecting one of the following three options:

- log on to your DBC ELEGANCE account if you already have one
- create a DBC ELEGANCE account if you are ordering for the first time on DBC ELEGANCE.com
- continue as a guest; this option enables you to place an order without creating an account, but your order history will not be saved.

Select your method of payment and fill in the information to complete your order.
Within a few minutes, you will receive an email confirming your order. When your order is shipped, you will receive a second email with a tracking number so that you can track your package's shipping.
For further information, do not hesitate to contact the Client Service Center.`
            },
            {
              id: 'order-help',
              question: 'HOW CAN I GET HELP WITH PLACING MY ORDER?',
              answer: `Our Client Advisors are available to help you with your order.

You can contact them from Monday to Friday from 10 am to 8 pm and Saturday from 10 am to 6 pm by calling +44 (0)20 7172 01 72 or by email at: contact@dbcelegance.com

Please refer to our page "DBC ELEGANCE and you" to obtain all our contact information.`
            },
            {
              id: 'modify-order',
              question: 'CAN I CANCEL OR CHANGE MY ORDER?',
              answer: `If you wish to modify or cancel your order, please contact the Client Service Center – our Client Advisors will be very happy to assist you with your request.`
            },
            {
              id: 'order-history',
              question: 'HOW CAN I ACCESS MY ORDER HISTORY?',
              answer: `If you have created a DBC ELEGANCE customer account, you can view your order history. Log in to your account and click on "My orders".

If you have placed an order as a guest, please contact the Client Service Center to get this information.`
            },
            {
              id: 'order-preparation',
              question: 'HOW IS MY ORDER PREPARED?',
              answer: `After you have validated your order, it will be prepared within 24 hours.
To provide you with a unique experience, we pay particular attention to the preparation of your order.
Each order is prepared in a DBC ELEGANCE workshop, and individually packaged in its presentation case, tied with a silk ribbon. The presentation case is then inserted into a box that will protect it and keep it anonymous during shipping.
Warranties, authentication certificates and a return voucher will be included with your order.`
            },
            {
              id: 'order-receipt',
              question: 'HOW CAN I GET A RECEIPT FOR MY ONLINE PURCHASE?',
              answer: `For all orders placed on our DBC ELEGANCE.com website via your DBC ELEGANCE account, you will receive an order confirmation and receipt by email. Your receipt will also be sent along with your package to the billing address you provided. You can also get a hard copy of your receipt from your customer account on the DBC ELEGANCE.com website by visiting the "My Orders" section then clicking on the receipt you wish to print.

If you placed your order as a guest, your receipt will be sent together with your order to the delivery address you provided. Should you wish to obtain a duplicate receipt, please contact the Client Service Center.`
            },
            {
              id: 'customized-order',
              question: 'WHAT ARE THE GUIDELINES FOR A CUSTOMIZED ORDER?',
              answer: `Certain DBC ELEGANCE items are eligible for customization service.
To customize the product, please tell us the name or the initials to appear on the item.
Every order will be verified by a reviewer so as to confirm the customization request, according to the following guidelines:
-Uppercase letters in the Roman alphabet only
-Only first names or initials are allowed
-Nicknames, acronyms, company names, insults, and brand names are not allowed

Once your request has been verified, you will receive a confirmation email.
In the case of a denied request, your order will be canceled and a DBC ELEGANCE representative will contact you so as to assist in the confirmation of a new order.
Please remember that customized products cannot be returned or exchanged.`
            }
          ]
        },
        {
          id: 'gift',
          question: 'I WOULD LIKE TO GIVE A DBC ELEGANCE GIFT',
          items: [
            {
              id: 'gift-wrapping',
              question: 'WILL MY ORDER BE SENT IN A GIFT-WRAPPED PACKAGE?',
              answer: `To provide you with a unique experience, we pay particular attention to the preparation of your order.
Each order is prepared in a DBC ELEGANCE workshop, and individually packaged in its presentation case, tied with a silk ribbon. The presentation case is then inserted into a box that will protect it and keep it anonymous during shipping.`
            },
            {
              id: 'personal-message',
              question: 'CAN I SEND A PERSONAL MESSAGE ALONG WITH MY ORDER?',
              answer: `Before validating your order, you will be able to write a personalized message that will be printed and included with your order. The message will be printed on a card and inserted into a DBC ELEGANCE envelope.`
            },
            {
              id: 'price-display',
              question: 'WILL THE PRICE OF THE ORDER APPEAR?',
              answer: `If you place an order via your customer account on the DBC ELEGANCE.com website, the receipt will be sent directly to you electronically at the email address registered to your account.
Price tags will be removed from the items you order.`
            },
            {
              id: 'gift-exchange',
              question: 'CAN THE RECEIVER EXCHANGE THE GIFT?',
              answer: `If the recipient of your gift wishes to exchange the item, they should contact the Client Service Center – our Client Advisors will be delighted to guide them through the process.

Explore our selection of gifts from Women's Fashion, Men's Fashion, Maison and Newborn.`
            }
          ]
        },
        {
          id: 'payment',
          question: 'YOUR PAYMENT',
          items: [
            {
              id: 'payment-methods',
              question: 'WHAT PAYMENT METHODS ARE ACCEPTED ON THE DBC ELEGANCE.COM WEBSITE?',
              answer: `Payment for purchases on DBC ELEGANCE.com can be made by CB, Visa©, Eurocard©, MasterCard©, American Express© or Apple Pay©. 

Payment for purchases can also be made by Paypal (except for phone orders) or by payment link, only by contacting our Client Service Center.

You can also refer to our General Terms and Conditions of Sale for further information.`
            },
            {
              id: 'payment-security',
              question: 'IS AN ONLINE PURCHASE ON DBC ELEGANCE.COM SECURE?',
              answer: `All transactions done on the DBC ELEGANCE.com website are extremely secure. An SSL encryption system is in place to protect personal data and payment information. In addition, DBC ELEGANCE makes a commitment to you not to save any credit card information.
Finally, we reinforce the security of payments by means of a 3D Secure system for Visa©, Eurocard©, Mastercard© and American Express© credit cards that are equipped with this system. An additional step is taken at the time of payment, which enables verification of the identity of the credit card holder and validation of the transaction.

Each bank has its own authentication. For any question regarding your 3D Secure code, please contact your bank directly.

In case of doubt, you can place your order by phone with our Client Service Center from Monday to Friday from 10 am to 8 pm and Saturday from 10 am to 6 pm by calling +44 (0)20 7172 01 72.`
            },
            {
              id: 'payment-timing',
              question: 'WHEN WILL MY PAYMENT BE DEBITED FROM MY ACCOUNT?',
              answer: `Your bank account will be debited as soon as your parcel is shipped. You will then receive an email from us confirming the shipment and its tracking number.`
            }
          ]
        },
        {
          id: 'delivery',
          question: 'YOUR DELIVERY',
          items: [
            {
              id: 'order-status',
              question: 'HAS MY ORDER BEEN SENT?',
              answer: `If you placed your order via your DBC ELEGANCE customer account, log in to your account then click on "my orders". You will then be able to consult the status of your order:

In preparation: the order has been validated and is being prepared.

Completed: the order has been shipped to the delivery address that you provided when you placed your order online. You can track your order using the tracking number at the following address: http://www.ups.com

Pending: payment for the order has not been finalized. A Client Advisor will contact you as soon as possible to assist you with your order.

Cancelled: the order has been canceled by you or due to lack of availability of the product. It is also possible that payment of your order has not been validated.

If you placed your order as a guest, please contact the Client Service Center – our Client Advisors will be pleased to inform you of the progress of your order.`
            },
            {
              id: 'track-order',
              question: 'HOW CAN I TRACK THE DELIVERY OF MY ORDER?',
              answer: `If you placed your order via your DBC ELEGANCE customer account, you can follow the progress of your order by logging in to your account then clicking on "my orders". Then click on the tracking number to track your order.

This same tracking number was also sent to you with your shipping confirmation email; enter it on the courier website to track your order.

If you placed your order as a guest, please contact the Client Service Center – our Client Advisors will be pleased to inform you of the progress of your order.`
            },
            {
              id: 'delivery-time',
              question: 'HOW LONG DOES DELIVERY TAKE?',
              answer: `Your items can be delivered to your home address or to the address that you provided when placing your order on the DBC ELEGANCE.com website. Your items will be delivered as soon as payment for your order has been registered, within 5 business days for standard deliveries and 2 business days for express deliveries. Should any items be unavailable, the delivery times may be modified. For more information, please refer to our general terms and conditions of sale and/or contact our Client Service Center.`
            },
            {
              id: 'missing-package',
              question: 'I PLACED AN ORDER BUT I HAVE NOT RECEIVED MY PACKAGE. WHAT CAN I DO?',
              answer: `If you placed your order via your DBC ELEGANCE customer account, log in to your account then click on "my orders". You will then be able to follow the status of your order.
If you placed your order as a guest, please track the progress of your delivery using the tracking number provided in the order confirmation email at the following address: http://www.ups.com.

If you do not receive your package within 5 business days, please contact the UPS Customer Service.`
            }
          ]
        },
        {
          id: 'returns',
          question: 'RETURNS AND EXCHANGES PROCEDURE',
          items: [
            {
              id: 'return-policy',
              question: 'CAN I RETURN A PRODUCT FROM AN ONLINE ORDER FOR AN EXCHANGE OR A REFUND?',
              answer: `You can return any order to us within 30 days of receiving it.

When returning a product, put the unused item(s) back in the original packaging, along with any accompanying accessories and documents (instructions, guarantees, certificates of authenticity) and the delivery slip. We advise you to take all necessary precautions to ensure that your product is protected. 

All shoes must be tried on a soft, clean and dry carpeted area in order to avoid any damage to the soles. Failure to do so may result in non-acceptance of your return or exchange.

Any item not returned or returned incomplete, spoiled, broken, damaged, soiled or in any other condition that would reasonably suggest that it has been used or worn, will not be refunded or exchanged. With regard to footwear, the sole must also be intact; for that reason, we strongly recommended trying on DBC ELEGANCE shoes on a carpet or rug-type surface.

Similarly, personalised items produced according to and/or at the request of the customer, or products that have been altered, as well as sealed items (swimwear, etc.) that have been unsealed after delivery and cannot be returned for reasons of hygiene or health protection cannot be exchanged.

An item can only be exchanged once, the item received in exchange can therefore only be returned for a refund under the usual conditions. In order to return it, you will have to contact the Client Service Center for a prepaid UPS voucher.

Regarding bags with customization badges, by returning a bag on its own, without the badges purchased at the same time, the discount you received on these badges that was linked to the purchase of this bag will be rendered invalid. The amount you originally saved will therefore be deducted from your refund. Please contact Client Service Center with any questions.`
            },
            {
              id: 'return-process',
              question: 'HOW DO I RETURN A PRODUCT ORDERED ONLINE?',
              answer: `The means and costs of returning your order are offered free of charge by DBC ELEGANCE, subject to a limit of one return per order.

To return items purchased online, simply pick one of the following options:

1. Inform DBC ELEGANCE of your wish to make a return via your account on the Website, in which case DBC ELEGANCE will acknowledge receipt of your cancellation by email.

In the "My Orders" section, click on "Request a Return".

Select the item(s) you wish to return and indicate whether you require an exchange or a refund.

For an exchange, please enter the new size or colour in the space provided.

Refunds will be made via the same method of payment used for the purchase and within 14 days of receiving the product(s), subject to your return being accepted.

2. Call Customer Services and inform them of your wish to exercise your right of return and arrange an appointment (date, time slot and location) for UPS to pick up the Item(s).

3. Return your Item(s) to a UPS drop-off point directly (https://www.ups.com/dropoff/) using the prepaid return label included in the parcel.

If you placed your order as a guest, you can return or exchange it via the Delivery and Returns page.

Simply enter your order number and email address on this page to access your order history and submit a request for an exchange or a refund.`
            },
            {
              id: 'damaged-product',
              question: 'WHAT DO I NEED TO DO IF MY PRODUCT IS DAMAGED OR IF IT IS NOT THE PRODUCT I ORDERED?',
              answer: `If one of your products is damaged or the items delivered do not correspond to your order, please contact our Client Service Center.`
            }
          ]
        },
        {
          id: 'click-collect',
          question: 'CLICK & COLLECT',
          items: [
            {
              id: 'in-store-delivery',
              question: 'CAN I RECEIVE A DELIVERY IN-STORE?',
              answer: `Certain boutiques offer a click-and-collect pick-up service for items ordered online. This delivery option will be offered upon confirmation of your order if the items in your basket are eligible and if at least one boutique offers this service in your country of delivery.

This delivery service is free.`
            },
            {
              id: 'pickup-process',
              question: 'HOW DO I PICK UP MY CLICK-AND-COLLECT ORDER?',
              answer: `You will receive an email as soon as your order is ready for pick-up (within two to five business days).

Upon receipt, please come to the boutique along with the email that you received and a valid form of identification.`
            },
            {
              id: 'third-party-pickup',
              question: 'CAN SOMEONE ELSE PICK UP MY ORDER?',
              answer: `If you cannot collect your order yourself, you can entrust its pick-up to a third party.

To do this, you can download a delegation of authority form in My Account > My Orders.

The authorized pick-up party must bring to the store:
– the delegation of authority form, printed and signed;
– your piece of identification;
– the order's in-store availability confirmation email; and
– the pick-up party's own piece of identification.`
            }
          ]
        },
        {
          id: 'care-service',
          question: 'CARE SERVICE',
          items: [
            {
              id: 'deposit-item',
              question: 'HOW CAN I DEPOSIT MY ITEM TO DBC ELEGANCE\'S CARE SERVICE?',
              answer: `For any repairs, you can deposit your DBC ELEGANCE items in after-sale services (care services) in our boutiques. They will be systematically appraised by our workshops. You will then be offered a quote and a repair time.

The terms and conditions of use of the care services are available [here].`
            }
          ]
        }
      ]
    },
    {
      title: 'DBC ELEGANCE And You',
      count: 2,
      items: [
        {
          id: 'exhibitions',
          question: 'HOW CAN I BE INFORMED OF EXHIBITIONS ABOUT DBC ELEGANCE?',
          answer: `If you have subscribed to the DBC ELEGANCE Newsletter, you will be kept informed about all the DBC ELEGANCE news (fashion shows, exhibitions, new boutiques, etc.). 

If you have not yet subscribed to the Newsletter, you can do so for free by visiting the "Newsletter" section of the DBC ELEGANCE.com website.

If you are not interested in subscribing in the DBC ELEGANCE Newsletter, we invite you nonetheless to discover the News and Exhibitions sections within DBC ELEGANCE World accessible in the menu.`
        },
        {
          id: 'learn-more',
          question: 'HOW CAN I FIND OUT MORE ABOUT DBC ELEGANCE?',
          answer: `For all information about DBC ELEGANCE, please visit the News & Events section of the www.DBC ELEGANCE.com website. Subscribe to the Newsletter to be one of the first to hear about new products, events and news from the House of DBC ELEGANCE. Also, do not hesitate to contact the Client Service Center.`
        }
      ]
    },
    {
      title: 'The DBC ELEGANCE Selection',
      count: 1,
      items: [
        {
          id: 'universes',
          question: 'DISCOVER THE DIFFERENT DBC ELEGANCE UNIVERSES',
          items: [
            {
              id: 'manufacturing',
              question: 'WHERE ARE DBC ELEGANCE PRODUCTS MANUFACTURED?',
              answer: `When the House of DBC ELEGANCE creates products, it pays great attention to ensuring that their manufacture complies with the legislation in effect in France and in Europe. DBC ELEGANCE is committed to manufacturing its products in countries that have the best expertise for the product in question. 
DBC ELEGANCE's leather goods collections are made in Europe. 
Our shoes and ready-to-wear collections are manufactured in France and in Italy. 
Our watches are manufactured exclusively in our workshops in Switzerland. 
We produce our haute couture collection and fine jewelry exclusively in our workshops in Paris, France. 
Our DBC ELEGANCE sunglasses and scarves are made in Italy.
Our DBC ELEGANCE jeans are made in Japan.

The House of DBC ELEGANCE frequently buys small workshops to preserve these artisan trades (such as leather working in Florence, Italy and watchmaking in Switzerland). In these workshops, the selection of natural materials, as well as the care taken in each phase of the process, perpetuate and renew our tradition of excellence and elegance.`
            },
            {
              id: 'repairs',
              question: 'HOW CAN I GET A DBC ELEGANCE PRODUCT REPAIRED?',
              answer: `DBC ELEGANCE offers its customers a range of repair services for any products purchased in boutiques and on DBC ELEGANCE.com.

If you wish to have DBC ELEGANCE product repaired, please visit a DBC ELEGANCE boutique. The Boutiques section on DBC ELEGANCE.com allows you to locate your nearest boutique. The sales staff at our boutiques will be delighted to guide you and answer any questions.
If you do not have a DBC ELEGANCE boutique near you or you cannot travel, do not hesitate to contact the Client Service Center.

To guarantee their quality, DBC ELEGANCE products are repaired exclusively in our workshops by our artisans.`
            }
          ]
        }
      ]
    },
    {
      title: 'Client Service Center',
      count: 2,
      items: [
        {
          id: 'contact',
          question: 'HOW CAN I CONTACT DBC ELEGANCE?',
          answer: `The Client Advisors at DBC ELEGANCE Client Service Center will be delighted to provide you with personalized advice and answer to your questions from Monday to Friday from 10am - 9pm (CET) and from Saturday to Sunday from 11am - 7pm (CET) by calling +33 (0)1 40 73 53 55 or by email at: contact@dbcelegance.com

We also invite you to refer to our contact page to obtain all our contact information.`
        },
        {
          id: 'mailing-address',
          question: 'WHAT ADDRESS SHOULD I USE TO WRITE TO DBC ELEGANCE?',
          answer: `You can also write to us at this address:

DBC ELEGANCE
Client Service Center
27 rue Jean Goujon
75008 PARIS
FRANCE`
        }
      ]
    },
    {
      title: 'BOOK AN APPOINTMENT',
      count: 1,
      items: [
        {
          id: 'appointment',
          question: 'BOOK AN APPOINTMENT',
          items: [
            {
              id: 'appointment-required',
              question: 'DO I HAVE TO BOOK AN APPOINTMENT BEFORE VISITING A DBC ELEGANCE STORE?',
              answer: `Absolutely not, you are more than welcome to visit our Stores. You can find directly our stores via the "Store Locator". However, by booking an appointment with one of our Sales Associates, you will benefit from a personalized shopping service, without interruption.

Please be aware that the amount of stock in our boutiques changes frequently, therefore we cannot guarantee items availability even if you have booked an appointment. Indeed, if you want to reserve a product in boutique, please see the section "E-RESERVATION".`
            },
            {
              id: 'which-stores',
              question: 'IN WHICH DBC ELEGANCE STORES CAN I BOOK A PRIVATE APPOINTMENT?',
              answer: `You can select one of the Stores listed on the page "Store Locator" or from the dropdown list available on the booking window section via the "Contact page".`
            },
            {
              id: 'book-appointment',
              question: 'HOW CAN I BOOK AN APPOINTMENT?',
              answer: `You can book your appointment by clicking on the button "Book your Appointment" display on the "Contact page" or directly by clicking on book an appointment icon on a store selected by you on the store sheet via the page "Store Locator".

For your store appointment request, you will be pleased to select on the appointment form, a store and a service. You can choose a date and timeslot which is suitable for you.

You will need to fill in the form with your name, surname, telephone number, email address and the purpose of your appointment (for example, Discover our collections and new arrivals).`
            },
            {
              id: 'appointment-confirmation',
              question: 'HOW AND WHEN WILL MY APPOINTMENT BE CONFIRMED BY THE STORE?',
              answer: `Once your appointment request has been received by your selected Store, we will send you an email confirming the receipt of your request.

You will then receive a confirmation email once your appointment has been confirmed by the Store and a Sales Associate has been assigned for you.

A reminder of your appointment will be sent to you before the scheduled date, by email (and by SMS if you have selected this preference of contact).`
            },
            {
              id: 'modify-appointment',
              question: 'HOW CAN I MODIFY OR CANCEL MY APPOINTMENT?',
              answer: `You can modify or cancel your appointment, via the link communicated in your confirmation email or in your reminder email.

Our Client Advisors are also available to help you from Monday to Friday from 10 am to 8 pm and Saturday from 10 am to 6 pm by calling +44 (0)20 7172 01 72 or by email at: contact@dbcelegance.com.`
            },
            {
              id: 'data-management',
              question: 'HOW ARE MY DATA MANAGED?',
              answer: `Your personal data are handled in accordance with DBC ELEGANCE's privacy policy.`
            }
          ]
        }
      ]
    }
  ];

  const currentCategory = categories.find(cat => cat.title === activeCategory);

  const renderFAQItems = (items, level = 0) => {
    return items.map((item) => (
      <div key={item.id} className={`${level > 0 ? 'ml-4' : ''} border-b border-gray-200 pb-6`}>
        <button
          onClick={() => toggleItem(item.id)}
          className="w-full text-left flex justify-between items-start gap-4 group"
        >
          <h3 className={`${level === 0 ? 'text-lg font-semibold' : 'text-base font-medium'} text-gray-900 group-hover:text-gray-700 transition-colors duration-200`}>
            {item.question}
          </h3>
          <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-gray-500 group-hover:text-gray-700 transition-colors duration-200">
            {openItems.has(item.id) ? '−' : '+'}
          </span>
        </button>
        
        {openItems.has(item.id) && (
          <div className="mt-4 text-gray-600 leading-relaxed">
            {item.answer ? (
              <div className="whitespace-pre-line">{item.answer}</div>
            ) : item.items ? (
              renderFAQItems(item.items, level + 1)
            ) : null}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-white ">
         <div className="fixed top-0 left-0 right-0 z-50 bg-white px-4 py-4 md:px-6 md:py-6 flex border-b border-gray-200 ">
               <div className="flex items-center cursor-pointer" onClick={router.back}>
                 <MdKeyboardArrowLeft size={24} className="text-gray-700" />
                 <p className="text-sm text-gray-700">Back</p>
               </div>
               <div className="mx-auto flex flex-row text-xl gap-3 items-center text-black">
                 <p className="tracking-wide lg:text-3xl">DBC ELEGANCE</p>
               </div>
             </div>
      <div className="max-w-7xl mx-auto pt-[100px] lg:pt-[150px]">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-2xl font-light text-gray-900 tracking-wide">FAQ COUTURE</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 py-8 px-4 sm:px-6 lg:px-8">
          {/* Sidebar - Categories */}
          <div className="lg:w-1/4">
            <div className="sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">CATEGORIES</h2>
              <nav className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.title}
                    onClick={() => setActiveCategory(category.title)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 ${
                      activeCategory === category.title
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{category.title}</span>
                      <span className={`text-sm ${
                        activeCategory === category.title ? 'text-gray-300' : 'text-gray-500'
                      }`}>
                        ({category.count})
                      </span>
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content - FAQ Items */}
          <div className="lg:w-3/4">
            <div className="mb-8">
              <h2 className="text-2xl font-light text-gray-900 mb-2">{activeCategory}</h2>
              <div className="w-20 h-0.5 bg-gray-900"></div>
            </div>

            <div className="space-y-6">
              {currentCategory?.items.map((item) => renderFAQItems([item]))}
            </div>

            {/* Contact Information */}
            {activeCategory === 'About The DBC ELEGANCE Site' && (
              <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <p className="text-gray-600 mb-4">
                  If you have any questions or concerns about how we process and use your personal data, 
                  or would like to exercise any of the rights described above, please contact our customer care service. 
                  You may also contact our Data Protection Officer at:
                </p>
                <a 
                  href="mailto:privacy@dbcelegance.com" 
                  className="text-gray-900 hover:text-gray-700 underline"
                >
                  privacy@dbcelegance.com
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQCouture;