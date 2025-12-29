let currentRole = "";
let currentUser = "";
let resources = [
    { name: "Classroom A", type: "Room" },
    { name: "Lab Projector", type: "Equipment" },
    { name: "Library Book - DBMS", type: "Book" }
];

let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

/* LOGIN */
function login() {
    currentRole = document.getElementById("role").value;
    document.getElementById("loginSection").classList.add("hidden");
    document.getElementById("appSection").classList.remove("hidden");
    loadDashboard();
    loadResources();
    loadRolePanels();
}

// Show Role Panel
function loadRolePanels()
{
    hideAllRolePanels();
    if(currentRole==="admin")
    {
        document.getElementById("adminPanel").classList.remove("hidden");
        loadAllBookings();
    }
    if (currentRole === "faculty") {
        document.getElementById("facultyPanel").classList.remove("hidden");
        loadFacultyBookings();
    }
    if (currentRole === "student") {
        document.getElementById("studentPanel").classList.remove("hidden");
        loadStudentBookings();
    }
}

function hideAllRolePanels() {
    document.querySelectorAll("#adminPanel, #facultyPanel, #studentPanel")
        .forEach(p => p.classList.add("hidden"));
}
/* DASHBOARD */
function loadDashboard() {
    let list = document.getElementById("resourceList");
    list.innerHTML = "";
    resources.forEach(r => {
        list.innerHTML += `<li>${r.name} (${r.type})</li>`;
    });
}

/* LOAD RESOURCES */
function loadResources() {
    let select = document.getElementById("resourceSelect");
    select.innerHTML = "";

    resources.forEach((r, i) => {
        if (currentRole === "student" && r.type !== "Book") return;
        select.innerHTML += `<option value="${i}">${r.name}</option>`;
    });
}

/* ADMIN FEATURE */
function adminAddResource() {
    let name = document.getElementById("newResourceName").value;
    let type = document.getElementById("newResourceType").value;

    if (!name) return alert("Enter resource name");

    resources.push({ name, type });
    loadDashboard();
    loadResources();
    alert("Resource Added Successfully");
}

/* BOOK RESOURCE (FACULTY + STUDENT) */
function bookResource() {
    let index = document.getElementById("resourceSelect").value;
    let date = document.getElementById("date").value;
    let start = document.getElementById("startTime").value;
    let end = document.getElementById("endTime").value;

    let conflict = bookings.find(b =>
        b.resource === resources[index].name &&
        b.date === date &&
        start < b.end &&
        end > b.start
    );

    if (conflict) {
        document.getElementById("bookingMessage").innerText =
            "❌ Booking Conflict!";
        return;
    }

    bookings.push({
        user: currentUser,
        role: currentRole,
        resource: resources[index].name,
        date,
        start,
        end
    });
    localStorage.setItem("bookings", JSON.stringify(bookings));
    document.getElementById("bookingMessage").innerText =
        "✅ Booking Successful";

    loadRolePanels();
}

/* ADMIN VIEW */
function loadAllBookings() {
    let list = document.getElementById("allBookings");
    list.innerHTML = "";

    bookings.forEach(b => {
        list.innerHTML +=
            `<li>${b.resource} | ${b.role} | ${b.date}</li>`;
    });
}

/* FACULTY VIEW */
function loadFacultyBookings() {
    let list = document.getElementById("facultyBookings");
    list.innerHTML = "";

    bookings
        .filter(b => b.role === "faculty")
        .forEach(b => {
            list.innerHTML += `<li>${b.resource} on ${b.date}</li>`;
        });
}

/* STUDENT VIEW */
function loadStudentBookings() {
    let list = document.getElementById("studentBookings");
    list.innerHTML = "";

    bookings
        .filter(b => b.role === "student")
        .forEach(b => {
            list.innerHTML += `<li>${b.resource} on ${b.date}</li>`;
        });
}

/* LOGOUT */
function logout() {
    location.reload();
}

/* NAVIGATION */
function showPage(page) {
    document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
    document.getElementById(page).classList.remove("hidden");
}

/* DASHBOARD
function loadDashboard() {
    let list = document.getElementById("resourceList");
    list.innerHTML = "";
    resources.forEach(r => {
        list.innerHTML += `<li>${r.name} (${r.type})</li>`;
    });
}*/

/* LOAD RESOURCES
function loadResources() {
    let select = document.getElementById("resourceSelect");
    select.innerHTML = "";
    resources.forEach((r, i) => {
        select.innerHTML += `<option value="${i}">${r.name}</option>`;
    });
}*/

/* BOOK RESOURCE 
function bookResource() {
    let resIndex = document.getElementById("resourceSelect").value;
    let date = document.getElementById("date").value;
    let start = document.getElementById("startTime").value;
    let end = document.getElementById("endTime").value;

    // Conflict Detection
    let conflict = bookings.find(b =>
        b.resource === resources[resIndex].name &&
        b.date === date &&
        start < b.end &&
        end > b.start
    );

    if (conflict) {
        document.getElementById("bookingMessage").innerText =
            "❌ Booking Conflict Detected!";
        return;
    }

    bookings.push({
        resource: resources[resIndex].name,
        date,
        start,
        end
    });

    localStorage.setItem("bookings", JSON.stringify(bookings));
    document.getElementById("bookingMessage").innerText =
        "✅ Booking Successful!";
}
        */

/* SEARCH */
function searchResource() {
    let query = document.getElementById("searchInput").value.toLowerCase();
    let result = document.getElementById("searchResult");
    result.innerHTML = "";

    resources.filter(r => r.name.toLowerCase().includes(query))
        .forEach(r => {
            result.innerHTML += `<li>${r.name}</li>`;
        });
}

/* REPORTS */
document.getElementById("reports").addEventListener("click", () => {
    document.getElementById("reportData").innerText =
        `Total Resources: ${resources.length}
Total Bookings: ${bookings.length}`;
});
