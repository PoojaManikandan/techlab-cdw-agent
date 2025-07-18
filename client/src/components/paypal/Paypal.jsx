import { PayPalButtons } from "@paypal/react-paypal-js";

export default function Paypal({ totalAmount }) {
  
  return (
    <PayPalButtons
      createOrder={(data, actions) =>
        actions.order
          .create({
            purchase_units: [
              {
                amount: {
                  value: String((Math.round(totalAmount * 100) / 100).toFixed(2)),
                },
              },
            ],
          })
          .then((orderID) => {
            return orderID;
          })
      }
      onApprove={async (data, actions) => {
        const details = await actions.order.capture();
        await fetch(
          `http://localhost:8000/api/paypal/capture-order/${data.orderID}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderID: data.orderID, details }),
          }
        );
        alert("Payment successful!");
      }}
      onError={(err) => console.error(err)}
    />
  );
}
