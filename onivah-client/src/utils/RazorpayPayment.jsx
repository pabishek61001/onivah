import React, { useEffect } from "react";
import axios from "axios";
import { Button } from "@mui/material";

const RazorpayPayment = ({ amount, buttonAction, currency = "INR", productName = "Test Shop", description = "Test Transaction" }) => {

    const createOrder = async () => {
        try {
            const order = await axios.post("http://localhost:4000/create-order", {
                amount,
                currency,
            });

            const options = {
                key: "rzp_test_DZs8IAfrdKP18K",
                amount: order.data.amount,
                currency: order.data.currency,
                name: productName,
                description: description,
                order_id: order.data.id,
                handler: async function (response) {
                    const captureRes = await axios.post("http://localhost:4000/capture-payment", {
                        payment_id: response.razorpay_payment_id,
                        amount,
                    });

                    console.log("Payment Captured:", captureRes.data);
                    alert("Payment Successful!");
                },
                theme: {
                    color: "#3399cc",
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            console.log("Payment Error:", err);
        }
    };

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;

        script.onload = () => {
            const payBtn = document.getElementById("rzp-button1");
            if (payBtn) {
                payBtn.addEventListener("click", createOrder);
            }
        };

        document.body.appendChild(script);

        return () => {
            const payBtn = document.getElementById("rzp-button1");
            if (payBtn) {
                payBtn.removeEventListener("click", createOrder);
            }
        };
    }, []);

    return (
        <div style={{ padding: "50px", display: buttonAction ? 'none' : "block" }}>
            <Button id="rzp-button1"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 4, py: 1.5, fontWeight: "medium" }}
            >
                Pay ₹{amount}
            </Button>
        </div>
    );
};

export default RazorpayPayment;
