import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useGuardStore } from "../context/GuardContext";
import { useVipStore } from "../context/VipContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const BASE_URL = process.env.REACT_APP_BASE_URL;
const PER_PAGE = 10;

export default function AdminUserHistory() {
  const { setSelectedGuard } = useGuardStore();
  const { setSelectedVip } = useVipStore();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRow, setSelectedRow] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });

  // New state variables for enhanced dashboard
  const [currentView, setCurrentView] = useState("vip-view"); // 'vip-view' or 'guard-view'
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filter states
  const [filters, setFilters] = useState({
    status: "all",
    rank: "all",
    vipStatus: "all",
    guardStatus: "all",
    experience: "all",
    timesAssigned: "all",
    dateFrom: "",
    dateTo: "",
    search: ""
  });

  // Sorting states
  const [sortConfig, setSortConfig] = useState({
    vip: { field: "name", direction: "asc" },
    guard: { field: "name", direction: "asc" }
  });

  // Calculate statistics
  const stats = useMemo(() => {
    const totalAssignments = data.length;

    const activeVips = new Set();
    const activeGuards = new Set();

    data.forEach(item => {
      if (item.category?.status === "Active") {
        activeVips.add(item.category.id);
      }
      if (item.officer?.status === "Active") {
        activeGuards.add(item.officer.id);
      }
    });

    return {
      totalAssignments,
      activeVips: activeVips.size,
      activeGuards: activeGuards.size
    };
  }, [data]);

  useEffect(() => {
    fetchAllData();
    // Set default date range
    const today = new Date().toISOString().split('T')[0];
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    setFilters(prev => ({
      ...prev,
      dateFrom: thirtyDaysAgo.toISOString().split('T')[0],
      dateTo: today
    }));
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const role = localStorage.getItem("role");
      const token = localStorage.getItem(`${role}Token`);

      const res = await axios.get(`${BASE_URL}/api/assignments/getall`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setData(res.data || []);
    } catch (err) {
      console.log("Admin User History Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDateOnly = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  // Helper: Apply UI filters to raw data and return filtered items (ignores pagination)
  const getFilteredItems = () => {
    if (!data || !Array.isArray(data)) return [];
    return data.filter(item => {
      // Status filter
      if (filters.status !== "all" && item.status !== filters.status) {
        return false;
      }

      // Rank filter
      if (filters.rank !== "all" && item.officer?.rank !== filters.rank) {
        return false;
      }

      // VIP status filter
      if (filters.vipStatus !== "all" && item.category?.status !== filters.vipStatus) {
        return false;
      }

      // Guard status filter
      if (filters.guardStatus !== "all" && item.officer?.status !== filters.guardStatus) {
        return false;
      }

      // Experience filter
      if (filters.experience !== "all" && item.officer?.experience !== undefined) {
        const exp = item.officer.experience;
        switch (filters.experience) {
          case '0-5':
            if (exp < 0 || exp > 5) return false;
            break;
          case '6-10':
            if (exp < 6 || exp > 10) return false;
            break;
          case '11-15':
            if (exp < 11 || exp > 15) return false;
            break;
          case '16-20':
            if (exp < 16 || exp > 20) return false;
            break;
          case '20+':
            if (exp < 20) return false;
            break;
        }
      }

      // Times assigned filter
      if (filters.timesAssigned !== "all" && item.timesAssigned !== undefined) {
        const times = item.timesAssigned;
        switch (filters.timesAssigned) {
          case '0':
            if (times !== 0) return false;
            break;
          case '1':
            if (times !== 1) return false;
            break;
          case '2+':
            if (times < 2) return false;
            break;
          case '5+':
            if (times < 5) return false;
            break;
        }
      }

      // Date range filter
      const assignedDate = new Date(item.assignedAt).toISOString().split('T')[0];
      if (filters.dateFrom && assignedDate < filters.dateFrom) {
        return false;
      }
      if (filters.dateTo && assignedDate > filters.dateTo) {
        return false;
      }

      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const vipName = item.category?.name?.toLowerCase() || '';
        const vipEmail = item.category?.email?.toLowerCase() || '';
        const vipDesignation = item.category?.designation?.toLowerCase() || '';
        const guardName = item.officer?.name?.toLowerCase() || '';
        const guardEmail = item.officer?.email?.toLowerCase() || '';

        if (!vipName.includes(searchTerm) &&
          !vipEmail.includes(searchTerm) &&
          !vipDesignation.includes(searchTerm) &&
          !guardName.includes(searchTerm) &&
          !guardEmail.includes(searchTerm)) {
          return false;
        }
      }

      return true;
    });
  };

  // Filter and process data for UI (with grouping + pagination)
  const processedData = useMemo(() => {
    let filtered = getFilteredItems();

    // Process based on view
    if (currentView === "vip-view") {
      // Group by VIP
      const vipMap = new Map();
      filtered.forEach(item => {
        const vipId = item.category?.id;
        if (!vipId) return;

        if (!vipMap.has(vipId)) {
          vipMap.set(vipId, {
            id: vipId,
            name: item.category.name,
            designation: item.category.designation || "Not Specified",
            status: item.category.status,
            email: item.category.email,
            assignments: []
          });
        }

        vipMap.get(vipId).assignments.push({
          officerId: item.officer?.id,
          officerName: item.officer?.name,
          officerRank: item.officer?.rank,
          officerStatus: item.officer?.status,
          assignmentStatus: item.status,
          assignedAt: new Date(item.assignedAt),
          timesAssigned: item.timesAssigned || 0
        });
      });

      let vipArray = Array.from(vipMap.values());

      // Apply sorting
      vipArray.sort((a, b) => {
        let aValue, bValue;
        const sortField = sortConfig.vip.field;
        const sortDirection = sortConfig.vip.direction;

        switch (sortField) {
          case 'name':
            aValue = a.name;
            bValue = b.name;
            break;
          case 'designation':
            aValue = a.designation;
            bValue = b.designation;
            break;
          case 'status':
            aValue = a.status;
            bValue = b.status;
            break;
          case 'guard-rank':
            aValue = a.assignments.length > 0 ? a.assignments.map(x => x.officerRank).sort()[0] : '';
            bValue = b.assignments.length > 0 ? b.assignments.map(x => x.officerRank).sort()[0] : '';
            break;
          case 'assignment-status':
            aValue = a.assignments.length > 0 ? a.assignments[0].assignmentStatus : '';
            bValue = b.assignments.length > 0 ? b.assignments[0].assignmentStatus : '';
            break;
          case 'date':
            aValue = a.assignments.length > 0 ? Math.max(...a.assignments.map(x => x.assignedAt.getTime())) : 0;
            bValue = b.assignments.length > 0 ? Math.max(...b.assignments.map(x => x.assignedAt.getTime())) : 0;
            break;
          case 'times-assigned':
            aValue = a.assignments.reduce((sum, x) => sum + (x.timesAssigned || 0), 0);
            bValue = b.assignments.reduce((sum, x) => sum + (x.timesAssigned || 0), 0);
            break;
          default:
            aValue = a.name;
            bValue = b.name;
        }

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        } else {
          return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
        }
      });

      // Pagination
      const total = vipArray.length;
      const pages = Math.ceil(total / PER_PAGE);
      setTotalPages(pages);

      const startIndex = (currentPage - 1) * PER_PAGE;
      const endIndex = Math.min(startIndex + PER_PAGE, total);

      return {
        type: 'vip',
        data: vipArray.slice(startIndex, endIndex),
        total
      };

    } else {
      // Group by Guard
      const guardMap = new Map();
      filtered.forEach(item => {
        const guardId = item.officer?.id;
        if (!guardId) return;

        if (!guardMap.has(guardId)) {
          guardMap.set(guardId, {
            id: guardId,
            name: item.officer.name,
            rank: item.officer.rank,
            status: item.officer.status,
            experience: item.officer.experience || 0,
            email: item.officer.email,
            assignments: []
          });
        }

        guardMap.get(guardId).assignments.push({
          vipId: item.category?.id,
          vipName: item.category?.name,
          vipDesignation: item.category?.designation || "Not Specified",
          vipStatus: item.category?.status,
          assignmentStatus: item.status,
          assignedAt: new Date(item.assignedAt),
          timesAssigned: item.timesAssigned || 0
        });
      });

      let guardArray = Array.from(guardMap.values());

      // Apply sorting
      guardArray.sort((a, b) => {
        let aValue, bValue;
        const sortField = sortConfig.guard.field;
        const sortDirection = sortConfig.guard.direction;

        switch (sortField) {
          case 'name':
            aValue = a.name;
            bValue = b.name;
            break;
          case 'rank':
            aValue = a.rank;
            bValue = b.rank;
            break;
          case 'status':
            aValue = a.status;
            bValue = b.status;
            break;
          case 'experience':
            aValue = a.experience;
            bValue = b.experience;
            break;
          case 'vip-designation':
            aValue = a.assignments.length > 0 ? a.assignments.map(x => x.vipDesignation).sort()[0] : '';
            bValue = b.assignments.length > 0 ? b.assignments.map(x => x.vipDesignation).sort()[0] : '';
            break;
          case 'assignment-status':
            aValue = a.assignments.length > 0 ? a.assignments[0].assignmentStatus : '';
            bValue = b.assignments.length > 0 ? b.assignments[0].assignmentStatus : '';
            break;
          case 'date':
            aValue = a.assignments.length > 0 ? Math.max(...a.assignments.map(x => x.assignedAt.getTime())) : 0;
            bValue = b.assignments.length > 0 ? Math.max(...b.assignments.map(x => x.assignedAt.getTime())) : 0;
            break;
          case 'times-assigned':
            aValue = a.assignments.reduce((sum, x) => sum + (x.timesAssigned || 0), 0);
            bValue = b.assignments.reduce((sum, x) => sum + (x.timesAssigned || 0), 0);
            break;
          default:
            aValue = a.name;
            bValue = b.name;
        }

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        } else {
          return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
        }
      });

      // Pagination
      const total = guardArray.length;
      const pages = Math.ceil(total / PER_PAGE);
      setTotalPages(pages);

      const startIndex = (currentPage - 1) * PER_PAGE;
      const endIndex = Math.min(startIndex + PER_PAGE, total);

      return {
        type: 'guard',
        data: guardArray.slice(startIndex, endIndex),
        total
      };
    }
  }, [data, currentView, filters, sortConfig, currentPage]);

  // Get status badge class
  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'complete':
        return 'status-completed';
      case 'active duty':
      case 'active':
        return 'status-active';
      case 'pending':
        return 'status-pending';
      case 'canceled':
      case 'cancelled':
        return 'status-canceled';
      case 'incident occur':
      case 'incident':
        return 'status-incident';
      default:
        return 'status-pending';
    }
  };

  const getRankClass = (rank) => {
    if (!rank) return 'rank-a';
    const grade = rank.charAt(0).toLowerCase();
    return `rank-${grade}`;
  };

  const handleRowClick = (item, e) => {
    if (currentView === "vip-view") {
      setSelectedVip(item.category || null);
      if (item.assignments && item.assignments.length > 0) {
        setSelectedGuard({
          id: item.assignments[0].officerId,
          name: item.assignments[0].officerName,
          rank: item.assignments[0].officerRank,
          status: item.assignments[0].officerStatus
        });
      }
    } else {
      setSelectedGuard(item.officer || null);
      if (item.assignments && item.assignments.length > 0) {
        setSelectedVip({
          id: item.assignments[0].vipId,
          name: item.assignments[0].vipName,
          designation: item.assignments[0].vipDesignation,
          status: item.assignments[0].vipStatus
        });
      }
    }

    const rect = e.currentTarget.getBoundingClientRect();
    setPopupPosition({
      x: rect.left + rect.width / 2,
      y: rect.top + window.scrollY,
    });

    setSelectedRow(item);
  };

  const handleSort = (field) => {
    setSortConfig(prev => {
      const currentConfig = prev[currentView === 'vip-view' ? 'vip' : 'guard'];
      const newDirection = currentConfig.field === field
        ? (currentConfig.direction === 'asc' ? 'desc' : 'asc')
        : 'asc';

      return {
        ...prev,
        [currentView === 'vip-view' ? 'vip' : 'guard']: {
          field,
          direction: newDirection
        }
      };
    });
  };

  const getSortIcon = (field) => {
    const config = currentView === 'vip-view' ? sortConfig.vip : sortConfig.guard;
    if (config.field !== field) return "fas fa-sort";
    return config.direction === 'asc' ? "fas fa-sort-up" : "fas fa-sort-down";
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const applyFilters = () => {
    setCurrentPage(1);
  };

  const resetFilters = () => {
    const today = new Date().toISOString().split('T')[0];
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    setFilters({
      status: "all",
      rank: "all",
      vipStatus: "all",
      guardStatus: "all",
      experience: "all",
      timesAssigned: "all",
      dateFrom: thirtyDaysAgo.toISOString().split('T')[0],
      dateTo: today,
      search: ""
    });
    setCurrentPage(1);
  };

  // ===== UPDATED exportToPDF: uses filtered items (ignores pagination) and autoTable(doc, {...}) =====
  const exportToPDF = () => {
    const filteredItems = getFilteredItems(); // all filtered raw assignment records
    const doc = new jsPDF();
    const today = new Date().toISOString().split('T')[0];

    // Header
    doc.setFontSize(18);
    doc.text(`VIP Security Assignment Report - ${currentView === 'vip-view' ? 'VIP View' : 'Guard View'}`, 14, 22);
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    // Stats
    doc.setFontSize(12);
    doc.text(`Total Assignments (raw): ${stats.totalAssignments}`, 14, 40);
    doc.text(`Active VIPs: ${stats.activeVips}`, 14, 46);
    doc.text(`Active Guards: ${stats.activeGuards}`, 14, 52);

    // Build table rows depending on view
    const tableData = [];
    if (currentView === 'vip-view') {
      const vipMap = new Map();
      filteredItems.forEach(item => {
        const vipId = item.category?.id;
        if (!vipId) return;
        if (!vipMap.has(vipId)) {
          vipMap.set(vipId, {
            name: item.category.name || 'N/A',
            designation: item.category.designation || "Not Specified",
            status: item.category.status || 'N/A',
            guards: [],
            guardRanks: [],
            assignmentStatuses: [],
            assignmentDates: [],
            timesAssigned: 0
          });
        }
        const vip = vipMap.get(vipId);
        vip.guards.push(item.officer?.name || 'N/A');
        vip.guardRanks.push(item.officer?.rank || 'N/A');
        vip.assignmentStatuses.push(item.status || 'N/A');
        if (item.assignedAt) vip.assignmentDates.push(new Date(item.assignedAt));
        vip.timesAssigned += item.timesAssigned || 0;
      });

      // headers
      const headers = [['VIP Name', 'Designation', 'VIP Status', 'Assigned Guards', 'Guard Ranks', 'Assignment Status', 'Latest Date', 'Total Times']];

      vipMap.forEach(vip => {
        const latestDate = vip.assignmentDates.length > 0
          ? new Date(Math.max(...vip.assignmentDates.map(d => d.getTime()))).toLocaleDateString()
          : 'N/A';

        tableData.push([
          vip.name,
          vip.designation,
          vip.status,
          vip.guards.join(', '),
          [...new Set(vip.guardRanks)].join(', '),
          [...new Set(vip.assignmentStatuses)].join(', '),
          latestDate,
          vip.timesAssigned.toString()
        ]);
      });

      // Use autoTable (function form)
      autoTable(doc, {
        head: headers,
        body: tableData,
        startY: 60,
        theme: 'grid',
        styles: { fontSize: 9, cellPadding: 3 },
        headStyles: { fillColor: [25, 118, 210] },
        // allow page break and long text wrap
        // didDrawCell: (data) => { },
      });

    } else {
      const guardMap = new Map();
      filteredItems.forEach(item => {
        const guardId = item.officer?.id;
        if (!guardId) return;
        if (!guardMap.has(guardId)) {
          guardMap.set(guardId, {
            name: item.officer.name || 'N/A',
            rank: item.officer.rank || 'N/A',
            status: item.officer.status || 'N/A',
            experience: item.officer.experience || 0,
            vips: [],
            vipDesignations: [],
            assignmentStatuses: [],
            assignmentDates: [],
            timesAssigned: 0
          });
        }
        const guard = guardMap.get(guardId);
        guard.vips.push(item.category?.name || 'N/A');
        guard.vipDesignations.push(item.category?.designation || 'Not Specified');
        guard.assignmentStatuses.push(item.status || 'N/A');
        if (item.assignedAt) guard.assignmentDates.push(new Date(item.assignedAt));
        guard.timesAssigned += item.timesAssigned || 0;
      });

      const headers = [['Guard Name', 'Rank', 'Status', 'Experience', 'Assigned VIPs', 'VIP Designations', 'Assignment Status', 'Latest Date']];

      guardMap.forEach(guard => {
        const latestDate = guard.assignmentDates.length > 0
          ? new Date(Math.max(...guard.assignmentDates.map(d => d.getTime()))).toLocaleDateString()
          : 'N/A';

        tableData.push([
          guard.name,
          guard.rank,
          guard.status,
          `${guard.experience} years`,
          guard.vips.join(', '),
          [...new Set(guard.vipDesignations)].join(', '),
          [...new Set(guard.assignmentStatuses)].join(', '),
          latestDate,
          guard.timesAssigned.toString()
        ]);
      });

      autoTable(doc, {
        head: headers,
        body: tableData,
        startY: 60,
        theme: 'grid',
        styles: { fontSize: 9, cellPadding: 3 },
        headStyles: { fillColor: [25, 118, 210] },
      });
    }

    doc.save(`vip_security_${currentView}_${today}.pdf`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Generate pagination buttons
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const buttons = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    buttons.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={styles.pageBtn}
      >
        <i className="fas fa-chevron-left"></i> Previous
      </button>
    );

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          style={{
            ...styles.pageBtn,
            ...(currentPage === i ? styles.activePage : {})
          }}
        >
          {i}
        </button>
      );
    }

    // Next button
    buttons.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={styles.pageBtn}
      >
        Next <i className="fas fa-chevron-right"></i>
      </button>
    );

    return buttons;
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.headerTitle}>
            <i className="fas fa-shield-alt" style={{ marginRight: '10px', color: "white" }}></i>
            VIP Security Assignment Dashboard
          </h1>
          <div style={styles.stats}>
            <div style={styles.statBox}>
              <div style={styles.statValue}>{stats.totalAssignments}</div>
              <div style={styles.statLabel}>Total Assignments</div>
            </div>
            <div style={styles.statBox}>
              <div style={styles.statValue}>{stats.activeVips}</div>
              <div style={styles.statLabel}>Active VIPs</div>
            </div>
            <div style={styles.statBox}>
              <div style={styles.statValue}>{stats.activeGuards}</div>
              <div style={styles.statLabel}>Active Guards</div>
            </div>
          </div>
        </div>
      </header>

      {/* View Toggle and Export */}
      <div style={styles.viewToggle}>
        <div style={styles.viewButtons}>
          <button
            style={{
              ...styles.viewBtn,
              ...(currentView === "vip-view" ? styles.activeViewBtn : {})
            }}
            onClick={() => {
              setCurrentView("vip-view");
              setCurrentPage(1);
            }}
          >
            <i className="fas fa-user-tie"></i> VIP View (VIP → Guards)
          </button>
          <button
            style={{
              ...styles.viewBtn,
              ...(currentView === "guard-view" ? styles.activeViewBtn : {})
            }}
            onClick={() => {
              setCurrentView("guard-view");
              setCurrentPage(1);
            }}
          >
            <i className="fas fa-user-shield"></i> Guard View (Guard → VIPs)
          </button>
        </div>
        <button style={styles.exportBtn} onClick={exportToPDF}>
          <i className="fas fa-download"></i> Export PDF
        </button>
      </div>

      {/* Advanced Filters */}
      <div style={styles.filtersContainer}>
        <div style={styles.filtersTitle}>
          <i className="fas fa-filter" style={{ marginRight: '10px' }}></i>
          Advanced Filters
        </div>

        {/* Active filters info */}
        {Object.values(filters).some(val => val !== "all" && val !== "") && (
          <div style={styles.filterInfo}>
            <strong>Active Filters:</strong>{" "}
            {[
              filters.status !== "all" && `Status: ${filters.status}`,
              filters.rank !== "all" && `Rank: ${filters.rank}`,
              filters.vipStatus !== "all" && `VIP Status: ${filters.vipStatus}`,
              filters.guardStatus !== "all" && `Guard Status: ${filters.guardStatus}`,
              filters.experience !== "all" && `Experience: ${filters.experience}`,
              filters.timesAssigned !== "all" && `Times Assigned: ${filters.timesAssigned}`,
              filters.dateFrom && `From: ${formatDateOnly(filters.dateFrom)}`,
              filters.dateTo && `To: ${formatDateOnly(filters.dateTo)}`,
              filters.search && `Search: "${filters.search}"`
            ].filter(Boolean).join(' • ')}
          </div>
        )}

        <div style={styles.filtersGrid}>
          {/* Status Filter */}
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>
              <i className="fas fa-clipboard-check"></i> Assignment Status
            </label>
            <select
              style={styles.select}
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Active Duty">Active Duty</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="canceled">Canceled</option>
              <option value="Incident Occur">Incident Occur</option>
            </select>
          </div>

          {/* Guard Rank Filter */}
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>
              <i className="fas fa-star"></i> Guard Rank
            </label>
            <select
              style={styles.select}
              value={filters.rank}
              onChange={(e) => handleFilterChange('rank', e.target.value)}
            >
              <option value="all">All Ranks</option>
              <option value="A Grade">A Grade</option>
              <option value="B Grade">B Grade</option>
              <option value="C Grade">C Grade</option>
              <option value="D Grade">D Grade</option>
              <option value="E Grade">E Grade</option>
            </select>
          </div>

          {/* VIP Status Filter */}
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>
              <i className="fas fa-user"></i> VIP Status
            </label>
            <select
              style={styles.select}
              value={filters.vipStatus}
              onChange={(e) => handleFilterChange('vipStatus', e.target.value)}
            >
              <option value="all">All VIP Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Guard Status Filter */}
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>
              <i className="fas fa-shield-alt"></i> Guard Status
            </label>
            <select
              style={styles.select}
              value={filters.guardStatus}
              onChange={(e) => handleFilterChange('guardStatus', e.target.value)}
            >
              <option value="all">All Guard Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Experience Filter */}
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>
              <i className="fas fa-briefcase"></i> Guard Experience (Years)
            </label>
            <select
              style={styles.select}
              value={filters.experience}
              onChange={(e) => handleFilterChange('experience', e.target.value)}
            >
              <option value="all">All Experience Levels</option>
              <option value="0-5">0-5 Years</option>
              <option value="6-10">6-10 Years</option>
              <option value="11-15">11-15 Years</option>
              <option value="16-20">16-20 Years</option>
              <option value="20+">20+ Years</option>
            </select>
          </div>

          {/* Times Assigned Filter */}
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>
              <i className="fas fa-redo"></i> Times Assigned
            </label>
            <select
              style={styles.select}
              value={filters.timesAssigned}
              onChange={(e) => handleFilterChange('timesAssigned', e.target.value)}
            >
              <option value="all">Any</option>
              <option value="0">0 Times</option>
              <option value="1">1 Time</option>
              <option value="2+">2+ Times</option>
              <option value="5+">5+ Times</option>
            </select>
          </div>

          {/* Date Range Filter */}
          <div style={{ ...styles.filterGroup, gridColumn: 'span 2', display: 'flex', gap: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={styles.filterLabel}>
                <i className="fas fa-calendar-alt"></i> Assignment Date From
              </label>
              <input
                type="date"
                style={styles.input}
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={styles.filterLabel}>
                <i className="fas fa-calendar-alt"></i> To
              </label>
              <input
                type="date"
                style={styles.input}
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              />
            </div>
          </div>

          {/* Search Filter */}
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>
              <i className="fas fa-search"></i> Search (Name/Email/Designation)
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                style={{ ...styles.input, paddingRight: '35px' }}
                placeholder="Search by name, email, or designation..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
              />
              <i className="fas fa-search" style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#777'
              }}></i>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ ...styles.filterGroup, gridColumn: '1 / -1', display: 'flex', gap: '10px', marginTop: '15px' }}>
            <button style={styles.applyBtn} onClick={applyFilters}>
              <i className="fas fa-check"></i> Apply Filters
            </button>
            <button style={styles.resetBtn} onClick={resetFilters}>
              <i className="fas fa-redo"></i> Reset All Filters
            </button>
          </div>
        </div>
      </div>

      {/* VIP View */}
      {currentView === "vip-view" && (
        <div style={styles.contentArea}>
          {loading ? (
            <div style={styles.noData}>Loading VIP data...</div>
          ) : processedData.data.length === 0 ? (
            <div style={styles.emptyState}>
              <i className="fas fa-user-slash" style={{ fontSize: '3rem', marginBottom: '15px', color: '#ccc' }}></i>
              <h3>No VIPs Found</h3>
              <p>Try adjusting your filters to see results</p>
            </div>
          ) : (
            <>
              <div style={styles.tableContainer}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th
                        style={styles.th}
                        onClick={() => handleSort('name')}
                      >
                        VIP Name <i className={getSortIcon('name')}></i>
                      </th>
                      <th
                        style={styles.th}
                        onClick={() => handleSort('designation')}
                      >
                        Designation <i className={getSortIcon('designation')}></i>
                      </th>
                      <th
                        style={styles.th}
                        onClick={() => handleSort('status')}
                      >
                        Status <i className={getSortIcon('status')}></i>
                      </th>
                      <th style={styles.th}>Assigned Guards</th>
                      <th
                        style={styles.th}
                        onClick={() => handleSort('guard-rank')}
                      >
                        Guard Rank <i className={getSortIcon('guard-rank')}></i>
                      </th>
                      <th
                        style={styles.th}
                        onClick={() => handleSort('assignment-status')}
                      >
                        Assignment Status <i className={getSortIcon('assignment-status')}></i>
                      </th>
                      <th
                        style={styles.th}
                        onClick={() => handleSort('date')}
                      >
                        Assignment Date <i className={getSortIcon('date')}></i>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {processedData.data.map((vip) => {
                      const statusCounts = {
                        completed: vip.assignments.filter(a =>
                          a.assignmentStatus === 'Completed' || a.assignmentStatus === 'completed'
                        ).length,
                        active: vip.assignments.filter(a =>
                          a.assignmentStatus === 'Active Duty' || a.assignmentStatus === 'Active'
                        ).length,
                        pending: vip.assignments.filter(a => a.assignmentStatus === 'Pending').length,
                        canceled: vip.assignments.filter(a => a.assignmentStatus === 'canceled').length,
                        incident: vip.assignments.filter(a => a.assignmentStatus === 'Incident Occur').length
                      };

                      const guardInfo = vip.assignments.map(a =>
                        `${a.officerName} <span class="${getRankClass(a.officerRank)}" style="${styles.rankBadge}">${a.officerRank}</span>`
                      ).join(', ');

                      const guardRanks = [...new Set(vip.assignments.map(a => a.officerRank))].join(', ');

                      const latestAssignment = vip.assignments.length > 0
                        ? new Date(Math.max(...vip.assignments.map(a => a.assignedAt.getTime())))
                        : null;

                      return (
                        <tr
                          key={vip.id}
                          style={styles.tableRow}
                          onClick={(e) => handleRowClick(vip, e)}
                        >
                          <td style={styles.td}>
                            <div style={styles.vipName}>{vip.name}</div>
                            <div style={styles.emailText}>{vip.email}</div>
                          </td>
                          <td style={styles.td}>{vip.designation}</td>
                          <td style={styles.td}>
                            <span className={getStatusClass(vip.status)} style={styles.statusBadge}>
                              {vip.status}
                            </span>
                          </td>
                          <td style={styles.td}>
                            <div dangerouslySetInnerHTML={{ __html: guardInfo }} />
                            <div style={styles.smallText}>
                              Total: {vip.assignments.length} guards
                            </div>
                          </td>
                          <td style={styles.td}>{guardRanks}</td>
                          <td style={styles.td}>
                            {statusCounts.completed > 0 && (
                              <span className="status-completed" style={styles.statusBadge}>
                                {statusCounts.completed} Completed
                              </span>
                            )} {statusCounts.active > 0 && (
                              <span className="status-active" style={styles.statusBadge}>
                                {statusCounts.active} Active
                              </span>
                            )} {statusCounts.pending > 0 && (
                              <span className="status-pending" style={styles.statusBadge}>
                                {statusCounts.pending} Pending
                              </span>
                            )} {statusCounts.canceled > 0 && (
                              <span className="status-canceled" style={styles.statusBadge}>
                                {statusCounts.canceled} Canceled
                              </span>
                            )} {statusCounts.incident > 0 && (
                              <span className="status-incident" style={styles.statusBadge}>
                                {statusCounts.incident} Incident
                              </span>
                            )}
                          </td>
                          <td style={styles.td}>
                            {latestAssignment ? latestAssignment.toLocaleDateString() : 'N/A'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div style={styles.paginationContainer}>
                {renderPagination()}
              </div>
            </>
          )}
        </div>
      )}

      {/* Guard View */}
      {currentView === "guard-view" && (
        <div style={styles.contentArea}>
          {loading ? (
            <div style={styles.noData}>Loading guard data...</div>
          ) : processedData.data.length === 0 ? (
            <div style={styles.emptyState}>
              <i className="fas fa-user-shield" style={{ fontSize: '3rem', marginBottom: '15px', color: '#ccc' }}></i>
              <h3>No Guards Found</h3>
              <p>Try adjusting your filters to see results</p>
            </div>
          ) : (
            <>
              <div style={styles.tableContainer}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th
                        style={styles.th}
                        onClick={() => handleSort('name')}
                      >
                        Guard Name <i className={getSortIcon('name')}></i>
                      </th>
                      <th
                        style={styles.th}
                        onClick={() => handleSort('rank')}
                      >
                        Rank <i className={getSortIcon('rank')}></i>
                      </th>
                      <th
                        style={styles.th}
                        onClick={() => handleSort('status')}
                      >
                        Status <i className={getSortIcon('status')}></i>
                      </th>
                      <th
                        style={styles.th}
                        onClick={() => handleSort('experience')}
                      >
                        Experience <i className={getSortIcon('experience')}></i>
                      </th>
                      <th style={styles.th}>Assigned VIPs</th>
                      <th
                        style={styles.th}
                        onClick={() => handleSort('vip-designation')}
                      >
                        VIP Designation <i className={getSortIcon('vip-designation')}></i>
                      </th>
                      <th
                        style={styles.th}
                        onClick={() => handleSort('assignment-status')}
                      >
                        Assignment Status <i className={getSortIcon('assignment-status')}></i>
                      </th>
                      <th
                        style={styles.th}
                        onClick={() => handleSort('date')}
                      >
                        Assignment Date <i className={getSortIcon('date')}></i>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {processedData.data.map((guard) => {
                      const statusCounts = {
                        completed: guard.assignments.filter(a =>
                          a.assignmentStatus === 'Completed' || a.assignmentStatus === 'completed'
                        ).length,
                        active: guard.assignments.filter(a =>
                          a.assignmentStatus === 'Active Duty' || a.assignmentStatus === 'Active'
                        ).length,
                        pending: guard.assignments.filter(a => a.assignmentStatus === 'Pending').length,
                        canceled: guard.assignments.filter(a => a.assignmentStatus === 'canceled').length,
                        incident: guard.assignments.filter(a => a.assignmentStatus === 'Incident Occur').length
                      };

                      const vipInfo = guard.assignments.map(a =>
                        `${a.vipName} <span class="${getStatusClass(a.vipStatus)}" style="${styles.statusBadge}">${a.vipStatus}</span>`
                      ).join(', ');

                      const vipDesignations = [...new Set(guard.assignments.map(a => a.vipDesignation))].join(', ');

                      const latestAssignment = guard.assignments.length > 0
                        ? new Date(Math.max(...guard.assignments.map(a => a.assignedAt.getTime())))
                        : null;

                      return (
                        <tr
                          key={guard.id}
                          style={styles.tableRow}
                          onClick={(e) => handleRowClick(guard, e)}
                        >
                          <td style={styles.td}>
                            <div style={styles.guardName}>{guard.name}</div>
                            <div style={styles.emailText}>{guard.email}</div>
                          </td>
                          <td style={styles.td}>
                            <span className={getRankClass(guard.rank)} style={styles.rankBadge}>
                              {guard.rank}
                            </span>
                          </td>
                          <td style={styles.td}>
                            <span className={getStatusClass(guard.status)} style={styles.statusBadge}>
                              {guard.status}
                            </span>
                          </td>
                          <td style={styles.td}>{guard.experience} years</td>
                          <td style={styles.td}>
                            <div dangerouslySetInnerHTML={{ __html: vipInfo }} />
                            <div style={styles.smallText}>
                              Total: {guard.assignments.length} VIPs
                            </div>
                          </td>
                          <td style={styles.td}>{vipDesignations}</td>
                          <td style={styles.td}>
                            {statusCounts.completed > 0 && (
                              <span className="status-completed" style={styles.statusBadge}>
                                {statusCounts.completed} Completed
                              </span>
                            )} {statusCounts.active > 0 && (
                              <span className="status-active" style={styles.statusBadge}>
                                {statusCounts.active} Active
                              </span>
                            )} {statusCounts.pending > 0 && (
                              <span className="status-pending" style={styles.statusBadge}>
                                {statusCounts.pending} Pending
                              </span>
                            )} {statusCounts.canceled > 0 && (
                              <span className="status-canceled" style={styles.statusBadge}>
                                {statusCounts.canceled} Canceled
                              </span>
                            )} {statusCounts.incident > 0 && (
                              <span className="status-incident" style={styles.statusBadge}>
                                {statusCounts.incident} Incident
                              </span>
                            )}
                          </td>
                          <td style={styles.td}>
                            {latestAssignment ? latestAssignment.toLocaleDateString() : 'N/A'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div style={styles.paginationContainer}>
                {renderPagination()}
              </div>
            </>
          )}
        </div>
      )}

      {/* POPUP */}
      {selectedRow && (
        <div
          style={{
            ...styles.popup,
            top: popupPosition.y - 20,
            left: popupPosition.x - 180,
          }}
        >
          <div style={styles.popupTitle}>
            {currentView === "vip-view" ? "VIP Details" : "Guard Details"}
          </div>

          {currentView === "vip-view" ? (
            <>
              <div><b>Name:</b> {selectedRow.name}</div>
              <div><b>Email:</b> {selectedRow.email}</div>
              <div><b>Designation:</b> {selectedRow.designation}</div>
              <div><b>Status:</b> {selectedRow.status}</div>
              <div><b>Total Guards Assigned:</b> {selectedRow.assignments?.length || 0}</div>
            </>
          ) : (
            <>
              <div><b>Name:</b> {selectedRow.name}</div>
              <div><b>Email:</b> {selectedRow.email}</div>
              <div><b>Rank:</b> {selectedRow.rank}</div>
              <div><b>Status:</b> {selectedRow.status}</div>
              <div><b>Experience:</b> {selectedRow.experience} Years</div>
              <div><b>Total VIPs Assigned:</b> {selectedRow.assignments?.length || 0}</div>
            </>
          )}

          <button
            onClick={() => setSelectedRow(null)}
            style={styles.infoBtn}
          >
            Close
          </button>
        </div>
      )}

      {/* Styles for badges */}
      <style>{`
        .status-completed { background-color: #e8f5e9; color: #2e7d32; padding: 4px 10px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; display: inline-block; margin: 2px; }
        .status-active { background-color: #e3f2fd; color: #1565c0; padding: 4px 10px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; display: inline-block; margin: 2px; }
        .status-pending { background-color: #fff3e0; color: #ef6c00; padding: 4px 10px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; display: inline-block; margin: 2px; }
        .status-canceled { background-color: #ffebee; color: #c62828; padding: 4px 10px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; display: inline-block; margin: 2px; }
        .status-incident { background-color: #fce4ec; color: #ad1457; padding: 4px 10px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; display: inline-block; margin: 2px; }
        .rank-a { background-color: #ffebee; color: #c62828; padding: 4px 10px; border-radius: 4px; font-size: 0.85rem; font-weight: 600; display: inline-block; margin: 2px; }
        .rank-b { background-color: #f3e5f5; color: #7b1fa2; padding: 4px 10px; border-radius: 4px; font-size: 0.85rem; font-weight: 600; display: inline-block; margin: 2px; }
        .rank-c { background-color: #e8eaf6; color: #3949ab; padding: 4px 10px; border-radius: 4px; font-size: 0.85rem; font-weight: 600; display: inline-block; margin: 2px; }
        .rank-d { background-color: #e0f2f1; color: #00695c; padding: 4px 10px; border-radius: 4px; font-size: 0.85rem; font-weight: 600; display: inline-block; margin: 2px; }
        .rank-e { background-color: #fff3e0; color: #ef6c00; padding: 4px 10px; border-radius: 4px; font-size: 0.85rem; font-weight: 600; display: inline-block; margin: 2px; }
        .fas { margin-left: 5px; }
      `}</style>
    </div>
  );
}

/* ---------------- VIP DASHBOARD STYLES ---------------- */
const styles = {
  container: {
    padding: '20px',
    background: "#f5f7fa",
    color: "#333",
    maxWidth: '1600px',
    margin: '0 auto',
    minHeight: '100vh'
  },
  header: {     
    background: "linear-gradient(135deg, #4e54c8, #8f94fb)",
    color: 'white',
    padding: '25px 0',
    borderRadius: '10px',
    marginBottom: '30px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 30px',
    flexWrap: 'wrap'
  },
  headerTitle: {
    fontSize: '2.2rem',
    fontWeight: 600,
    margin: 0,
    color: "#fff",
  },
  stats: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap'
  },
  statBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: '12px 20px',
    borderRadius: '8px',
    textAlign: 'center',
    minWidth: '150px'
  },
  statValue: {
    fontSize: '1.8rem',
    fontWeight: 700
  },
  statLabel: {
    fontSize: '0.9rem',
    opacity: 0.9,
    marginTop: '5px'
  },
  viewToggle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '25px',
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '10px 20px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    flexWrap: 'wrap'
  },
  viewButtons: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap'
  },
  viewBtn: {
    padding: '12px 30px',
    border: 'none',
    backgroundColor: 'transparent',
    fontSize: '1rem',
    fontWeight: 600,
    color: '#666',
    cursor: 'pointer',
    borderRadius: '6px',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  activeViewBtn: {
    backgroundColor: '#4e54c8',
    color: 'white'
  },
  exportBtn: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'background-color 0.3s ease'
  },
  filtersContainer: {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '25px',
    marginBottom: '25px',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)'
  },
  filtersTitle: {
    fontSize: '1.2rem',
    marginBottom: '20px',
    color: '#1a237e',
    display: 'flex',
    alignItems: 'center',
    fontWeight: 600
  },
  filtersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '20px'
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column'
  },
  filterLabel: {
    fontSize: '0.9rem',
    fontWeight: 600,
    marginBottom: '5px',
    color: '#555',
    display: 'flex',
    alignItems: 'center',
    gap: '5px'
  },
  select: {
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '0.95rem',
    width: '100%',
    backgroundColor: 'white'
  },
  input: {
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '0.95rem',
    width: '100%'
  },
  applyBtn: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 600,
    transition: 'all 0.3s ease',
    backgroundColor: '#1a237e',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  resetBtn: {
    padding: '10px 20px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 600,
    transition: 'all 0.3s ease',
    backgroundColor: '#f5f5f5',
    color: '#666',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  filterInfo: {
    backgroundColor: '#e8f5e9',
    borderLeft: '4px solid #4CAF50',
    padding: '10px 15px',
    marginBottom: '15px',
    borderRadius: '4px',
    fontSize: '0.9rem'
  },
  contentArea: {
    animation: 'fadeIn 0.5s ease'
  },
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    marginBottom: '30px',
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '1200px'
  },
  th: {
    padding: '16px 12px',
    textAlign: 'left',
    fontWeight: 600,
    fontSize: '0.95rem',
    cursor: 'pointer',
    userSelect: 'none',
    position: 'relative',
    backgroundColor: '#1a237e',
    color: 'white',
    borderBottom: '2px solid #ddd'
  },
  tableRow: {
    borderBottom: '1px solid #f0f0f0',
    transition: 'background-color 0.2s ease',
    cursor: 'pointer'
  },
  td: {
    padding: '14px 12px',
    fontSize: '0.95rem'
  },
  vipName: {
    fontWeight: 600,
    color: '#1a237e'
  },
  guardName: {
    fontWeight: 600,
    color: '#333'
  },
  emailText: {
    fontSize: '0.85rem',
    color: '#666',
    marginTop: '2px'
  },
  smallText: {
    fontSize: '0.85rem',
    marginTop: '5px',
    color: '#666'
  },

  statusBadge: {
    padding: '5px 12px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: 600,
    display: 'inline-block'
  },

  rankBadge: {
    padding: '4px 10px',
    borderRadius: '4px',
    fontSize: '0.85rem',
    fontWeight: 600,
    display: 'inline-block'
  },

  /* Empty State */
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#777',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
  },

  noData: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '18px',
    color: '#777',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
  },

  /* Pagination */
  paginationContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
    marginTop: '20px',
    flexWrap: 'wrap'
  },

  pageBtn: {
    padding: '8px 15px',
    border: '1px solid #ddd',
    backgroundColor: 'white',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '5px'
  },

  activePage: {
    backgroundColor: '#1a237e',
    color: 'white',
    borderColor: '#1a237e'
  },

  /* Footer */
  footer: {
    textAlign: 'center',
    padding: '20px',
    color: '#777',
    fontSize: '0.9rem',
    marginTop: '40px',
    borderTop: '1px solid #eee'
  },

  /* Popup Styles (from original) */
  popup: {
    position: 'absolute',
    background: "#ffffff",
    padding: '18px',
    width: '340px',
    borderRadius: '12px',
    boxShadow: "0 8px 25px rgba(0,0,0,0.25)",
    zIndex: 5000,
  },

  popupTitle: {
    fontSize: '18px',
    fontWeight: 700,
    marginBottom: '10px',
  },

  infoBtn: {
    background: "#1976d2",
    padding: "7px 14px",
    border: 0,
    color: "#fff",
    borderRadius: 8,
    cursor: "pointer",
    marginTop: '10px'
  },
};