import { redirect } from "next/navigation";

const DashboardPage = async () => {
    // Redirect to root page which now serves as the dashboard
    redirect("/");
};

export default DashboardPage;