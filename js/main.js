const firebaseConfig = {
  apiKey: "AIzaSyBh_L78r2fvxhvDpJHyyo96fATmXtfLBcI",
  authDomain: "carenest-72c57.firebaseapp.com",
  databaseURL: "https://carenest-72c57-default-rtdb.firebaseio.com",
  projectId: "carenest-72c57",
  storageBucket: "carenest-72c57.firebasestorage.app",
  messagingSenderId: "886796282957",
  appId: "1:886796282957:web:f482f30e232e5ffac00004",
  measurementId: "G-2H52H5R8VB"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

document.addEventListener("DOMContentLoaded", function () {




const closePaymentModal = document.getElementById("closePaymentModal");
if (closePaymentModal) {
  closePaymentModal.addEventListener("click", () => {
    document.getElementById("paymentModal").style.display = "none";
  });
}





/* ==============================
   LOAD STATES & CITIES FROM JSON
============================== */

const stateSelect = document.getElementById("stateSelect");
const citySelect = document.getElementById("citySelect");

const serviceDate = document.getElementById("bookingDate");
const serviceTime = document.getElementById("bookingTime");
const streetAddress = document.getElementById("streetAddress");
const availabilityMessage = document.getElementById("availabilityMessage");

let locationData = [];

if (stateSelect && citySelect) {

  fetch("us-states-cities.json")
    .then(response => response.json())
    .then(data => {
      locationData = data;

      stateSelect.innerHTML = '<option value="">Select State</option>';

      Object.keys(locationData).forEach(state => {
        const option = document.createElement("option");
        option.value = state;
        option.textContent = state;
        stateSelect.appendChild(option);
      });
    });

}


if (stateSelect && citySelect) {
  stateSelect.addEventListener("change", function () {
    const selectedState = this.value;
    citySelect.innerHTML = '<option value="">Select City</option>';

    if (!selectedState) {
      citySelect.disabled = true;
      return;
    }

    citySelect.disabled = false;

    const cities = locationData[selectedState];
    if (!cities) return;

    cities.forEach(city => {
      const option = document.createElement("option");
      option.value = city;
      option.textContent = city;
      citySelect.appendChild(option);
    });
  });
}

    /* =====================================
       FAQ TOGGLE
    ====================================== */
    document.querySelectorAll('.faq-item').forEach(item => {
        item.addEventListener('click', () => {
            const p = item.querySelector('p');
            if (p) {
                p.style.display = p.style.display === "block" ? "none" : "block";
            }
        });
    });


    /* =====================================
       DARK MODE
    ====================================== */
    const darkToggle = document.getElementById("darkToggle");
    if (darkToggle) {
        darkToggle.addEventListener("click", () => {
            document.body.classList.toggle("dark");
        });
    }


    /* =====================================
       BOOKING DATE WARNING
    ====================================== */
    const dateInput = document.getElementById("bookingDate");
    if (dateInput) {
        dateInput.addEventListener("input", function () {
            const day = new Date(this.value).getUTCDay();
            if (day === 0 || day === 6) {
                alert("Weekend bookings are limited!");
            }
        });
    }


    /* =====================================
       LIVE BOOKING POPUP
    ====================================== */
    const messages = [
        "Emma from New York just booked 2 hours ago 👶",
        "Sarah just scheduled a Half-Day session 👩‍👧",
        "Michael booked Full Day care 🔥",
        "Lisa left a 5-star review ⭐"
    ];

    const liveBooking = document.getElementById("liveBooking");

    function showLiveBooking() {
        if (!liveBooking) return;

        liveBooking.innerText = messages[Math.floor(Math.random() * messages.length)];
        liveBooking.style.display = "block";

        setTimeout(() => {
            liveBooking.style.display = "none";
        }, 4000);
    }

    if (liveBooking) {
        setInterval(showLiveBooking, 10000);
    }


    /* =====================================
       COUNTDOWN SYSTEM
    ====================================== */
    let countdownInterval;

    function startCountdown(seconds) {
        clearInterval(countdownInterval);

        const countdownTimer = document.getElementById("countdownTimer");
        if (!countdownTimer) return;

        countdownInterval = setInterval(() => {
            let hours = Math.floor(seconds / 3600);
            let minutes = Math.floor((seconds % 3600) / 60);
            let secs = seconds % 60;

            countdownTimer.innerText = `${hours}h ${minutes}m ${secs}s`;

            if (seconds <= 0) {
                clearInterval(countdownInterval);
            }

            seconds--;
        }, 1000);
    }


    /* =====================================
       SERVICE SELECTION + BASE PRICING
    ====================================== */
    const serviceCards = document.querySelectorAll(".service-card");
    const dynamicPrice = document.querySelector(".price");

    const basePrices = {
        infant: 35,
        toddler: 30,
        child: 25,
        elderly: 40
    };

    serviceCards.forEach(card => {
        card.addEventListener("click", function () {

            serviceCards.forEach(c => c.classList.remove("active"));
            this.classList.add("active");

            const type = this.getAttribute("data-type");

            if (dynamicPrice && basePrices[type]) {
                dynamicPrice.innerHTML = `$${basePrices[type]}<span>/hour</span>`;
            }
        });
    });


/* =====================================
   ADVANCED ADDRESS SYSTEM
===================================== */



function calculateSlots() {
    const street = streetAddress.value.trim();
    const state = stateSelect.value;
    const city = citySelect.value;
    const date = serviceDate.value;
    const time = serviceTime.value;

    // Only run if ALL required fields are filled
    if (!street || !state || !city || !date || !time) {
        availabilityMessage.innerHTML = ""; // clear message if incomplete
        return;
    }

    // Generate smart availability based on location hash
    const seed = street.length + city.length;
    const slots = (seed % 5) + 1;

    availabilityMessage.innerHTML = `
        <strong>${slots} babysitters available</strong><br>
        in ${citySelect.options[citySelect.selectedIndex].text}, ${stateSelect.options[stateSelect.selectedIndex].text}<br>
        for ${date} at ${time}.
    `;

    // Start dynamic countdown
    let randomTime = Math.floor(Math.random() * (7200 - 1800) + 1800);
    startCountdown(randomTime);
}

[streetAddress, citySelect, serviceDate, serviceTime].forEach(el => {
    if (el) {
        el.addEventListener("change", calculateSlots);
        el.addEventListener("input", calculateSlots);
    }
});

    /* =====================================
       CHAT SYSTEM
    ====================================== */
    const chatBtn = document.getElementById("chatBtn");
    const chatWindow = document.getElementById("chatWindow");
    const closeChat = document.getElementById("closeChat");
    const chatInput = document.getElementById("chatInput");
    const sendChat = document.getElementById("sendChat");
    const chatMessages = document.getElementById("chatMessages");

    if (chatBtn && chatWindow) {
        chatBtn.addEventListener("click", () => {
            chatWindow.style.display = "flex";
        });
    }

    if (closeChat && chatWindow) {
        closeChat.addEventListener("click", () => {
            chatWindow.style.display = "none";
        });
    }

    if (chatInput && sendChat && chatMessages) {

        sendChat.addEventListener("click", function () {
            const msg = chatInput.value.trim();
            if (!msg) return;

            const userMsg = document.createElement("p");
            userMsg.textContent = `You: ${msg}`;
            userMsg.style.fontWeight = "bold";
            chatMessages.appendChild(userMsg);

            setTimeout(() => {
                const agentMsg = document.createElement("p");
                agentMsg.textContent = "Agent: Thank you! We'll respond shortly.";
                agentMsg.style.color = "blue";
                chatMessages.appendChild(agentMsg);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 600);

            chatInput.value = "";
        });

        chatInput.addEventListener("keypress", function (e) {
            if (e.key === "Enter") {
                sendChat.click();
            }
        });
    }


    /* =====================================
       PAYMENT SYSTEM
    ====================================== */
 /* =====================================
   PAYMENT SYSTEM
===================================== */

const paymentMethod = document.getElementById("paymentMethod");
const paymentDetails = document.getElementById("paymentDetails");

if (paymentMethod && paymentDetails) {

  paymentMethod.addEventListener("change", function () {

    const method = paymentMethod.value;
    paymentDetails.innerHTML = "";

    if (method === "btc") {

      paymentDetails.innerHTML = `
        <div class="payment-box">

          <p><strong>Send BTC to this address:</strong></p>
          <p style="font-weight:bold;color:#ff9800;">
          1FfmbHfnpaZjKFvyi1okTjJJusN455paPH
          </p>

          <label>Your Wallet Address</label>
          <input type="text" id="btcWallet" placeholder="Enter wallet address">

          <label>Upload Payment Screenshot</label>
          <input type="file" id="btcProof" accept="image/*">

        </div>
      `;

    }

    if (method === "giftcard") {

      paymentDetails.innerHTML = `
        <div class="payment-box">

          <label>Gift Card Brand</label>
          <input type="text" id="giftCardName" placeholder="Amazon, Apple, Steam etc">

          <label>Gift Card Amount ($)</label>
          <input type="number" id="giftCardAmount" placeholder="Enter amount">

          <label>Upload Gift Card Image</label>
          <input type="file" id="giftCardImage" accept="image/*">

        </div>
      `;

    }

  });

}



document.querySelectorAll(".book-btn").forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();

 sessionStorage.setItem("freshBooking", "true");
    localStorage.removeItem("chosenSitter");

    const state = stateSelect.value;
    const city = citySelect.value;
    const date = serviceDate.value;
    const time = serviceTime.value;
    const address = streetAddress.value;
    const careType = document.querySelector(".service-card.active")?.dataset.type;

const planCard = btn.closest(".price-card");
const planName = planCard.querySelector("h3")?.innerText;
const planType = planCard.dataset.plan;


console.log({
  state,
  city,
  date,
  time,
  address,
  careType
});
    
  const price = planCard.querySelector(".price")?.innerText;

    const errorBox = document.getElementById("errorBox");

    if (!state || !city || !date || !time || !address || !careType || !price) {
      errorBox.textContent = "⚠️ Please complete all required fields before booking.";
      errorBox.style.display = "block";
      return;
    }

    errorBox.style.display = "none";

    // Save booking details
    localStorage.setItem("state", state);
    localStorage.setItem("city", city);
    localStorage.setItem("date", date);
    localStorage.setItem("time", time);
    localStorage.setItem("address", address);
    localStorage.setItem("careType", careType);
    localStorage.setItem("price", price);
    localStorage.setItem("planName", planName);
    localStorage.setItem("planType", planType);
const message = document.getElementById("availabilityMessage")?.innerText;
let availableSitters = 1;

if (message) {
  const match = message.match(/\d+/);
  if (match) {
    availableSitters = parseInt(match[0]);
  }
}

localStorage.setItem("availableSitters", availableSitters);

    // Redirect
    window.location.href = "choose-sitter.html";
  });
});









    /* =====================================
       NAV HIGHLIGHT
    ====================================== */
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach(link => {
        if (link.href === choose-sitter.html) {
            link.style.fontWeight = "bold";
            link.style.color = "#ff9800";
        }
    });


const payNowBtn = document.getElementById("payNowBtn");
const processingOverlay = document.getElementById("processingOverlay");
const successOverlay = document.getElementById("successOverlay");
const receiptOverlay = document.getElementById("receiptOverlay");
const progressFill = document.getElementById("progressFill");
const finalReceipt = document.getElementById("finalReceipt");
const receiptContent = document.getElementById("receiptContent");
const paymentModal = document.getElementById("paymentModal");

if (payNowBtn) {
  payNowBtn.addEventListener("click", function () {

    const method = document.getElementById("paymentMethod").value;
    const name = document.getElementById("customerName").value.trim();
    const email = document.getElementById("customerEmail").value.trim();
    const sitter = localStorage.getItem("chosenSitter");
   const price = document.getElementById("totalAmount").innerText.replace("$", "");
   
   const btcWallet = document.getElementById("btcWallet")?.value || "";

  let paymentImageURL = "";

let file = null;

// Get file based on method
if (method === "btc") {
  file = document.getElementById("btcProof")?.files[0];
}

if (method === "giftcard") {
  file = document.getElementById("giftCardImage")?.files[0];
}
if (file) {

  convertToBase64(file, function (base64) {

    continuePayment(
      name,
      email,
      sitter,
      price,
      method,
      btcWallet,
      base64
    );

  });

} else {

  continuePayment(
    name,
    email,
    sitter,
    price,
    method,
    btcWallet,
    ""
  );

}

    
    console.log("Processing overlay:", processingOverlay);
    console.log("Success overlay:", successOverlay);

    const errorBox = document.getElementById("paymentError");
    if (errorBox) errorBox.textContent = "";


if (!validateHalfDayTime()) {
  return;
}


    // ✅ VALIDATION
    if (!name || !email) {
      if (errorBox) errorBox.textContent = "Please enter your name and email";
      return;
    }

   if (!email.includes("@") || !email.includes(".")) {
  alert("Enter a valid email address");
  return;
   }

    if (!method) {
      if (errorBox) errorBox.textContent = "Select a payment method";
      return;
    }

    // ✅ CLOSE PAYMENT MODAL IMMEDIATELY (FIXED)
    if (paymentModal) {
      paymentModal.style.display = "none";
    }
   
})};


function getBookingDetails() {
  const planType = localStorage.getItem("planType");

  const hours = document.getElementById("hoursInput")?.value;
  const days = document.getElementById("daysInput")?.value;
  const halfStart = document.getElementById("halfStart")?.value;
  const halfEnd = document.getElementById("halfEnd")?.value;
  const overnight = document.getElementById("overnightSelect")?.value;
  const arrival = document.getElementById("arrivalTime")?.value;

  if (planType === "hourly") {
    return `<p>⏱ <strong>Hours:</strong> ${hours}</p>`;
  }

  if (planType === "fullday") {
    return `<p>📅 <strong>Days:</strong> ${days}</p>`;
  }

  if (planType === "halfday") {
    return `<p>🕒 <strong>Time:</strong> ${halfStart} - ${halfEnd}</p>`;
  }

  if (planType === "overnight") {
    return `<p>🌙 <strong>Overnight:</strong> ${overnight}</p>`;
  }

  return "";
}




function generateReceiptId() {
  const now = new Date();
  const datePart = now.toISOString().slice(0,10).replace(/-/g,"");
  const randomPart = Math.floor(100000 + Math.random() * 900000);
  return `CRN-${datePart}-${randomPart}`;
}



// STEP 1: PROCESSING

function continuePayment(name, email, sitter, price, method, btcWallet, paymentImageURL) {

const receiptId = generateReceiptId();

let arrival = "";

try {
  arrival = getArrivalText();
} catch (e) {
  console.error("Arrival error:", e);
  arrival = "On-time";
}

    if (processingOverlay) {
      processingOverlay.style.display = "flex";
    }

    setTimeout(() => {
      if (processingOverlay) processingOverlay.style.display = "none";
      if (successOverlay) successOverlay.style.display = "flex";
  

      // STEP 2: SUCCESS → RECEIPT LOADING
      setTimeout(() => {
        if (successOverlay) successOverlay.style.display = "none";
        if (receiptOverlay) receiptOverlay.style.display = "flex";

        // PROGRESS BAR
        let progress = 0;

        const interval = setInterval(() => {
          progress += 10;

          if (progressFill) {
            progressFill.style.width = progress + "%";
          }

          if (progress >= 100) {
        console.log("✅ Progress reached 100%");
            clearInterval(interval);

      
   const booking = {
  receiptId,
  name,
  email,
  sitter,
  price,
  method,
  btcWallet,
  paymentImageURL,
  status: "pending",
  date: localStorage.getItem("date"),
  time: localStorage.getItem("time"),
  city: localStorage.getItem("city"),
  state: localStorage.getItem("state"),
  address: localStorage.getItem("address"),
  arrival: arrival,

  careType: localStorage.getItem("careType"),
  planName: localStorage.getItem("planName")
};

db.ref("bookings/" + receiptId).set(booking);
localStorage.setItem("currentReceiptId", receiptId);


            // STEP 3: SHOW FINAL RECEIPT
            if (receiptOverlay) receiptOverlay.style.display = "none";
            if (finalReceipt) finalReceipt.style.display = "flex";
if (typeof watchBookingStatus === "function") {
  watchBookingStatus();
}

console.log("🔥 Showing receipt now...");
            if (receiptContent) {
             receiptContent.innerHTML = `
  <h2 class="receipt-brand">
  CareNest
  <span>Babysitting Services</span>
</h2>
<p style="text-align:center;">📍 Trusted Childcare Nationwide</p>
<hr>

<p><strong>Receipt ID:</strong> ${receiptId}</p>
<p><strong>Date:</strong> ${new Date().toLocaleString()}</p>

<hr>

<p>👤 <strong>Name:</strong> ${name}</p>
  <p>📧 <strong>Email:</strong> ${email}</p>
  <p>👩‍🍼 <strong>Sitter:</strong> ${sitter}</p>
  <p>⏰ <strong>Arrival:</strong> ${arrival}</p>
  <p>🧾 <strong>Service:</strong> ${localStorage.getItem("careType") || "N/A"}</p>
  <p>📦 <strong>Plan:</strong> ${localStorage.getItem("planName") || "N/A"}</p>
  <hr>
  ${getBookingDetails()}
  <hr>
  <p>📍<strong>Address:</strong> ${localStorage.getItem("address") || "N/A"}</p>
  <p>📍<strong>City:</strong> ${localStorage.getItem("city") || ""}</p>
  <p>📍<strong>State:</strong> ${localStorage.getItem("state") || ""}</p>

  <hr>

  <p>💰 <strong>Amount Paid:</strong> $${price}</p>
  <p>💳 <strong>Payment Method:</strong> ${method ? method.toUpperCase() : "N/A"}</p>


${paymentImageURL ? `
  <!-- WEB BUTTON -->
  <div class="web-only">
    <button class="view-image-btn" onclick="viewPaymentImage('${paymentImageURL}')">
      👁 View Payment Proof
    </button>
  </div>

  <!-- PDF IMAGE -->
  <div class="pdf-only">
    <p><strong>Payment Proof:</strong></p>
    <img src="${paymentImageURL}" style="max-width:100%;border-radius:8px;">
  </div>

` : ""}

${method === "btc" ? `<p><strong>Wallet:</strong> ${btcWallet}</p>` : ""}
  <p id="receiptStatus" style="color:orange;">
  <strong>Status:</strong> ⏳ Pending Payment Confirmation
</p>
<p style="font-size:13px;">
You will be notified via email once payment is confirmed by admin.
</p>

<hr>

<p style="text-align:center;">
Thank you for choosing <strong>CareNest</strong> ❤️
</p>
  
`;
            }
          }

        }, 300);

      }, 2000);

    }, 3000);

 } }); 



const openSitterBtn = document.getElementById("openSitterBtn");
const sitterModal = document.getElementById("sitterModal");

if (openSitterBtn && sitterModal) {
  openSitterBtn.addEventListener("click", () => {
  const box = document.getElementById("findingSitterBox");
  const text = document.getElementById("findingText");

  const availableSitters = parseInt(localStorage.getItem("availableSitters")) || 0;

  box.style.display = "flex";

  // Step 1
  text.textContent = "🔍 Finding available sitters...";

  // Step 2
  setTimeout(() => {

    text.textContent = `✅ ${availableSitters} sitters available`;

    // Step 3
    setTimeout(() => {

     
  // 🔥 FULLY REMOVE OVERLAY
  box.style.display = "none";
  box.style.opacity = "0";
  box.style.visibility = "hidden";
  box.style.pointerEvents = "none";

  // 🔥 NOW OPEN MODAL
  const sitterModal = document.getElementById("sitterModal");
  if (sitterModal) {
    sitterModal.style.display = "flex";
sitterModal.classList.add("show");
  }

}, 1500);

  }, 2000);
});
}



function printReceipt() {
  const content = document.getElementById("receiptBox").innerHTML;
  const win = window.open("", "", "width=800,height=600");
  win.document.write(`
    <html>
      <head>
        <title>Receipt</title>
      </head>
      <body>
        ${content}
      </body>
    </html>
  `);
  win.document.close();
  win.print();
}

function downloadPDF() {
  const element = document.getElementById("receiptBox");

  // 🔥 ADD THIS LINE
  document.body.classList.add("pdf-mode");

  html2pdf().set({
    margin: 10,
    filename: "CareNest_Receipt.pdf",
    html2canvas: { scale: 2 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
  }).from(element).save().then(() => {

    // 🔥 REMOVE AFTER PDF
    document.body.classList.remove("pdf-mode");

  });
}



function viewPaymentImage(url) {
  const viewer = document.getElementById("imageViewer");
  const img = document.getElementById("previewImage");

  if (viewer && img) {
    img.src = url;
    viewer.style.display = "flex";
  }
}

function convertToBase64(file, callback) {
  const reader = new FileReader();
  reader.onload = function () {
    callback(reader.result);
  };
  reader.readAsDataURL(file);
}


function closeImageViewer() {
  const viewer = document.getElementById("imageViewer");

  if (viewer) {
    viewer.style.display = "none";
  }
}


function checkPaymentReady() {
  const name = document.getElementById("customerName")?.value.trim();
  const email = document.getElementById("customerEmail")?.value.trim();
  const method = document.getElementById("paymentMethod")?.value;

  const planType = localStorage.getItem("planType");

  const hours = document.getElementById("hoursInput")?.value;
  const days = document.getElementById("daysInput")?.value;
  const halfStart = document.getElementById("halfStart")?.value;
  const halfEnd = document.getElementById("halfEnd")?.value;
  const overnight = document.getElementById("overnightSelect")?.value;
  const arrivalSelect = document.getElementById("arrivalTime");
  const arrival = arrivalSelect ? arrivalSelect.value : "";
 

  let validPlan = false;

  if (planType === "hourly" && hours > 0) validPlan = true;
  if (planType === "fullday" && days > 0) validPlan = true;
  if (planType === "halfday" && halfStart && halfEnd && validateHalfDayTime()) {
  validPlan = true;
}
  if (planType === "overnight" && overnight) validPlan = true;


console.log({
  name,
  email,
  method,
  validPlan,
  arrival
});
 const isValid = name && email && method && validPlan && arrival !== "";

  const btn = document.getElementById("payNowBtn");

  if (btn) {
    btn.disabled = !isValid;
    btn.style.opacity = isValid ? "1" : "0.5";
    btn.style.cursor = isValid ? "pointer" : "not-allowed";
  }
}

document.addEventListener("input", checkPaymentReady);
document.addEventListener("change", checkPaymentReady);
document.addEventListener("click", checkPaymentReady);

function finishBooking() {
  localStorage.clear();
  window.location.href = "index.html";
}

function validateHalfDayTime() {
  const start = document.getElementById("halfStart")?.value;
  const end = document.getElementById("halfEnd")?.value;

  if (!start || !end) return true;

  if (end <= start) {
    const errorBox = document.getElementById("paymentError");
    if (errorBox) {
      errorBox.textContent = "⚠️ End time must be after start time";
    }
    return false;
  }

  const errorBox = document.getElementById("paymentError");
  if (errorBox) errorBox.textContent = "";

  return true;
}

function sendReceiptEmail(name, email, sitter, price, receiptId) {
  // Get date, time, city, state from localStorage
  const date = localStorage.getItem("date") || "N/A";
  const time = localStorage.getItem("time") || "N/A";
  const city = localStorage.getItem("city") || "N/A";
  const state = localStorage.getItem("state") || "N/A";
  const careType = localStorage.getItem("careType") || "N/A";
  const planName = localStorage.getItem("planName") || "N/A";
  const address = localStorage.getItem("address") || "N/A";

const templateParams = {
  name: name,
  email: email,
  sitter: sitter,
  date: date,
  time: time,
  location: `${city}, ${state}`,
  amount: "$" + price,
  arrival: getArrivalText() || "On-time",
  receiptId: receiptId,
  careType: careType,
  planName: planName,
  address: address
};
  emailjs.send("service_2hk40dp", "template_n6v3do5", templateParams)
 .then(function(response) {
   console.log("✅ Email sent!", response);
 alert("Email sent successfully!");
}, function(error) {
   console.error("❌ FULL ERROR:", error);
   alert("Email failed. Check console.");
});
}


function getArrivalText() {
  const arrivalSelect = document.getElementById("arrivalTime");
const arrival = arrivalSelect ? arrivalSelect.value : "";
  const baseTime = localStorage.getItem("time");

  if (!arrival || !baseTime) return arrival;

  const [hour, minute] = baseTime.split(":").map(Number);
  let date = new Date();
  date.setHours(hour);
  date.setMinutes(minute);

  if (arrival.includes("5")) date.setMinutes(date.getMinutes() - 5);
  if (arrival.includes("10")) date.setMinutes(date.getMinutes() - 10);
  if (arrival.includes("15")) date.setMinutes(date.getMinutes() - 15);
  if (arrival.includes("30")) date.setMinutes(date.getMinutes() - 30);

  return `${arrival} (${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})})`;
}


function watchBookingStatus() {

  const receiptId = localStorage.getItem("currentReceiptId");
  if (!receiptId) return;

  firebase.database().ref("bookings/" + receiptId).on("value", (snapshot) => {

    const booking = snapshot.val();
    if (!booking) return;

    const statusEl = document.getElementById("receiptStatus");
    if (!statusEl) return;

    if (booking.status === "confirmed") {

      statusEl.innerHTML = "✅ <strong>Status:</strong> Payment Confirmed";
      statusEl.style.color = "green";

      // Optional styling (same as your own)
      statusEl.style.fontSize = "18px";
      statusEl.style.fontWeight = "bold";
    }

  });
}

