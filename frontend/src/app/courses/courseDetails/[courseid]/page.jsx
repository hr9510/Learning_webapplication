"use client";

import Ask from '@/app/Ask/page';
import { GetCourses, refreshingToken, Updating } from '@/component/Fetching';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import html2canvas from 'html2canvas';

export default function Page() {
  const [ask, setAsk] = useState(false);
  const [courses, setCourses] = useState(null);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const courseId = parseInt(params.courseid.replace("course-", ""), 10) - 1;
  const [access, setAccess] = useState(localStorage.getItem("access"));
  const pathName = usePathname()
  const [url, setUrl] = useState(`http://localhost:3000/${pathName}`);
  const [show, setshow] = useState(false)
  const qrRef = useRef(null);

  // Fetch courses
  useEffect(() => {
    const getData = async () => {
      try {
        const data = await GetCourses();
        setCourses(data);
        await refreshingToken(data)
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    getData();
  }, [access]);

  if (!courses) {
    return (
      <div className="flex items-center justify-center mt-10">
        <div className="h-[300px] w-[500px] bg-gray-200 animate-pulse rounded-xl"></div>
      </div>
    );
  }

  const currentCourse = courses[courseId];
  if (!currentCourse) {
    return <div className="mt-10 text-lg font-semibold text-center">⚠ Course not found</div>;
  }

  // Mark course as completed
  const handleComplete = async () => {
    try {
      setLoading(true);
      await Updating("completed", true, currentCourse.id);

      setCourses(prev =>
        prev.map(course =>
          course.id === currentCourse.id
            ? { ...course, completed: true }
            : course
        )
      );
    } catch (error) {
      console.error("Error updating course:", error);
      alert("Failed to update course status. Try again!");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (qrRef.current) {
      html2canvas(qrRef.current).then((canvas) => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'QRCode.png';
        link.click();
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 space-y-10 bg-gradient-to-b from-gray-50 to-gray-100">
      {ask ? (
        <Ask ask={ask} setAsk={setAsk} />
      ) : (
        <>
          {/* Course Section */}
          <section className="flex flex-col sm:flex-row justify-between items-start w-full sm:w-[90%] gap-8">
            <div className="overflow-hidden font-bold transition-all duration-300 bg-white shadow-xl rounded-2xl hover:shadow-2xl transform hover:scale-105 h-[240px] min-w-[300px] mx-auto">
              <img
                src={currentCourse.imgLink}
                alt={currentCourse.title}
                className="object-cover h-[240px] w-full"
              />
              <h2 className="p-3 text-xl text-center">{currentCourse.title}</h2>
            </div>
            <p className="text-base font-medium leading-relaxed text-center text-gray-700 lg:text-lg lg:text-left">
              {currentCourse.description || "No description available for this course."}
            </p>
          </section>

          {/* Video Section */}
          {currentCourse.vedioLink && (
            <div className="w-full lg:w-[80%] h-[60vh] lg:h-[70vh] p-3 sm:p-5 rounded-2xl overflow-hidden shadow-lg bg-white">
              <iframe
                className="w-full h-full rounded-xl"
                src={`${currentCourse.vedioLink}?vq=hd1080`}
                title={currentCourse.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          {/* PDF Section */}
          {currentCourse.pdfLink && (
            <a
              href={currentCourse.pdfLink}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-600 underline transition-colors duration-300 hover:text-blue-800"
            >
              📄 Download PDF / Resources
            </a>
          )}

          {/* Prev/Next Navigation */}
          <section className="flex items-center justify-center gap-8 w-full lg:w-[50%] mt-6">
            {courseId > 0 && (
              <Link
                href={`/courses/courseDetails/course-${courseId}`}
                className="font-semibold text-white text-lg bg-gradient-to-r from-purple-600 to-indigo-500 w-[140px] text-center py-3 rounded-full shadow-md hover:scale-105 transition-all"
              >
                ⬅ Previous
              </Link>
            )}
            {courseId + 1 < courses.length && (
              <Link
                href={`/courses/courseDetails/course-${courseId + 2}`}
                className="font-semibold text-white text-lg bg-gradient-to-r from-indigo-500 to-purple-600 w-[140px] text-center py-3 rounded-full shadow-md hover:scale-105 transition-all"
              >
                Next ➡
              </Link>
            )}
          </section>

          {/* Footer Section */}
          <footer className="w-full lg:w-[70%] mt-12 flex flex-col items-center">
            <section className="flex flex-wrap justify-center gap-5 w-full lg:w-[65%]">
              {/* Mark Completed */}
              <button
                onClick={handleComplete}
                disabled={loading || currentCourse.completed}
                className={`px-6 py-3 rounded-xl font-semibold text-lg shadow-md transition-all duration-300 
                  ${currentCourse.completed
                    ? "bg-green-500 cursor-not-allowed text-white"
                    : "bg-gradient-to-r from-purple-600 to-indigo-500 hover:scale-105 text-white shadow-purple-300/50"
                  }`}
              >
                {loading
                  ? "Saving..."
                  : currentCourse.completed
                  ? "✔ Completed"
                  : "Mark Completed"}
              </button>

              {/* Ask Question */}
              <button
                onClick={() => setAsk(!ask)}
                className="px-6 py-3 text-lg font-semibold text-white transition-all duration-300 shadow-md bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl hover:scale-105"
              >
                💬 Ask Question
              </button>

              {/* Generate QR */}
              <button
                type="button"
                onClick={() => setshow(true)}
                className="px-6 py-3 text-lg font-semibold text-white transition-all duration-300 shadow-md bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl hover:scale-105"
              >
                📱 Generate QR
              </button>
            </section>

            {/* QR Code Section */}
            {show && (
              <div className="flex flex-col items-center gap-4 p-6 mt-8 shadow-xl bg-white/70 backdrop-blur-md rounded-2xl">
                <QRCodeCanvas
                  ref={qrRef}
                  value={url}
                  size={200}
                  bgColor="white"
                  fgColor="black"
                  level="Q"
                />
                <button
                  type="button"
                  onClick={handleDownload}
                  className="px-6 py-3 text-lg font-semibold text-white transition-all duration-300 shadow-md bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl hover:scale-105"
                >
                  ⬇ Download QR
                </button>
              </div>
            )}
          </footer>
        </>
      )}
    </div>
  );
}
