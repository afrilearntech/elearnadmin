"use client";

import React, { useState, useMemo, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Icon } from "@iconify/react";
import Image from "next/image";

type ParentStatus = "ACTIVE" | "INACTIVE" | "PENDING";

type Parent = {
  id: string;
  name: string;
  email: string;
  linkedStudents: number;
  dateJoined: string;
  status: ParentStatus;
  district?: string;
  avatar?: string;
};

const mockParents: Parent[] = [
  { id: "1", name: "Kristin Akua Watson", email: "bjones566@gmail.com", linkedStudents: 2, dateJoined: "January 12, 2021", status: "ACTIVE", district: "District 1" },
  { id: "2", name: "Kristin Akua Watson", email: "bjones566@gmail.com", linkedStudents: 2, dateJoined: "January 12, 2021", status: "ACTIVE", district: "District 2" },
  { id: "3", name: "Kristin Akua Watson", email: "bjones566@gmail.com", linkedStudents: 2, dateJoined: "January 12, 2021", status: "ACTIVE", district: "District 1" },
  { id: "4", name: "Kristin Akua Watson", email: "bjones566@gmail.com", linkedStudents: 2, dateJoined: "January 12, 2021", status: "ACTIVE", district: "District 3" },
  { id: "5", name: "Kristin Akua Watson", email: "bjones566@gmail.com", linkedStudents: 2, dateJoined: "January 12, 2021", status: "ACTIVE", district: "District 2" },
  { id: "6", name: "Kristin Akua Watson", email: "bjones566@gmail.com", linkedStudents: 2, dateJoined: "January 12, 2021", status: "ACTIVE", district: "District 4" },
  { id: "7", name: "Kristin Akua Watson", email: "bjones566@gmail.com", linkedStudents: 2, dateJoined: "January 12, 2021", status: "ACTIVE", district: "District 1" },
  { id: "8", name: "Kristin Akua Watson", email: "bjones566@gmail.com", linkedStudents: 2, dateJoined: "January 12, 2021", status: "ACTIVE", district: "District 2" },
  { id: "9", name: "Kristin Akua Watson", email: "bjones566@gmail.com", linkedStudents: 2, dateJoined: "January 12, 2021", status: "ACTIVE", district: "District 3" },
  { id: "10", name: "Kristin Akua Watson", email: "bjones566@gmail.com", linkedStudents: 2, dateJoined: "January 12, 2021", status: "ACTIVE", district: "District 1" },
  { id: "11", name: "Kristin Akua Watson", email: "bjones566@gmail.com", linkedStudents: 2, dateJoined: "January 12, 2021", status: "ACTIVE", district: "District 4" },
  { id: "12", name: "Kristin Akua Watson", email: "bjones566@gmail.com", linkedStudents: 2, dateJoined: "January 12, 2021", status: "ACTIVE", district: "District 2" },
  { id: "13", name: "Kristin Akua Watson", email: "bjones566@gmail.com", linkedStudents: 2, dateJoined: "January 12, 2021", status: "ACTIVE", district: "District 3" },
  { id: "14", name: "Kristin Akua Watson", email: "bjones566@gmail.com", linkedStudents: 2, dateJoined: "January 12, 2021", status: "ACTIVE", district: "District 1" },
  { id: "15", name: "Kristin Akua Watson", email: "bjones566@gmail.com", linkedStudents: 2, dateJoined: "January 12, 2021", status: "ACTIVE", district: "District 4" },
];

const statusOptions = ["All", "ACTIVE", "INACTIVE", "PENDING"];
const districts = ["All", "District 1", "District 2", "District 3", "District 4"];

export default function ParentsPage() {
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedDistrict, setSelectedDistrict] = useState("All");
  const [page, setPage] = useState(1);
  const [selectedParent, setSelectedParent] = useState<Parent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionButtonRef, setActionButtonRef] = useState<HTMLButtonElement | null>(null);
  const pageSize = 10;

  const filteredParents = useMemo(() => {
    return mockParents.filter((parent) => {
      const matchesSearch =
        search.trim().length === 0 ||
        parent.name.toLowerCase().includes(search.toLowerCase()) ||
        parent.email.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = selectedStatus === "All" || parent.status === selectedStatus;
      const matchesDistrict = selectedDistrict === "All" || (parent.district && parent.district === selectedDistrict);
      return matchesSearch && matchesStatus && matchesDistrict;
    });
  }, [search, selectedStatus, selectedDistrict]);

  const totalPages = Math.max(1, Math.ceil(filteredParents.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pagedParents = filteredParents.slice(start, start + pageSize);

  useEffect(() => {
    setPage(1);
  }, [search, selectedStatus, selectedDistrict]);

  const handleActionClick = (parent: Parent, event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setSelectedParent(parent);
    setIsModalOpen(true);
    setActionButtonRef(event.currentTarget);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedParent(null);
    setActionButtonRef(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isModalOpen && actionButtonRef && !actionButtonRef.contains(event.target as Node)) {
        const modal = document.getElementById("parent-action-dropdown");
        if (modal && !modal.contains(event.target as Node)) {
          closeModal();
        }
      }
    };

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isModalOpen, actionButtonRef]);

  const getStatusBadge = (status: ParentStatus) => {
    if (status === "ACTIVE") {
      return "bg-emerald-100 text-emerald-700";
    }
    if (status === "PENDING") {
      return "bg-yellow-100 text-yellow-700";
    }
    return "bg-gray-100 text-gray-600";
  };

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <DashboardLayout onAddParent={() => console.log("Add Parent")} onLinkStudent={() => console.log("Link Student")}>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Parents Management</h1>
            <p className="text-gray-600 mt-1">Manage all parents</p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={() => console.log("Link Student")}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-5 py-2.5 text-white shadow hover:bg-emerald-600 transition-colors sm:hidden"
            >
              <Icon icon="solar:link-bold" className="w-5 h-5" />
              Link Student
            </button>
            <button
              onClick={() => console.log("Add Parent")}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-white shadow hover:bg-emerald-700 transition-colors sm:hidden"
            >
              <Icon icon="solar:add-circle-bold" className="w-5 h-5" />
              Add Parent
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 min-w-0">
              <div className="relative">
                <Icon
                  icon="solar:magnifer-bold"
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10"
                />
                <input
                  type="text"
                  placeholder="search Name, email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 bg-white placeholder:text-gray-400"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:w-auto">
              <div className="relative sm:w-48">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 bg-white appearance-none cursor-pointer"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status === "All" ? "All Status" : status}
                    </option>
                  ))}
                </select>
                <Icon
                  icon="solar:alt-arrow-down-bold"
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                />
              </div>
              <div className="relative sm:w-48">
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 bg-white appearance-none cursor-pointer"
                >
                  {districts.map((district) => (
                    <option key={district} value={district}>
                      {district === "All" ? "All Districts" : district}
                    </option>
                  ))}
                </select>
                <Icon
                  icon="solar:alt-arrow-down-bold"
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                />
              </div>
            </div>
          </div>

          {filteredParents.length === 0 ? (
            <div className="text-center py-12">
              <Icon icon="solar:users-group-two-rounded-bold-duotone" className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No parents found</p>
              <p className="text-gray-400 text-xs mt-1">Try adjusting your search or filters</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr className="bg-emerald-50">
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Name</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Email</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider hidden md:table-cell">Linked Student(s)</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider hidden lg:table-cell">Date Joined</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Status</th>
                        <th className="px-4 sm:px-6 py-3 text-right text-xs font-semibold text-gray-900 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {pagedParents.map((parent) => (
                        <tr key={parent.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              {parent.avatar ? (
                                <Image
                                  src={parent.avatar}
                                  alt={parent.name}
                                  width={40}
                                  height={40}
                                  className="rounded-full flex-shrink-0"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                  <span className="text-sm font-semibold text-emerald-700">{getInitials(parent.name)}</span>
                                </div>
                              )}
                              <div className="min-w-0">
                                <div className="text-sm font-medium text-gray-900 truncate">{parent.name}</div>
                                <div className="text-xs text-gray-500 md:hidden">{parent.linkedStudents} Student(s)</div>
                                <div className="text-xs text-gray-500 lg:hidden">{parent.dateJoined}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-600 truncate max-w-[200px]">{parent.email}</div>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600 hidden md:table-cell">
                            {parent.linkedStudents} Student{parent.linkedStudents !== 1 ? "s" : ""}
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600 hidden lg:table-cell">
                            {parent.dateJoined}
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(parent.status)}`}>
                              {parent.status}
                            </span>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={(e) => handleActionClick(parent, e)}
                              className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors ml-auto"
                              aria-label="More options"
                            >
                              <Icon icon="solar:menu-dots-bold" className="w-5 h-5 text-gray-600" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-gray-200">
                  <div className="text-sm text-gray-600 order-2 sm:order-1">
                    Showing <span className="font-medium">{start + 1}</span> to <span className="font-medium">{Math.min(start + pageSize, filteredParents.length)}</span> of <span className="font-medium">{filteredParents.length}</span> parents
                  </div>
                  <div className="flex items-center gap-2 order-1 sm:order-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      aria-label="Previous page"
                    >
                      <Icon icon="solar:alt-arrow-left-bold" className="w-4 h-4" />
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`px-3 py-2 border rounded-lg text-sm font-medium transition-colors min-w-[40px] ${
                            currentPage === pageNum
                              ? "bg-emerald-600 text-white border-emerald-600"
                              : "border-gray-300 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <>
                        <span className="px-2 text-gray-500">...</span>
                        <button
                          onClick={() => setPage(totalPages - 1)}
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          {totalPages - 1}
                        </button>
                        <button
                          onClick={() => setPage(totalPages)}
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          {totalPages}
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      aria-label="Next page"
                    >
                      <Icon icon="solar:alt-arrow-right-bold" className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {isModalOpen && selectedParent && actionButtonRef && (
        <ParentActionDropdown
          parent={selectedParent}
          onClose={closeModal}
          buttonRef={actionButtonRef}
        />
      )}
    </DashboardLayout>
  );
}

function ParentActionDropdown({
  parent,
  onClose,
  buttonRef,
}: {
  parent: Parent;
  onClose: () => void;
  buttonRef: HTMLButtonElement;
}) {
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const updatePosition = () => {
      if (buttonRef) {
        const rect = buttonRef.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const dropdownWidth = 200;
        let left = rect.right - dropdownWidth;
        
        if (left < 8) {
          left = 8;
        } else if (left + dropdownWidth > viewportWidth - 8) {
          left = viewportWidth - dropdownWidth - 8;
        }
        
        setPosition({
          top: rect.bottom + 4,
          left: left,
        });
      }
    };

    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [buttonRef]);

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      <div
        id="parent-action-dropdown"
        className="fixed z-50 bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[200px] max-w-[250px]"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-4 py-2 border-b border-gray-200">
          <p className="text-sm font-semibold text-gray-900 truncate">{parent.name}</p>
          <p className="text-xs text-gray-500 truncate">{parent.email}</p>
        </div>
        <div className="py-1">
          <button
            onClick={onClose}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
          >
            <Icon icon="solar:eye-bold" className="w-4 h-4 text-gray-600" />
            <span>View Details</span>
          </button>
          <button
            onClick={onClose}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
          >
            <Icon icon="solar:pen-bold" className="w-4 h-4 text-gray-600" />
            <span>Edit Parent</span>
          </button>
          <button
            onClick={onClose}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
          >
            <Icon icon="solar:link-bold" className="w-4 h-4 text-gray-600" />
            <span>Link Student</span>
          </button>
          <button
            onClick={onClose}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
          >
            <Icon icon="solar:lock-password-bold" className="w-4 h-4 text-gray-600" />
            <span>Reset Password</span>
          </button>
          <button
            onClick={onClose}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
          >
            <Icon icon="solar:trash-bin-trash-bold" className="w-4 h-4" />
            <span>Delete Parent</span>
          </button>
        </div>
      </div>
    </>
  );
}

