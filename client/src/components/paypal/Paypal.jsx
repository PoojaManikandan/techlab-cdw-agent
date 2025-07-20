import { PayPalButtons } from "@paypal/react-paypal-js";
import { useNavigate } from 'react-router-dom';

export default function Paypal({ totalAmount }) {

  const navigate = useNavigate();
  
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
          `http://localhost:8080/api/paypal/capture-order/${data.orderID}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderID: data.orderID, details }),
          }
        );
        navigate('/orderConfirmation'); // Navigate to orderConfirmation after successful payment
      }}
      onError={(err) => console.error(err)}
    />
  );
}
