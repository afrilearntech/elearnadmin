"use client";

import React, { useState, useMemo, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";

type StudentStatus = "Active" | "Inactive" | "Creator";

type Student = {
  id: string;
  name: string;
  school: string;
  email: string;
  linkedParent: string;
  gradeLevel: string;
  status: StudentStatus;
  avatar?: string;
};

const mockStudents: Student[] = [
  { id: "1", name: "Bertha Jones", school: "Maplewood High School", email: "bjones566@gmail.com", linkedParent: "Mrs Katamanso", gradeLevel: "Grade 5", status: "Active" },
  { id: "2", name: "Bertha Jones", school: "Maplewood High School", email: "bjones566@gmail.com", linkedParent: "Mrs Katamanso", gradeLevel: "Grade 5", status: "Inactive" },
  { id: "3", name: "Bertha Jones", school: "Maplewood High School", email: "bjones566@gmail.com", linkedParent: "Mrs Katamanso", gradeLevel: "Grade 5", status: "Creator" },
  { id: "4", name: "Bertha Jones", school: "Maplewood High School", email: "bjones566@gmail.com", linkedParent: "Mrs Katamanso", gradeLevel: "Grade 5", status: "Creator" },
  { id: "5", name: "Bertha Jones", school: "Maplewood High School", email: "bjones566@gmail.com", linkedParent: "Mrs Katamanso", gradeLevel: "Grade 5", status: "Creator" },
  { id: "6", name: "Bertha Jones", school: "Maplewood High School", email: "bjones566@gmail.com", linkedParent: "Mrs Katamanso", gradeLevel: "Grade 5", status: "Creator" },
  { id: "7", name: "Bertha Jones", school: "Maplewood High School", email: "bjones566@gmail.com", linkedParent: "Mrs Katamanso", gradeLevel: "Grade 5", status: "Active" },
  { id: "8", name: "Bertha Jones", school: "Maplewood High School", email: "bjones566@gmail.com", linkedParent: "Mrs Katamanso", gradeLevel: "Grade 5", status: "Inactive" },
  { id: "9", name: "Bertha Jones", school: "Maplewood High School", email: "bjones566@gmail.com", linkedParent: "Mrs Katamanso", gradeLevel: "Grade 5", status: "Creator" },
  { id: "10", name: "Bertha Jones", school: "Maplewood High School", email: "bjones566@gmail.com", linkedParent: "Mrs Katamanso", gradeLevel: "Grade 5", status: "Active" },
  { id: "11", name: "Bertha Jones", school: "Maplewood High School", email: "bjones566@gmail.com", linkedParent: "Mrs Katamanso", gradeLevel: "Grade 5", status: "Inactive" },
  { id: "12", name: "Bertha Jones", school: "Maplewood High School", email: "bjones566@gmail.com", linkedParent: "Mrs Katamanso", gradeLevel: "Grade 5", status: "Creator" },
  { id: "13", name: "Bertha Jones", school: "Maplewood High School", email: "bjones566@gmail.com", linkedParent: "Mrs Katamanso", gradeLevel: "Grade 5", status: "Active" },
  { id: "14", name: "Bertha Jones", school: "Maplewood High School", email: "bjones566@gmail.com", linkedParent: "Mrs Katamanso", gradeLevel: "Grade 5", status: "Creator" },
  { id: "15", name: "Bertha Jones", school: "Maplewood High School", email: "bjones566@gmail.com", linkedParent: "Mrs Katamanso", gradeLevel: "Grade 5", status: "Inactive" },
];

const grades = ["All", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"];
const schools = ["All", "Maplewood", "Riverside", "Central High", "Westside", "Eastside"];

type Step = 1 | 2;

const gradesOptions = ["Select Grade level", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"];
const genders = ["Select Gender", "Male", "Female", "Other"];
const schoolDistricts = ["Select School District", "District 1", "District 2", "District 3", "District 4"];
const schoolsOptions = ["Mamas Day care", "Maplewood High School", "Riverside School", "Central High", "Westside School"];

export default function StudentsPage() {
  const [search, setSearch] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("All");
  const [selectedSchool, setSelectedSchool] = useState("All");
  const [page, setPage] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionButtonRef, setActionButtonRef] = useState<HTMLButtonElement | null>(null);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [addStudentStep, setAddStudentStep] = useState<Step>(1);
  const [addStudentFormData, setAddStudentFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    dateOfBirth: "",
    gender: "",
    gradeLevel: "",
    schoolDistrict: "",
    password: "",
    school: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showSchoolDropdown, setShowSchoolDropdown] = useState(false);
  const [schoolSearch, setSchoolSearch] = useState("");
  const pageSize = 10;

  const filteredStudents = useMemo(() => {
    return mockStudents.filter((student) => {
      const matchesSearch =
        search.trim().length === 0 ||
        student.name.toLowerCase().includes(search.toLowerCase()) ||
        student.email.toLowerCase().includes(search.toLowerCase()) ||
        student.school.toLowerCase().includes(search.toLowerCase());
      const matchesGrade = selectedGrade === "All" || student.gradeLevel === selectedGrade;
      const matchesSchool = selectedSchool === "All" || student.school.includes(selectedSchool);
      return matchesSearch && matchesGrade && matchesSchool;
    });
  }, [search, selectedGrade, selectedSchool]);

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pagedStudents = filteredStudents.slice(start, start + pageSize);

  useEffect(() => {
    setPage(1);
  }, [search, selectedGrade, selectedSchool]);

  const handleActionClick = (student: Student, event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setActionButtonRef(event.currentTarget);
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
    setActionButtonRef(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isModalOpen && actionButtonRef && !actionButtonRef.contains(event.target as Node)) {
        const modal = document.getElementById("student-action-dropdown");
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showSchoolDropdown && !target.closest(".school-dropdown-container")) {
        setShowSchoolDropdown(false);
      }
    };

    if (showSchoolDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showSchoolDropdown]);

  const handleAddStudentInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAddStudentFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddStudentNext = () => {
    if (addStudentStep === 1) {
      setAddStudentStep(2);
    }
  };

  const handleAddStudentBack = () => {
    if (addStudentStep === 2) {
      setAddStudentStep(1);
    } else {
      setShowAddStudentModal(false);
      setAddStudentStep(1);
      setAddStudentFormData({
        name: "",
        phone: "",
        email: "",
        address: "",
        dateOfBirth: "",
        gender: "",
        gradeLevel: "",
        schoolDistrict: "",
        password: "",
        school: "",
      });
    }
  };

  const handleAddStudentFinish = () => {
    setShowAddStudentModal(false);
    setAddStudentStep(1);
    setAddStudentFormData({
      name: "",
      phone: "",
      email: "",
      address: "",
      dateOfBirth: "",
      gender: "",
      gradeLevel: "",
      schoolDistrict: "",
      password: "",
      school: "",
    });
  };

  const filteredSchools = schoolsOptions.filter((school) =>
    school.toLowerCase().includes(schoolSearch.toLowerCase())
  );

  const getStatusBadge = (status: StudentStatus) => {
    if (status === "Active" || status === "Creator") {
      return "bg-emerald-100 text-emerald-700";
    }
    return "bg-gray-100 text-gray-600";
  };

  return (
    <DashboardLayout onAddStudent={() => setShowAddStudentModal(true)}>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Student Management</h1>
            <p className="text-gray-600 mt-1">Manage all students</p>
          </div>
          <button
            onClick={() => setShowAddStudentModal(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-white shadow hover:bg-emerald-700 transition-colors sm:hidden"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Student
          </button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Icon
                  icon="solar:magnifer-bold"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="search subjects, lessons..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 bg-white"
                />
              </div>
              <div className="flex gap-3">
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white text-sm min-w-[140px] text-gray-900"
                >
                  {grades.map((grade) => (
                    <option key={grade} value={grade}>
                      {grade}
                    </option>
                  ))}
                </select>
                <div className="relative">
                  <select
                    value={selectedSchool}
                    onChange={(e) => setSelectedSchool(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white text-sm min-w-[140px] text-gray-900"
                  >
                    {schools.map((school) => (
                      <option key={school} value={school}>
                        {school}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-emerald-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Student Name
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    School
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Linked Parent (s)
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Grade Level
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pagedStudents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 sm:px-6 py-8 text-center text-gray-500">
                      No students found
                    </td>
                  </tr>
                ) : (
                  pagedStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                            {student.avatar ? (
                              <Image
                                src={student.avatar}
                                alt={student.name}
                                width={40}
                                height={40}
                                className="rounded-full"
                              />
                            ) : (
                              <span className="text-gray-600 font-semibold text-sm">
                                {student.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()
                                  .slice(0, 2)}
                              </span>
                            )}
                          </div>
                          <span className="text-sm font-medium text-gray-900 truncate">{student.name}</span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-700 truncate block max-w-[200px]">{student.school}</span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-700 truncate block max-w-[200px]">{student.email}</span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-700">{student.linkedParent}</span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-700">{student.gradeLevel}</span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                            student.status
                          )}`}
                        >
                          {student.status}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap relative">
                        <button
                          onClick={(e) => handleActionClick(student, e)}
                          className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                        >
                          <Icon icon="solar:menu-dots-bold" className="w-5 h-5 text-gray-600" />
                        </button>
                        {isModalOpen && selectedStudent?.id === student.id && actionButtonRef && (
                          <StudentActionDropdown
                            student={selectedStudent}
                            onClose={closeModal}
                            buttonRef={actionButtonRef}
                          />
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="px-4 sm:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-700 text-center sm:text-left">
                Showing {start + 1} to {Math.min(start + pageSize, filteredStudents.length)} of {filteredStudents.length} students
              </div>
              <div className="flex items-center gap-2 flex-wrap justify-center">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  &lt;
                </button>
                {Array.from({ length: Math.min(10, totalPages) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 10) {
                    pageNum = i + 1;
                  } else if (currentPage <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 4) {
                    pageNum = totalPages - 9 + i;
                  } else {
                    pageNum = currentPage - 4 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${
                        currentPage === pageNum
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                {totalPages > 10 && currentPage < totalPages - 4 && (
                  <>
                    <span className="px-2 text-gray-500">...</span>
                    <button
                      onClick={() => setPage(totalPages)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      {totalPages}
                    </button>
                  </>
                )}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  &gt;
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showAddStudentModal && (
        <div className="fixed right-0 top-16 bottom-0 w-full sm:w-[600px] lg:w-[700px] xl:max-w-2xl bg-white shadow-2xl overflow-y-auto animate-slide-in m-4 sm:m-6 rounded-lg z-50">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleAddStudentBack}
                    className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                  >
                    <Icon icon="solar:arrow-left-bold" className="w-6 h-6 text-gray-700" />
                  </button>
                  <h1 className="text-2xl font-bold text-gray-900">Add New Student</h1>
                </div>
                <button
                  onClick={handleAddStudentBack}
                  className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                >
                  <Icon icon="solar:close-circle-bold" className="w-6 h-6 text-gray-700" />
                </button>
              </div>

              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                      addStudentStep === 1
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    1
                  </div>
                  <span
                    className={`font-medium ${
                      addStudentStep === 1 ? "text-emerald-600" : "text-gray-600"
                    }`}
                  >
                    Personal Details
                  </span>
                </div>
                <div className="flex-1 h-0.5 bg-gray-200"></div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                      addStudentStep === 2
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    2
                  </div>
                  <span
                    className={`font-medium ${
                      addStudentStep === 2 ? "text-emerald-600" : "text-gray-600"
                    }`}
                  >
                    Enrollment Details
                  </span>
                </div>
              </div>

              {addStudentStep === 1 && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={addStudentFormData.name}
                      onChange={handleAddStudentInputChange}
                      placeholder="Enter student name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={addStudentFormData.phone}
                      onChange={handleAddStudentInputChange}
                      placeholder="Enter phone number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email <span className="text-gray-500">(Optional)</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={addStudentFormData.email}
                      onChange={handleAddStudentInputChange}
                      placeholder="Enter email address"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Student Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={addStudentFormData.address}
                      onChange={handleAddStudentInputChange}
                      placeholder="Enter student address"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="dateOfBirth"
                        value={addStudentFormData.dateOfBirth}
                        onChange={handleAddStudentInputChange}
                        placeholder="DD/MM/YYYY"
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 bg-white"
                      />
                      <Icon
                        icon="solar:calendar-bold"
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Gender
                    </label>
                    <div className="relative">
                      <select
                        name="gender"
                        value={addStudentFormData.gender}
                        onChange={handleAddStudentInputChange}
                        className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 bg-white appearance-none"
                      >
                        {genders.map((gender) => (
                          <option key={gender} value={gender === "Select Gender" ? "" : gender}>
                            {gender}
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
              )}

              {addStudentStep === 2 && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Grade Level
                    </label>
                    <div className="relative">
                      <select
                        name="gradeLevel"
                        value={addStudentFormData.gradeLevel}
                        onChange={handleAddStudentInputChange}
                        className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 bg-white appearance-none"
                      >
                        {gradesOptions.map((grade) => (
                          <option key={grade} value={grade === "Select Grade level" ? "" : grade}>
                            {grade}
                          </option>
                        ))}
                      </select>
                      <Icon
                        icon="solar:alt-arrow-down-bold"
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      School District
                    </label>
                    <div className="relative">
                      <select
                        name="schoolDistrict"
                        value={addStudentFormData.schoolDistrict}
                        onChange={handleAddStudentInputChange}
                        className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 bg-white appearance-none"
                      >
                        {schoolDistricts.map((district) => (
                          <option key={district} value={district === "Select School District" ? "" : district}>
                            {district}
                          </option>
                        ))}
                      </select>
                      <Icon
                        icon="solar:alt-arrow-down-bold"
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={addStudentFormData.password}
                        onChange={handleAddStudentInputChange}
                        placeholder="Password"
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2"
                      >
                        <Icon
                          icon={showPassword ? "solar:eye-closed-bold" : "solar:eye-bold"}
                          className="w-5 h-5 text-gray-400"
                        />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      School
                    </label>
                    <div className="relative school-dropdown-container">
                      <button
                        type="button"
                        onClick={() => setShowSchoolDropdown(!showSchoolDropdown)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-left text-gray-900 bg-white flex items-center justify-between"
                      >
                        <span className={addStudentFormData.school ? "text-gray-900" : "text-gray-500"}>
                          {addStudentFormData.school || "Select School"}
                        </span>
                        <Icon
                          icon="solar:alt-arrow-down-bold"
                          className={`w-5 h-5 text-gray-400 transition-transform ${showSchoolDropdown ? "rotate-180" : ""}`}
                        />
                      </button>
                      {showSchoolDropdown && (
                        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-hidden">
                          <div className="p-3 border-b border-gray-200">
                            <div className="relative">
                              <Icon
                                icon="solar:magnifer-bold"
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                              />
                              <input
                                type="text"
                                placeholder="Search For Topic"
                                value={schoolSearch}
                                onChange={(e) => setSchoolSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-gray-900 bg-white"
                              />
                            </div>
                          </div>
                          <div className="max-h-48 overflow-y-auto">
                            {filteredSchools.length === 0 ? (
                              <div className="px-4 py-3 text-sm text-gray-500 text-center">No schools found</div>
                            ) : (
                              filteredSchools.map((school, index) => (
                                <button
                                  key={index}
                                  type="button"
                                  onClick={() => {
                                    setAddStudentFormData((prev) => ({ ...prev, school }));
                                    setShowSchoolDropdown(false);
                                    setSchoolSearch("");
                                  }}
                                  className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                  {school}
                                </button>
                              ))
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between gap-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleAddStudentBack}
                  className="px-6 py-3 rounded-lg bg-emerald-50 text-emerald-700 font-semibold hover:bg-emerald-100 transition-colors"
                >
                  Back
                </button>
                {addStudentStep === 1 ? (
                  <button
                    onClick={handleAddStudentNext}
                    className="px-6 py-3 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={handleAddStudentFinish}
                    className="px-6 py-3 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors"
                  >
                    Finish
                  </button>
                )}
              </div>
            </div>
          </div>
      )}
    </DashboardLayout>
  );
}

function StudentActionDropdown({
  student,
  onClose,
  buttonRef,
}: {
  student: Student;
  onClose: () => void;
  buttonRef: HTMLButtonElement;
}) {
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const updatePosition = () => {
      if (buttonRef) {
        const rect = buttonRef.getBoundingClientRect();
        setPosition({
          top: rect.bottom + 4,
          left: rect.right - 200,
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
        id="student-action-dropdown"
        className="fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[200px]"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-4 py-2 border-b border-gray-200">
          <p className="text-sm font-semibold text-gray-900 truncate">{student.name}</p>
          <p className="text-xs text-gray-500 truncate">{student.email}</p>
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
            <span>Edit Student</span>
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
            <span>Delete Student</span>
          </button>
        </div>
      </div>
    </>
  );
}

