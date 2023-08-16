// Logic


const api_url = "https://hickory-quilled-actress.glitch.me/computers"
// DOM
const elBankBalanceValue = document.getElementById("bankBalanceValue");
const elOutstandingLoanValue = document.getElementById("outstandingLoanValue");
const elPayBalanceValue = document.getElementById("payBalanceValue");
const elLaptopSelect = document.getElementById("laptopSelect");
const elSpecs = document.getElementById("specs");
const elLaptopTitle = document.getElementById("laptopTitle");
const elLaptopDescription = document.getElementById("laptopDescription");

// array to store fetched data (laptops)
let laptops = [];

// Function to fetch laptop data from API endpoint (url)
function fetchAPI(url) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            laptops = data;
            // Supply to laptop select box with options
            laptops.forEach((laptop, index) => {
                const option = document.createElement("option");
                option.text = laptop.title;
                option.value = index;
                elLaptopSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Some error fetching:", error);
        });
}

// Update laptop details handler
function updateLaptopDetails(selectedLaptop) {
    elLaptopTitle.textContent = selectedLaptop.title;
    elLaptopDescription.textContent = selectedLaptop.description;
    elSpecs.textContent = selectedLaptop.specs.join(", ");
}

// Loan repay handler
function repayLoan() {
    debugger
    if (elOutstandingLoanValue.textContent > "0") {
        const payAmount = parseInt(elPayBalanceValue.textContent);
        const outstandingLoanAmount = parseInt(elOutstandingLoanValue.textContent);
        
        if (payAmount >= outstandingLoanAmount) {
            //paybalance - remaining loan fee
            elBankBalanceValue.textContent = (payAmount*0.9 + parseInt(elBankBalanceValue.textContent)).toString();
            elOutstandingLoanValue.textContent -= 0.1*payAmount.toString();
            // Clear the outstanding loan amount
            elPayBalanceValue.textContent = "0";
        }
    }
}

// Work button handler
function workClick() {
    const payAmount = parseInt(elPayBalanceValue.textContent);
    elPayBalanceValue.textContent = (payAmount + 100).toString();
}

// Get loan handler
function getLoan() {
    const maxLoanAmount = parseInt(elBankBalanceValue.textContent) * 2;
    const currentLoanAmount = parseInt(elOutstandingLoanValue.textContent);

    if (currentLoanAmount === 0) {
        const requestedLoan = prompt(`Enter loan amount (up to ${maxLoanAmount}):`);
        
        if (requestedLoan !== null) {
            const loanAmount = parseInt(requestedLoan);
            if (loanAmount > 0 && loanAmount <= maxLoanAmount) {
                const currentBalance = parseInt(elBankBalanceValue.textContent);
                const newBalance = currentBalance - loanAmount;
                elBankBalanceValue.textContent = newBalance.toString();
                
                // Add the loan amount to the outstanding loan value
                elOutstandingLoanValue.textContent = loanAmount.toString();
            } else {
                alert("Invalid loan amount.");
            }
        }
    } else {
        alert("You already have an outstanding loan.");
    }
}

// transfer to bank accnt handler
function transferToBank() {
    const payAmount = parseInt(elPayBalanceValue.textContent);
    const currentBalance = parseInt(elBankBalanceValue.textContent);
    const currentLoanAmount = parseInt(elOutstandingLoanValue.textContent);
    elBankBalanceValue.textContent = currentBalance + parseInt(elPayBalanceValue.textContent);
    elPayBalanceValue.textContent = "0";

    /**if (currentLoanAmount > 0) {
        // -0.1*pay balance value
        const loanRepaymentAmount = Math.ceil(payAmount * 0.1);
        elPayBalanceValue.textContent = (payAmount - loanRepaymentAmount).toString();
        elOutstandingLoanValue.textContent = (currentLoanAmount + loanRepaymentAmount).toString();
    }
    const amountTransferredToBank = payAmount - (currentLoanAmount > 0 ? Math.ceil(payAmount * 0.1) : 0);
    elBankBalanceValue.textContent = (currentBalance + amountTransferredToBank).toString();
    elPayBalanceValue.textContent = "0";

    // Update bank balance value
    document.getElementById("elBankBalanceValue").textContent = elBankBalanceValue.textContent;- */
}

// Buy now latop handler
function buyLaptop() {
    const selectedLaptopIndex = elLaptopSelect.selectedIndex;
    const selectedLaptop = laptops[selectedLaptopIndex];
    const laptopPrice = selectedLaptop.price;
    const currentBalance = parseInt(elBankBalanceValue.textContent);

    if (currentBalance >= laptopPrice) {
        // bank balance - laptop price
        elBankBalanceValue.textContent = (currentBalance - laptopPrice).toString();
        alert(`Congratulations! You've purchased ${selectedLaptop.title}.`);
    } else {
        alert("You cannot afford this laptop.");
    }
}

// init supplying select box
fetchAPI(api_url);

// Adding event listeners
elLaptopSelect.addEventListener("change", (event) => {
    const selectedLaptopIndex = event.target.selectedIndex;
    const selectedLaptop = laptops[selectedLaptopIndex];
    updateLaptopDetails(selectedLaptop);
});


document.getElementById("getLoan").addEventListener("click", getLoan);
document.getElementById("repayLoan").addEventListener("click", repayLoan);
document.getElementById("work").addEventListener("click", workClick);
document.getElementById("bank").addEventListener("click", transferToBank);
document.getElementById("buyNow").addEventListener("click", buyLaptop);
