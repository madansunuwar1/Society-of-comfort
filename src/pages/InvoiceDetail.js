import { useParams, useEffect, useState } from "react";
import api from "../utils/api";

const InvoiceDetail = () => {
  const { id } = useParams(); // Get the invoice id from the URL
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    // Fetch the invoice data based on the ID
    api
      .get(`/invoices/${id}`)
      .then((response) => {
        setInvoice(response.data);
      })
      .catch((error) => {
        console.error("Error fetching invoice details:", error);
      });
  }, [id]);

  if (!invoice) return <p>Loading...</p>;

  return (
    <div>
      <h2>Invoice Details</h2>
      <p>Date: {new Date(invoice.created_at).toLocaleDateString()}</p>
      <p>Invoice for month: {invoice.month}</p>
      <div>
        {invoice.invoice_items.map((item) => (
          <div key={item.id}>
            <p>{item.particular}</p>
            <p>Rs. {item.total}</p>
          </div>
        ))}
      </div>
      <div>Total: Rs. {invoice.total_amount}</div>
    </div>
  );
};

export default InvoiceDetail;
