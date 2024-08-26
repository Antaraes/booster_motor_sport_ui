import { FC } from 'react';

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <>
      <section className="h-auto bg-white">
        <div className="px-10 py-24 mx-auto max-w-7xl">
          <div className="w-full mx-auto text-left md:text-center">
            <h1 className="mb-6 text-5xl font-extrabold leading-none max-w-5xl mx-auto tracking-normal text-gray-900 sm:text-6xl md:text-3xl lg:text-7xl md:tracking-tight">
              {' '}
              The{' '}
              <span className="w-full text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 lg:inline">
                Ultimate Shopping Destination
              </span>{' '}
              for
              <br className="lg:block hidden" /> all your fashion and lifestyle
              needs.{' '}
            </h1>
            <p className="px-0 mb-6 text-lg text-gray-600 md:text-xl lg:px-24">
              {' '}
              Discover a world of fashion, electronics, home essentials, and
              more. Shop the latest trends, enjoy seamless shopping, and find
              everything you need in one place.{' '}
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="px-8 mx-auto max-w-7xl lg:px-16">
          <h2 className="mb-4 text-xl font-bold md:text-3xl">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 gap-0 text-gray-600 md:grid-cols-2 md:gap-16">
            <div>
              <h5 className="mt-10 mb-3 font-semibold text-gray-900">
                How do I place an order?
              </h5>
              <p>
                Simply browse our products, add your desired items to the cart,
                and proceed to checkout. You can pay using various methods,
                including credit/debit cards and PayPal.
              </p>
              <h5 className="mt-10 mb-3 font-semibold text-gray-900">
                Can I track my order?
              </h5>
              <p>
                Yes, once your order is shipped, you will receive a tracking
                number via email. You can use this number to track your order in
                real-time on our website.
              </p>
              <h5 className="mt-10 mb-3 font-semibold text-gray-900">
                What is your return policy?
              </h5>
              <p>
                We offer a 30-day return policy for most items. If you&apos;re
                not satisfied with your purchase, you can return it for a full
                refund or exchange. Visit our
                <a
                  href="/return-policy"
                  className="text-indigo-500 underline"
                  data-primary="indigo-500"
                >
                  Return Policy page
                </a>
                for more details.
              </p>
              <h5 className="mt-10 mb-3 font-semibold text-gray-900">
                Do you offer international shipping?
              </h5>
              <p>
                Yes, we ship to many countries around the world. Shipping costs
                and times vary depending on the destination. You can view
                shipping options and rates at checkout.
              </p>
            </div>
            <div>
              <h5 className="mt-10 mb-3 font-semibold text-gray-900">
                What payment methods do you accept?
              </h5>
              <p>
                We accept all major credit and debit cards, PayPal, and other
                secure payment options. Your payment information is processed
                securely.
              </p>
              <h5 className="mt-10 mb-3 font-semibold text-gray-900">
                Can I cancel my order?
              </h5>
              <p>
                If your order hasn&apos;t been shipped yet, you can cancel it by
                contacting our customer service team. Once the order is shipped,
                you may need to follow the return process.
              </p>
              <h5 className="mt-10 mb-3 font-semibold text-gray-900">
                How do I contact customer service?
              </h5>
              <p>
                You can reach our customer service team via email, phone, or
                live chat. Visit our
                <a
                  href="/contact-us"
                  className="text-indigo-500 underline"
                  data-primary="indigo-500"
                >
                  Contact Us page
                </a>
                for more information.
              </p>
              <h5 className="mt-10 mb-3 font-semibold text-gray-900">
                Do you offer gift cards?
              </h5>
              <p>
                Yes, we offer digital gift cards that can be purchased online
                and emailed directly to the recipient. Gift cards can be
                redeemed on any product in our store.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default page;
