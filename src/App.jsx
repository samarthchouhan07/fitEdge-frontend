import "./App.css";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { LoginPage } from "../src/components/loginPage";
import OtpPage from "./components/otpPage";
import { Landing } from "./components/landing";
import { AdminDashboard } from "./components/adminDashboard";
import { CoachCreatePlan } from "./components/CoachCreatePlan";
import { ClientWorkoutPlans } from "./components/clientWorkoutPlans";
import { CoachDashboard } from "./components/coachDashboard";
import { CoachPlanDetails } from "./components/CoachPlanDetails";
import { ClientCalendar } from "./components/ClientCalendar";
import { CreateGoal } from "./components/CreateGoal";
import { ClientGoal } from "./components/ClientGoal";
import { Chat } from "./components/chat";
import { UserProfile } from "./components/UserProfile";
import { ClientDashboard } from "./components/ClientDashboard";
import { GymProfileSettings } from "./components/GymProfileSettings";
import { ClientDetails } from "./components/ClientDetails";
import { Header } from "./components/header";

const Layout = () => (
  <div>
    <Header />
    <div className="pt-16">
      <Outlet />
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />.
        <Route path="/login" element={<LoginPage />} />.
        <Route path="/verify" element={<OtpPage />} />.
        <Route element={<Layout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />.
          <Route path="/coach/create-plan" element={<CoachCreatePlan />} />.
          <Route
            path="/client/plans/workout"
            element={<ClientWorkoutPlans />}
          />
          .
          <Route path="/coach/dashboard" element={<CoachDashboard />} />.
          <Route path="/coach/client/:clientId" element={<ClientDetails />} />
          <Route
            path="/coach/dashboard/plan/:planId"
            element={<CoachPlanDetails />}
          />{" "}
          .
          <Route path="/client/calendar" element={<ClientCalendar />} />.
          <Route path="/create-goal" element={<CreateGoal />} />.
          <Route path="/client/goals" element={<ClientGoal />} />.
          <Route path="/chat" element={<Chat />} />.
          <Route path="/settings" element={<GymProfileSettings />} />.
          <Route path="/profile/:userId" element={<UserProfile />} />.
          <Route path="/client/dashboard" element={<ClientDashboard />} />.
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
