"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Icon } from "@iconify/react";
import { getTeachers, TeacherRecord, assignSubjectsToTeacher } from "@/lib/api/teachers";
import { getSubjects, Subject } from "@/lib/api/subjects";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { ApiClientError } from "@/lib/api/client";

interface AssignSubjectToTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AssignSubjectToTeacherModal({
  isOpen,
  onClose,
  onSuccess,
}: AssignSubjectToTeacherModalProps) {
  const [teachers, setTeachers] = useState<TeacherRecord[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoadingTeachers, setIsLoadingTeachers] = useState(false);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [teacherSearch, setTeacherSearch] = useState("");
  const [subjectSearch, setSubjectSearch] = useState("");
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | null>(null);
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<Set<number>>(new Set());
  const [showTeacherDropdown, setShowTeacherDropdown] = useState(false);
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchTeachers();
      fetchSubjects();
      // Reset form
      setSelectedTeacherId(null);
      setSelectedSubjectIds(new Set());
      setTeacherSearch("");
      setSubjectSearch("");
      setShowTeacherDropdown(false);
      setShowSubjectDropdown(false);
    }
  }, [isOpen]);

  const fetchTeachers = async () => {
    try {
      setIsLoadingTeachers(true);
      const data = await getTeachers();
      setTeachers(data);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      showErrorToast("Failed to load teachers. Please try again.");
    } finally {
      setIsLoadingTeachers(false);
    }
  };

  const fetchSubjects = async () => {
    try {
      setIsLoadingSubjects(true);
      const data = await getSubjects();
      // Only show APPROVED subjects
      const approvedSubjects = data.filter((s) => s.status === "APPROVED");
      setSubjects(approvedSubjects);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      showErrorToast("Failed to load subjects. Please try again.");
    } finally {
      setIsLoadingSubjects(false);
    }
  };

  const filteredTeachers = useMemo(() => {
    if (!teacherSearch.trim()) return teachers;
    const searchLower = teacherSearch.toLowerCase();
    return teachers.filter(
      (teacher) =>
        teacher.profile.name.toLowerCase().includes(searchLower) ||
        teacher.profile.email.toLowerCase().includes(searchLower) ||
        teacher.profile.phone.toLowerCase().includes(searchLower)
    );
  }, [teachers, teacherSearch]);

  const filteredSubjects = useMemo(() => {
    if (!subjectSearch.trim()) return subjects;
    const searchLower = subjectSearch.toLowerCase();
    return subjects.filter(
      (subject) =>
        subject.name.toLowerCase().includes(searchLower) ||
        subject.description.toLowerCase().includes(searchLower) ||
        subject.grade.toLowerCase().includes(searchLower)
    );
  }, [subjects, subjectSearch]);

  const selectedTeacher = useMemo(() => {
    if (!selectedTeacherId) return null;
    return teachers.find((t) => t.id === selectedTeacherId) || null;
  }, [teachers, selectedTeacherId]);

  const handleTeacherSelect = (teacher: TeacherRecord) => {
    setSelectedTeacherId(teacher.id);
    setTeacherSearch("");
    setShowTeacherDropdown(false);
  };

  const handleSubjectToggle = (subjectId: number) => {
    setSelectedSubjectIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(subjectId)) {
        newSet.delete(subjectId);
      } else {
        newSet.add(subjectId);
      }
      return newSet;
    });
  };

  const handleSubmit = async () => {
    if (!selectedTeacherId) {
      showErrorToast("Please select a teacher");
      return;
    }

    if (selectedSubjectIds.size === 0) {
      showErrorToast("Please select at least one subject");
      return;
    }

    try {
      setIsSubmitting(true);
      await assignSubjectsToTeacher({
        teacher_id: selectedTeacherId,
        subject_ids: Array.from(selectedSubjectIds),
      });
      showSuccessToast("Subjects assigned to teacher successfully!");
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error assigning subjects:", error);
      if (error instanceof ApiClientError) {
        showErrorToast(error.message || "Failed to assign subjects");
      } else {
        showErrorToast("An unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="bg-black/50 backdrop-blur-sm fixed inset-0" onClick={onClose} />
      <div
        className="relative z-50 bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Assign Subject to Teacher</h2>
              <p className="text-sm text-gray-600 mt-1">Select a teacher and assign subjects to them</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close modal"
            >
              <Icon icon="solar:close-circle-bold" className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Teacher Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Select Teacher <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              {/* Search Input */}
              <div className="relative mb-2">
                <Icon
                  icon="solar:magnifer-bold"
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10"
                />
                <input
                  type="text"
                  placeholder="Search teachers by name, email, or phone..."
                  value={teacherSearch}
                  onChange={(e) => {
                    setTeacherSearch(e.target.value);
                    setShowTeacherDropdown(true);
                  }}
                  onFocus={() => setShowTeacherDropdown(true)}
                  className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 bg-white placeholder:text-gray-400 text-sm"
                />
              </div>

              {/* Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowTeacherDropdown(!showTeacherDropdown)}
                  className="w-full px-4 py-3 text-left border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white text-gray-900 flex items-center justify-between"
                >
                  <span className={selectedTeacherId ? "text-gray-900" : "text-gray-400"}>
                    {selectedTeacher
                      ? `${selectedTeacher.profile.name} (${selectedTeacher.profile.email})`
                      : "Select a teacher..."}
                  </span>
                  <Icon
                    icon="solar:alt-arrow-down-bold"
                    className={`w-5 h-5 text-gray-400 transition-transform ${showTeacherDropdown ? "rotate-180" : ""}`}
                  />
                </button>

                {showTeacherDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowTeacherDropdown(false)}
                    />
                    <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                      {isLoadingTeachers ? (
                        <div className="p-4 text-center text-gray-500">
                          <Icon icon="solar:loading-bold" className="w-5 h-5 animate-spin mx-auto mb-2" />
                          Loading teachers...
                        </div>
                      ) : filteredTeachers.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">No teachers found</div>
                      ) : (
                        filteredTeachers.map((teacher) => (
                          <button
                            key={teacher.id}
                            type="button"
                            onClick={() => handleTeacherSelect(teacher)}
                            className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                              selectedTeacherId === teacher.id ? "bg-emerald-50" : ""
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">
                                  {teacher.profile.name}
                                </p>
                                <p className="text-xs text-gray-500 truncate">{teacher.profile.email}</p>
                                {teacher.profile.phone && (
                                  <p className="text-xs text-gray-400 mt-0.5">Phone: {teacher.profile.phone}</p>
                                )}
                              </div>
                              {selectedTeacherId === teacher.id && (
                                <Icon icon="solar:check-circle-bold" className="w-5 h-5 text-emerald-600 flex-shrink-0 ml-2" />
                              )}
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Subject Selection */}
          {selectedTeacherId && (
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Select Subjects <span className="text-red-500">*</span> (Multiple selection)
              </label>
              
              {/* Search Input */}
              <div className="relative mb-2">
                <Icon
                  icon="solar:magnifer-bold"
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10"
                />
                <input
                  type="text"
                  placeholder="Search subjects by name, description, or grade..."
                  value={subjectSearch}
                  onChange={(e) => {
                    setSubjectSearch(e.target.value);
                    setShowSubjectDropdown(true);
                  }}
                  onFocus={() => setShowSubjectDropdown(true)}
                  className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 bg-white placeholder:text-gray-400 text-sm"
                />
              </div>

              {/* Multi-Select Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowSubjectDropdown(!showSubjectDropdown)}
                  className="w-full px-4 py-3 text-left border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white text-gray-900 flex items-center justify-between min-h-[48px]"
                >
                  <span className={selectedSubjectIds.size > 0 ? "text-gray-900" : "text-gray-400"}>
                    {selectedSubjectIds.size > 0
                      ? `${selectedSubjectIds.size} subject${selectedSubjectIds.size !== 1 ? "s" : ""} selected`
                      : "Select subjects..."}
                  </span>
                  <Icon
                    icon="solar:alt-arrow-down-bold"
                    className={`w-5 h-5 text-gray-400 transition-transform ${showSubjectDropdown ? "rotate-180" : ""}`}
                  />
                </button>

                {showSubjectDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowSubjectDropdown(false)}
                    />
                    <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-xl max-h-64 overflow-y-auto">
                      {isLoadingSubjects ? (
                        <div className="p-4 text-center text-gray-500">
                          <Icon icon="solar:loading-bold" className="w-5 h-5 animate-spin mx-auto mb-2" />
                          Loading subjects...
                        </div>
                      ) : filteredSubjects.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">No subjects found</div>
                      ) : (
                        <div className="divide-y divide-gray-200">
                          {filteredSubjects.map((subject) => {
                            const isSelected = selectedSubjectIds.has(subject.id);
                            return (
                              <button
                                key={subject.id}
                                type="button"
                                onClick={() => handleSubjectToggle(subject.id)}
                                className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                                  isSelected ? "bg-emerald-50" : ""
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <p className="text-sm font-semibold text-gray-900">{subject.name}</p>
                                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                        {subject.grade}
                                      </span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">{subject.description}</p>
                                  </div>
                                  <div className="flex-shrink-0 ml-3">
                                    {isSelected ? (
                                      <Icon icon="solar:check-circle-bold" className="w-5 h-5 text-emerald-600" />
                                    ) : (
                                      <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                                    )}
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Selected Subjects Display */}
              {selectedSubjectIds.size > 0 && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-medium text-blue-900 mb-2">
                    {selectedSubjectIds.size} subject{selectedSubjectIds.size !== 1 ? "s" : ""} selected:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(selectedSubjectIds).map((subjectId) => {
                      const subject = subjects.find((s) => s.id === subjectId);
                      if (!subject) return null;
                      return (
                        <span
                          key={subjectId}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-blue-300 rounded text-xs text-blue-900"
                        >
                          {subject.name}
                          <button
                            type="button"
                            onClick={() => handleSubjectToggle(subjectId)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Icon icon="solar:close-circle-bold" className="w-4 h-4" />
                          </button>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !selectedTeacherId || selectedSubjectIds.size === 0}
            className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Icon icon="solar:loading-bold" className="w-4 h-4 animate-spin" />
                Assigning...
              </>
            ) : (
              <>
                <Icon icon="solar:check-circle-bold" className="w-4 h-4" />
                Assign Subjects
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
