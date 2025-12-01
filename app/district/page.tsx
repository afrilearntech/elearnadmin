"use client";

import React, { useState, useMemo, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Icon } from "@iconify/react";
import { getDistricts, District, updateDistrict, createDistrict } from "@/lib/api/districts";
import { getCounties, County } from "@/lib/api/counties";
import { showErrorToast, showSuccessToast } from "@/lib/toast";

type DistrictStatus = "APPROVED" | "PENDING" | "REJECTED" | "REVIEW_REQUESTED" | "DRAFT";

const statusOptions = ["All", "APPROVED", "PENDING", "REJECTED", "REVIEW_REQUESTED"];

export default function DistrictPage() {
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [page, setPage] = useState(1);
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [districts, setDistricts] = useState<District[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    county: "",
    name: "",
  });
  const [createFormErrors, setCreateFormErrors] = useState<{
    county?: string;
    name?: string;
  }>({});
  const [counties, setCounties] = useState<County[]>([]);
  const pageSize = 10;

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        setIsLoading(true);
        const data = await getDistricts();
        setDistricts(data);
      } catch (error) {
        showErrorToast("Failed to load districts. Please try again.");
        console.error("Error fetching districts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchCounties = async () => {
      try {
        const data = await getCounties();
        setCounties(data);
      } catch (error) {
        console.error("Error fetching counties:", error);
      }
    };

    fetchDistricts();
    fetchCounties();
  }, []);

  const filteredDistricts = useMemo(() => {
    return districts.filter((district) => {
      const matchesSearch =
        search.trim().length === 0 ||
        district.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = selectedStatus === "All" || district.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [search, selectedStatus, districts]);

  const totalPages = Math.max(1, Math.ceil(filteredDistricts.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pagedDistricts = filteredDistricts.slice(start, start + pageSize);

  useEffect(() => {
    setPage(1);
  }, [search, selectedStatus]);

  const handleViewClick = (district: District) => {
    setSelectedDistrict(district);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedDistrict(null);
  };

  const getStatusBadge = (status: DistrictStatus) => {
    if (status === "APPROVED") {
      return "bg-emerald-100 text-emerald-700";
    }
    if (status === "PENDING") {
      return "bg-yellow-100 text-yellow-700";
    }
    if (status === "REJECTED") {
      return "bg-red-100 text-red-700";
    }
    if (status === "REVIEW_REQUESTED") {
      return "bg-blue-100 text-blue-700";
    }
    return "bg-gray-100 text-gray-600";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleCreateDistrict = async () => {
    const errors: typeof createFormErrors = {};
    if (!createFormData.county) {
      errors.county = "County is required";
    }
    if (!createFormData.name.trim()) {
      errors.name = "District name is required";
    }
    if (Object.keys(errors).length > 0) {
      setCreateFormErrors(errors);
      return;
    }

    try {
      setIsCreating(true);
      setCreateFormErrors({});
      const newDistrict = await createDistrict({
        county: parseInt(createFormData.county, 10),
        name: createFormData.name.trim(),
        status: "APPROVED",
      });
      setDistricts((prev) => [newDistrict, ...prev]);
      showSuccessToast("District created successfully!");
      setIsCreateModalOpen(false);
      setCreateFormData({ county: "", name: "" });
    } catch (error: any) {
      showErrorToast(error.message || "Failed to create district. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <DashboardLayout onAddDistrict={() => setIsCreateModalOpen(true)}>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">District Management</h1>
            <p className="text-gray-600 mt-1">Manage all districts</p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-white shadow hover:bg-emerald-700 transition-colors sm:hidden"
          >
            <Icon icon="solar:add-circle-bold" className="w-5 h-5" />
            Add District
          </button>
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
                  placeholder="search Name..."
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
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
              <p className="text-gray-500 text-sm mt-3">Loading districts...</p>
            </div>
          ) : filteredDistricts.length === 0 ? (
            <div className="text-center py-12">
              <Icon icon="solar:buildings-bold" className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No districts found</p>
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
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider hidden md:table-cell">County ID</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Status</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider hidden lg:table-cell">Created At</th>
                        <th className="px-4 sm:px-6 py-3 text-right text-xs font-semibold text-gray-900 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {pagedDistricts.map((district) => (
                        <tr key={district.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{district.name}</div>
                            <div className="text-xs text-gray-500 md:hidden">County {district.county}</div>
                            <div className="text-xs text-gray-500 lg:hidden">{formatDate(district.created_at)}</div>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600 hidden md:table-cell">
                            County {district.county}
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(district.status)}`}>
                              {district.status}
                            </span>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600 hidden lg:table-cell">
                            {formatDate(district.created_at)}
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleViewClick(district)}
                              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                            >
                              <Icon icon="solar:eye-bold" className="w-4 h-4" />
                              <span className="hidden sm:inline">View</span>
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
                    Showing <span className="font-medium">{start + 1}</span> to <span className="font-medium">{Math.min(start + pageSize, filteredDistricts.length)}</span> of <span className="font-medium">{filteredDistricts.length}</span> districts
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

      {isViewModalOpen && selectedDistrict && (
        <DistrictViewModal
          district={selectedDistrict}
          onClose={closeViewModal}
          onUpdate={(updatedDistrict) => {
            setDistricts((prev) =>
              prev.map((d) => (d.id === updatedDistrict.id ? updatedDistrict : d))
            );
            setSelectedDistrict(updatedDistrict);
          }}
        />
      )}
      {isCreateModalOpen && (
        <CreateDistrictModal
          onClose={() => {
            setIsCreateModalOpen(false);
            setCreateFormData({ county: "", name: "" });
            setCreateFormErrors({});
          }}
          onSubmit={handleCreateDistrict}
          formData={createFormData}
          setFormData={setCreateFormData}
          errors={createFormErrors}
          isSubmitting={isCreating}
          counties={counties}
        />
      )}
    </DashboardLayout>
  );
}

function DistrictViewModal({
  district,
  onClose,
  onUpdate,
}: {
  district: District;
  onClose: () => void;
  onUpdate: (district: District) => void;
}) {
  const [showRequestChangesModal, setShowRequestChangesModal] = useState(false);
  const [moderationComment, setModerationComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionType, setActionType] = useState<"APPROVE" | "REJECT" | "REVIEW_REQUESTED" | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: DistrictStatus) => {
    if (status === "APPROVED") {
      return "bg-emerald-100 text-emerald-700";
    }
    if (status === "PENDING") {
      return "bg-yellow-100 text-yellow-700";
    }
    if (status === "REJECTED") {
      return "bg-red-100 text-red-700";
    }
    if (status === "REVIEW_REQUESTED") {
      return "bg-blue-100 text-blue-700";
    }
    return "bg-gray-100 text-gray-600";
  };

  const handleApprove = async () => {
    try {
      setIsSubmitting(true);
      setActionType("APPROVE");
      const updatedDistrict = await updateDistrict(district.id, {
        status: "APPROVED",
        county: district.county,
        name: district.name,
      });
      onUpdate(updatedDistrict);
      showSuccessToast("District approved successfully!");
      onClose();
    } catch (error: any) {
      showErrorToast(error.message || "Failed to approve district. Please try again.");
    } finally {
      setIsSubmitting(false);
      setActionType(null);
    }
  };

  const handleReject = async () => {
    try {
      setIsSubmitting(true);
      setActionType("REJECT");
      const updatedDistrict = await updateDistrict(district.id, {
        status: "REJECTED",
        county: district.county,
        name: district.name,
      });
      onUpdate(updatedDistrict);
      showSuccessToast("District rejected successfully!");
      onClose();
    } catch (error: any) {
      showErrorToast(error.message || "Failed to reject district. Please try again.");
    } finally {
      setIsSubmitting(false);
      setActionType(null);
    }
  };

  const handleRequestReview = () => {
    setShowRequestChangesModal(true);
  };

  const handleSubmitRequestReview = async () => {
    if (!moderationComment.trim()) {
      showErrorToast("Please provide a moderation comment.");
      return;
    }

    try {
      setIsSubmitting(true);
      setActionType("REVIEW_REQUESTED");
      const updatedDistrict = await updateDistrict(district.id, {
        status: "REVIEW_REQUESTED",
        county: district.county,
        name: district.name,
        moderation_comment: moderationComment.trim(),
      });
      onUpdate(updatedDistrict);
      showSuccessToast("Request for changes submitted successfully!");
      setShowRequestChangesModal(false);
      setModerationComment("");
      onClose();
    } catch (error: any) {
      showErrorToast(error.message || "Failed to request changes. Please try again.");
    } finally {
      setIsSubmitting(false);
      setActionType(null);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-[55]"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 pointer-events-none">
        <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto border border-gray-200" onClick={(e) => e.stopPropagation()}>
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <h2 className="text-xl font-bold text-gray-900">District Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close modal"
            >
              <Icon icon="solar:close-circle-bold" className="w-6 h-6" />
            </button>
          </div>

          <div className="px-6 py-6 space-y-6">
            <div>
              <label className="text-sm font-medium text-gray-500">District Name</label>
              <p className="mt-1 text-base text-gray-900 font-semibold">{district.name}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-500">County ID</label>
                <p className="mt-1 text-base text-gray-900">County {district.county}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <div className="mt-1">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(district.status)}`}>
                    {district.status}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Created At</label>
                <p className="mt-1 text-base text-gray-900">{formatDate(district.created_at)}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Last Updated</label>
                <p className="mt-1 text-base text-gray-900">{formatDate(district.updated_at)}</p>
              </div>
            </div>

            {district.moderation_comment && (
              <div>
                <label className="text-sm font-medium text-gray-500">Moderation Comment</label>
                <div className="mt-1 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-700">{district.moderation_comment}</p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Close
              </button>
              {district.status === "PENDING" && (
                <>
                  <button
                    onClick={handleApprove}
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSubmitting && actionType === "APPROVE" ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Approving...
                      </>
                    ) : (
                      "Approve"
                    )}
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSubmitting && actionType === "REJECT" ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Rejecting...
                      </>
                    ) : (
                      "Reject"
                    )}
                  </button>
                  <button
                    onClick={handleRequestReview}
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Request Review
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {showRequestChangesModal && (
        <RequestChangesModal
          districtName={district.name}
          moderationComment={moderationComment}
          setModerationComment={setModerationComment}
          onSubmit={handleSubmitRequestReview}
          onClose={() => {
            setShowRequestChangesModal(false);
            setModerationComment("");
          }}
          isSubmitting={isSubmitting && actionType === "REVIEW_REQUESTED"}
        />
      )}
    </>
  );
}

function CreateDistrictModal({
  onClose,
  onSubmit,
  formData,
  setFormData,
  errors,
  isSubmitting,
  counties,
}: {
  onClose: () => void;
  onSubmit: () => void;
  formData: { county: string; name: string };
  setFormData: (data: { county: string; name: string }) => void;
  errors: { county?: string; name?: string };
  isSubmitting: boolean;
  counties: County[];
}) {
  const disabled =
    isSubmitting || !formData.name.trim() || !formData.county;

  return (
    <>
      <div
        className="fixed inset-0 z-[55]"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 pointer-events-none">
        <div
          className="bg-white rounded-lg shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto pointer-events-auto border border-gray-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Create New District</h3>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
              aria-label="Close modal"
            >
              <Icon icon="solar:close-circle-bold" className="w-6 h-6" />
            </button>
          </div>

          <div className="px-6 py-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                County <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={formData.county}
                  onChange={(e) =>
                    setFormData({ ...formData, county: e.target.value })
                  }
                  className={`w-full px-4 py-3 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 bg-white appearance-none cursor-pointer ${
                    errors.county ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select County</option>
                  {counties.map((county) => (
                    <option key={county.id} value={county.id}>
                      {county.name}
                    </option>
                  ))}
                </select>
                <Icon
                  icon="solar:alt-arrow-down-bold"
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                />
              </div>
              {errors.county && (
                <p className="mt-1 text-sm text-red-600">{errors.county}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                District Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter district name"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 bg-white placeholder:text-gray-400 ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={onSubmit}
                disabled={disabled}
                className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create District"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


function RequestChangesModal({
  districtName,
  moderationComment,
  setModerationComment,
  onSubmit,
  onClose,
  isSubmitting,
}: {
  districtName: string;
  moderationComment: string;
  setModerationComment: (comment: string) => void;
  onSubmit: () => void;
  onClose: () => void;
  isSubmitting: boolean;
}) {
  return (
    <>
      <div
        className="fixed inset-0 z-[65]"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6 pointer-events-none">
        <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full pointer-events-auto border border-gray-200" onClick={(e) => e.stopPropagation()}>
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Request Review</h3>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
              aria-label="Close modal"
            >
              <Icon icon="solar:close-circle-bold" className="w-6 h-6" />
            </button>
          </div>

          <div className="px-6 py-6 space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">
                Please provide a comment explaining what changes are needed for <span className="font-semibold text-gray-900">{districtName}</span>:
              </p>
              <textarea
                value={moderationComment}
                onChange={(e) => setModerationComment(e.target.value)}
                placeholder="Enter moderation comment..."
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white placeholder:text-gray-400 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={onSubmit}
                disabled={isSubmitting || !moderationComment.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

