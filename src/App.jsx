import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

/* ---------------- CONTEXT ---------------- */
import { VipProvider } from "./context/VipContext";
import { GuardProvider } from "./context/GuardContext";
import { AdminProvider } from "./context/AdminContext";
import { UserProvider } from "./context/UserContext";


/* ---------------- AUTH ---------------- */
import AdminLogin from "./components/AdminLogin";
import Logout from "./components/Logout";
import PrivateRoute from "./components/PrivateRoute";


/* ---------------- ADMIN ---------------- */
import AdminForm from "./components/AdminForm";
import AdminDashboard from "./pages/AdminDashboard";
import AdminListPage from "./pages/AdminListPage";
import AdminProfile from "./components/AdminProfile";
import AdminEditPage from "./pages/AdminEditPage";
import VipAutoAssign from "./pages/VipAutoAssign";

/* ---------------- VIP ---------------- */
import VIPForm from "./components/VIPForm";
import VipListPage from "./pages/VipListPage";
import VipGuardManagement from "./components/VipGuardManagement";
import VipDashboard from "./pages/VipDashboard";
import VipLayout from "./layouts/Viplayout";
import VipProfile from "./components/VipProfile";

/* ---------------- GUARD ---------------- */
import GuardForm from "./components/GuardForm";
import GuardListPage from "./pages/GuardListPage";
import GuardDashboard from "./pages/GuardDashboard";
import GuardProfile from "./components/GuardProfile";
import Guardlayout from "./layouts/Guardlayout";
import GuardShift from "./components/GuardShift";

/* ---------------- USER ---------------- */
import UserLayout from "./layouts/UserLayout";
import UserDashboard from "./pages/UserDashboard";
import UserProfile from "./components/UserProfile";
// import UserDetailEditPage from "./components/UserDetailEditPage";
import UserForm from "./components/UserForm";

/* ---------------- LAYOUT ---------------- */
import Adminlayout from "./layouts/Adminlayout";

/* ---------------- WRAPPER ---------------- */
import AdminUserWrapper from "./components/AdminUserWrapper";

/* ---------------- TOAST ---------------- */
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GuardEditPage from "./pages/GuardEditPage";
// import VIPEditForm from "./components/VipDetailEditPage";
import VipEditPage from "./pages/VipEditPage";
import UserEditPage from "./pages/UserEditPage";
import VipAssignedGuards from "./components/VipAssignedGuards";
import AdminUserGuardLeaveRequest from "./components/AdminUserGuardLeaveRequest";
import AdminRequestAccept from "./components/AdminRequestAccept";
import GuardDutyDecision from "./components/GuardDutyDecision";
import GuardDutyHistory from "./components/GuardDutyHistory";
import VipHistory from "./components/VipHistory";

import AdminUserVipHistory from "./components/AdminUserVipHistory";
import GuardNotification from "./components/GuardNotification";
import VipNotification from "./components/VipNotification";
import Incident from "./components/Incident";
import VipIncident from "./components/VipIncident";
import GuardIncident from "./components/GuardIncident";
import GuardIncidentHistory from "./components/GuardIncidentHistory";
import VipDuty from "./components/VipDuty";
import MarkDuty from "./components/MarkDuty";
import ManagerSettings from "./components/ManagerSettings";
import UpdationHistory from "./components/UpdationHistory";

import Notification from "./components/Notifications";

function App() {

  useEffect(() => {
    const resetActivityTimer = () => {
      localStorage.setItem("lastActiveTime", Date.now());
    };

    window.addEventListener("mousemove", resetActivityTimer);
    window.addEventListener("keydown", resetActivityTimer);

    return () => {
      window.removeEventListener("mousemove", resetActivityTimer);
      window.removeEventListener("keydown", resetActivityTimer);
    };
  }, []);

  return (
    <Router>
     
        <AdminProvider>
          <UserProvider>
            <VipProvider>
              <GuardProvider>

                <ToastContainer
                  position="top-right"
                  autoClose={2000}
                  pauseOnHover
                  draggable
                  theme="colored"
                />

                <Routes>

                  {/* ---------------- AUTH ---------------- */}
                  <Route path="/" element={<AdminLogin />} />
                  <Route path="/login" element={<AdminLogin />} />
                  <Route path="/logout" element={<Logout />} />

                  {/* ---------------- ADMIN ---------------- */}
                  <Route path="/register" element={<AdminForm />} />
                  <Route path="/userform" element={<UserForm />} />

                  <Route
                    path="/admindashboard"
                    element={
                      <PrivateRoute roles={["admin"]}>
                        <Adminlayout><AdminDashboard /></Adminlayout>
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/adminlist"
                    element={
                      <PrivateRoute roles={["admin"]}>
                        <Adminlayout><AdminListPage /></Adminlayout>
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/adminprofile"
                    element={
                      <PrivateRoute roles={["admin"]}>
                        <Adminlayout><AdminProfile /></Adminlayout>
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/adminedit"
                    element={
                      <PrivateRoute roles={["admin"]}>
                        <Adminlayout><AdminEditPage /></Adminlayout>
                      </PrivateRoute>
                    }
                  />


                  {/* <Route
                  path="/userform"
                  element={
                     <PrivateRoute roles={["admin"]}>
                      <Adminlayout><UserForm /></Adminlayout>
                     </PrivateRoute>
                  }
                /> */}

                  <Route
                    path="/vipform"
                    element={
                      <PrivateRoute roles={["admin"]}>
                        <Adminlayout><VIPForm /></Adminlayout>
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/guardform"
                    element={
                      <PrivateRoute roles={["admin"]}>
                        <Adminlayout><GuardForm /></Adminlayout>
                      </PrivateRoute>
                    }
                  />

                  {/* <Route
                  path="/adminrequestaccept"
                  element={
                    <PrivateRoute roles={["admin"]}>
                      <Adminlayout><AdminRequestAccept /></Adminlayout>
                    </PrivateRoute>
                  }
                /> */}

                  {/* ---------------- SHARED ADMIN + USER ---------------- */}
                  <Route
                    path="/vip-auto-assign"
                    element={
                      <PrivateRoute roles={["user"]}>
                        <UserLayout><VipAutoAssign /></UserLayout>
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/viplist"
                    element={
                      <PrivateRoute roles={["admin", "user"]}>
                        <AdminUserWrapper>
                          <VipListPage />
                        </AdminUserWrapper>
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/guardlist"
                    element={
                      <PrivateRoute roles={["admin", "user"]}>
                        <AdminUserWrapper>
                          <GuardListPage />
                        </AdminUserWrapper>
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/vgmang"
                    element={
                      <PrivateRoute roles={["admin", "user"]}>
                        <AdminUserWrapper>
                          <VipGuardManagement />
                        </AdminUserWrapper>
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/adminrequestaccept"
                    element={
                      <PrivateRoute roles={["admin", "user"]}>
                        <AdminUserWrapper>
                          <AdminRequestAccept />
                        </AdminUserWrapper>
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/dutyhistory"
                    element={
                      <PrivateRoute roles={["admin", "user"]}>
                        <AdminUserWrapper>
                          <AdminUserVipHistory />
                        </AdminUserWrapper>
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/incidents"
                    element={
                      <PrivateRoute roles={["admin", "user"]}>
                        <AdminUserWrapper>
                          <Incident />
                        </AdminUserWrapper>
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/markduty"
                    element={
                      <PrivateRoute roles={["admin", "user"]}>
                        <AdminUserWrapper>
                          <MarkDuty />
                        </AdminUserWrapper>
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/updatehistory"
                    element={
                      <PrivateRoute roles={["admin", "user"]}>
                        <AdminUserWrapper>
                          <UpdationHistory />
                        </AdminUserWrapper>
                      </PrivateRoute>
                    }
                  />
                  
                   <Route
                    path="/notify"
                    element={
                      <PrivateRoute roles={["admin", "user"]}>
                        <AdminUserWrapper>
                          <Notification />
                        </AdminUserWrapper>
                      </PrivateRoute>
                    }
                  /> 
                  

                  {/* ---------------- USER ---------------- */}
                  <Route
                    path="/userdashboard"
                    element={
                      <PrivateRoute roles={["user"]}>
                        <UserLayout><UserDashboard /></UserLayout>
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/useredit"
                    element={
                      <PrivateRoute roles={["user"]}>
                        <UserLayout><UserEditPage /></UserLayout>
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/userprofile"
                    element={
                      <PrivateRoute roles={["user"]}>
                        <UserLayout><UserProfile /></UserLayout>
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/uglrequest"
                    element={
                      <PrivateRoute roles={["user"]}>
                        <UserLayout><AdminUserGuardLeaveRequest /></UserLayout>
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/setting"
                    element={
                      <PrivateRoute roles={["user"]}>
                        <UserLayout><ManagerSettings /></UserLayout>
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/notify"
                    element={
                      <PrivateRoute roles={["user"]}>
                        <UserLayout><ManagerSettings /></UserLayout>
                      </PrivateRoute>
                    }
                  />

                  {/* ---------------- VIP ---------------- */}
                  <Route
                    path="/vipdashboard"
                    element={
                      <PrivateRoute roles={["vip"]}>
                        <VipLayout><VipDashboard /></VipLayout>
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/vipprofile"
                    element={
                      <PrivateRoute roles={["vip"]}>
                        <VipLayout><VipProfile /></VipLayout>
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/assguards"
                    element={
                      <PrivateRoute roles={["vip"]}>
                        <VipLayout><VipAssignedGuards /></VipLayout>
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/vipedit"
                    element={
                      <PrivateRoute roles={["vip"]}>
                        <VipLayout><VipEditPage /></VipLayout>
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/viphistory"
                    element={
                      <PrivateRoute roles={["vip"]}>
                        <VipLayout><VipHistory /></VipLayout>
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/vipNotification"
                    element={
                      <PrivateRoute roles={["vip"]}>
                        <VipLayout><VipNotification /></VipLayout>
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/vipIncident"
                    element={
                      <PrivateRoute roles={["vip"]}>
                        <VipLayout><VipIncident /></VipLayout>
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/vipduty"
                    element={
                      <PrivateRoute roles={["vip"]}>
                        <VipLayout><VipDuty /></VipLayout>
                      </PrivateRoute>
                    }
                  />

                  {/* ---------------- GUARD ---------------- */}
                  <Route
                    path="/guarddashboard"
                    element={
                      <PrivateRoute roles={["guard"]}>
                        <Guardlayout><GuardDashboard /></Guardlayout>
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/guardshift"
                    element={
                      <PrivateRoute roles={["guard"]}>
                        <Guardlayout><GuardShift /></Guardlayout>
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/guardprofile"
                    element={
                      <PrivateRoute roles={["guard"]}>
                        <Guardlayout><GuardProfile /></Guardlayout>
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/guardedit"
                    element={
                      <PrivateRoute roles={["guard"]}>
                        <Guardlayout><GuardEditPage /></Guardlayout>
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/guarddecision/:assignmentId"
                    element={
                      <PrivateRoute roles={["guard"]}>
                        <Guardlayout><GuardDutyDecision /></Guardlayout>
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/guardhistory"
                    element={
                      <PrivateRoute roles={["guard"]}>
                        <Guardlayout><GuardDutyHistory /></Guardlayout>
                      </PrivateRoute>
                    }
                  />

                  <Route
                    path="/guardNotification"
                    element={
                      <PrivateRoute roles={["guard"]}>
                        <Guardlayout><GuardNotification /></Guardlayout>
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/guardIncident"
                    element={
                      <PrivateRoute roles={["guard"]}>
                        <Guardlayout><GuardIncident /></Guardlayout>
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/guardIncidentHistory"
                    element={
                      <PrivateRoute roles={["guard"]}>
                        <Guardlayout><GuardIncidentHistory /></Guardlayout>
                      </PrivateRoute>
                    }
                  />

                </Routes>

              </GuardProvider>
            </VipProvider>
          </UserProvider>
        </AdminProvider>
      
    </Router>
  );
}

export default App;
