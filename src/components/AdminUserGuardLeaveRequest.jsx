import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function AdminUserLeaveRequest() {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  //  FETCH ALL USER LEAVE REQUESTS
  const fetchLeaveRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");

      const res = await axios.get(`${BASE_URL}/api/leave/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setLeaveRequests(res.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch leave requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  //  ACCEPT / REJECT HANDLER
  const updateLeaveStatus = async (leaveId, status) => {
    try {
      const token = localStorage.getItem("adminToken");

      await axios.put(
        `${BASE_URL}/api/leave/status/${leaveId}`,
        { status }, // payload
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(`Leave ${status} successfully`);
      fetchLeaveRequests(); // refresh table
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4 fw-bold text-primary">User Leave Requests</h3>

      <div className="card shadow">
        <div className="card-body">
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary"></div>
            </div>
          ) : leaveRequests.length === 0 ? (
            <p className="text-center text-muted">No leave requests found</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover table-bordered text-center align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>User Name</th>
                    <th>Email</th>
                    <th>Leave Type</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {leaveRequests.map((leave, index) => (
                    <tr key={leave._id}>
                      <td>{index + 1}</td>
                      <td>{leave.user?.name}</td>
                      <td>{leave.user?.email}</td>
                      <td>{leave.leaveType}</td>
                      <td>{leave.fromDate}</td>
                      <td>{leave.toDate}</td>
                      <td>{leave.reason}</td>

                      <td>
                        <span
                          className={`badge ${
                            leave.status === "Approved"
                              ? "bg-success"
                              : leave.status === "Rejected"
                              ? "bg-danger"
                              : "bg-warning"
                          }`}
                        >
                          {leave.status}
                        </span>
                      </td>

                      <td>
                        {leave.status === "Pending" ? (
                          <div className="d-flex justify-content-center gap-2">
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() =>
                                updateLeaveStatus(leave._id, "Approved")
                              }
                            >
                              Accept
                            </button>

                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() =>
                                updateLeaveStatus(leave._id, "Rejected")
                              }
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-muted">No Action</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
