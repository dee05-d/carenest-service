function loadBookings() {
  const container = document.getElementById("adminBookings");
  let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

  container.innerHTML = "";

  if (bookings.length === 0) {
    container.innerHTML = "<p>No bookings yet.</p>";
    return;
  }

  bookings.forEach((b, index) => {

    const div = document.createElement("div");
    div.className = "booking";

    div.innerHTML = `
      <p><strong>Receipt ID:</strong> ${b.receiptId}</p>
      <p><strong>Name:</strong> ${b.name}</p>
      <p><strong>Email:</strong> ${b.email}</p>
      <p><strong>Sitter:</strong> ${b.sitter}</p>

      <p><strong>Care Type:</strong> ${b.careType || "N/A"}</p>
      <p><strong>Plan:</strong> ${b.planName || "N/A"}</p>

      <p><strong>Amount:</strong> $${b.price}</p>
      <p><strong>Method:</strong> ${b.method}</p>

      <p class="${b.status === "pending" ? "pending" : "confirmed"}">
        Status: ${b.status.toUpperCase()}
      </p>

      ${
        b.paymentImageURL
          ? `<button class="view" onclick="viewImage('${b.paymentImageURL}')">View Proof</button>`
          : ""
      }

      ${
        b.status === "pending"
          ? `<button class="approve" onclick="approveBooking(${index})">Approve</button>`
          : ""
      }
    `;

    container.appendChild(div);
  });
}

function approveBooking(index) {
  let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

  bookings[index].status = "confirmed";
  console.log(bookings[index]);

  localStorage.setItem("bookings", JSON.stringify(bookings));

  // 🔥 SEND EMAIL ON APPROVAL
  sendReceiptEmail(bookings[index]);

  alert("✅ Payment Approved & Email Sent!");

  loadBookings();
}

function viewImage(url) {
  const win = window.open("");
  win.document.write(`<img src="${url}" style="max-width:100%;">`);
}

/* 🔥 COPY YOUR EMAIL FUNCTION HERE */
function sendReceiptEmail(booking) {

  const templateParams = {
    name: booking.name,
    email: booking.email,
    sitter: booking.sitter,
    amount: "$" + booking.price,
    receiptId: booking.receiptId,
    

    date: booking.date || "N/A",
    time: booking.time || "N/A",
    location: `${booking.city || ""}, ${booking.state || ""}`,
    address: booking.address || "N/A",
    arrival: booking.arrival || "On-time",
    method: booking.method || "N/A",

  careType: booking.careType || "N/A",
  planName: booking.planName || "N/A"

  };

  emailjs.send("service_2hk40dp", "template_n6v3do5", templateParams)
    .then(() => {
      console.log("✅ Email sent with full details!");
    })
    .catch(err => {
      console.error("❌ Email error:", err);
    });
}

loadBookings();