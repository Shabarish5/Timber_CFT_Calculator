document.addEventListener("DOMContentLoaded", () => {
    const referenceTable = document.getElementById("referenceTable");
    const historyTableBody = document.querySelector("#historyTable tbody");
    const toggleTableBtn = document.getElementById("toggleTable");
    const resultDiv = document.getElementById("result");
    const tableContainer = document.getElementById("tableContainer");

    let showTable = true;

    const generateCFT = (feet, inches, length) => {
        const girthInFeet = feet + inches / 12;
        return Math.round((girthInFeet * girthInFeet * length) / 16 * 100) / 100;
    };

    const generateCFTData = () => {
        const data = {};
        for (let feet = 1; feet <= 6; feet++) {
            for (let inches = 0; inches < 12; inches++) {
                const key = `${feet}-${inches}`;
                data[key] = {};
                for (let length = 1; length <= 15; length++) {
                    data[key][length] = generateCFT(feet, inches, length);
                }
            }
        }
        return data;
    };

    const populateReferenceTable = (data) => {
        const headerRow = document.createElement("tr");
        headerRow.innerHTML = "<th>Girth</th>" + [...Array(15)].map((_, i) => `<th>${i + 1}'</th>`).join("");
        referenceTable.appendChild(headerRow);

        Object.entries(data).forEach(([girth, lengths]) => {
            const row = document.createElement("tr");
            const [feet, inches] = girth.split("-");
            const formattedGirth = `${feet}'${inches}"`;
            row.innerHTML = `<td>${formattedGirth}</td>` + Object.values(lengths).map(value => `<td>${value.toFixed(2)}</td>`).join("");
            referenceTable.appendChild(row);
        });
    };

    const addToHistory = (timestamp, girth, length, cft) => {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${timestamp}</td><td>${girth}</td><td>${length}</td><td>${cft}</td>`;
        historyTableBody.prepend(row);
    };

    document.getElementById("calculateBtn").addEventListener("click", () => {
        const girthFeet = parseInt(document.getElementById("girthFeet").value, 10);
        const girthInches = parseInt(document.getElementById("girthInches").value, 10);
        const lengthFeet = parseInt(document.getElementById("lengthFeet").value, 10);

        if (isNaN(girthFeet) || isNaN(girthInches) || isNaN(lengthFeet) ||
            girthFeet < 1 || girthFeet > 6 || girthInches < 0 || girthInches > 11 || lengthFeet < 1 || lengthFeet > 15) {
            alert("Please enter valid numbers within the specified ranges:\nGirth (feet): 1-6\nGirth (inches): 0-11\nLength: 1-15");
            return;
        }

        const cft = generateCFT(girthFeet, girthInches, lengthFeet);
        const timestamp = new Date().toLocaleString();
        const girth = `${girthFeet}'${girthInches}"`;

        addToHistory(timestamp, girth, lengthFeet, cft);
        resultDiv.textContent = `Calculated CFT: ${cft}`;
    });

    toggleTableBtn.addEventListener("click", () => {
        showTable = !showTable;
        tableContainer.style.display = showTable ? "block" : "none";
        toggleTableBtn.textContent = showTable ? "Hide Table" : "Show Table";
    });

    const cftData = generateCFTData();
    populateReferenceTable(cftData);
});
