import {
    getAdminProfile,
    adminLogout,
    getDashboardData,
} from "../api/adminApi.js";


/* =========================
   DOM ELEMENTS
========================= */

const adminName =
    document.getElementById("adminName");

const adminInitial =
    document.getElementById("adminInitial");

const sessionUsername =
    document.getElementById("sessionUsername");

const logoutButton =
    document.getElementById("logoutButton");

const totalSubmissions =
    document.getElementById("totalSubmissions");

const todaySubmissions =
    document.getElementById("todaySubmissions");

const monthSubmissions =
    document.getElementById("monthSubmissions");

const latestSubmission =
    document.getElementById("latestSubmission");

const currentDate =
    document.getElementById("currentDate");

const refreshButton =
    document.getElementById("refreshButton");

const submissionCount =
    document.getElementById("submissionCount");

const submissionsTableBody =
    document.getElementById("submissionsTableBody");


/* =========================
   CURRENT DATE
========================= */

const displayCurrentDate = () => {

    if (!currentDate) {
        return;
    }

    const today = new Date();

    currentDate.textContent =
        today.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
};


/* =========================
   LOAD DASHBOARD
========================= */

const loadDashboard = async () => {

    try {

        const dashboardData =
            await getDashboardData();

        console.log(
            "Dashboard data:",
            dashboardData
        );


        /* =========================
           STATISTICS
        ========================== */

        totalSubmissions.textContent =
            dashboardData.stats.totalSubmissions;

        todaySubmissions.textContent =
            dashboardData.stats.todaySubmissions;

        monthSubmissions.textContent =
            dashboardData.stats.monthSubmissions;


        /* =========================
           RECENT SUBMISSIONS
        ========================== */

        const submissions =
            dashboardData.recentSubmissions || [];

        if (submissions.length > 0) {

            const latest =
                submissions[0];

            latestSubmission.textContent =
                latest.created_at
                    ? new Date(
                        latest.created_at
                    ).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                    })
                    : "-";

        } else {

            latestSubmission.textContent = "-";

        }


        renderRecentSubmissions(
            submissions
        );

    } catch (error) {

        console.error(
            "Failed to load dashboard:",
            error
        );

        throw error;
    }
};


/* =========================
   RENDER SUBMISSIONS
========================= */

const renderRecentSubmissions = (
    submissions
) => {

    if (!submissionsTableBody) {

        console.error(
            "Element #submissionsTableBody was not found"
        );

        return;
    }


    submissionsTableBody.innerHTML = "";


    if (
        !submissions ||
        submissions.length === 0
    ) {

        submissionsTableBody.innerHTML = `
            <tr class="empty-row">

                <td colspan="7">

                    <div class="empty-state">

                        <div class="empty-icon">
                            □
                        </div>

                        <h3>
                            No submissions found
                        </h3>

                        <p>
                            There are currently no applications to display.
                        </p>

                    </div>

                </td>

            </tr>
        `;

        if (submissionCount) {
            submissionCount.textContent =
                "No submissions";
        }

        return;
    }


    submissions.forEach((submission) => {

        const row =
            document.createElement("tr");


        const startDate =
            submission.start_date
                ? new Date(
                    submission.start_date
                ).toLocaleDateString(
                    "en-IN"
                )
                : "-";


        const submittedDate =
            submission.created_at
                ? new Date(
                    submission.created_at
                ).toLocaleDateString(
                    "en-IN"
                )
                : "-";


        row.innerHTML = `

            <td>

                <div class="applicant-cell">

                    <strong>
                        ${submission.name}
                    </strong>

                    <span>
                        ${submission.contact_number || "-"}
                    </span>

                </div>

            </td>


            <td>
                ${submission.email}
            </td>


            <td>
                ${submission.institution_type || "-"}
            </td>


            <td>
                ${submission.program_type || "-"}
            </td>


            <td>
                ${startDate}
            </td>


            <td>
                ${submittedDate}
            </td>


            <td>

                <span class="status-badge">
                    Received
                </span>

            </td>

        `;


        submissionsTableBody.appendChild(row);

    });


    if (submissionCount) {

        submissionCount.textContent =
            `Showing ${submissions.length} recent submission${submissions.length === 1 ? "" : "s"}`;

    }

};


/* =========================
   INITIALIZE DASHBOARD
========================= */

const initializeDashboard = async () => {

    try {

        console.log("1. Dashboard initialization started");


        /*
         * Check authentication
         */
        console.log("2. Checking admin profile...");

        const profileData = await getAdminProfile();

        console.log(
            "3. Profile response:",
            profileData
        );


        if (
            !profileData ||
            !profileData.admin
        ) {
            throw new Error(
                "Profile response does not contain admin data"
            );
        }


        adminName.textContent =
            profileData.admin.username;


        /*
         * Load dashboard
         */
        console.log(
            "4. Loading dashboard data..."
        );

        const dashboardData =
            await getDashboardData();

        console.log(
            "5. Dashboard response:",
            dashboardData
        );


        if (
            !dashboardData ||
            !dashboardData.stats
        ) {
            throw new Error(
                "Dashboard response does not contain stats"
            );
        }


        /*
         * Update statistics
         */
        totalSubmissions.textContent =
            dashboardData.stats.totalSubmissions;

        todaySubmissions.textContent =
            dashboardData.stats.todaySubmissions;

        monthSubmissions.textContent =
            dashboardData.stats.monthSubmissions;


        /*
         * Render submissions
         */
        renderRecentSubmissions(
            dashboardData.recentSubmissions
        );


        console.log(
            "6. Dashboard initialized successfully"
        );


    } catch (error) {

        console.error(
            "DASHBOARD INITIALIZATION ERROR:",
            error
        );

        /*
         * IMPORTANT:
         * Do NOT redirect yet.
         *
         * We want to see exactly
         * which request is failing.
         */

    }
};

initializeDashboard();