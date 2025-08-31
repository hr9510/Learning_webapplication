"use client";

import { GetCourses, refreshingToken } from '@/component/Fetching';
import React, { useEffect, useState } from 'react';

export default function Page() {
  const [percentPerCourse, setPercentPerCourse] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courses = await GetCourses();
        await refreshingToken(courses); // ⚠️ ideally yaha response check hona chahiye

        // Filter completed courses
        const completedCourses = courses.filter(course => course.completed === true);

        // Calculate percentage safely
        const percent = courses.length > 0
          ? (completedCourses.length / courses.length) * 100
          : 0;

        setPercentPerCourse(percent);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold text-gray-600">Loading progress...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-10 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">
        Progress: {percentPerCourse.toFixed(2)}% Completed
      </h1>

      <div className="relative h-[200px] w-[200px]">
        <div
          className="absolute inset-0 transition-all duration-700 ease-in-out rounded-full"
          style={{
            background: `conic-gradient(#7e22ce ${percentPerCourse * 3.6}deg, #e5e7eb 0deg)`
          }}
        />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-[160px] w-[160px] bg-white rounded-full flex items-center justify-center text-2xl font-bold text-gray-800">
            {percentPerCourse.toFixed(0)}%
          </div>
        </div>
      </div>
    </div>
  );
}
