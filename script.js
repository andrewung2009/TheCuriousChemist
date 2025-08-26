// Select container and modal elements
const container = document.getElementById("elements-container");
const modal = document.getElementById("modal");
const closeBtn = document.getElementById("close-btn");

// Populate Group 1 elements
group1Metals.forEach(metal => {
    const div = document.createElement("div");
    div.className = "element group1";
    div.innerHTML = `<strong>${metal.symbol}</strong><br>${metal.number}`;
    div.addEventListener("click", () => showModal(metal));
    container.appendChild(div);
});

// Show modal with element info
function showModal(metal) {
    document.getElementById("element-name").textContent = metal.name;
    document.getElementById("element-symbol").textContent = metal.symbol;
    document.getElementById("element-number").textContent = metal.number;
    document.getElementById("element-physical").textContent = metal.physical;
    document.getElementById("element-chemical").textContent = metal.chemical;
    document.getElementById("element-reactions").textContent = metal.reactions;
    modal.style.display = "block";
}

// Close modal
closeBtn.onclick = () => modal.style.display = "none";
window.onclick = e => { if (e.target == modal) modal.style.display = "none"; };
