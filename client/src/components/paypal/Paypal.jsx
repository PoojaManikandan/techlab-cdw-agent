import { PayPalButtons } from "@paypal/react-paypal-js";
import { useNavigate } from 'react-router-dom';

export default function Paypal({ totalAmount }) {

  const navigate = useNavigate();
  const PRODUCT_SERVER_URL = window.REACT_APP_PRODUCT_SERVER_URL
  
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
          `${PRODUCT_SERVER_URL}/api/paypal/capture-order/${data.orderID}`,
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
